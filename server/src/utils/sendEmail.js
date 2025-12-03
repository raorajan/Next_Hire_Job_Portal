const nodemailer = require("nodemailer");

async function sendMail(emailBody) {
  try {
    // Validate required email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration is missing. EMAIL_USER and EMAIL_PASS must be set.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password if 2FA is enabled
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ SMTP server connection verified");

    // Gmail requires the "from" address to match the authenticated user
    const fromEmail = process.env.EMAIL_USER;
    
    // Warn if sending to the same email (Gmail may filter these)
    if (emailBody.to === fromEmail) {
      console.warn("⚠️  Warning: Sending email to the same address as sender. Gmail may filter or delay these emails.");
      console.warn("   Consider setting CONTACT_EMAIL in .env to a different recipient email.");
    }
    
    const mailOptions = {
      from: `"Next Hire Job Portal" <${fromEmail}>`,
      to: emailBody.to,
      subject: emailBody.subject,
      text: emailBody.text || "",       // optional fallback plain text
      html: emailBody.html || "",       // required: actual email content
      headers: {
        ...emailBody.headers,
        'Reply-To': emailBody.replyTo || fromEmail,
        'X-Mailer': 'Next Hire Job Portal',
      },
    };

    console.log("📧 Sending email:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      replyTo: mailOptions.headers['Reply-To'],
    });

    // Send email and get result
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
    console.log("📬 Message ID:", info.messageId);
    console.log("📧 Response:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    console.error("Full error:", error);
    
    // Provide more helpful error messages
    if (error.code === "EAUTH") {
      throw new Error("Authentication failed. Please check your EMAIL_USER and EMAIL_PASS. For Gmail, you may need to use an App Password instead of your regular password.");
    } else if (error.code === "ECONNECTION") {
      throw new Error("Connection failed. Please check your internet connection and SMTP settings.");
    } else if (error.code === "ETIMEDOUT") {
      throw new Error("Connection timeout. Please check your network connection.");
    }
    
    throw error;
  }
}

module.exports = { sendMail };
