const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/executionController");

router.post("/:projectId/compute-execution", auth, ctrl.computeExecution);
router.post("/:projectId/simulate", auth, ctrl.simulateExecution);

module.exports = router;