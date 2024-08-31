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

module.exports = {
    signup,
};
