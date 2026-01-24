const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const { handleCreateNewUser, handleLoginUser,handleRefreshUsers,handleLogoutUsers } = require("../controllers/user");
const rateLimiter = require("../middlewares/rateLimiter");

router.post("/signup", handleCreateNewUser);
router.post("/login",rateLimiter, handleLoginUser);
router.post("/refresh",rateLimiter, handleRefreshUsers);
router.post("/logout", handleLogoutUsers);

router.get("/",authMiddleware,(req, res) => {
  res.send("ok");
});

module.exports = router;
