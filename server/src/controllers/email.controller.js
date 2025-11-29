const { sendMail } = require("../utils/sendEmail");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

/**
 * Send contact email
 * POST /api/v1/send-email
 */
const sendContactEmail = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, email, phone, service, message } = req.body;

  // Validation
  if (!firstname || !lastname || !email || !phone || !service || !message) {
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new ErrorHandler("Invalid email format", 400);
    return error.sendError(res);
  }

  // Validate service type
  const validServices = ["FullStack", "Frontend", "Backend"];
  if (!validServices.includes(service)) {
    const error = new ErrorHandler(
      `Invalid service type. Must be one of: ${validServices.join(", ")}`,
      400
    );
    return error.sendError(res);
  }

  // Validate phone format (basic validation)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    const error = new ErrorHandler("Invalid phone number format", 400);
    return error.sendError(res);
  }

  // Check if email service is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const error = new ErrorHandler("Email service is not configured", 500);
    return error.sendError(res);
  }

  // Get recipient email (use CONTACT_EMAIL if set, otherwise use EMAIL_USER)
  const recipientEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

  // Format email content
  const emailSubject = `New Contact Form Submission - ${service} Service`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4F46E5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .field {
          margin-bottom: 15px;
        }
        .field-label {
          font-weight: bold;
          color: #4F46E5;
          margin-bottom: 5px;
          display: block;
        }
        .field-value {
          color: #1f2937;
          padding: 8px;
          background-color: white;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }
        .message-box {
          min-height: 100px;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        .service-badge {
          display: inline-block;
          padding: 5px 15px;
          background-color: #4F46E5;
          color: white;
          border-radius: 20px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <div class="field">
          <span class="field-label">Name:</span>
          <div class="field-value">${firstname} ${lastname}</div>
        </div>
        
        <div class="field">
          <span class="field-label">Email:</span>
          <div class="field-value">${email}</div>
        </div>
        
        <div class="field">
          <span class="field-label">Phone:</span>
          <div class="field-value">${phone}</div>
        </div>
        
        <div class="field">
          <span class="field-label">Service:</span>
          <div class="field-value">
            <span class="service-badge">${service}</span>
          </div>
        </div>
        
        <div class="field">
          <span class="field-label">Message:</span>
          <div class="field-value message-box">${message}</div>
        </div>
        
        <div class="footer">
          <p>This email was sent from the Next Hire Job Portal contact form.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
New Contact Form Submission

Name: ${firstname} ${lastname}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
This email was sent from the Next Hire Job Portal contact form.
  `;

  try {
    // Send email
    await sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    const err = new ErrorHandler(
      "Failed to send email. Please try again later.",
      500
    );
    return err.sendError(res);
  }
});

module.exports = {
  sendContactEmail,
};

