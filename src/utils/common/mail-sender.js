const nodemailer = require("nodemailer");
const { ServerConfig } = require("../../config");

const transporter = nodemailer.createTransport({
    host: ServerConfig.MAIL_HOST,
    port: ServerConfig.MAIL_PORT,
    auth: {
        user: ServerConfig.MAIL_USER,
        pass: ServerConfig.MAIL_PASS,
    },
});

async function sendMail(data) {
    try {
        const { receiverInfo, subject, body } = data;
        const response = await transporter.sendMail({
            from: ServerConfig.MAIL_USER,
            to: receiverInfo,
            subject,
            html: body,
        });
        return response;
    } catch (error) {
        console.log(
            `Something went wrong while sending mail to user:- ${error}`
        );
        return null;
    }
}

module.exports = { sendMail };
