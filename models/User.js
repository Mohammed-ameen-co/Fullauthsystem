const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified:{
      type: Boolean,
      default: false,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $ne: null },
    },
  }
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $ne: null },
    },
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
