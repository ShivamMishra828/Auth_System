const otpGenerator = require("otp-generator");

function generate() {
    const generatedOtp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    return generatedOtp;
}

module.exports = { generate };
