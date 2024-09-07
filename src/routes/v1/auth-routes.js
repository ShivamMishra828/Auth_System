const express = require("express");
const { AuthController } = require("../../controllers");
const {
    AuthMiddleware,
    ValidateIncomingRequest,
} = require("../../middlewares");

const router = express.Router();

router.post(
    "/signup",
    ValidateIncomingRequest.validateIncomingSignUpRequest,
    AuthController.signup
);
router.post(
    "/verify-email",
    ValidateIncomingRequest.validateIncomingVerifyEmailRequest,
    AuthController.verifyEmail
);
router.post(
    "/signin",
    ValidateIncomingRequest.validateIncomingSignInRequest,
    AuthController.signin
);
router.get("/logout", AuthMiddleware.verifyJWT, AuthController.logout);
router.post(
    "/forgot-password",
    ValidateIncomingRequest.validateIncomingForgotPasswordRequest,
    AuthController.forgotPassword
);
router.post(
    "/reset-password/:resetToken",
    ValidateIncomingRequest.validateIncomingResetPasswordRequest,
    AuthController.resetPassword
);

module.exports = router;
