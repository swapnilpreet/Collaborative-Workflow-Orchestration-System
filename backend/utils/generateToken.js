const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};