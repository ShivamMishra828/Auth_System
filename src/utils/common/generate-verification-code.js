// Import the OTP generator library
const otpGenerator = require("otp-generator");

/**
 * Generates a 6-digit verification code
 * @returns {string} The generated verification code
 */
function generate() {
    // Use the otp-generator library to generate a 6-digit code
    // with only numbers (no letters or special characters)
    const generatedOtp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    // Return the generated verification code
    return generatedOtp;
}

// Export the generate function for use in other modules
module.exports = { generate };
