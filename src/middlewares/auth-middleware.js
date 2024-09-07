const { ErrorResponse, Auth } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/error/app-error");

// Defining a middleware function to verify JWT tokens
async function verifyJWT(req, res, next) {
    try {
        // Get the token from the request cookies or headers
        const token =
            req.cookies.token || req.headers["Authorization"]?.split(" ")[1];

        // Check if the token exists
        if (!token) {
            // Return an unauthorized response if the token is missing
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Token not found. Authorization denied.",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        // Decode the token using the Auth.decodeToken function
        const decodedData = await Auth.decodeToken(token);

        // Check if the decoded data is valid
        if (!decodedData || !decodedData.id) {
            // Return an unauthorized response if the token is invalid
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Invalid JWT token. Authorization denied.",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        // Set the user ID on the request object
        req.userId = decodedData.id;

        // Calling the next middleware function
        next();
    } catch (error) {
        // Return an error response if something goes wrong
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    error,
                    error.explanation ||
                        "Something went wrong while verifying the jwt token"
                )
            );
    }
}

// Export the verifyJWT middleware function
module.exports = { verifyJWT };
