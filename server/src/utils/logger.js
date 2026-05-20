const winston = require("winston");

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // capture stack trace
    process.env.NODE_ENV === "production" ? winston.format.json() : logFormat
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "development"
          ? combine(colorize(), logFormat)
          : winston.format.json(),
    }),
  ],
});

module.exports = logger;
