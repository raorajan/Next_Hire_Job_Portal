require("dotenv").config();
const nodemailer = require("nodemailer");

async function verifySMTP() {
  console.log("🔍 Checking SMTP Configuration...");
  console.log(`📧 User: ${process.env.EMAIL_USER}`);
  console.log(`🔑 Pass: ${process.env.EMAIL_PASS ? "******** (Hidden)" : "MISSING"}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Error: EMAIL_USER or EMAIL_PASS is missing in .env");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log("⏳ Verifying connection to Gmail SMTP...");
    await transporter.verify();
    console.log("✅ SUCCESS: SMTP connection is valid! Your credentials are correct.");
  } catch (error) {
    console.error("❌ FAILED: SMTP connection failed.");
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Message: ${error.message}`);
    
    if (error.code === "EAUTH") {
      console.log("\n💡 TIP: For Gmail, this usually means:");
      console.log("1. You need to use an 'App Password', not your regular password.");
      console.log("2. 2-Step Verification must be ENABLED to use App Passwords.");
      console.log("3. Go to https://myaccount.google.com/apppasswords to create a new one.");
    }
  }
}

verifySMTP();
