const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { AuthService } = require("../services");
const { StatusCodes } = require("http-status-codes");

async function signup(req, res) {
    try {
        const user = await AuthService.signup({
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
        });

        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully"));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function verifyEmail(req, res) {
    try {
        const user = await AuthService.verifyEmail({
            email: req.body.email,
            otp: req.body.otp,
        });
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(user, "User Verified Successfully"));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function signin(req, res) {
    try {
        const { user, jwtToken } = await AuthService.signin({
            email: req.body.email,
            password: req.body.password,
        });

        return res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    { user, token: jwtToken },
                    "User logged in successfully"
                )
            );
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function logout(req, res) {
    try {
        return res
            .clearCookie("token")
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "User logged out successfully"));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    error,
                    "Something went wrong while logging out the user"
                )
            );
    }
}

async function forgotPassword(req, res) {
    try {
        await AuthService.forgotPassword({
            email: req.body.email,
        });

        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    {},
                    "Reset Password link has been sent to your email"
                )
            );
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function resetPassword(req, res) {
    try {
        await AuthService.resetPassword({
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
            resetToken: req.params.resetToken,
        });

        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "Password Reset Successfully"));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function fetchUserDetails(req, res) {
    try {
        const userDetails = await AuthService.fetchUserDetails({
            userId: req.userId,
        });

        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    userDetails,
                    "Successfully fetched user details"
                )
            );
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

module.exports = {
    signup,
    verifyEmail,
    signin,
    logout,
    forgotPassword,
    resetPassword,
    fetchUserDetails,
};
