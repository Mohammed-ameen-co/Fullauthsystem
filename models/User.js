const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: function () {
        return !!this.email;
      },
    },
    lastname: {
      type: String,
      required: function () {
        return !!this.email;
      },
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["email", "phone"],
      default: [],
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !!this.email;
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $ne: null },
    },
  },
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $ne: null },
    },
  },
);

const User = mongoose.model("users", userSchema);

module.exports = User;
