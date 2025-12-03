const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Connection = require("./config/db");

const userRouter = require("./routes/user.route");
const jobRouter = require("./routes/job.route");
const companyRouter = require("./routes/company.route");
const applicationRouter = require("./routes/application.route");
const prepResourceRouter = require("./routes/prepResource.route");
const highlightRouter = require("./routes/highlight.route");
const emailRouter = require("./routes/email.route");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const externalJobsRouter = require("./routes/externalJobs.route");
const app = express();

// Configure file upload FIRST to handle multipart/form-data before other parsers
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    abortOnLimit: true,
  })
);

// Optimize: Set body parser limits to prevent DoS attacks and improve performance
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Limit URL-encoded payload size
app.use(cookieParser());
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal By NextHire",
      version: "1.0.0",
    },
    servers: [
      {
        url:
          process.env.BACKEND_URL ||
          process.env.SERVER_URL ||
          "http://localhost:8000",
      },
      ...(process.env.PRODUCTION_BACKEND_URL
        ? [
            {
              url: process.env.PRODUCTION_BACKEND_URL,
            },
          ]
        : []),
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/swagger/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
// Optimize: Configure CORS with specific options
app.use(
  cors({
    origin: function (origin, callback) {
      // List of allowed origins
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.CLIENT_URL,
        "https://raorajan.github.io",
        "http://localhost:5173",
      ].filter(Boolean); // Remove undefined/null values

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (process.env.SKIP_DB === "true") {
  console.warn("Skipping database connection (SKIP_DB=true).");
} else {
  Connection();
}

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/prep-resources", prepResourceRouter);
app.use("/api/v1/highlights", highlightRouter);
app.use("/api/v1/external-jobs", externalJobsRouter);
app.use("/api/v1", emailRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Running! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = app;
