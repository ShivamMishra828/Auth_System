const dotenv = require("dotenv");

// Loading the environment variables from .env file
dotenv.config();

module.exports = {
    // Port number for the server
    PORT: process.env.PORT,

    // MongoDB connection url
    MONGODB_URI: process.env.MONGODB_URI,

    // Mailing server configuration
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,

    // JWT Secret Key
    JWT_SECRET: process.env.JWT_SECRET,
};
