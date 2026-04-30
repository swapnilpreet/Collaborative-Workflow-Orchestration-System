const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/projectController");

// Create project
router.post("/", auth, ctrl.createProject);

// Get all projects (user belongs to)
router.get("/", auth, ctrl.getProjects);

// ✅ Get single project by ID
router.get("/:projectId", auth, ctrl.getProjectById);

// Generate invite link
router.post("/:projectId/invite", auth, ctrl.generateInvite);

// Join project via token
router.post("/join", auth, ctrl.joinProject);

module.exports = router;