const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  priority: Number,
  estimatedHours: Number,
  status: {
    type: String,
    enum: ["Pending", "Running", "Completed", "Failed", "Blocked"],
    default: "Pending"
  },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  resourceTag: String,
  maxRetries: Number,
  retryCount: { type: Number, default: 0 },
  versionNumber: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);

// user:{type: mongoose.Schema.Types.ObjectId, ref: "User"}