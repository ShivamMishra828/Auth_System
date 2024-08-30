const mongoose = require("mongoose");
const { ServerConfig } = require("../config");

async function connectToDB() {
    const connectionInstance = await mongoose.connect(ServerConfig.MONGODB_URI);
    console.log(
        `MongoDB Connected Successfully !! Host:- ${connectionInstance.connection.host}`
    );
}

module.exports = connectToDB;
