const express = require("express");
const authRoutes = require("./auth-routes");
const { AuthController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

const router = express.Router();

router.get(
    "/profile",
    AuthMiddleware.verifyJWT,
    AuthController.fetchUserDetails
);
router.use("/auth", authRoutes);

module.exports = router;
