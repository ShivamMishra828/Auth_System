const express = require("express");
const { AuthController } = require("../../controllers");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/signin", AuthController.signin);
router.get("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);

module.exports = router;
