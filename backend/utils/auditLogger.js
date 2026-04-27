const AuditLog = require("../models/AuditLog");

module.exports = async (data) => {
  await AuditLog.create(data);
};