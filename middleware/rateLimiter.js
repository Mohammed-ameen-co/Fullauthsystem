const Bucket = require("../models/Bucket");

async function rateLimiter(req, res, next) {
  try {
    const key = req.ip;
    const type = "ip";

    if (!key) return res.status(401).json({ message: "Key not found" });
    let bucket = await Bucket.findOne({
      key,
      type,
      expiresAt: { $gt: Date.now() },
    });
    const now = new Date();
    if (!bucket) {
      bucket = await Bucket.create({
        key,
        type,
        tokens: 5,
        capacity: 5,
        refillRate: 1,
        lastRefill: now,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
      });
    }

    const diffInSec = now - bucket.lastRefill;
    const diffInMinute = Math.floor(diffInSec / 60000);

    if (diffInMinute > 0) {
      const refillToken = diffInMinute * bucket.refillRate;
      bucket.tokens = Math.min(bucket.capacity, bucket.tokens + refillToken);
      bucket.lastRefill = now;
    }

    if (bucket.tokens <= 0)
      return res.status(429).json({ message: "To many request" });

    bucket.tokens -= 1;

    await bucket.save();

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Rate limit error" });
  }
}

module.exports = rateLimiter;
