const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  token: String,
  expiresAt: Date
});

module.exports = mongoose.model("InviteToken", inviteSchema);