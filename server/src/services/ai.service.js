const { sendMail } = require("../utils/sendEmail");
const User = require("../models/user.model");
require("dotenv").config();
const cron = require("node-cron");
const { genAI, generateJson } = require("../utils/gemini");

// ─── Email Notifications ────────────────────────────────────────────────────

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

  if (!genAI) return content;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(content);
  return result.response.text();
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
      }
    }
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
      const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
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
    }
  } catch (error) {
    console.error(
      "Error in notifying users to complete their profiles:",
      error
    );
  }
}

cron.schedule("0 0 * * *", () => {
  notifyUsersToCompleteProfile();
});

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
  } catch (error) {
    console.error("Error sending application status update:", error);
  }
}

// ─── AI Feature Functions (Native JSON output, no regex cleanup) ─────────────

async function calculateCandidateMatchScore(job, user) {
  const fallback = {
    match_score: 65,
    reasons: [
      "Candidate shows basic proficiency in requested tech stack",
      "Experience level matches standard operational boundaries",
      "Proceed to standard recruiter assessment workflow",
    ],
    profile_summary:
      "A suitability analysis was performed, showing viable potential alignment with core requirements.",
  };

  try {
    const prompt = `You are an expert technical recruiter. Analyze the candidate's professional profile against the job description to calculate a suitability match score and provide detailed reasons.
    
    Job Details:
    - Title: ${job.title}
    - Description: ${job.description}
    - Requirements: ${job.requirements ? job.requirements.join(", ") : ""}
    - Experience Level: ${job.experienceLevel} years
    - Location: ${job.location}

    Candidate Profile:
    - Fullname: ${user.fullname}
    - Bio: ${user.profile?.bio || "Not provided"}
    - Skills: ${user.profile?.skills ? user.profile.skills.join(", ") : "None listed"}

    Return a JSON object with the keys:
    - match_score: Number (0-100 Suitability match score based on skills, requirements, and experience)
    - reasons: Array of 3 short, actionable strings (bullet points summarizing why they fit or what crucial skills they lack)
    - profile_summary: A brief 2-sentence summary paragraph of the candidate's professional profile relative to this role.`;

    const parsed = await generateJson(prompt, fallback);
    return {
      match_score: typeof parsed.match_score === "number" ? parsed.match_score : 50,
      reasons: Array.isArray(parsed.reasons)
        ? parsed.reasons
        : ["Matches core profile criteria", "No major skill discrepancies found", "Qualified for interview process"],
      profile_summary:
        parsed.profile_summary ||
        "Candidate matches key criteria for this role based on profile parameters.",
    };
  } catch (error) {
    console.error("AI Match Score generation failed:", error);
    return fallback;
  }
}

async function generateJobDescriptionAi(title, skills, experience) {
  const fallback = {
    description: `Outstanding opportunity for a ${title} seeking an impactful role. Join our premium, fast-scaling enterprise team to develop core software products, establish operational standards, and streamline system deliveries.`,
    requirements: skills || "Software Engineering, Development, Scalability",
  };

  try {
    const prompt = `You are an elite, inclusive, and professional technical recruitment assistant. Write an outstanding, highly detailed, and SEO-friendly job description for the following role:
    - Role Title: ${title}
    - Target Skills/Keywords: ${skills || "Standard industry stack"}
    - Experience Level Required: ${experience || "Not specified"} years

    The generated content must follow this exact format:
    1. A compelling 2-sentence introduction section about the role and target scope.
    2. A markdown bulleted list of 5 key Responsibilities.
    3. A markdown bulleted list of 5 key Requirements.
    
    Return a JSON object with the keys:
    - description: String (A beautifully crafted professional description paragraph, incorporating the responsibilities and requirements clearly)
    - requirements: String (A comma-separated list of extracted core technical skill tags, e.g., 'React, TypeScript, Redux')`;

    const parsed = await generateJson(prompt, fallback);
    return {
      description: parsed.description || fallback.description,
      requirements: parsed.requirements || fallback.requirements,
    };
  } catch (error) {
    console.error("AI description generation failed:", error);
    return fallback;
  }
}

async function generateInterviewQuestionsAi(job, user) {
  const fallback = [
    {
      question: `Based on your experience with ${
        job.requirements[0] || "relevant skills"
      }, can you describe a challenging engineering problem you solved recently?`,
      guidelines: `Look for candidate demonstrating deep technical knowledge, practical problem-solving flow, and active ownership.`,
    },
  ];

  try {
    const prompt = `You are a world-class technical interviewer, staff engineer, and recruitment lead. Compare the following Candidate's resume details and bio against the target Job Description:
    - Job Title: ${job.title}
    - Job Description: ${job.description}
    - Job Requirements: ${job.requirements.join(", ")}
    - Candidate Name: ${user.fullname}
    - Candidate Bio: ${user.profile?.bio || "Not specified"}
    - Candidate Skills: ${user.profile?.skills?.join(", ") || "Not specified"}

    Based on this comparison, generate exactly 5 targeted, highly relevant interview questions specifically designed to test this candidate's fit for this role.
    For each question, provide an 'Ideal Answer Checklist' or expectations the interviewer should look for.

    Return a JSON array of objects, where each object has EXACTLY these keys:
    - question: String (the targeted question)
    - guidelines: String (expectations/guidelines for the ideal answer)`;

    const parsed = await generateJson(prompt, fallback);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error("AI interview questions generation failed:", error);
    return fallback;
  }
}

async function generateEmailDraftAi(job, user, application, type, recruiterName) {
  const isInvite = type === "invite";
  const fallback = {
    subject: isInvite
      ? `Interview Invitation: ${job.title}`
      : `Application Update: ${job.title}`,
    body: isInvite
      ? `Hi ${user.fullname},\n\nThank you for applying for the ${job.title} position. We were impressed by your technical profile and would love to schedule an introductory interview with you.\n\nPlease let us know your availability over the next few days.\n\nBest regards,\nRecruitment Team`
      : `Hi ${user.fullname},\n\nThank you for applying for the ${job.title} position. After careful review of all applications, we regret to inform you that we will not be moving forward with your candidacy at this time.\n\nWe appreciate your interest in joining our team and wish you the best in your professional search.\n\nBest regards,\nRecruitment Team`,
  };

  try {
    const prompt = `You are an elite, highly empathetic, and professional technical recruiter. Draft a personalized email outreach to the candidate.
    - Candidate Name: ${user.fullname}
    - Role: ${job.title}
    - Company: Target Hiring Team
    - Recruiter Name: ${recruiterName || "[Your Name]"}
    - Match Suitability Score: ${application.aiScore || "N/A"}%
    - Outreach Type: ${isInvite ? "Interview Invitation" : "Polite Rejection"}

    Use the exact Recruiter Name provided in the email signature instead of placeholders.

    If Outreach Type is 'Interview Invitation': Draft a warm, highly enthusiastic, and professional interview invitation email.
    If Outreach Type is 'Polite Rejection': Draft a highly constructive, encouraging, and empathetic rejection email, thanking them for their application and encouraging them for future roles.

    Return a JSON object with the keys:
    - subject: String (email subject line)
    - body: String (email body text, formatted with linebreaks)`;

    const parsed = await generateJson(prompt, fallback);
    return {
      subject: parsed.subject || fallback.subject,
      body: parsed.body || fallback.body,
    };
  } catch (error) {
    console.error("AI email draft generation failed:", error);
    return fallback;
  }
}

module.exports = {
  processJobAndNotifyUsers,
  notifyUsersToCompleteProfile,
  notifyApplicationReceived,
  notifyJobDeletion,
  notifyStatusUpdate,
  calculateCandidateMatchScore,
  generateJobDescriptionAi,
  generateInterviewQuestionsAi,
  generateEmailDraftAi,
};
