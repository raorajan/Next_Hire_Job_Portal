const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

// General rate limiter for authentication routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    status: 429,
    message: "Too many login/register attempts from this IP, please try again after 15 minutes",
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on route ${req.originalUrl}`);
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { authRateLimiter };
