const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Defining the User Schema
const userSchema = new mongoose.Schema(
    {
        // Email field
        email: {
            type: String,
            required: true,
            unique: true,
        },

        // User name field
        userName: {
            type: String,
            required: true,
            unique: true,
        },

        // Password field
        password: {
            type: String,
            required: true,
        },

        // Last login field
        lastLogin: {
            type: Date,
            default: null,
        },

        // Is verified field
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Reset password token field
        resetPasswordToken: String,

        // Reset password expires at field
        resetPasswordExpiresAt: Date,

        // Verification token field
        verificationToken: String,

        // Verification token expires at field
        verificationTokenExpiresAt: Date,
    },
    { timestamps: true } // Enable timestamps for created and updated fields
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
    // Check if the password has been modified
    if (!this.isModified("password")) return next();

    // Hash the password using bcrypt
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Method to check if a password matches the hashed password
userSchema.methods.checkPassword = async function (password) {
    // Compare the provided password with the hashed password
    return bcrypt.compareSync(password, this.password);
};

// Creating the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
