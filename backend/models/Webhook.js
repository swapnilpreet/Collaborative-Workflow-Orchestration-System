const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  url: String,
  retries: { type: Number, default: 0 },
  deliveryLogs: [
    {
      status: String,
      response: String,
      timestamp: Date
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Webhook", webhookSchema);