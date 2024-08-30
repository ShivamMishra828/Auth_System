const app = require("./app");
const connectToDB = require("./db");
const { ServerConfig } = require("./config");

const PORT = ServerConfig.PORT;

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Started at PORT:- ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB Connection Failed !! Error:- ${error}`);
        process.exit(1);
    });
