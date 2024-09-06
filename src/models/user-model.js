const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.checkPassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
