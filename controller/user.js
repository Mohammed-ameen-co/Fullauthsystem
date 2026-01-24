const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const {
  accesstoken,
  refreshtoken,
  verifyRefreshToken,
} = require("../services/tokenService");

//this handler create new users
async function handleCreateNewUser(req, res) {
  const { firstname, lastname, email, phone, role, password } = req.body;
  try {
    if (!email && !phone) {
      return res.status(400).json({
        message: "Email Or Phone Is Required",
      });
    }
    const existingUser = await User.findOne({
      $or: [email ? { email } : null, phone ? { phone } : null].filter(Boolean),
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or phone already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 16);
    await User.create({
      firstname,
      lastname,
      email,
      phone,
      role,
      password: hashPassword,
    });
    return res.status(200).send("User Succesfully created");
  } catch (error) {
    console.error(error);
    return res.status(400).send("field missing");
  }
}


//this handler login the already availabe users and create refresh and access token

async function handleLoginUser(req, res) {
  const { recognizer, password } = req.body;

  console.log("Body", req.body);

  console.log("recognizer", recognizer);
  console.log("password", req.body.password);

  if (!recognizer) {
    return res.status(400).json({ error: "Email or phone required" });
  }
  try {
    const user = await User.findOne({
      $or: [{ email: recognizer }, { phone: recognizer }],
    });
    if (!user) {
      return res.status(400).json({ Error: "User not found" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ Error: "Wrong Password" });
    }

    const createAccessToken = accesstoken(user);
    const createRefreshToken = refreshtoken(user);

    const hashedRefreshToken = await bcrypt.hash(createRefreshToken, 16);

    await Session.create({
      userId: user._id,
      token: hashedRefreshToken,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      isRevoked: false,
      device: req.headers["user-agent"],
    });

    return res
      .cookie("jwttoken", createRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
      })
      .status(200)
      .json({ accessToken: createAccessToken, message: "Logged in" });
  } catch (error) {

    console.error(error);


    return res.status(500).json({ message: "Login failed" });
  }
}

//this handler logout the current login user and revoked the user current device sessions
async function handleLogoutUsers(req, res) {
  try {
    if (!req.cookies.jwttoken)
      return res.status(401).json({ message: "Missing" });

    const refreshToken = req.cookies.jwttoken;
    const sessions = await Session.find({
      isRevoked: false,
      expiresAt: { $gt: Date.now() },
    });

    let revoked = false;

    for (const session of sessions) {
      const match = await bcrypt.compare(refreshToken, session.token);
      if (match) {
        session.isRevoked = true;
        await session.save();
        revoked = true;
        break;
      }
    }

    res.clearCookie("jwttoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });
    return res.status(200).json({
      message: revoked ? "Logged out successfully" : "Session already invalid",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Logout failed" });
  }
}


// this handler provide new access token 
async function handleRefreshUsers(req, res) {
  try {
    if (!req.cookies.jwttoken){
      console.log(req.cookies.jwttoken)
      return res.status(401).json({ message: "Missing / invalid token" });
    }
    const getRefreshToken = req.cookies.jwttoken;

    const decode = verifyRefreshToken(getRefreshToken);
    const user = await User.findById(decode._id);
    if (!user)
      return res.status(401).json({ message: "User not found during auth" });

    const sessions = await Session.find({
      userId: user._id,
      isRevoked: false,
      expiresAt: { $gt: Date.now() },
    });
    let validSession = null;

    for (const session of sessions) {
      const match = await bcrypt.compare(getRefreshToken, session.token);
      if (match) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      return res.status(401).json({ message: "Session expired or revoked" });
    }

    const newAccessToken = accesstoken(user);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

module.exports = {
  handleCreateNewUser,
  handleLoginUser,
  handleRefreshUsers,
  handleLogoutUsers,
};
