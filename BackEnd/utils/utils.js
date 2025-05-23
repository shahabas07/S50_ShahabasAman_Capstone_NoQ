
const crypto = require('crypto');

function generateOtp() {
  return crypto.randomInt(1000, 9999).toString();
}

function isOtpExpired(expiresAt) {
  return Date.now() > expiresAt;
}

module.exports = {
  generateOtp,
  isOtpExpired
};
