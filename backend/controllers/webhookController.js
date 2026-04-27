const Webhook = require("../models/Webhook");

exports.addWebhook = async (req, res) => {
   try {
    const webhook = await Webhook.create({
      projectId: req.params.projectId,
      url: req.body.url
    });

    res.json(webhook);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getWebhooks = async (req, res) => {
  const hooks = await Webhook.find({
    projectId: req.params.projectId
  });

  res.json(hooks);
};