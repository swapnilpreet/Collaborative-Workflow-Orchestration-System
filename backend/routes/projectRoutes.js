const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/projectController");

router.post("/", auth, ctrl.createProject);
router.get("/", auth, ctrl.getProjects);
router.post("/:projectId/invite", auth, ctrl.generateInvite);
router.post("/join", auth, ctrl.joinProject);

module.exports = router;