const AppError = require("../error/app-error");
const { ServerConfig } = require("../../config");
const jwt = require("jsonwebtoken");

async function decodeToken(token) {
    try {
        return await jwt.decode(token, ServerConfig.JWT_SECRET);
    } catch (error) {
        throw new AppError(
            "Failed to decode token",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    decodeToken,
};
