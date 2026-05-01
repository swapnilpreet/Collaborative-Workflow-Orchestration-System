// routes/auditRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Audit = require("../models/AuditLog");

router.get("/", auth, async (req, res) => {
  const logs = await Audit.find()
    .populate("actor", "name email")
    .sort({ createdAt: -1 });

  res.json(logs);
});

module.exports = router;