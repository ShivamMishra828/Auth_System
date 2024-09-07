const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/error/app-error");

// Validate incoming sign up request
function validateIncomingSignUpRequest(req, res, next) {
    // Check if the email is present
    if (!req.body.email) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Email is required", StatusCodes.BAD_REQUEST),
                    "Please provide email"
                )
            );
    }

    // Check if the user name is present
    if (!req.body.userName) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "User Name is required",
                        StatusCodes.BAD_REQUEST
                    ),
                    "Please provide user name"
                )
            );
    }

    // Check if the password is present
    if (!req.body.password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Password is required",
                        StatusCodes.BAD_REQUEST
                    ),
                    "Please provide password"
                )
            );
    }

    // Calling the next middleware function
    next();
}

// Validate incoming sign in request
function validateIncomingSignInRequest(req, res, next) {
    // Check if the email is present
    if (!req.body.email) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Email is required", StatusCodes.BAD_REQUEST),
                    "Please provide email"
                )
            );
    }

    // Check if the password is present
    if (!req.body.password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Password is required",
                        StatusCodes.BAD_REQUEST
                    ),
                    "Please provide password"
                )
            );
    }

    // Calling the next middleware function
    next();
}

// Validate incoming verify email request
function validateIncomingVerifyEmailRequest(req, res, next) {
    // Check if the email is present
    if (!req.body.email) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Email is required", StatusCodes.BAD_REQUEST),
                    "Please provide email"
                )
            );
    }

    // Check if the OTP is present
    if (!req.body.otp) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Otp is required", StatusCodes.BAD_REQUEST),
                    "Please provide OTP"
                )
            );
    }

    // Calling the next middleware function
    next();
}

// Validate incoming forgot password request
function validateIncomingForgotPasswordRequest(req, res, next) {
    // Check if the email is present
    if (!req.body.email) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Email is required", StatusCodes.BAD_REQUEST),
                    "Please provide email"
                )
            );
    }

    // Calling the next middleware function
    next();
}

// Validate incoming reset password request
function validateIncomingResetPasswordRequest(req, res, next) {
    // Check if the new password is present
    if (!req.body.newPassword) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "New Password is required",
                        StatusCodes.BAD_REQUEST
                    ),
                    "Please provide New Password"
                )
            );
    }

    // Check if the confirm new password is present
    if (!req.body.confirmNewPassword) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Confirm New Password is required",
                        StatusCodes.BAD_REQUEST
                    ),
                    "Please provide Confirm New Password"
                )
            );
    }

    // Check if the reset token is present
    if (!req.params.resetToken) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Reset Token is required",
                        StatusCodes.BAD_REQUEST
                    ),
                    "Please provide Reset Token"
                )
            );
    }

    // Calling the next middleware function
    next();
}

// Export all validation middleware functions
module.exports = {
    validateIncomingSignUpRequest,
    validateIncomingSignInRequest,
    validateIncomingVerifyEmailRequest,
    validateIncomingForgotPasswordRequest,
    validateIncomingResetPasswordRequest,
};
