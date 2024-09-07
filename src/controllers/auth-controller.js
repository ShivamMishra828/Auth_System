const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { AuthService } = require("../services");
const { StatusCodes } = require("http-status-codes");

// Signup function to create a new user
async function signup(req, res) {
    try {
        // Call the AuthService.signup method to create a new user
        const user = await AuthService.signup({
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
        });

        // Returning a successful response with the created user
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully"));
    } catch (error) {
        // Returning an error response with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Verify email function to verify a user's email address
async function verifyEmail(req, res) {
    try {
        // Calling the AuthService.verifyEmail method to verify the email
        const { user, jwtToken } = await AuthService.verifyEmail({
            email: req.body.email,
            otp: req.body.otp,
        });

        // Setting the JWT token as a cookie and return a successful response
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
                    "User verified successfully"
                )
            );
    } catch (error) {
        // Return an error response with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Signin function to authenticate a user
async function signin(req, res) {
    try {
        // Call the AuthService.signin method to authenticate the user
        const { user, jwtToken } = await AuthService.signin({
            email: req.body.email,
            password: req.body.password,
        });

        // Setting the JWT token as a cookie and return a successful response
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
        // Return an error response with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Logout function to log out a user
async function logout(req, res) {
    try {
        // Clear the JWT token cookie and return a successful response
        return res
            .clearCookie("token")
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "User logged out successfully"));
    } catch (error) {
        // Return an error response with the error details
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

// Forgot password function to send a password reset link
async function forgotPassword(req, res) {
    try {
        // Calling the AuthService.forgotPassword method to send the reset link
        await AuthService.forgotPassword({
            email: req.body.email,
        });

        // Return a successful response with a message
        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    {},
                    "Reset Password link has been sent to your email"
                )
            );
    } catch (error) {
        // Return an error response with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Reset password function to reset a user's password
async function resetPassword(req, res) {
    try {
        // Calling the AuthService.resetPassword method to reset the password
        await AuthService.resetPassword({
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
            resetToken: req.params.resetToken,
        });

        // Return a successful response with a message
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "Password Reset Successfully"));
    } catch (error) {
        // Return an error response with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Fetch user details function to retrieve a user's details
async function fetchUserDetails(req, res) {
    try {
        // Calling the AuthService.fetchUserDetails method to retrieve user details
        const userDetails = await AuthService.fetchUserDetails({
            userId: req.userId,
        });

        // Return a successful response with the user details
        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    userDetails,
                    "Successfully fetched user details"
                )
            );
    } catch (error) {
        // Return an error response with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Export all authentication controller functions
module.exports = {
    signup,
    verifyEmail,
    signin,
    logout,
    forgotPassword,
    resetPassword,
    fetchUserDetails,
};
