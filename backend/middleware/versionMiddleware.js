module.exports = (req, res, next) => {
  const version = req.body.versionNumber;

  if (version === undefined) {
    return res.status(400).json({ msg: "Version number required" });
  }

  next();
};