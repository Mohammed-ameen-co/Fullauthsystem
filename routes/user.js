const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const { handleCreateNewUser, handleLoginUser,handleRefreshUsers,handleLogoutUsers } = require("../controller/user");
const rateLimiter = require("../middleware/rateLimiter");

router.post("/signup", handleCreateNewUser);
router.post("/login",rateLimiter, handleLoginUser);
router.post("/refresh",rateLimiter, handleRefreshUsers);
router.post("/logout", handleLogoutUsers);

router.get("/",authMiddleware,(req, res) => {
  res.send("ok");
});

module.exports = router;
