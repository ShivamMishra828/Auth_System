const express = require("express");
const { AuthController } = require("../../controllers");
const {
    AuthMiddleware,
    ValidateIncomingRequest,
} = require("../../middlewares");

// Creating an Express router for authentication routes
const router = express.Router();

// Sign up route
router.post(
    "/signup",
    // Validate incoming sign up request
    ValidateIncomingRequest.validateIncomingSignUpRequest,
    // Handle sign up request
    AuthController.signup
);

// Verify email route
router.post(
    "/verify-email",
    // Validate incoming verify email request
    ValidateIncomingRequest.validateIncomingVerifyEmailRequest,
    // Handle verify email request
    AuthController.verifyEmail
);

// Sign in route
router.post(
    "/signin",
    // Validate incoming sign in request
    ValidateIncomingRequest.validateIncomingSignInRequest,
    // Handle sign in request
    AuthController.signin
);

// Logout route
router.get(
    "/logout",
    // Verify JWT token
    AuthMiddleware.verifyJWT,
    // Handle logout request
    AuthController.logout
);

// Forgot password route
router.post(
    "/forgot-password",
    // Validate incoming forgot password request
    ValidateIncomingRequest.validateIncomingForgotPasswordRequest,
    // Handle forgot password request
    AuthController.forgotPassword
);

// Reset password route
router.post(
    "/reset-password/:resetToken",
    // Validate incoming reset password request
    ValidateIncomingRequest.validateIncomingResetPasswordRequest,
    // Handle reset password request
    AuthController.resetPassword
);

// Export the authentication routes
module.exports = router;
