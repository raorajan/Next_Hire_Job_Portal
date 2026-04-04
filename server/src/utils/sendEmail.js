const { Resend } = require("resend");

async function sendMail(emailBody) {
  try {
    // Validate required email configuration
    if (!process.env.RESEND_EMAIL_API_KEY) {
      throw new Error("Email configuration is missing. RESEND_EMAIL_API_KEY must be set.");
    }

    const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

    // Use the custom domain raorajan.pro for professional sending
    // Make sure you have added the DNS records provided for raorajan.pro in Resend
    const resendOptions = {
      from: `Next Hire <verify@raorajan.pro>`, 
      to: emailBody.to,
      subject: emailBody.subject,
      text: emailBody.text || "",
      html: emailBody.html || "",
      headers: {
        'Reply-To': emailBody.replyTo || "raorajan9576@gmail.com",
        'X-Mailer': 'Next Hire Job Portal',
      },
    };

    // If we have a custom domain/verified email, we should use that instead
    // But for initial Resend setup, onboarding@resend.dev is the only one that works without domain verification
    console.log("📧 Sending email via Resend:", {
      to: resendOptions.to,
      subject: resendOptions.subject,
    });

    // Send email using Resend SDK
    const { data, error } = await resend.emails.send(resendOptions);

    if (error) {
      throw error;
    }

    console.log("✅ Email sent successfully via Resend");
    console.log("📬 Message ID:", data.id);

    return data;
  } catch (error) {
    console.error("❌ Error sending email via Resend:", error.message);
    console.error("Full error:", error);
    
    // Provide more helpful error messages for Resend
    if (error.name === "validation_error") {
      throw new Error("Resend: Validation error. Check if the 'to' address is authorized for your free tier.");
    } else if (error.name === "rate_limit_exceeded") {
      throw new Error("Resend: Rate limit exceeded. Please wait a moment before sending more emails.");
    } else if (error.name === "missing_api_key") {
      throw new Error("Resend: API key is missing. Please check your RESEND_EMAIL_API_KEY in .env.");
    }
    
    throw error;
  }
}

module.exports = { sendMail };
