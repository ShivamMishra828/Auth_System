const express = require("express");
const authRoutes = require("./auth-routes");
const { AuthController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// Create an Express router for v1 routes
const router = express.Router();

// Profile route
router.get(
    "/profile",
    // Verify JWT token
    AuthMiddleware.verifyJWT,
    // Handle fetch user details request
    AuthController.fetchUserDetails
);

// Use authentication routes
router.use("/auth", authRoutes);

// Export the v1 routes
module.exports = router;
