const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/webhookController");

// ➕ Add webhook
router.post("/:projectId", auth, ctrl.addWebhook);
// 📥 Get all webhooks for project
router.get("/:projectId", auth, ctrl.getWebhooks);

module.exports = router;