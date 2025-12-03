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

  // Get recipient emails - send to both portfolio email addresses
  // You can override with CONTACT_EMAIL in .env, or it will use both default emails
  const recipientEmails = process.env.CONTACT_EMAIL 
    ? process.env.CONTACT_EMAIL.split(',').map(e => e.trim())
    : ['raorajan9576@gmail.com', 'nexthire6@gmail.com'];

  console.log("📬 Email recipients:", recipientEmails);
  console.log("📧 Contact form submitted by:", email);

  // Format email content
  const emailSubject = `Portfolio Contact: ${firstname} ${lastname} - ${service} Inquiry`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .header p {
          font-size: 14px;
          opacity: 0.95;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 40px 30px;
          background-color: #ffffff;
        }
        .intro-text {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .field-group {
          margin-bottom: 24px;
        }
        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .field-label::before {
          content: '';
          width: 4px;
          height: 16px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          border-radius: 2px;
        }
        .field-value {
          color: #111827;
          font-size: 16px;
          padding: 12px 16px;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
          word-break: break-word;
        }
        .field-value.email-link {
          color: #4F46E5;
          text-decoration: none;
          display: inline-block;
        }
        .field-value.email-link:hover {
          text-decoration: underline;
        }
        .field-value.phone-link {
          color: #059669;
          text-decoration: none;
        }
        .message-box {
          min-height: 120px;
          white-space: pre-wrap;
          line-height: 1.7;
          background-color: #ffffff;
          border: 2px solid #e5e7eb;
        }
        .service-badge {
          display: inline-block;
          padding: 8px 20px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
        }
        .action-section {
          margin-top: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 8px;
          border-left: 4px solid #4F46E5;
        }
        .action-section p {
          font-size: 14px;
          color: #1e40af;
          margin-bottom: 12px;
        }
        .reply-button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 8px;
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
        }
        .footer {
          background-color: #f9fafb;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          font-size: 12px;
          color: #6b7280;
          margin: 4px 0;
        }
        .footer .timestamp {
          color: #9ca3af;
          font-size: 11px;
          margin-top: 8px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 24px 0;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .content {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>💼 New Portfolio Contact</h1>
          <p>Someone wants to connect with you!</p>
        </div>
        
        <div class="content">
          <div class="intro-text">
            You've received a new contact form submission from your portfolio. Someone is interested in your ${service} services.
          </div>
          
          <div class="field-group">
            <div class="field-label">Full Name</div>
            <div class="field-value">${firstname} ${lastname}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="field-group">
            <div class="field-label">Email Address</div>
            <div class="field-value">
              <a href="mailto:${email}" class="email-link">${email}</a>
            </div>
          </div>
          
          <div class="field-group">
            <div class="field-label">Phone Number</div>
            <div class="field-value">
              <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="phone-link">${phone}</a>
            </div>
          </div>
          
          <div class="field-group">
            <div class="field-label">Service Type</div>
            <div class="field-value">
              <span class="service-badge">${service}</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="field-group">
            <div class="field-label">Message</div>
            <div class="field-value message-box">${message}</div>
          </div>
          
          <div class="action-section">
            <p><strong>💡 Quick Action:</strong></p>
            <p>Click the button below to reply directly to ${firstname}, or use the email/phone above to reach out.</p>
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(emailSubject)}" class="reply-button">📧 Reply to ${firstname}</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Portfolio Contact Form</strong></p>
          <p>This email was automatically generated from your portfolio contact form.</p>
          <p class="timestamp">Submitted on ${new Date().toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          })}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
═══════════════════════════════════════════════════════════
  💼 NEW PORTFOLIO CONTACT - ${service} Inquiry
═══════════════════════════════════════════════════════════

You've received a new contact form submission from your portfolio.
Someone is interested in your ${service} services.

───────────────────────────────────────────────────────────
  CONTACT INFORMATION
───────────────────────────────────────────────────────────

Full Name:     ${firstname} ${lastname}
Email:         ${email}
Phone:         ${phone}
Service Type:  ${service}

───────────────────────────────────────────────────────────
  MESSAGE
───────────────────────────────────────────────────────────

${message}

───────────────────────────────────────────────────────────

To reply to this inquiry:
📧 Email: ${email}
📱 Phone: ${phone}

Or simply reply to this email to respond to ${firstname}.

Submitted on: ${new Date().toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
})}

───────────────────────────────────────────────────────────
This email was automatically generated from your portfolio 
contact form.
═══════════════════════════════════════════════════════════
  `;

  // Welcome email template for the person who submitted the form
  const welcomeSubject = `Thank You for Reaching Out - ${firstname}!`;
  const welcomeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header p {
          font-size: 16px;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
          background-color: #ffffff;
        }
        .greeting {
          font-size: 18px;
          color: #111827;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message {
          font-size: 16px;
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        .highlight-box {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 24px;
          border-radius: 8px;
          border-left: 4px solid #4F46E5;
          margin: 30px 0;
        }
        .highlight-box p {
          font-size: 15px;
          color: #1e40af;
          margin-bottom: 8px;
        }
        .footer {
          background-color: #f9fafb;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          font-size: 12px;
          color: #6b7280;
          margin: 4px 0;
        }
        .signature {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .signature p {
          font-size: 14px;
          color: #4b5563;
          margin: 4px 0;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>👋 Thank You, ${firstname}!</h1>
          <p>Your message has been received</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${firstname} ${lastname},
          </div>
          
          <div class="message">
            <p>Thank you for reaching out through my portfolio contact form! I truly appreciate you taking the time to get in touch.</p>
            
            <p>I've received your inquiry regarding <strong>${service}</strong> services, and I'm excited about the possibility of working together.</p>
            
            <p>I've carefully reviewed your message and will get back to you as soon as possible, typically within 24-48 hours. I look forward to discussing how I can help bring your project to life.</p>
          </div>
          
          <div class="highlight-box">
            <p><strong>📋 What happens next?</strong></p>
            <p>• I'll review your requirements and message</p>
            <p>• I'll prepare a personalized response with next steps</p>
            <p>• I'll reach out to you at <strong>${email}</strong> or <strong>${phone}</strong></p>
          </div>
          
          <div class="signature">
            <p>Best regards,</p>
            <p><strong>Portfolio Contact</strong></p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Portfolio Contact Form</strong></p>
          <p>This email was automatically generated to confirm receipt of your message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const welcomeText = `
═══════════════════════════════════════════════════════════
  👋 Thank You for Reaching Out!
═══════════════════════════════════════════════════════════

Hello ${firstname} ${lastname},

Thank you for reaching out through my portfolio contact form! 
I truly appreciate you taking the time to get in touch.

I've received your inquiry regarding ${service} services, and I'm 
excited about the possibility of working together.

I've carefully reviewed your message and will get back to you as 
soon as possible, typically within 24-48 hours. I look forward 
to discussing how I can help bring your project to life.

───────────────────────────────────────────────────────────
  📋 What happens next?
───────────────────────────────────────────────────────────

• I'll review your requirements and message
• I'll prepare a personalized response with next steps
• I'll reach out to you at ${email} or ${phone}

───────────────────────────────────────────────────────────

Best regards,
Portfolio Contact

───────────────────────────────────────────────────────────
This is an automated confirmation email. Please do not reply 
to this email. If you need to reach out, please use the 
contact form on my portfolio.

═══════════════════════════════════════════════════════════
  `;

  try {
    // Send notification email to portfolio owner
    const emailResult = await sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmails.join(','), // Send to both email addresses
      replyTo: email, // Set reply-to to the user's email so you can reply directly
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    console.log("✅ Notification email sent to portfolio owner:", {
      messageId: emailResult?.messageId,
      response: emailResult?.response,
      accepted: emailResult?.accepted,
      rejected: emailResult?.rejected,
      recipients: recipientEmails,
    });

    // Send welcome email to the person who submitted the form
    const welcomeResult = await sendMail({
      from: process.env.EMAIL_USER,
      to: email, // Send to the person who submitted the form
      subject: welcomeSubject,
      text: welcomeText,
      html: welcomeHtml,
    });

    console.log("✅ Welcome email sent to contact:", {
      messageId: welcomeResult?.messageId,
      recipient: email,
      accepted: welcomeResult?.accepted,
      rejected: welcomeResult?.rejected,
    });
    
    // Additional warning if email might be filtered
    if (recipientEmails.includes(process.env.EMAIL_USER)) {
      console.log("⚠️  NOTE: Email sent to same address as sender. Check:");
      console.log("   1. Gmail 'All Mail' folder (not just Inbox)");
      console.log("   2. Spam/Junk folder");
      console.log("   3. Gmail may delay self-sent automated emails");
    }

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: emailResult?.messageId,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    
    // Provide more specific error message
    const errorMessage = error.message || "Failed to send email. Please try again later.";
    const err = new ErrorHandler(errorMessage, 500);
    return err.sendError(res);
  }
});

module.exports = {
  sendContactEmail,
};

