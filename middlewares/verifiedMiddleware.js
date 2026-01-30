async function verifiedMiddleware(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Verification check failed",
    });
  }
}
module.exports = verifiedMiddleware;
