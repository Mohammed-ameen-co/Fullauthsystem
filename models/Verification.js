const mongoose = require("mongoose");

const verifiedSchema = mongoose.Schema(
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
      type: Date,
      required: true,
    },
    variant: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


verifiedSchema.index({expiresAt: 1},{ expireAfterSeconds: 0 })

const Verification = mongoose.model("userVerifications",verifiedSchema);

module.exports = Verification;