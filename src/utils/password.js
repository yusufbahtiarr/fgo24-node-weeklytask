const argon2 = require("argon2");

async function hashPassword(password) {
  return await argon2.hash(password);
}

async function verifyPassword(hashedPassword, plainPassword) {
  return await argon2.verify(hashedPassword, plainPassword);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
