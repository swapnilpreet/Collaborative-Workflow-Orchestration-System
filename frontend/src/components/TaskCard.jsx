import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import "../styles/TaskUI.css";
import { toast } from "react-toastify";

export default function TaskCard({ task }) {
  const { updateTask, retryTask, deleteTask, editTask, tasks } =
    useContext(TaskContext);

  const [isEditing, setIsEditing] = useState(false);

  console.log("Rendering TaskCard:", task);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    estimatedHours: task.estimatedHours,
    dependencies: task.dependencies || [],
    resourceTag: task.resourceTag,
    maxRetries: task.maxRetries,
  });

  const changeStatus = (status) => {
    updateTask(task._id, {
      status,
      versionNumber: task.versionNumber,
    });
  };

  const validate = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!form.priority || form.priority < 1 || form.priority > 5) {
      toast.error("Priority must be between 1 and 5");
      return false;
    }

    if (!form.estimatedHours || form.estimatedHours <= 0) {
      toast.error("Estimated hours must be > 0");
      return false;
    }

    if (!form.resourceTag.trim()) {
      toast.error("Resource tag required");
      return false;
    }

    if (form.maxRetries < 0) {
      toast.error("Max retries cannot be negative");
      return false;
    }

    return true;
  };

  // ✅ HANDLE EDIT SAVE
  const handleEdit = async () => {
    if (!validate()) return;
    await editTask(task._id, {
      ...form,
      versionNumber: task.versionNumber,
    });
    setIsEditing(false);
  };

  const toggleDependency = (id) => {
    setForm((prev) => ({
      ...prev,
      dependencies: prev.dependencies.includes(id)
        ? prev.dependencies.filter((d) => d !== id)
        : [...prev.dependencies, id],
    }));
  };

  return (
    <div className="task-card">
      {/* NORMAL VIEW */}
      {!isEditing && (
        <>
          <h4>{task.title}</h4>

          <p className={`status ${task.status}`}>{task.status}</p>

          <p className="task-desc">{task.description}</p>

          <div className="task-details">
            <p>
              <strong>Priority </strong> {task.priority}
            </p>
            <p>
              <strong>Hours</strong> {task.estimatedHours}
            </p>
            <p>
              <strong>Resource</strong>
              <span className="resource-tag">{task.resourceTag}</span>
            </p>
          </div>

          <div className="task-actions">
            <button className="btn-run" onClick={() => changeStatus("Running")}>
              Run
            </button>
            <button
              className="btn-complete"
              onClick={() => changeStatus("Completed")}
            >
              Done
            </button>
            <button className="btn-fail" onClick={() => changeStatus("Failed")}>
              Fail
            </button>
            <button className="btn-retry" onClick={() => retryTask(task._id)}>
              Retry
            </button>
            <button className="btn-delete" onClick={() => deleteTask(task._id)}>
              Delete
            </button>

            {/* ✏️ EDIT BUTTON */}
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </div>
        </>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="edit-form">
          <h4>Edit Task</h4>

          <label htmlFor="title">Title:</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label htmlFor="description">Description:</label>
          <input
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label htmlFor="priority">Priority:</label>
          <input
            id="priority"
            type="number"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: Number(e.target.value) })
            }
          />

          <label htmlFor="estimatedHours">Estimated Hours:</label>
          <input
            id="estimatedHours"
            type="number"
            value={form.estimatedHours}
            onChange={(e) =>
              setForm({ ...form, estimatedHours: Number(e.target.value) })
            }
          />

          <label htmlFor="resourceTag">Resource Tag:</label>
          <input
            id="resourceTag"
            value={form.resourceTag}
            onChange={(e) => setForm({ ...form, resourceTag: e.target.value })}
          />

          <label htmlFor="maxRetries">Max Retries:</label>
          <input
            id="maxRetries"
            type="number"
            value={form.maxRetries}
            onChange={(e) =>
              setForm({ ...form, maxRetries: Number(e.target.value) })
            }
          />
          <div className="dependency-box">
            <p>
              <strong>Select Dependencies:</strong>
            </p>

            {tasks.length === 0 && <p>No tasks available</p>}

            {tasks
              .filter((t) => t._id !== task._id)
              .map((t) => (
                <label key={t._id} className="dep-item">
                  <input
                    type="checkbox"
                    checked={form.dependencies.includes(t._id)}
                    onChange={() => toggleDependency(t._id)}
                  />
                  {t.title}
                </label>
              ))}
          </div>

          <div className="selected-deps">
            <p>Selected:</p>

            {form.dependencies.length === 0 && <span>None</span>}

            {form.dependencies.map((depId) => {
              const depTask = tasks.find((t) => t._id === depId);

              return (
                <span key={depId} className="dep-badge">
                  {depTask?.title || "Unknown"}
                </span>
              );
            })}
          </div>

          <div className="task-actions">
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
