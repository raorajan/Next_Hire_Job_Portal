const Application = require("../models/application.model");
const Job = require("../models/job.model");
const Company = require("../models/company.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const {
  notifyApplicationReceived,
  notifyStatusUpdate,
  calculateCandidateMatchScore,
  generateInterviewQuestionsAi,
  generateEmailDraftAi,
  evaluateMockInterviewAnswersAi,
  optimizeResumeForJobAi,
  generateCandidateInsightsAi,
  calculateRadarDataAi,
} = require("../services/ai.service");

const ErrorHandler = require("../utils/errorHandler");

const applyJob = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;
    const { templateId, coverLetter } = req.body || {};
    if (req.user.role !== "student") {
      const error = new ErrorHandler(
        "Only students are allowed to apply. Please update your account role to Student to proceed.",
        403
      );
      return error.sendError(res);
    }
    if (!jobId) {
      return new ErrorHandler("Job ID is required", 400).sendError(res);
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return new ErrorHandler(
        "You have already applied for this job",
        400
      ).sendError(res);
    }

    const job = await Job.findById(jobId).populate("company", "companyName");
    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }
    let templateData = {};
    if (templateId) {
      const user = req.user;
      if (Array.isArray(user.quickTemplates)) {
        const template = user.quickTemplates.id(templateId);
        if (template) {
          templateData.coverLetter = template.coverLetter;
          templateData.resumeId = template.resumeId;
        }
      }
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      coverLetter: templateData.coverLetter || coverLetter || "",
      resumeId: templateData.resumeId || undefined,
      statusHistory: [
        {
          status: "pending",
          note: "Application submitted",
          changedBy: userId,
        },
      ],
    });

    job.applications.push(newApplication._id);
    await job.save();
    
    // Optimize: Don't await - let notification run in background
    notifyApplicationReceived(req.user, job, job.company.companyName).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Error sending application notification:", err.message);
      }
    });
    
    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      status: 200,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Apply job error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getAppliedJobs = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        select: "title description salary location jobType experienceLevel company createdAt", // Only needed fields
        populate: {
          path: "company",
          select: "companyName location logo", // Only needed fields
        },
      })
      .select("-__v") // Exclude version key
      .lean() // Use lean() for better performance
      .limit(100); // Limit results

    if (!applications.length) {
      return new ErrorHandler("No applications found", 404).sendError(res);
    }

    return res.status(200).json({
      applications,
      success: true,
      status: 200,
    });
  } catch (error) {
    // Error is already handled by asyncErrorHandler, but log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Get applied jobs error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getApplicants = asyncErrorHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "applicant",
          select: "fullname email profile.profilePhoto profile.resume", // Only needed fields
        },
      })
      .select("-__v") // Exclude version key
      .lean(); // Use lean() for better performance

    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }

    return res.status(200).json({
      applicants: job.applications,
      success: true,
      status: 200,
    });
  } catch (error) {
    // Error is already handled by asyncErrorHandler, but log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Get applicants error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const updateStatus = asyncErrorHandler(async (req, res) => {
  try {
    const { status, note } = req.body;
    const applicationId = req.params.applicationId;
    if (!status) {
      return new ErrorHandler("Status is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate({
        path: "applicant",
        select: "fullname email profile.profilePhoto", // Only needed fields
      });
    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    const previousStatus = application.status;
    const nextStatus = status.toLowerCase();
    
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(nextStatus)) {
      return new ErrorHandler("Invalid status value", 400).sendError(res);
    }

    if (previousStatus === nextStatus) {
      return new ErrorHandler("Application is already in this status", 400).sendError(res);
    }

    application.status = nextStatus;
    application.statusHistory.push({
      status: nextStatus,
      note,
      changedBy: req.user.id,
      changedAt: new Date(),
    });
    await application.save();

    // Optimize: Fetch job first, then company
    const job = await Job.findById(application.job).select("title company").lean();
    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }

    const company = await Company.findById(job.company).select("companyName").lean();
    if (!company) {
      return new ErrorHandler("Company not found", 404).sendError(res);
    }

    const applicant = application.applicant;

    // Optimize: Don't await - let notification run in background
    notifyStatusUpdate(
      applicant,
      job.title,
      application.status,
      company.companyName
    ).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Error sending status update notification:", err.message);
      }
    });

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      status: 200,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update status error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getApplicationTimeline = asyncErrorHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (!applicationId) {
    return new ErrorHandler("Application ID is required", 400).sendError(res);
  }

  const application = await Application.findById(applicationId)
    .select("job applicant status statusHistory createdAt updatedAt")
    .populate({
      path: "job",
      select: "title company",
      populate: {
        path: "company",
        select: "companyName",
      },
    })
    .populate({
      path: "statusHistory.changedBy",
      select: "fullname role",
    });

  if (!application) {
    return new ErrorHandler("Application not found", 404).sendError(res);
  }

  // Only applicant or recruiter who owns the company’s jobs should see timeline
  const userId = req.user.id.toString();
  const isApplicant = application.applicant.toString() === userId;

  if (!isApplicant && req.user.role !== "recruiter") {
    return new ErrorHandler("Not authorized to view this timeline", 403).sendError(res);
  }

  return res.status(200).json({
    success: true,
    status: 200,
    application: {
      id: application._id,
      jobTitle: application.job?.title,
      companyName: application.job?.company?.companyName,
      currentStatus: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    },
    timeline: application.statusHistory,
  });
});

const getApplicationAiScore = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return new ErrorHandler("Application ID is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    // Check if score is already cached
    if (application.aiScore !== undefined && application.aiScore !== null) {
      return res.status(200).json({
        success: true,
        status: 200,
        aiScore: application.aiScore,
        aiReason: application.aiReason,
        aiSummarizedProfile: application.aiSummarizedProfile,
      });
    }

    // Otherwise calculate match score
    const aiResult = await calculateCandidateMatchScore(application.job, application.applicant);

    // Save to database
    application.aiScore = aiResult.match_score;
    application.aiReason = aiResult.reasons;
    application.aiSummarizedProfile = aiResult.profile_summary;
    await application.save();

    return res.status(200).json({
      success: true,
      status: 200,
      aiScore: application.aiScore,
      aiReason: application.aiReason,
      aiSummarizedProfile: application.aiSummarizedProfile,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("AI Match score calculation error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getApplicationInterviewQuestions = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return new ErrorHandler("Application ID is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    // Check if questions are already cached
    if (application.interviewQuestions && application.interviewQuestions.length > 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        interviewQuestions: application.interviewQuestions,
      });
    }

    // Generate interview questions
    const questions = await generateInterviewQuestionsAi(application.job, application.applicant);

    // Save to database
    application.interviewQuestions = questions;
    await application.save();

    return res.status(200).json({
      success: true,
      status: 200,
      interviewQuestions: application.interviewQuestions,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("AI Interview Questions error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const { sendMail } = require("../utils/sendEmail.js");

const getApplicationEmailDraft = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { type } = req.body;
    
    if (!applicationId) {
      return new ErrorHandler("Application ID is required", 400).sendError(res);
    }
    if (!type || !["invite", "rejection"].includes(type)) {
      return new ErrorHandler("Valid draft type ('invite' or 'rejection') is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    const draft = await generateEmailDraftAi(application.job, application.applicant, application, type, req.user.fullname);

    return res.status(200).json({
      success: true,
      status: 200,
      draft,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("AI Email Draft generation error:", error.message);
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const sendApplicationEmail = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { subject, body } = req.body;

    if (!applicationId || !subject || !body) {
      return new ErrorHandler("Application ID, Subject, and Body are required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    // Convert plain text body to HTML by replacing newlines with <br/>
    const htmlBody = `<div style="font-family: Arial, sans-serif; white-space: pre-wrap;">${body}</div>`;

    const emailBody = {
      from: `NextHire <notifications@raorajan.pro>`,
      to: application.applicant.email,
      subject: subject,
      text: body,
      html: htmlBody,
    };

    await sendMail(emailBody);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Email sent successfully to the candidate.",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Send application email error:", error.message);
    }
    return res.status(500).json({
      message: "Failed to send email. Internal server error",
      success: false,
      status: 500,
    });
  }
});

const evaluateMockInterview = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { answers } = req.body; // Array of { question, userAnswer }

    if (!applicationId || !Array.isArray(answers) || answers.length === 0) {
      return new ErrorHandler("Application ID and answers are required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    // Call AI service to evaluate answers
    const evaluation = await evaluateMockInterviewAnswersAi(
      application.job,
      application.applicant,
      answers
    );

    // Save mock interview result in database
    application.mockInterviewResult = {
      overallScore: evaluation.overallScore,
      keyStrengths: evaluation.keyStrengths,
      areasOfImprovement: evaluation.areasOfImprovement,
      verdict: evaluation.verdict,
      answers: evaluation.answers,
      completedAt: new Date(),
    };

    await application.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Mock interview evaluated successfully",
      mockInterviewResult: application.mockInterviewResult,
    });
  } catch (error) {
    console.error("Evaluate mock interview error:", error);
    return res.status(500).json({
      message: "Failed to evaluate mock interview. Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getMockInterviewResult = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    if (!applicationId) {
      return new ErrorHandler("Application ID is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId).select("mockInterviewResult");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      mockInterviewResult: application.mockInterviewResult,
    });
  } catch (error) {
    console.error("Get mock interview result error:", error);
    return res.status(500).json({
      message: "Failed to retrieve mock interview result. Internal server error",
      success: false,
      status: 500,
    });
  }
});

const optimizeResumeForJob = asyncErrorHandler(async (req, res) => {
  try {
    const { jobId } = req.params;
    const { customResumeText } = req.body;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }

    const user = req.user;

    const result = await optimizeResumeForJobAi(job, user, customResumeText || null);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Resume optimized successfully",
      optimization: result,
    });
  } catch (error) {
    console.error("Optimize resume error:", error);
    return res.status(500).json({
      message: "Failed to optimize resume. Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getCandidateInsights = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return new ErrorHandler("Application ID is required", 400).sendError(res);
    }
    const application = await Application.findById(applicationId);
    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }
    const insights = await generateCandidateInsightsAi(applicationId, application.job);
    return res.status(200).json({
      success: true,
      status: 200,
      insights,
    });
  } catch (error) {
    console.error("Get insights error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getCandidateRadar = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return new ErrorHandler("Application ID is required", 400).sendError(res);
    }
    const application = await Application.findById(applicationId);
    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }
    const radar = await calculateRadarDataAi(applicationId, application.job);
    return res.status(200).json({
      success: true,
      status: 200,
      radar,
    });
  } catch (error) {
    console.error("Get radar error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const crypto = require("crypto");

const scheduleInterview = asyncErrorHandler(async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { date, time } = req.body;

    if (!applicationId || !date || !time) {
      return new ErrorHandler("Application ID, date, and time are required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    // Check if already scheduled
    if (application.interviewSchedule && application.interviewSchedule.meetLink) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Interview was already scheduled.",
        schedule: application.interviewSchedule,
      });
    }

    // Generate a unique Jitsi Meet link (completely free, no API key needed)
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const meetLink = `https://meet.jit.si/NextHire-${uniqueId}`;

    // Save schedule to application
    application.interviewSchedule = {
      date,
      time,
      meetLink,
      scheduledAt: new Date(),
    };
    await application.save();

    // Find the recruiter (job creator)
    const User = require("../models/user.model");
    const job = application.job;
    const recruiter = await User.findById(job.created_by);

    const candidateName = application.applicant.fullname;
    const candidateEmail = application.applicant.email;
    const recruiterEmail = recruiter ? recruiter.email : null;
    const jobTitle = job.title;

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    // Build HTML email
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #E6EDF3; border-radius: 16px; overflow: hidden; border: 1px solid #1e2433;">
        <div style="background: linear-gradient(135deg, #00C8FF22, #8040FF22); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: #00C8FF;">🎯 Interview Scheduled!</h1>
          <p style="color: #8B949E; margin-top: 8px;">Your interview for <strong style="color: #fff;">${jobTitle}</strong> has been confirmed.</p>
        </div>
        <div style="padding: 32px;">
          <div style="background: #161B22; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #30363D;">
            <p style="margin: 0 0 12px; color: #8B949E; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">📅 Date</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #fff;">${formattedDate}</p>
          </div>
          <div style="background: #161B22; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #30363D;">
            <p style="margin: 0 0 12px; color: #8B949E; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">🕐 Time</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #fff;">${time}</p>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #00C8FF, #8040FF); color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">
              🚀 Join Meeting
            </a>
          </div>
          <p style="color: #8B949E; font-size: 13px; text-align: center;">Meeting Link: <a href="${meetLink}" style="color: #00C8FF;">${meetLink}</a></p>
        </div>
        <div style="padding: 20px 32px; background: #161B22; text-align: center; border-top: 1px solid #30363D;">
          <p style="color: #8B949E; font-size: 12px; margin: 0;">Powered by NextHire — AI-Driven Hiring Platform</p>
        </div>
      </div>
    `;

    // Send to candidate
    await sendMail({
      from: `NextHire <notifications@raorajan.pro>`,
      to: candidateEmail,
      subject: `✅ Interview Confirmed: ${jobTitle} — ${formattedDate} at ${time}`,
      text: `Your interview for ${jobTitle} is scheduled on ${formattedDate} at ${time}. Join here: ${meetLink}`,
      html: emailHtml,
    });

    // Send to recruiter
    if (recruiterEmail) {
      const recruiterHtml = emailHtml.replace("Your interview for", `${candidateName}'s interview for`);
      await sendMail({
        from: `NextHire <notifications@raorajan.pro>`,
        to: recruiterEmail,
        subject: `✅ Interview Scheduled: ${candidateName} for ${jobTitle} — ${formattedDate} at ${time}`,
        text: `${candidateName}'s interview for ${jobTitle} is scheduled on ${formattedDate} at ${time}. Join here: ${meetLink}`,
        html: recruiterHtml,
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Interview scheduled successfully! Confirmation emails sent.",
      schedule: {
        date,
        time,
        meetLink,
      },
    });
  } catch (error) {
    console.error("Schedule interview error:", error);
    return res.status(500).json({
      message: "Failed to schedule interview. Internal server error.",
      success: false,
      status: 500,
    });
  }
});

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
  getApplicationTimeline,
  getApplicationAiScore,
  getApplicationInterviewQuestions,
  getApplicationEmailDraft,
  sendApplicationEmail,
  evaluateMockInterview,
  getMockInterviewResult,
  optimizeResumeForJob,
  getCandidateInsights,
  getCandidateRadar,
  scheduleInterview,
};
