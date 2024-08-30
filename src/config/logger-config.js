const fs = require("fs");
const morgan = require("morgan");
const { LOG_FILE_PATH } = require("../constants");

const accessLogStream = fs.createWriteStream(LOG_FILE_PATH, { flags: "a" });

morgan.format(
    "myFormat",
    "[:date[web]] ':method :url' :status :response-time ms ':user-agent'"
);

const logger = morgan("myFormat", { stream: accessLogStream });

module.exports = {
    logger,
};
