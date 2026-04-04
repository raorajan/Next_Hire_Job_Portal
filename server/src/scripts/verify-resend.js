require("dotenv").config();
const { Resend } = require("resend");

async function verifyResend() {
  console.log("🔍 Checking Resend Configuration...");
  const apiKey = process.env.RESEND_EMAIL_API_KEY;
  console.log(`🔑 API Key: ${apiKey ? apiKey.substring(0, 7) + "..." : "MISSING"}`);

  if (!apiKey) {
    console.error("❌ Error: RESEND_EMAIL_API_KEY is missing in server/.env");
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  try {
    console.log("⏳ Sending test email via Resend with CUSTOM DOMAIN...");
    const { data, error } = await resend.emails.send({
      from: 'NextHire Test <verify@raorajan.pro>',
      to: 'raorajan9576@gmail.com', // Now you can send to any address!
      subject: 'Custom Domain Test - raorajan.pro',
      html: '<h1>Success!</h1><p>Your custom domain <strong>raorajan.pro</strong> is working correctly with Resend.</p>'
    });

    if (error) {
      throw error;
    }

    console.log("✅ SUCCESS: Email sent successfully via Resend!");
    console.log("📬 Message ID:", data.id);
  } catch (error) {
    console.error("❌ FAILED: Resend forgot to send the email.");
    console.error(`Error Name: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    
    if (error.name === "validation_error") {
      console.log("\n💡 TIP: Check if 'raorajan9576@gmail.com' is the email you used to sign up for Resend.");
      console.log("On the free tier, you can only send to your own registered email address until you verify a domain.");
    }
  }
}

verifyResend();
