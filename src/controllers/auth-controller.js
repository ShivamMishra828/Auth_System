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

module.exports = {
    signup,
    verifyEmail,
    signin,
};
