const crypto = require("crypto");

// Generate a random token using crypto
exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex"); // generates a random 32-byte token
};
