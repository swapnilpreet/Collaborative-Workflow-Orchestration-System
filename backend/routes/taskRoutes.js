const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/taskController");

router.post("/:projectId", auth, ctrl.createTask);
router.get("/history/:taskId", auth, ctrl.getTaskHistory);
router.get("/:projectId", auth, ctrl.getTasks);

router.put("/edit/:taskId", auth, ctrl.editTask);
router.put("/:taskId", auth, ctrl.updateTask);
router.delete("/:taskId", auth, ctrl.deleteTask);
router.post("/retry/:taskId", auth, ctrl.retryTask);

module.exports = router;