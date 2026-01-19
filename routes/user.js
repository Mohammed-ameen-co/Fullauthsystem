const express = require("express");
const router = express.Router();
const { handleCreateNewUser, handleLoginUser,handleRefreshUsers,handleLogoutUsers } = require("../controller/user");

router.post("/signup", handleCreateNewUser);
router.post("/login", handleLoginUser);
router.post("/refresh", handleRefreshUsers);
router.post("/logout", handleLogoutUsers);

module.exports = router;
