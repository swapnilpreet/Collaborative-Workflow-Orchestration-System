const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  actor: String,
  action: String,
  entity: String,
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditSchema);