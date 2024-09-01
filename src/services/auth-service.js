const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repository");
const AppError = require("../utils/error/app-error");
const { GenerateVerificationCode } = require("../utils/common");
const { MailTemplates } = require("../templates");
const { MailSender, JWTToken } = require("../utils/common");
const uuid = require("uuid").v4;
const { ServerConfig } = require("../config");

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

async function verifyEmail(data) {
    try {
        const { email, otp } = data;

        const user = await userRepository.findOne({ email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        if (user.isVerified === true) {
            throw new AppError(
                "User is already verified",
                StatusCodes.BAD_REQUEST
            );
        }

        if (otp != user.verificationToken) {
            throw new AppError("Invalid otp", StatusCodes.BAD_REQUEST);
        }

        if (user.verificationTokenExpiresAt <= Date.now()) {
            throw new AppError("Otp expires", StatusCodes.BAD_REQUEST);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        const response = await MailSender.sendMail({
            receiverInfo: email,
            subject:
                "Welcome Aboard! Your Account Has Been Successfully Created",
            body: MailTemplates.verificationSuccessTemplate(),
        });
        if (!response) {
            throw new AppError(
                "Can't send welcome mail",
                StatusCodes.BAD_REQUEST
            );
        }

        return user;
    } catch (error) {
        throw new AppError(
            "Something went wrong while verifying user's email",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function signin(data) {
    try {
        const { email, password } = data;

        const user = await userRepository.findOne({ email });
        if (!user) {
            throw new AppError(
                "User not exists, signup first",
                StatusCodes.NOT_FOUND
            );
        }

        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }

        const payload = {
            userId: user._id,
            email,
        };
        const jwtToken = await JWTToken.generateJWTToken(payload);

        user.lastLogin = Date.now();
        await user.save();

        return { user, jwtToken };
    } catch (error) {
        throw new AppError(
            "Something went wrong while logging in the user",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function forgotPassword(data) {
    try {
        const { email } = data;
        const user = await userRepository.findOne({ email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        const resetToken = uuid();
        const resetURL = `${ServerConfig.CLIENT_URL}/reset-password/${resetToken}`;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        const response = await MailSender.sendMail({
            receiverInfo: email,
            subject: "Reset Your Password",
            body: MailTemplates.resetPasswordTemplate(resetURL),
        });
        if (!response) {
            throw new AppError(
                "Can't send reset password mail",
                StatusCodes.BAD_REQUEST
            );
        }
    } catch (error) {
        throw new AppError(
            "Something went wrong while forgotting the password",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function resetPassword(data) {
    try {
        const { newPassword, confirmNewPassword, resetToken } = data;
        console.log(newPassword, confirmNewPassword);

        if (newPassword !== confirmNewPassword) {
            throw new AppError(
                "New Password and Confirm new password must be same",
                StatusCodes.BAD_REQUEST
            );
        }

        const user = await userRepository.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpiresAt: {
                $gt: Date.now(),
            },
        });
        if (!user) {
            throw new AppError(
                "Invalid or expired reset token",
                StatusCodes.BAD_REQUEST
            );
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        const response = await MailSender.sendMail({
            receiverInfo: user.email,
            subject: "Password Reset Successfully",
            body: MailTemplates.resetPasswordSuccessTemplate(),
        });
        if (!response) {
            throw new AppError(
                "Can't send reset password success mail",
                StatusCodes.BAD_REQUEST
            );
        }
    } catch (error) {
        throw new AppError(
            "Something went wrong while resetting user password",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signup,
    verifyEmail,
    signin,
    verifyEmail,
    forgotPassword,
    resetPassword,
};
