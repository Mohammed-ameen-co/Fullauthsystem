const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secret = process.env.SECRET_KEY;

function setUserCookei(user) {
  try {
    const payload = {
      _id: user._id,
      firstname: user.firstname,
      role: user.role,
      timestamp: true,
    };
    return jwt.sign(payload, secret);
  } catch (error) {
    return error;
  }
}

function getUser(token) {
  if (!token) return null;
  return jwt.verify(token, secret);
}

module.exports = {
  setUserCookei,
  getUser,
};
