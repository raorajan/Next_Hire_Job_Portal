const express = require("express");
const { sendContactEmail } = require("../controllers/email.controller");

const emailRouter = express.Router();

// POST /api/v1/send-email - Send contact form email
emailRouter.route("/send-email").post(sendContactEmail);

module.exports = emailRouter;

