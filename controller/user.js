const User = require("../models/User");
const bcrypt = require("bcrypt");
const { setUserCookei } = require("../utils/auth");

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
    return res.status(400).send("field missing");
  }
}

async function handleLoginUser(req, res) {
  const { recognizer, password } = req.body;

  console.log("Body", req.body);


  console.log("recognizer", recognizer);
  console.log("password", req.body.password);

  if (!recognizer) {
    return res.status(400).json({ error: "Email or phone required" });
  }
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

  const token = setUserCookei(user);
  return res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .send("Logged in");
}

module.exports = {
  handleCreateNewUser,
  handleLoginUser,
};
