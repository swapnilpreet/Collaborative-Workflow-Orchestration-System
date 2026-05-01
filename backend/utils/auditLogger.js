const AuditLog = require("../models/AuditLog");
const { getIO } = require("../config/socket");

module.exports = async ({ actor, action, entity, metadata }) => {
  const log = await AuditLog.create({
    actor,
    action,
    entity,
    metadata,
  });

  // 🔥 ADD THIS
  const io = getIO();
  io.emit("audit_log_created", log);

  return log;
};