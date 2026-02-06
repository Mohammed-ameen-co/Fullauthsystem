const User = require("../models/User");
const Verification = require("../models/Verification");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const {
  accesstoken,
  refreshtoken,
  verifyRefreshToken,
} = require("../services/tokenService");
const generateOTP = require("../services/generateVerificationCode");

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
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstname,
      lastname,
      email,
      phone,
      role,
      password: hashPassword,
    });
    return res.status(200).json({
      success: true,
      message: "User successfully created",
    });
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

    const hashedRefreshToken = await bcrypt.hash(createRefreshToken, 10);

    await Session.create({
      userId: user._id,
      tokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isRevoked: false,
      device: req.headers["user-agent"],
    });

    return res
      .cookie("jwttoken", createRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.firstname,
        },
        accessToken: createAccessToken,
      });
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
    const decode = verifyRefreshToken(refreshToken);

    const session = await Session.findOne({
      userId: decode._id,
      isRevoked: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!session) {
      return res.status(401).json({ message: "Session not found" });
    }

    const isValidToken = await bcrypt.compare(refreshToken, session.tokenHash);
    if (!isValidToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    session.isRevoked = true;
    await session.save();

    res.clearCookie("jwttoken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Logout failed" });
  }
}

// this handler provide new access token
async function handleRefreshUsers(req, res) {
  try {
    if (!req.cookies.jwttoken) {
      console.log(req.cookies.jwttoken);
      return res.status(401).json({ message: "Missing / invalid token" });
    }
    const getRefreshToken = req.cookies.jwttoken;

    const decode = verifyRefreshToken(getRefreshToken);
    const user = await User.findById(decode._id);
    if (!user)
      return res.status(401).json({ message: "User not found during auth" });

    const session = await Session.findOne({
      userId: user._id,
      isRevoked: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!session) {
      return res.status(401).json({ message: "Session expired or revoked" });
    }

    const isValidToken = await bcrypt.compare(
      getRefreshToken,
      session.tokenHash,
    );

    if (!isValidToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const SESSION_TTL = 24 * 60 * 60 * 1000 + 60 * 1000;
    session.expiresAt = new Date(Date.now() + SESSION_TTL);

    await session.save();

    const newAccessToken = accesstoken(user);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

//user veryfication request chacke and handle

async function handleVerifiedRequest(req, res) {
  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({ message: "User not found during auth" });

    if (user.isVerified)
      return res.status(200).json({ message: "User already verified" });

    const existing = await Verification.findOne({
      userId: user._id,
      expiresAt: { $gt: Date.now() },
    });

    if (existing) return res.status(429).json({ message: "OTP already sent" });

    const otp = generateOTP();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Verification.create({
      userId: user._id,
      token: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      variant: "email",
    });

    return res.status(200).json({ message: otp });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

//To verify the user
async function handleVerifiedConfirm(req, res) {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP required" });

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized " });

    const record = await Verification.findOne({ userId: user._id });

    if (!record) return res.status(404).json({ message: "OTP not found " });

    if (record.expiresAt < Date.now())
      return res.status(410).json({ message: "OTP expired" });

    const correct = await bcrypt.compare(otp, record.token);

    if (!correct)
      return res.status(422).json({ message: "Enter the right OTP " });

    user.isVerified = true;
    await user.save();

    await Verification.deleteOne({ _id: record._id });

    return res.status(200).json({ message: "succesfully varified " });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function handleMe(req, res) {
  const user = req.user;
  return res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.firstname,
    },
  });
}

module.exports = {
  handleCreateNewUser,
  handleLoginUser,
  handleRefreshUsers,
  handleLogoutUsers,
  handleVerifiedRequest,
  handleVerifiedConfirm,
  handleMe
};
