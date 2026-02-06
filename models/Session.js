const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
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


sessionSchema.index({expiresAt: 1},{ expireAfterSeconds: 0 })
sessionSchema.index({ userId: 1, isRevoked: 1 });

const Session = mongoose.model("sessions", sessionSchema);

module.exports = Session;
