const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const { LoggerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 20,
    message: "Too many requests, try again after 10 mins.",
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(LoggerConfig.logger);
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api", apiRoutes);
app.get("/", (req, res) => {
    res.send("Server is Up and Running Smoothly!");
});

module.exports = app;
