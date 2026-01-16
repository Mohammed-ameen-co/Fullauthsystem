const { getUser } = require("../utils/auth");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    const decode = getUser(token);

    const user = await User.findById(decode._id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
module.exports = authMiddleware;
