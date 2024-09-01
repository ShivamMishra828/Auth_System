const express = require("express");
const { AuthController } = require("../../controllers");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/signin", AuthController.signin);

module.exports = router;
