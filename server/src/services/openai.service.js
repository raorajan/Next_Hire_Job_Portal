const { sendMail } = require("../utils/sendEmail");
const User = require("../models/user.model");
require("dotenv").config();
const cron = require("node-cron");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateEmailContent(job, user, companyName) {
  const content = `
  Subject: Exciting Job Opportunity: ${job.title} at ${companyName}

  Dear ${user.fullname},

  We are thrilled to share an exciting opportunity at ${companyName}. As a valued candidate on NextHire, we believe you would be a perfect fit for the ${
    job.title
  } position, available at our rapidly growing tech company located in ${
    job.location
  }.

  **Job Description:**
  ${job.description}

  In this role, you will collaborate with a talented team, utilizing your skills in ${job.requirements.join(
    ", "
  )} to develop and maintain innovative web applications. Your contributions will help us deliver exceptional user experiences while maintaining high standards of quality and efficiency.

  **Required Skills:**
  - Proficiency in ${job.requirements.join(", ")}
  - Over ${job.experienceLevel} years of experience in ${job.jobType}
  - Strong communication and problem-solving abilities

  **Job Details:**
  - Salary: ${job.salary} per year
  - Location: ${job.location}
  - Type: ${job.jobType}
  - Experience Level: ${job.experienceLevel}+ years

  To apply, please visit this link: [job-link]. We encourage you to explore this exciting role and consider joining our dynamic team.

  Warm regards,
  The Hiring Team at ${companyName}`;

  const result = await model.generateContent(content);
  return result.content;
}

async function processJobAndNotifyUsers(job, companyName) {
  try {
    const matchingUsers = await User.find({
      "profile.skills": { $in: job.requirements },
    });

    for (const user of matchingUsers) {
      if (user.role === "student") {
        const emailContent = await generateEmailContent(job, user, companyName);

        const emailBody = {
          from: "NextHire <notifications@raorajan.pro>",
          to: user.email,
          subject: `Exciting Job Opportunity: ${job.title} at ${companyName}`,
          text: emailContent,
          html: `
            <p>Dear ${user.fullname},</p>
            <p>${emailContent.replace(/(?:\r\n|\r|\n)/g, "<br>")}</p>
            <p>Warm regards,<br>The Hiring Team at ${companyName}</p>
          `,
        };

        await sendMail(emailBody);
        console.log(`Email sent to: ${user.email}`);
      } else {
        console.log(`User ${user.email} is not a student, skipping email.`);
      }
    }

    console.log("Emails sent to matching users successfully.");
  } catch (error) {
    console.error("Error in processing job and notifying users:", error);
  }
}

async function notifyUsersToCompleteProfile() {
  try {
    const usersWithEmptySkills = await User.find({
      "profile.skills": { $exists: true, $eq: [] },
      role: "student",
    });

    for (const user of usersWithEmptySkills) {
      const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL ;
      const userProfileLink = `${frontendUrl}/profile`;
      const emailContent = `
      Subject: Enhance Your Profile for Better Job Suggestions

      Dear ${user.fullname},

      We noticed that your profile is currently incomplete, specifically in the skills section. Completing your profile will significantly improve our ability to suggest relevant job opportunities tailored to your expertise and interests.

      To enhance your experience on NextHire and receive notifications about exciting job openings that match your skills, please log in to your account and update your skills section at the following link: [Update Your Profile](${userProfileLink}).

      Best regards,
      The NextHire Team`;

      const emailBody = {
        from: "NextHire <notifications@raorajan.pro>",
        to: user.email,
        subject: "Enhance Your Profile for Better Job Suggestions",
        text: emailContent,
        html: `
          <p>Dear ${user.fullname},</p>
          <p>We noticed that your profile is currently incomplete, specifically in the skills section. Completing your profile will significantly improve our ability to suggest relevant job opportunities tailored to your expertise and interests.</p>
          <p>To enhance your experience on NextHire and receive notifications about exciting job openings that match your skills, please log in to your account and update your skills section at the following link: <a href="${userProfileLink}">Update Your Profile</a>.</p>
          <p>Best regards,<br>The NextHire Team</p>
        `,
      };
      await sendMail(emailBody);
      console.log(`Email sent to: ${user.email}`);
    }

    console.log("Profile completion notifications sent successfully.");
  } catch (error) {
    console.error(
      "Error in notifying users to complete their profiles:",
      error
    );
  }
}

cron.schedule("0 0 * * *", () => {
  console.log(
    "Checking for users to notify about completing their profiles..."
  );
  notifyUsersToCompleteProfile();
});

// cron.schedule("* * * * *", () => {
//   console.log("Checking for users to notify about completing their profiles...");
//   notifyUsersToCompleteProfile();
// });

async function notifyApplicationReceived(user, job, companyName) {
  try {
    const emailContentText = `
    Dear ${user.fullname},

    Thank you for applying for the ${job.title} position at ${companyName}. We have received your application and are currently reviewing it.

    We appreciate your interest in joining our team and will reach out if your skills and experience align with the requirements for this role.

    In the meantime, feel free to explore other opportunities on our platform and update your profile for more tailored job suggestions.

    Thank you again for considering ${companyName}. We wish you the best in the application process!

    Best regards,
    The Hiring Team at ${companyName}`;

    const emailContentHtml = `
    <p>Dear ${user.fullname},</p>
    <p>Thank you for applying for the <strong>${job.title}</strong> position at <strong>${companyName}</strong>. We have received your application and are currently reviewing it.</p>

    <p>We appreciate your interest in joining our team and will reach out if your skills and experience align with the requirements for this role.</p>

    <p>In the meantime, feel free to explore other opportunities on our platform and update your profile for more tailored job suggestions.</p>

    <p>Thank you again for considering <strong>${companyName}</strong>. We wish you the best in the application process!</p>

    <p>Best regards,<br>The Hiring Team at ${companyName}</p>`;

    const emailBody = {
      from: "NextHire <notifications@raorajan.pro>",
      to: user.email,
      subject: `Application Received for ${job.title} at ${companyName}`,
      text: emailContentText,
      html: emailContentHtml,
    };

    await sendMail(emailBody);
    console.log(`Application confirmation email sent to: ${user.email}`);
  } catch (error) {
    console.error("Error sending application confirmation email:", error);
  }
}

async function notifyJobDeletion(jobTitle, companyName, applicants) {
  try {
    for (const applicant of applicants) {
      const emailContentText = `
      Dear ${applicant.fullname},

      We regret to inform you that the job position for ${jobTitle} at ${companyName} has been deleted, and the hiring process for this position has been halted.

      We understand that this news may be disappointing, and we encourage you to explore other opportunities that may align with your skills and interests.

      Thank you for your understanding.

      Best regards,
      The Hiring Team at ${companyName}`;

      const emailContentHtml = `
      <p>Dear ${applicant.fullname},</p>
      <p>We regret to inform you that the job position for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been deleted, and the hiring process for this position has been halted.</p>

      <p>We understand that this news may be disappointing, and we encourage you to explore other opportunities that may align with your skills and interests.</p>

      <p>Thank you for your understanding.</p>

      <p>Best regards,<br>The Hiring Team at ${companyName}</p>`;

      const emailBody = {
        from: "NextHire <notifications@raorajan.pro>",
        to: applicant.email,
        subject: `Update on Your Application for ${jobTitle}`,
        text: emailContentText,
        html: emailContentHtml,
      };

      await sendMail(emailBody);
      console.log(`Job deletion notification sent to: ${applicant.email}`);
    }
  } catch (error) {
    console.error("Error in sending job deletion notifications:", error);
  }
}

async function notifyStatusUpdate(applicant, jobTitle, status, companyName) {
  const isRejected = status === "rejected";
  const statusFormatted = isRejected ? "Rejected" : "Accepted";

  try {
    const emailContentText = isRejected
      ? `
    Dear ${applicant.fullname},

    Thank you for applying for the ${jobTitle} position at ${companyName}. After careful consideration, we regret to inform you that your application status has been updated to ${statusFormatted}.

    We appreciate the time and effort you invested in the application process. Please do not be discouraged — we encourage you to apply for future openings that match your qualifications and experience.

    Wishing you the best in your job search.

    Best regards,
    The Hiring Team at ${companyName}`
      : `
    Dear ${applicant.fullname},

    Congratulations! We are pleased to inform you that your application for the ${jobTitle} position at ${companyName} has been ${statusFormatted}.

    Our team was impressed with your background and qualifications. We will be in touch with the next steps in the hiring process soon.

    Thank you for your interest and enthusiasm.

    Best regards,
    The Hiring Team at ${companyName}`;

    const emailContentHtml = isRejected
      ? `
    <p>Dear ${applicant.fullname},</p>
    <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. After careful consideration, we regret to inform you that your application status has been updated to "<strong>${statusFormatted}</strong>".</p>

    <p>We appreciate the time and effort you invested in the application process. Please do not be discouraged — we encourage you to apply for future openings that match your qualifications and experience.</p>

    <p>Wishing you the best in your job search.</p>

    <p>Best regards,<br>The Hiring Team at ${companyName}</p>`
      : `
    <p>Dear ${applicant.fullname},</p>
    <p>Congratulations! We are pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <strong>${statusFormatted}</strong>.</p>

    <p>Our team was impressed with your background and qualifications. We will be in touch with the next steps in the hiring process soon.</p>

    <p>Thank you for your interest and enthusiasm.</p>

    <p>Best regards,<br>The Hiring Team at ${companyName}</p>`;

    const emailBody = {
      from: "NextHire <notifications@raorajan.pro>",
      to: applicant.email,
      subject: `Application Status Update for ${jobTitle}`,
      text: emailContentText,
      html: emailContentHtml,
    };

    await sendMail(emailBody);
    console.log(`Application status update sent to: ${applicant.email}`);
  } catch (error) {
    console.error("Error sending application status update:", error);
  }
}

module.exports = {
  processJobAndNotifyUsers,
  notifyUsersToCompleteProfile,
  notifyApplicationReceived,
  notifyJobDeletion,
  notifyStatusUpdate,
};
