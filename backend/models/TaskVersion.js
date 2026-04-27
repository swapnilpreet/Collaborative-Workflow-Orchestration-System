const mongoose = require("mongoose");

const taskVersionSchema = new mongoose.Schema({
  taskId: mongoose.Schema.Types.ObjectId,
  snapshot: Object,
  versionNumber: Number
}, { timestamps: true });

module.exports = mongoose.model("TaskVersion", taskVersionSchema);