const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleCreateNewUser,
  handleLoginUser,
  handleRefreshUsers,
  handleLogoutUsers,
  handleVerifiedRequest,
  handleVerifiedConfirm,
  handleMe
} = require("../controllers/user");
const rateLimiter = require("../middlewares/rateLimiter");
const verifiedMiddleware = require("../middlewares/verifiedMiddleware");

router.post("/signup", handleCreateNewUser);
router.post("/login", rateLimiter, handleLoginUser);

router.post("/refresh", rateLimiter, handleRefreshUsers);
router.post("/logout", authMiddleware ,handleLogoutUsers);

router.post("/verify/request", authMiddleware, handleVerifiedRequest);
router.post("/verify/confirm", authMiddleware, handleVerifiedConfirm);

router.get("/me",authMiddleware,handleMe)

router.get("/", authMiddleware, verifiedMiddleware, (req, res) => {
  res.send("ok");
});

module.exports = router;
