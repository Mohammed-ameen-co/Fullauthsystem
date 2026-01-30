function generateOTP() {
    // Generate a random number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string to ensure leading zeros are handled if length varies
}

module.exports = generateOTP;