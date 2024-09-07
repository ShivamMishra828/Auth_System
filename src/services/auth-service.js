const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repository");
const AppError = require("../utils/error/app-error");
const { GenerateVerificationCode } = require("../utils/common");
const { MailTemplates } = require("../templates");
const { MailSender, JWTToken } = require("../utils/common");
const uuid = require("uuid").v4;
const { ServerConfig } = require("../config");

// Create a new instance of the UserRepository
const userRepository = new UserRepository();

// Signup service
async function signup(data) {
    try {
        // Extract email, password, and userName from the request data
        const { email, password, userName } = data;

        // Check if the user already exists
        const existingUser = await userRepository.findOne({ email });
        if (existingUser) {
            throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
        }

        // Generate a verification code
        const generatedOtp = GenerateVerificationCode.generate();

        // Send a verification email to the user
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

        // Create a new user document
        const user = await userRepository.create({
            email,
            userName,
            password,
            verificationToken: generatedOtp,
            verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });

        return user;
    } catch (error) {
        // Handle errors
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Something went wrong while signing up the user",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Verify email service
async function verifyEmail(data) {
    try {
        // Extract email and otp from the request data
        const { email, otp } = data;

        // Find the user by email
        const user = await userRepository.findOne({ email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        // Check if the user is already verified
        if (user.isVerified === true) {
            throw new AppError(
                "User is already verified",
                StatusCodes.BAD_REQUEST
            );
        }

        // Check if the otp is valid
        if (otp != user.verificationToken) {
            throw new AppError("Invalid otp", StatusCodes.BAD_REQUEST);
        }

        // Check if the otp has expired
        if (user.verificationTokenExpiresAt <= Date.now()) {
            throw new AppError("Otp expires", StatusCodes.BAD_REQUEST);
        }

        // Generate a JWT token for the user
        const payload = {
            id: user._id,
        };
        const jwtToken = await JWTToken.generateJWTToken(payload);

        // Update the user document
        user.lastLogin = Date.now();
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // Send a welcome email to the user
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

        return { user, jwtToken };
    } catch (error) {
        // Handle errors
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Something went wrong while verifying user's email",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Signin service
async function signin(data) {
    try {
        // Extract email and password from the request data
        const { email, password } = data;

        // Find the user by email
        const user = await userRepository.findOne({ email });
        if (!user) {
            throw new AppError(
                "User not exists, signup first",
                StatusCodes.NOT_FOUND
            );
        }

        // Check if the password is correct
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }

        // Generate a JWT token for the user
        const payload = {
            id: user._id,
        };
        const jwtToken = await JWTToken.generateJWTToken(payload);

        // Update the user document
        user.lastLogin = Date.now();
        await user.save();

        return { user, jwtToken };
    } catch (error) {
        // Handle errors
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Something went wrong while logging in the user",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Forgot password service
async function forgotPassword(data) {
    try {
        // Extract email from the request data
        const { email } = data;

        // Find the user by email
        const user = await userRepository.findOne({ email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        // Generate a reset token
        const resetToken = uuid();
        const resetURL = `${ServerConfig.CLIENT_URL}/reset-password/${resetToken}`;

        // Update the user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send a reset password email to the user
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
        // Handle errors
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Something went wrong while forgotting the password",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Reset password service
async function resetPassword(data) {
    try {
        // Extract newPassword, confirmNewPassword, and resetToken from the request data
        const { newPassword, confirmNewPassword, resetToken } = data;

        // Check if the new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            throw new AppError(
                "New Password and Confirm new password must be same",
                StatusCodes.BAD_REQUEST
            );
        }

        // Find the user by reset token
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

        // Update the user document
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        // Send a reset password success email to the user
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
        // Handle errors
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Something went wrong while resetting user password",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Fetch user details service
async function fetchUserDetails(data) {
    try {
        // Extract userId from the request data
        const { userId } = data;

        // Find the user by userId
        const userDetails = await userRepository.findById(userId);

        if (!userDetails) {
            throw new AppError(
                "User with given userId doesn't exists",
                StatusCodes.BAD_REQUEST
            );
        }

        return userDetails;
    } catch (error) {
        // Handle errors
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Something went wrong while fetching user's details",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Export the authentication services
module.exports = {
    signup,
    verifyEmail,
    signin,
    verifyEmail,
    forgotPassword,
    resetPassword,
    fetchUserDetails,
};
