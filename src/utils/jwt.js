const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.APP_SECRET;
const EXPIRES_IN = "2h";

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
