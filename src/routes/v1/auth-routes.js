const express = require("express");
const { AuthController } = require("../../controllers");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/verify-email", AuthController.verifyEmail);

module.exports = router;
