const router = require("express").Router();
const ctrl = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.get('/me',auth,ctrl.verifyuser)
module.exports = router;