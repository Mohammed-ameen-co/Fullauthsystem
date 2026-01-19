const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    device: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("sessions", sessionSchema);

module.exports = Session;
