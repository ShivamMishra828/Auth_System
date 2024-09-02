const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/error/app-error");

function validateIncomingSignUpRequest(req, res, next) {
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
    next();
}

function validateIncomingSignInRequest(req, res, next) {
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
    next();
}

function validateIncomingVerifyEmailRequest(req, res, next) {
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
    next();
}

function validateIncomingForgotPasswordRequest(req, res, next) {
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
    next();
}

function validateIncomingResetPasswordRequest(req, res, next) {
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
    next();
}

module.exports = {
    validateIncomingSignUpRequest,
    validateIncomingSignInRequest,
    validateIncomingVerifyEmailRequest,
    validateIncomingForgotPasswordRequest,
    validateIncomingResetPasswordRequest,
};
