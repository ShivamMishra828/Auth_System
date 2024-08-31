const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repository");
const AppError = require("../utils/error/app-error");
const { GenerateVerificationCode } = require("../utils/common");
const { MailTemplates } = require("../templates");
const { MailSender } = require("../utils/common");

const userRepository = new UserRepository();

async function signup(data) {
    try {
        const { email, password, userName } = data;

        const existingUser = await userRepository.findOne({ email });
        if (existingUser) {
            throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
        }

        const generatedOtp = GenerateVerificationCode.generate();

        const response = await MailSender.sendMail({
            receiverInfo: email,
            subject: "Verification Email",
            body: MailTemplates.verificationTemplate(generatedOtp),
        });

        if (!response) {
            throw new AppError(
                "Can't send verification mail",
                StatusCodes.BAD_REQUEST
            );
        }

        const user = await userRepository.create({
            email,
            userName,
            password,
            verificationToken: generatedOtp,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });

        return user;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "Something went wrong while signing up the user",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signup,
};
