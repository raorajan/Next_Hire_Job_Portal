const User = require("../models/user.model");
const { sendMail } = require("../utils/sendEmail");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const sendToken = require("./../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const Job = require("../models/job.model");
const PrepResource = require("../models/prepResource.model");
const Company = require("../models/company.model");
const Application = require("../models/application.model");
const cron = require("node-cron");
const crypto = require("crypto");
const fs = require("fs");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const JOB_ALERT_FREQUENCIES = ["daily", "weekly"];
const MAX_ALERT_FILTERS = 5;
const DEFAULT_ALERT_LIMIT = 5;
const MAX_ALERT_RESULTS = 20;
const MAX_SAVED_SEARCHES = 20;
const SAVED_SEARCH_DEFAULT_LIMIT = 10;
const SAVED_SEARCH_MAX_LIMIT = 50;
const SAVED_SEARCH_KEYWORD_LIMIT = 10;
const COMPANY_BADGE_RULES = [
  {
    name: "Fast Hiring",
    description: "Responds to applicants in under a week on average",
    test: (stats) =>
      stats.decisionsCount >= 3 &&
      stats.averageResponseDays !== null &&
      stats.averageResponseDays <= 7,
  },
  {
    name: "Responsive Recruiter",
    description: "Typically replies to applications within 3 days",
    test: (stats) =>
      stats.decisionsCount >= 5 &&
      stats.averageResponseDays !== null &&
      stats.averageResponseDays <= 3,
  },
  {
    name: "Active Employer",
    description: "Hired 5+ candidates in the last 90 days",
    test: (stats) => stats.hiresLast90Days >= 5,
  },
  {
    name: "High Demand",
    description: "Receives 20+ applications across roles",
    test: (stats) => stats.applicationsCount >= 20,
  },
];

const sanitizeNumber = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PROFILE_COMPLETION_CRITERIA = [
  {
    key: "bio",
    label: "Add a short bio (at least 20 characters)",
    isComplete: (user) => Boolean(user.profile?.bio && user.profile.bio.trim().length >= 20),
  },
  {
    key: "skills",
    label: "Add at least 3 skills",
    isComplete: (user) => Array.isArray(user.profile?.skills) && user.profile.skills.length >= 3,
  },
  {
    key: "resume",
    label: "Upload your resume",
    isComplete: (user) => Boolean(user.profile?.resume?.url),
  },
  {
    key: "avatar",
    label: "Upload a profile photo",
    isComplete: (user) => Boolean(user.profile?.profilePhoto?.url),
  },
  {
    key: "company",
    label: "Associate a company (for recruiters)",
    isComplete: (user) =>
      user.role !== "recruiter" || Boolean(user.profile?.company),
  },
];

const normalizeFilterPayload = (
  filter = {},
  fallbackName,
  {
    defaultLimit = DEFAULT_ALERT_LIMIT,
    minLimit = 1,
    maxLimit = DEFAULT_ALERT_LIMIT,
    maxKeywords = 5,
  } = {}
) => {
  const keywordsSource = Array.isArray(filter.keywords)
    ? filter.keywords
    : filter.keyword
    ? [filter.keyword]
    : [];

  const keywords = keywordsSource
    .map((keyword) => String(keyword || "").trim())
    .filter(Boolean)
    .slice(0, maxKeywords);

  const companyIds = Array.isArray(filter.companyIds)
    ? filter.companyIds
        .map((id) => {
          if (!id) return null;
          if (id instanceof mongoose.Types.ObjectId) return id;
          return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
        })
        .filter(Boolean)
    : [];

  const limitValue = sanitizeNumber(filter.limit);
  const limit = Math.min(
    Math.max(limitValue ?? defaultLimit, minLimit),
    maxLimit
  );

  return {
    name: String(filter.name || fallbackName || "Saved Search").trim(),
    keywords,
    location: filter.location ? String(filter.location).trim() : "",
    jobType: filter.jobType ? String(filter.jobType).trim() : "",
    minSalary: sanitizeNumber(filter.minSalary),
    maxSalary: sanitizeNumber(filter.maxSalary),
    experienceLevel: sanitizeNumber(filter.experienceLevel),
    companyIds,
    limit,
  };
};

const normalizeJobAlertFilters = (filters = []) => {
  if (!Array.isArray(filters)) return [];

  return filters
    .filter((filter) => filter && typeof filter === "object")
    .slice(0, MAX_ALERT_FILTERS)
    .map((filter, index) =>
      normalizeFilterPayload(filter, `Alert ${index + 1}`, {
        defaultLimit: DEFAULT_ALERT_LIMIT,
        maxLimit: MAX_ALERT_RESULTS,
        maxKeywords: 5,
      })
    );
};

const normalizeSavedSearchPayload = (payload = {}, index = 0) => {
  const normalized = normalizeFilterPayload(
    payload,
    payload.name || `Saved Search ${index + 1}`,
    {
      defaultLimit: SAVED_SEARCH_DEFAULT_LIMIT,
      maxLimit: SAVED_SEARCH_MAX_LIMIT,
      maxKeywords: SAVED_SEARCH_KEYWORD_LIMIT,
    }
  );

  return {
    ...normalized,
    alertEnabled: Boolean(payload.alertEnabled),
  };
};

const convertSavedSearchToFilter = (search, index = 0) =>
  normalizeFilterPayload(search, search?.name || `Alert ${index + 1}`, {
    defaultLimit: DEFAULT_ALERT_LIMIT,
    maxLimit: MAX_ALERT_RESULTS,
    maxKeywords: 5,
  });

const getAlertFiltersForUser = (user) => {
  const savedSearchFilters = (user.savedSearches || [])
    .filter((search) => search && search.alertEnabled)
    .map((search, index) => convertSavedSearchToFilter(search, index))
    .filter(Boolean);

  if (savedSearchFilters.length) {
    return savedSearchFilters;
  }

  return normalizeJobAlertFilters(user.jobAlerts?.savedFilters || []);
};

const buildJobAlertQuery = (filter, lastSentAt) => {
  const andConditions = [];

  if (filter.keywords && filter.keywords.length) {
    const escaped = filter.keywords.map((keyword) =>
      keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const pattern = escaped.join("|");
    const keywordRegex = new RegExp(pattern, "i");

    andConditions.push({
      $or: [
        { title: keywordRegex },
        { description: keywordRegex },
        { location: keywordRegex },
        { requirements: { $elemMatch: { $regex: keywordRegex } } },
      ],
    });
  }

  if (filter.location) {
    andConditions.push({ location: { $regex: filter.location, $options: "i" } });
  }

  if (filter.jobType) {
    andConditions.push({ jobType: { $regex: `^${filter.jobType}$`, $options: "i" } });
  }

  if (filter.companyIds && filter.companyIds.length) {
    andConditions.push({ company: { $in: filter.companyIds } });
  }

  if (typeof filter.experienceLevel === "number") {
    andConditions.push({ experienceLevel: filter.experienceLevel });
  }

  if (
    typeof filter.minSalary === "number" ||
    typeof filter.maxSalary === "number"
  ) {
    const salaryQuery = {};
    if (typeof filter.minSalary === "number") {
      salaryQuery.$gte = filter.minSalary;
    }
    if (typeof filter.maxSalary === "number") {
      salaryQuery.$lte = filter.maxSalary;
    }
    andConditions.push({ salary: salaryQuery });
  }

  if (lastSentAt) {
    andConditions.push({ createdAt: { $gt: lastSentAt } });
  }

  if (!andConditions.length) {
    return {}; // fallback to latest jobs
  }

  return { $and: andConditions };
};

const shouldSendJobAlert = (user) => {
  const jobAlerts = user.jobAlerts || {};
  if (!jobAlerts.enabled) return false;

  const filters = getAlertFiltersForUser(user);
  if (!filters.length) return false;

  const now = Date.now();
  if (!jobAlerts.lastSentAt) return true;

  const diff = now - new Date(jobAlerts.lastSentAt).getTime();

  if (jobAlerts.frequency === "weekly") {
    return diff >= 7 * 24 * 60 * 60 * 1000;
  }

  return diff >= 24 * 60 * 60 * 1000;
};

const collectAlertJobsForUser = async (user) => {
  const lastSentAt = user.jobAlerts?.lastSentAt;
  const filters = getAlertFiltersForUser(user);
  if (!filters.length) return [];
  const jobsMap = new Map();

  for (const filter of filters) {
    const query = buildJobAlertQuery(filter, lastSentAt);
    const limit = filter.limit || DEFAULT_ALERT_LIMIT;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "company",
        select: "companyName location logo",
      })
      .lean();

    jobs.forEach((job) => {
      const id = job._id.toString();
      if (!jobsMap.has(id)) {
        jobsMap.set(id, { ...job, matchedFilters: [filter.name] });
      } else {
        jobsMap.get(id).matchedFilters.push(filter.name);
      }
    });
  }

  return Array.from(jobsMap.values()).slice(0, MAX_ALERT_RESULTS);
};

const buildJobAlertEmail = (user, jobs) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL 

  const jobItemsHtml = jobs
    .map((job) => {
      const companyName = job.company?.companyName || "Company";
      const jobUrl = `${frontendUrl}/description/${job._id}`;
      const matchedFilters = job.matchedFilters?.join(", ");

      return `
        <li style="margin-bottom:12px;">
          <strong>${job.title}</strong> at ${companyName} – ${job.location || "Remote"}<br/>
          <a href="${jobUrl}" target="_blank" rel="noopener noreferrer">View job</a>
          ${matchedFilters ? `<div style="color:#6b7280;font-size:12px;">Matched: ${matchedFilters}</div>` : ""}
        </li>
      `;
    })
    .join("");

  const jobItemsText = jobs
    .map((job, index) => {
      const companyName = job.company?.companyName || "Company";
      const jobUrl = `${frontendUrl}/description/${job._id}`;
      const matchedFilters = job.matchedFilters?.join(", ");
      return `${index + 1}. ${job.title} at ${companyName} (${job.location || "Remote"})\n   ${jobUrl}${
        matchedFilters ? `\n   Matched filters: ${matchedFilters}` : ""
      }`;
    })
    .join("\n\n");

  const firstName = user.fullname?.split(" ")[0] || user.fullname || "there";

  const subject = "Your latest job alerts from NextHire";
  const text = `Hi ${firstName},

Here are the latest opportunities that match your saved alerts:

${jobItemsText}

You can adjust your alert preferences from your profile settings.

Best,
Team NextHire`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;">
      <p>Hi ${firstName},</p>
      <p>Here are the latest opportunities that match your saved alerts:</p>
      <ul style="padding-left:18px;">${jobItemsHtml}</ul>
      <p style="font-size:13px;color:#6b7280;">You can adjust your alert preferences from your profile settings.</p>
      <p>Best,<br/>Team NextHire</p>
    </div>
  `;

  return { subject, text, html };
};

const sendJobAlertsForUser = async (user) => {
  if (!shouldSendJobAlert(user)) return false;
  if (!process.env.RESEND_EMAIL_API_KEY) return false;

  const jobs = await collectAlertJobsForUser(user);
  if (!jobs.length) return false;

  const emailContent = buildJobAlertEmail(user, jobs);

  await sendMail({
    from: "NextHire Alerts <alerts@raorajan.pro>",
    to: user.email,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  user.jobAlerts.lastSentAt = new Date();
  await user.save({ validateBeforeSave: false });
  return true;
};

const sendJobAlertDigests = async () => {
  if (!process.env.RESEND_EMAIL_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.warn("RESEND_EMAIL_API_KEY is not configured. Skipping job alert digests.");
    }
    return;
  }

  const users = await User.find({
    "jobAlerts.enabled": true,
    $or: [
      { "jobAlerts.savedFilters.0": { $exists: true } },
      { savedSearches: { $elemMatch: { alertEnabled: true } } },
    ],
  }).select("fullname email jobAlerts savedSearches");

  for (const user of users) {
    try {
      await sendJobAlertsForUser(user);
    } catch (error) {
      console.error(`Failed to send job alert to ${user.email}:`, error.message);
    }
  }
};

const readDocumentContent = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || !req.files.document) {
    const error = new ErrorHandler("Please upload a document file.", 400);
    return error.sendError(res);
  }

  const documentFilePath = req.files.document.tempFilePath;
  const documentData = fs.readFileSync(documentFilePath);

  const prompt = `Extract key information from the following document. Identify and return the relevant sections and headings based on the content. Format the response in JSON.`;

  const image = {
    inlineData: {
      data: Buffer.from(documentData).toString("base64"),
      mimeType: req.files.document.mimetype,
    },
  };

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([prompt, image]);

  const responseText = result.response ? result.response.text() : "";

  const cleanedText = responseText.replace(/`/g, "");
  const cleanedTextWithoutLeadingComments = cleanedText.replace(/^.*?\{/s, "{");

  try {
    const formattedContent = JSON.parse(cleanedTextWithoutLeadingComments);

    return res.status(200).json({
      success: true,
      status: 200,
      extractedContent: formattedContent,
    });
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to parse extracted content.",
      error: error.message,
    });
  }
});

const registerUser = asyncErrorHandler(async (req, res, next) => {
  // Debug: Log received data
  console.log("Registration request body:", req.body);
  console.log("Registration request files:", req.files);
  
  const { fullname, email, password, role } = req.body;
  
  // Check if fields are missing
  if (!fullname || !email || !password || !role) {
    console.error("Missing fields - fullname:", fullname, "email:", email, "password:", password ? "***" : "missing", "role:", role);
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new ErrorHandler("User with this email already exists", 400);
    return error.sendError(res);
  }
  let profilePhoto;
  try {
    if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
      const uploaded = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        {
          folder: "avatar",
          width: 150,
          crop: "scale",
        }
      );
      profilePhoto = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }
  } catch (avatarError) {
    console.error("Error uploading avatar (continuing without avatar):", avatarError);
    // Continue registration even if avatar upload fails
  }

  const user = await User.create({
    fullname,
    email,
    password,
    role,
    profile: profilePhoto ? { profilePhoto } : {},
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL ;
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

  const emailBody = {
    from: "NextHire <verify@raorajan.pro>",
    to: email,
    subject: "Welcome to NextHire - Verify Your Email",
    text: `Hello ${fullname},\n\nWelcome to NextHire! Please verify your email by clicking on the following link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568;">Welcome to NextHire!</h2>
        <p>Hello <strong>${fullname}</strong>,</p>
        <p>Thank you for registering with NextHire. To complete your registration, please verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify My Email</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
        <p style="color: #718096; font-size: 14px; margin-top: 30px;">If you didn't request this email, please ignore it.</p>
      </div>
    `,
  };

  // Send email asynchronously (non-blocking) to avoid delays
  sendMail(emailBody)
    .then(() => {
      console.log("✅ Registration verification email sent successfully to:", email);
    })
    .catch((error) => {
      console.error("❌ Failed to send registration verification email:", error.message);
      // Log error but don't block registration
    });

  // Send response immediately with success message
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    status: 200,
    message: "Registration successful! Please check your email to verify your account.",
    user,
    token,
  });
});

const getJobAlerts = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("jobAlerts");

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  res.status(200).json({
    success: true,
    status: 200,
    jobAlerts:
      user.jobAlerts || {
        enabled: false,
        frequency: "daily",
        savedFilters: [],
      },
  });
});

const updateJobAlerts = asyncErrorHandler(async (req, res, next) => {
  const { enabled, frequency, filters } = req.body || {};
  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  if (!user.jobAlerts) {
    user.jobAlerts = {
      enabled: false,
      frequency: "daily",
      savedFilters: [],
    };
  }

  if (typeof enabled !== "undefined") {
    user.jobAlerts.enabled = Boolean(enabled);
  }

  if (frequency) {
    if (!JOB_ALERT_FREQUENCIES.includes(frequency)) {
      const error = new ErrorHandler(
        "Invalid frequency. Allowed values are daily or weekly.",
        400
      );
      return error.sendError(res);
    }
    user.jobAlerts.frequency = frequency;
  }

  if (Array.isArray(filters)) {
    const normalizedFilters = normalizeJobAlertFilters(filters);
    user.jobAlerts.savedFilters = normalizedFilters;
  }

  if (!user.jobAlerts.savedFilters?.length) {
    user.jobAlerts.lastSentAt = undefined;
  }

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Job alert preferences updated successfully.",
    jobAlerts: user.jobAlerts,
  });
});

const getSavedSearches = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("savedSearches");

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  res.status(200).json({
    success: true,
    status: 200,
    savedSearches: user.savedSearches || [],
  });
});

const saveSavedSearch = asyncErrorHandler(async (req, res, next) => {
  const {
    searchId,
    name,
    keywords,
    location,
    jobType,
    minSalary,
    maxSalary,
    experienceLevel,
    companyIds,
    limit,
    alertEnabled,
  } = req.body || {};

  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  if (!Array.isArray(user.savedSearches)) {
    user.savedSearches = [];
  }

  if (!searchId && user.savedSearches.length >= MAX_SAVED_SEARCHES) {
    const error = new ErrorHandler(
      `You can only save up to ${MAX_SAVED_SEARCHES} searches.`,
      400
    );
    return error.sendError(res);
  }

  const normalizedSearch = normalizeSavedSearchPayload(
    {
      name,
      keywords,
      location,
      jobType,
      minSalary,
      maxSalary,
      experienceLevel,
      companyIds,
      limit,
      alertEnabled,
    },
    user.savedSearches.length
  );

  let message = "Saved search created successfully.";

  if (searchId) {
    const existingSearch = user.savedSearches.id(searchId);
    if (!existingSearch) {
      const error = new ErrorHandler("Saved search not found", 404);
      return error.sendError(res);
    }
    Object.assign(existingSearch, normalizedSearch, { updatedAt: new Date() });
    message = "Saved search updated successfully.";
  } else {
    user.savedSearches.push({
      ...normalizedSearch,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message,
    savedSearches: user.savedSearches,
  });
});

const deleteSavedSearch = asyncErrorHandler(async (req, res, next) => {
  const { searchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(searchId)) {
    const error = new ErrorHandler("Invalid saved search id", 400);
    return error.sendError(res);
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  if (!Array.isArray(user.savedSearches)) {
    user.savedSearches = [];
  }

  const savedSearch = user.savedSearches.id(searchId);
  if (!savedSearch) {
    const error = new ErrorHandler("Saved search not found", 404);
    return error.sendError(res);
  }

  savedSearch.remove();
  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Saved search removed successfully.",
    savedSearches: user.savedSearches,
  });
});

const getQuickTemplates = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("quickTemplates");

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  res.status(200).json({
    success: true,
    status: 200,
    templates: user.quickTemplates || [],
  });
});

const createQuickTemplate = asyncErrorHandler(async (req, res, next) => {
  const { title, coverLetter, resumeId } = req.body || {};

  if (!title) {
    const error = new ErrorHandler("Template title is required", 400);
    return error.sendError(res);
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  if (!Array.isArray(user.quickTemplates)) {
    user.quickTemplates = [];
  }

  const template = {
    title: String(title).trim(),
    coverLetter: coverLetter ? String(coverLetter) : "",
    resumeId: resumeId ? String(resumeId) : "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  user.quickTemplates.push(template);
  await user.save();

  res.status(201).json({
    success: true,
    status: 201,
    message: "Quick apply template created successfully.",
    templates: user.quickTemplates,
  });
});

const updateQuickTemplate = asyncErrorHandler(async (req, res, next) => {
  const { templateId } = req.params;
  const { title, coverLetter, resumeId } = req.body || {};

  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  if (!Array.isArray(user.quickTemplates)) {
    user.quickTemplates = [];
  }

  const template = user.quickTemplates.id(templateId);

  if (!template) {
    const error = new ErrorHandler("Template not found", 404);
    return error.sendError(res);
  }

  if (typeof title !== "undefined") {
    template.title = String(title).trim();
  }
  if (typeof coverLetter !== "undefined") {
    template.coverLetter = coverLetter ? String(coverLetter) : "";
  }
  if (typeof resumeId !== "undefined") {
    template.resumeId = resumeId ? String(resumeId) : "";
  }
  template.updatedAt = new Date();

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Quick apply template updated successfully.",
    templates: user.quickTemplates,
  });
});

const deleteQuickTemplate = asyncErrorHandler(async (req, res, next) => {
  const { templateId } = req.params;

  const user = await User.findById(req.user.id);

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  if (!Array.isArray(user.quickTemplates)) {
    user.quickTemplates = [];
  }

  const template = user.quickTemplates.id(templateId);

  if (!template) {
    const error = new ErrorHandler("Template not found", 404);
    return error.sendError(res);
  }

  template.remove();
  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Quick apply template deleted successfully.",
    templates: user.quickTemplates,
  });
});

const computeProfileCompletion = (user) => {
  const totalCriteria = PROFILE_COMPLETION_CRITERIA.length;

  const status = PROFILE_COMPLETION_CRITERIA.map((criterion) => {
    const completed = Boolean(criterion.isComplete(user));
    return {
      key: criterion.key,
      label: criterion.label,
      completed,
    };
  });

  const completedCount = status.filter((item) => item.completed).length;
  const score = Math.round((completedCount / totalCriteria) * 100);
  const pendingTasks = status.filter((item) => !item.completed).map((item) => item.label);

  return {
    score,
    completedTasks: completedCount,
    totalTasks: totalCriteria,
    pendingTasks,
    status,
  };
};

const getSkillGapInsights = asyncErrorHandler(async (req, res, next) => {
  const { jobId } = req.query;

  if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
    const error = new ErrorHandler("A valid jobId query parameter is required.", 400);
    return error.sendError(res);
  }

  const user = await User.findById(req.user.id).select("profile.skills fullname");

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  const job = await Job.findById(jobId)
    .select("title requirements company location")
    .populate({
      path: "company",
      select: "companyName location",
    })
    .lean();

  if (!job) {
    const error = new ErrorHandler("Job not found", 404);
    return error.sendError(res);
  }

  const userSkillsOriginal = Array.isArray(user.profile?.skills)
    ? user.profile.skills.filter(Boolean)
    : [];

  const normalizedUserSkills = userSkillsOriginal.map((skill) =>
    skill.trim().toLowerCase()
  );

  const jobRequirements = Array.isArray(job.requirements)
    ? job.requirements.map((req) => req && req.trim()).filter(Boolean)
    : [];

  const matchedSkills = [];
  const missingSkillsSet = new Set();

  jobRequirements.forEach((requirement) => {
    const normalizedRequirement = requirement.toLowerCase();
    const isMatched = normalizedUserSkills.some((skill) => {
      if (!skill) return false;
      return (
        normalizedRequirement === skill ||
        normalizedRequirement.includes(skill) ||
        skill.includes(normalizedRequirement)
      );
    });

    if (isMatched) {
      matchedSkills.push(requirement);
    } else {
      missingSkillsSet.add(requirement);
    }
  });

  const missingSkills = Array.from(missingSkillsSet);

  let recommendedResources = [];
  if (missingSkills.length) {
    const resourceConditions = missingSkills.flatMap((skill) => {
      const regex = new RegExp(escapeRegExp(skill), "i");
      return [
        { tags: { $elemMatch: { $regex: regex } } },
        { title: { $regex: regex } },
        { content: { $regex: regex } },
      ];
    });

    recommendedResources = await PrepResource.find({
      $or: resourceConditions,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
  }

  return res.status(200).json({
    success: true,
    status: 200,
    job: {
      id: job._id,
      title: job.title,
      company: job.company?.companyName || null,
      location: job.company?.location || job.location || null,
    },
    userSkills: userSkillsOriginal,
    matchedSkills,
    missingSkills,
    recommendedResources,
  });
});

const getProfileCompletion = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "fullname role profile.bio profile.skills profile.resume profile.profilePhoto profile.company quickTemplates"
  );

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  const completion = computeProfileCompletion(user);

  res.status(200).json({
    success: true,
    status: 200,
    ...completion,
    templatesCount: Array.isArray(user.quickTemplates) ? user.quickTemplates.length : 0,
  });
});

const deriveCompanyBadges = (stats) =>
  COMPANY_BADGE_RULES.filter((rule) => rule.test(stats)).map((rule) => rule.name);

const calculateCompanyStats = async (companyId) => {
  const jobs = await Job.find({ company: companyId }).select("_id").lean();
  if (!jobs.length) {
    return {
      averageResponseDays: null,
      decisionsCount: 0,
      applicationsCount: 0,
      hiresCount: 0,
      hiresLast90Days: 0,
      lastCalculatedAt: new Date(),
    };
  }

  const jobIds = jobs.map((job) => job._id);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const applications = await Application.find({
    job: { $in: jobIds },
  })
    .select("status createdAt updatedAt")
    .lean();

  let decisionsCount = 0;
  let responseTimeSum = 0;
  let hiresCount = 0;
  let hiresLast90Days = 0;

  applications.forEach((application) => {
    if (application.status && application.status !== "pending") {
      const createdAt = new Date(application.createdAt).getTime();
      const updatedAt = new Date(application.updatedAt).getTime();
      if (updatedAt >= createdAt) {
        responseTimeSum += updatedAt - createdAt;
        decisionsCount += 1;
      }
      if (application.status === "accepted") {
        hiresCount += 1;
        if (application.updatedAt >= ninetyDaysAgo) {
          hiresLast90Days += 1;
        }
      }
    }
  });

  const averageResponseDays =
    decisionsCount > 0 ? responseTimeSum / decisionsCount / (24 * 60 * 60 * 1000) : null;

  return {
    averageResponseDays,
    decisionsCount,
    applicationsCount: applications.length,
    hiresCount,
    hiresLast90Days,
    lastCalculatedAt: new Date(),
  };
};

const updateCompanyBadges = async () => {
  const companies = await Company.find().select("_id").lean();
  for (const company of companies) {
    const stats = await calculateCompanyStats(company._id);
    const badges = deriveCompanyBadges(stats);
    await Company.findByIdAndUpdate(company._id, {
      stats,
      badges,
    });
  }
};

const verifyEmail = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    const error = new ErrorHandler(
      "Invalid or expired verification token",
      400
    );
    return error.sendError(res);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Email verified successfully",
  });
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    const error = new ErrorHandler("Please Enter Email And Password", 400);
    return error.sendError(res);
  }
  // Fetch user with password to verify, but without restricting other fields
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new ErrorHandler("User does not exist. Please sign up.", 404);
    return error.sendError(res);
  }
  if (role !== user.role) {
    const error = new ErrorHandler(
      "Account doesn't exist with current role.",
      400
    );
    return error.sendError(res);
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    const error = new ErrorHandler("Incorrect Password", 401);
    return error.sendError(res);
  }

  // Check if email is verified, if not, send verification email and reject login
  if (!user.isVerified) {
    // Generate a new verification token (always generate fresh token on login attempt)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    
    // Save user with new verification token
    await user.save();
    
    // Send verification email if email configuration is available
    if (process.env.RESEND_EMAIL_API_KEY && email && user.fullname) {
      const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL ;
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

      const emailBody = {
        from: "NextHire <verify@raorajan.pro>",
        to: email,
        subject: "Email Verification Required - NextHire",
        text: `Hello ${user.fullname},\n\nPlease verify your email by clicking on the following link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4a5568;">Email Verification Required</h2>
            <p>Hello <strong>${user.fullname}</strong>,</p>
            <p>Your account is pending verification. Please verify your email address to access all features of NextHire.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify My Email</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">If you didn't request this email, please ignore it.</p>
          </div>
        `
      };

      // Send email (non-blocking - don't wait for it)
      sendMail(emailBody).catch((err) => {
        // Log error but don't block the error response
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to send verification email:", err.message);
        }
      });
    }
    
    // Reject login - email must be verified first
    const error = new ErrorHandler(
      "Please verify your email address before logging in. A verification email has been sent to your email address.",
      403
    );
    return error.sendError(res);
  }
  
  // If email is verified, proceed with normal login
  user.password = undefined;
  sendToken(user, 200, res);
});

const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    status: 200,
    message: "successfully Logged Out",
  });
});

const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new ErrorHandler(
      "Both current and new password are required",
      400
    );
    return error.sendError(res);
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    const error = new ErrorHandler("Current password is incorrect", 401);
    return error.sendError(res);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Password updated successfully",
  });
});

const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    const error = new ErrorHandler("Email is required", 400);
    return error.sendError(res);
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = new ErrorHandler("User not found with this email", 404);
    return error.sendError(res);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL ;
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  const emailBody = {
    from: "NextHire Support <support@raorajan.pro>",
    to: email,
    subject: "Password Reset Request",
    text: `You requested to reset your password. Click the link to reset: ${resetUrl}`,
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="color:blue;">Reset Password</a>
      <p>This link is valid for 15 minutes.</p>
    `,
  };

  try {
    await sendMail(emailBody);
    return res.status(200).json({
      success: true,
      status: 200,
      message: `Reset password link sent to ${email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    const error = new ErrorHandler(
      "Failed to send email. Try again later.",
      500
    );
    return error.sendError(res);
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("token", token, newPassword);

  if (!token || !newPassword) {
    const error = new ErrorHandler("Token and new password are required", 400);
    return error.sendError(res);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new ErrorHandler("Invalid or expired reset token", 400);
    return error.sendError(res);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Password reset successfully",
  });
});

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const { fullname, email, bio, skills } = req.body;
  console.log(req.body);
  const userId = req.user.id;
  let user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (fullname !== undefined) user.fullname = fullname;
  if (email !== undefined) user.email = email;
  
  if (!user.profile) {
    user.profile = {};
  }
  
  if (bio !== undefined) user.profile.bio = bio;
  if (skills !== undefined) {
    user.profile.skills = skills ? skills.split(",").map((skill) => skill.trim()).filter(Boolean) : [];
  }

  try {
    if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
      if (user.profile.profilePhoto && user.profile.profilePhoto.public_id) {
        await cloudinary.uploader.destroy(user.profile.profilePhoto.public_id);
      }
      const result = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        {
          folder: "avatars",
          width: 150,
          crop: "scale",
        }
      );
      user.profile.profilePhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
  } catch (avatarError) {
    console.error("Error uploading avatar (continuing without avatar update):", avatarError);
    // Continue profile update even if avatar upload fails
  }

  if (req.files && req.files.resume && req.files.resume.tempFilePath) {
    if (user.profile.resume && user.profile.resume.public_id) {
      await cloudinary.uploader.destroy(user.profile.resume.public_id);
    }
    const resumeUpload = await cloudinary.uploader.upload(
      req.files.resume.tempFilePath,
      {
        folder: "resumes",
      }
    );
    user.profile.resume = {
      public_id: resumeUpload.public_id,
      url: resumeUpload.secure_url,
      resumeOriginalName: req.files.resume.name,
    };
  }

  // Generate recommendations immediately
  const userSkills = user.profile?.skills || [];
  const userBio = user.profile?.bio || "";
  
  if (userSkills.length > 0 || userBio) {
    const jobQuery = {
      $or: [
        ...(userSkills.length > 0
          ? userSkills.map((skill) => ({
              requirements: { $regex: skill.trim(), $options: "i" },
            }))
          : []),
        ...(userBio ? [{ title: { $regex: userBio.trim(), $options: "i" } }] : []),
      ],
    };
    
    try {
      const matchedJobs = await Job.find(jobQuery).select("_id").lean().limit(20);
      user.jobRecommendations = matchedJobs.map((j) => j._id);
    } catch (recError) {
      console.error("Failed to generate immediate job recommendations:", recError.message);
    }
  } else {
    user.jobRecommendations = [];
  }

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
});

const getUserSearchHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId)
    .select("searchHistory")
    .lean(); // Use lean() for read-only query

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Optimize: Use Set for O(1) lookup and filter empty strings
  const cleanedSearchHistory = [
    ...new Set(
      (user.searchHistory || [])
        .map((term) => term.trim().toLowerCase())
        .filter((term) => term.length > 0)
    ),
  ];

  return res.status(200).json({
    success: true,
    status: 200,
    searchHistory: cleanedSearchHistory,
  });
});

const clearUserSearchHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  await User.findByIdAndUpdate(userId, { searchHistory: [] }, { new: true });

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Search history cleared successfully.",
  });
});

const getSearchResult = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId)
    .select("searchHistory")
    .lean();

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }
  
  const searchKeywords = [
    ...new Set(
      (user.searchHistory || [])
        .map((term) => term.trim().toLowerCase())
        .filter((term) => term.length > 0)
    ),
  ];

  let jobQuery = {};
  let message = "Jobs retrieved successfully.";

  if (searchKeywords.length > 0) {
    // If we have history, filter by it using a combined regex for efficiency
    const searchPattern = searchKeywords.join("|");
    jobQuery = {
      $or: [
        { title: { $regex: searchPattern, $options: "i" } },
        { requirements: { $regex: searchPattern, $options: "i" } },
      ],
    };
  } else {
    // If no history, show latest jobs as a fallback for better UX
    message = "Explore our latest job openings.";
  }

  // Optimize: Use aggregation with lookup for better performance
  const jobs = await Job.aggregate([
    { $match: jobQuery },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
        pipeline: [
          {
            $project: {
              companyName: 1,
              location: 1,
              logo: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$company" },
    { $sort: { createdAt: -1 } },
    { $limit: 50 }, // Limit results for browse/search view
  ]);

  return res.status(200).json({
    success: true,
    status: 200,
    message: jobs.length === 0 ? "No jobs found matching your criteria." : message,
    jobs,
  });
});

const recommendJobsToUsers = async () => {
  // Optimize: Only fetch users with skills or bio, and use lean()
  const users = await User.find({
    $or: [
      { "profile.skills": { $exists: true, $ne: [] } },
      { "profile.bio": { $exists: true, $ne: "" } },
    ],
  })
    .select("profile.skills profile.bio")
    .lean();

  // Optimize: Process users in batches to avoid memory issues
  const batchSize = 10;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (user) => {
        const skills = user.profile?.skills || [];
        const bio = user.profile?.bio || "";
        
        if (skills.length === 0 && !bio) return;

        // Optimize: Build query more efficiently
        const jobQuery = {
          $or: [
            ...(skills.length > 0
              ? skills.map((skill) => ({
                  requirements: { $regex: skill.trim(), $options: "i" },
                }))
              : []),
            ...(bio ? [{ title: { $regex: bio.trim(), $options: "i" } }] : []),
          ],
        };

        const jobs = await Job.find(jobQuery)
          .select("_id")
          .lean()
          .limit(20); // Limit recommendations

        const jobIds = jobs.map((job) => job._id.toString());

        // Update user with recommendations (non-blocking)
        if (jobIds.length > 0) {
          await User.findByIdAndUpdate(user._id, {
            jobRecommendations: jobIds,
          });
        }
      })
    );
  }
};
// Optimize: Run recommendation job every 5 minutes instead of every minute
cron.schedule("*/5 * * * *", async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Running job recommendation task...");
  }
  try {
    await recommendJobsToUsers();
  } catch (error) {
    console.error("Error in cron job:", error.message);
  }
});

cron.schedule("0 * * * *", async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Running job alert digest task...");
  }
  try {
    await sendJobAlertDigests();
  } catch (error) {
    console.error("Error in job alert digest task:", error.message);
  }
});

cron.schedule("30 2 * * *", async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Running company badge update task...");
  }
  try {
    await updateCompanyBadges();
  } catch (error) {
    console.error("Error updating company badges:", error.message);
  }
});

const getRecommendedJobs = asyncErrorHandler(async (req, res, next) => {
  const {
    title,
    salary,
    experienceLevel,
    location,
    jobType,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = req.query;

  const userId = req.user.id;

  // Optimize: Only select jobRecommendations field
  const user = await User.findById(userId)
    .select("jobRecommendations")
    .lean(); // Use lean() for better performance

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (!user.jobRecommendations || user.jobRecommendations.length === 0) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No recommended jobs found",
      jobs: [],
    });
  }

  const query = {
    _id: { $in: user.jobRecommendations },
  };

  if (title) {
    const keyword = title.trim();
    query.title = { $regex: keyword, $options: "i" };
  }

  if (salary) {
    const [minSalary, maxSalary] = salary
      .split("-")
      .map((s) => s.replace(/,/g, "").trim());
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }

  if (experienceLevel) {
    query.experienceLevel = Number(experienceLevel);
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = { $regex: jobType, $options: "i" };
  }

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const sortOptions = {};
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortBy] = order;
  } else {
    sortOptions.createdAt = -1;
  }

  // Optimize: Use parallel queries and lean()
  const [recommendedJobs, totalJobs] = await Promise.all([
    Job.find(query)
      .populate({
        path: "company",
        select: "companyName location logo", // Only needed fields
      })
      .populate({
        path: "applications",
        select: "status createdAt", // Only needed fields
        options: { limit: 3 }, // Limit applications
      })
      .select("-__v") // Exclude version key
      .lean() // Use lean() for better performance
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOptions),
    Job.countDocuments(query), // Parallel count query
  ]);

  if (recommendedJobs.length === 0) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No recommended jobs found matching your criteria",
      jobs: [],
    });
  }

  const totalPages = Math.ceil(totalJobs / limitNumber);

  return res.status(200).json({
    jobs: recommendedJobs,
    currentPage: pageNumber,
    totalPages,
    totalJobs,
    limit: limitNumber,
    success: true,
    status: 200,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserSearchHistory,
  clearUserSearchHistory,
  getRecommendedJobs,
  getSearchResult,
  verifyEmail,
  readDocumentContent,
  changePassword,
  forgetPassword,
  resetPassword,
  getJobAlerts,
  updateJobAlerts,
  getSavedSearches,
  saveSavedSearch,
  deleteSavedSearch,
  getSkillGapInsights,
  getProfileCompletion,
  getQuickTemplates,
  createQuickTemplate,
  updateQuickTemplate,
  deleteQuickTemplate,
};
