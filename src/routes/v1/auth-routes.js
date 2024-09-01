const express = require("express");
const { AuthController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/signin", AuthController.signin);
router.get("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:resetToken", AuthController.resetPassword);
router.get("/verify", AuthMiddleware.verifyJWT, (req, res) => {
    res.send({ message: "User Verified" });
});

module.exports = router;
