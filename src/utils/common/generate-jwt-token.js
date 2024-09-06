const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function generateJWTToken(payload) {
    return jwt.sign(payload, ServerConfig.JWT_SECRET, {
        expiresIn: "1d",
    });
}

module.exports = {
    generateJWTToken,
};
