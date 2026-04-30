const Task = require("../models/Task");
const TaskVersion = require("../models/TaskVersion");
const hasCycle = require("../utils/cycleDetection");
const auditLogger = require("../utils/auditLogger");
const { getIO } = require("../config/socket");
const { encrypt, decrypt } = require("../utils/encrypt");
const sendWebhook = require("../utils/webhookSender");
const mongoose = require("mongoose");

// ================= CREATE TASK =================
exports.createTask = async (req, res) => {
  try {
    // 🔥 STEP 1: Validate ObjectId format FIRST
    if (req.body.dependencies && req.body.dependencies.length > 0) {
      const invalidIds = req.body.dependencies.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id),
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          msg: "Invalid dependency IDs",
        });
      }

      // 🔥 STEP 2: Check existence in DB
      const deps = await Task.find({
        _id: { $in: req.body.dependencies },
      });

      if (deps.length !== req.body.dependencies.length) {
        return res.status(400).json({
          msg: "Invalid dependency IDs",
        });
      }
    }

    // 🔐 Encrypt
    if (req.body.description) {
      req.body.description = encrypt(req.body.description);
    }

    const task = await Task.create({
      ...req.body,
      project: req.params.projectId,
    });

    await TaskVersion.create({
      taskId: task._id,
      snapshot: task,
      versionNumber: task.versionNumber,
    });

    await auditLogger({
      actor: req.user.id,
      action: "CREATE_TASK",
      entity: "Task",
      metadata: { taskId: task._id },
    });

    getIO().to(req.params.projectId).emit("task_created", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= GET TASKS =================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });

    const decryptedTasks = tasks.map((task) => {
      const obj = task.toObject();

      if (obj.description) {
        obj.description = decrypt(obj.description);
      }

      return obj;
    });

    res.json(decryptedTasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= BLOCK DEPENDENTS =================
async function blockDependents(taskId) {
  const dependents = await Task.find({ dependencies: taskId });

  for (let t of dependents) {
    t.status = "Blocked";
    await t.save();

    getIO().to(t.project.toString()).emit("status_changed", t);
  }
}

// ================= UPDATE TASK =================
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // VERSION CHECK
    if (task.versionNumber !== req.body.versionNumber) {
      return res.status(409).json({
        msg: "Version conflict",
        latest: task,
      });
    }

    const oldStatus = task.status;

    const updatedData = { ...req.body };
    delete updatedData.versionNumber;

    // 🔐 Encrypt description
    if (updatedData.description) {
      updatedData.description = encrypt(updatedData.description);
    }

    // 🔥 VALIDATION BEFORE APPLY
    if (
      updatedData.status === "Running" ||
      updatedData.status === "Completed"
    ) {
      const dependencies = await Task.find({
        _id: { $in: task.dependencies },
      });

      const allCompleted = dependencies.every((d) => d.status === "Completed");

      if (!allCompleted) {
        return res.status(400).json({
          msg: "Dependencies not completed",
        });
      }

      const runningTask = await Task.findOne({
        resourceTag: task.resourceTag,
        status: "Running",
        _id: { $ne: task._id },
      });

      if (runningTask) {
        return res.status(400).json({
          msg: "Resource already in use",
        });
      }
    }

    // 🔥 APPLY UPDATE
    Object.assign(task, updatedData);
    task.versionNumber += 1;

    // 🔥 CYCLE CHECK BEFORE SAVE
    const allTasks = await Task.find({ project: task.project });

    const tempTasks = allTasks.map((t) => (t._id.equals(task._id) ? task : t));

    if (hasCycle(tempTasks)) {
      await auditLogger({
        actor: req.user.id,
        action: "DEPENDENCY_REJECTED",
        entity: "Task",
        metadata: { taskId: task._id },
      });

      return res.status(400).json({ msg: "Cycle detected" });
    }

    await task.save();

    // SAVE VERSION
    await TaskVersion.create({
      taskId: task._id,
      snapshot: task,
      versionNumber: task.versionNumber,
    });

    // 🔥 FAILURE HANDLING
    if (task.status === "Failed") {
      await auditLogger({
        actor: req.user.id,
        action: "TASK_FAILED",
        entity: "Task",
        metadata: { taskId: task._id },
      });

      await blockDependents(task._id);
    }

    // 🔥 WEBHOOK
    if (oldStatus !== "Completed" && task.status === "Completed") {
      await sendWebhook(task.project, {
        event: "TASK_COMPLETED",
        taskId: task._id,
      });
      // ✅ ADD THIS (REAL-TIME UPDATE)
      const io = getIO();
      io.to(task.project.toString()).emit("webhook_triggered");
    }

    // AUDIT
    await auditLogger({
      actor: req.user.id,
      action: "UPDATE_TASK",
      entity: "Task",
      metadata: { taskId: task._id },
    });

    // SOCKET
    const io = getIO();
    const projectId = task.project.toString();

    io.to(projectId).emit("task_updated", task);

    if (oldStatus !== task.status) {
      io.to(projectId).emit("status_changed", task);
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= DELETE TASK =================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await auditLogger({
      actor: req.user.id,
      action: "DELETE_TASK",
      entity: "Task",
      metadata: { taskId: task._id },
    });

    getIO().to(task.project.toString()).emit("task_deleted", task);

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= TASK HISTORY =================
exports.getTaskHistory = async (req, res) => {
  try {
    const history = await TaskVersion.find({
      taskId: req.params.taskId,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= RETRY TASK =================
exports.retryTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔥 ADD THIS CHECK
    if (task.status !== "Failed") {
      return res.status(400).json({
        msg: "Retry allowed only for failed tasks",
      });
    }

    if (task.retryCount >= task.maxRetries) {
      return res.status(400).json({ msg: "Max retries reached" });
    }

    task.retryCount += 1;
    task.status = "Pending";

    await task.save();

    await auditLogger({
      actor: req.user.id,
      action: "RETRY_TASK",
      entity: "Task",
      metadata: { taskId: task._id },
    });

    getIO().to(task.project.toString()).emit("retry_attempted", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= EDIT FULL TASK =================
exports.editTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" ,success: false});
    }
    if (task.versionNumber !== req.body.versionNumber) {
      return res.status(409).json({
        msg: "Version conflict",
        latest: task,
        success: false
      });
    }
    if (req.body.dependencies && req.body.dependencies.length > 0) {
      const invalidIds = req.body.dependencies.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id),
      );
      if (invalidIds.length > 0) {
        return res.status(400).json({ msg: "Invalid dependency IDs" ,success: false });
      }
      const deps = await Task.find({
        _id: { $in: req.body.dependencies },
      });
      if (deps.length !== req.body.dependencies.length) {
        return res.status(400).json({ msg: "Invalid dependency IDs" ,success: false });
      }
    }
    let updatedData = { ...req.body };
    delete updatedData.versionNumber;

    if (updatedData.description) {
      updatedData.description = encrypt(updatedData.description);
    }
    Object.assign(task, updatedData);
    task.versionNumber += 1;
    const allTasks = await Task.find({ project: task.project });
    const tempTasks = allTasks.map((t) => (t._id.equals(task._id) ? task : t));
    if (hasCycle(tempTasks)) {
      return res.status(400).json({ msg: "Cycle detected" ,success: false});
    }
    await task.save();
    await TaskVersion.create({
      taskId: task._id,
      snapshot: task,
      versionNumber: task.versionNumber,
    });
    await auditLogger({
      actor: req.user.id,
      action: "EDIT_TASK",
      entity: "Task",
      metadata: { taskId: task._id },
    });
    const io = getIO();
    io.to(task.project.toString()).emit("task_updated", task);
    res.json({ task: task ,success: true });
  } catch (err) {
    res.status(500).json({ msg: err.message ,success: false });
  }
};
