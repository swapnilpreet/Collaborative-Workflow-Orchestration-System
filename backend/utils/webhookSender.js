const axios = require("axios");
const Webhook = require("../models/Webhook");

module.exports = async function sendWebhook(projectId, payload) {
  const hooks = await Webhook.find({ projectId });

  for (let hook of hooks) {
    let success = false;

    for (let i = 0; i < 3; i++) {
      try {
        const res = await axios.post(hook.url, payload);

        hook.deliveryLogs.push({
          status: "SUCCESS",
          response: res.status,
          timestamp: new Date()
        });

        hook.retries = i;
        success = true;
        break;

      } catch (err) {
        hook.deliveryLogs.push({
          status: "FAILED",
          response: err.message,
          timestamp: new Date()
        });
      }
    }

    if (!success) {
      hook.retries = 3;
    }

    await hook.save();
  }
};