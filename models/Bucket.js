const mongoose = require("mongoose");

const bucketSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ip", "user"],
      required: true,
    },
    tokens: {
      type: Number,
      required: true,
      min: 0
    },
    capacity: {
      type: Number,
      required: true,
    },
    refillRate:{
        type: Number,
        required: true,
    },
    lastRefill: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);



bucketSchema.index({ key: 1, type: 1 }, { unique: true });

bucketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const Bucket = mongoose.model("buckets", bucketSchema);

module.exports = Bucket;
