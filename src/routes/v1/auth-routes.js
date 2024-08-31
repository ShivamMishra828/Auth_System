const express = require("express");
const { AuthController } = require("../../controllers");

const router = express.Router();

router.post("/signup", AuthController.signup);

module.exports = router;
