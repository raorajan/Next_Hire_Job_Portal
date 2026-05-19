const Job = require("../models/job.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Company = require("../models/company.model");

const {
  processJobAndNotifyUsers,
  notifyJobDeletion,
} = require("../services/openai.service");

const postJob = asyncErrorHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experienceLevel,
    position,
    companyId,
  } = req.body;
  const userId = req.user.id;

  if (
    !title ||
    !description ||
    !requirements ||
    !salary ||
    !location ||
    !jobType ||
    !experienceLevel ||
    !position ||
    !companyId
  ) {
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  // Optimize: Only select needed fields
  const company = await Company.findById(companyId).select("userId companyName");
  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  if (company.userId.toString() !== userId) {
    const error = new ErrorHandler(
      "You do not have permission to post jobs for this company.",
      403
    );
    return error.sendError(res);
  }

  const companyName = company.companyName;
  const job = await Job.create({
    title,
    description,
    requirements: Array.isArray(requirements)
      ? requirements?.map((req) => req.trim())
      : requirements?.split(",").map((req) => req.trim()),
    salary: Number(salary),
    location,
    jobType,
    experienceLevel,
    position,
    company: companyId,
    created_by: userId,
  });

  // Optimize: Don't await - let notification run in background
  processJobAndNotifyUsers(job, companyName).catch((err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("Error processing job notifications:", err.message);
    }
  });

  // Return response
  return res.status(201).json({
    message: "New job created successfully.",
    job,
    success: true,
    status: 200,
  });
});

const getAllJobs = asyncErrorHandler(async (req, res) => {
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

  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      console.log("Invalid token, skipping user context");
    }
  }
  const keyword = title || "";
  // Update search history only if user is logged in and keyword exists (non-blocking)
  if (userId && keyword) {
    // Don't await - let it run in background to not block the main query
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { searchHistory: keyword } },
      { new: true }
    ).catch((err) => console.error("Error updating search history:", err));
  }

  const query = {};

  // Handle title search with company names or requirements
  if (keyword) {
    // Optimize: Only fetch company IDs if keyword exists
    const companies = await Company.find({
      companyName: { $regex: keyword, $options: "i" },
    })
      .select("_id")
      .lean(); // Use lean() for read-only query

    const companyIds = companies.map((company) => company._id);
    const keywordTerms = keyword.trim().split(/\s+/).filter((term) => term.length > 0);

    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      ...(companyIds.length > 0 ? [{ company: { $in: companyIds } }] : []),
      ...(keywordTerms.length > 0
        ? [
            {
              requirements: {
                $in: keywordTerms.map((term) => new RegExp(term, "i")),
              },
            },
          ]
        : []),
    ];
  }

  // Handle salary filtering based on a range
  if (salary) {
    const [minSalary, maxSalary] = salary
      .split("-")
      .map((s) => s.replace(/,/g, "").trim());
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }

  // Handle experience level filter
  if (experienceLevel) {
    query.experienceLevel = Number(experienceLevel);
  }

  // Handle location filter with case-insensitive regex
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Handle job type filter with case-insensitive regex
  if (jobType) {
    const normalizedRegex = jobType
      .replace(/[-\s]+/g, "[-\\s]*")
      .trim();
    query.jobType = { $regex: normalizedRegex, $options: "i" };
  }

  // Pagination settings
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Sorting settings
  const sortOptions = {};
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortBy] = order;
  } else {
    sortOptions.createdAt = -1;
  }

  // Optimize: Use parallel queries and lean() for better performance
  const [jobs, totalJobs] = await Promise.all([
    Job.find(query)
      .populate({
        path: "company",
        select: "companyName location website logo", // Only select needed fields
      })
      .populate({
        path: "applications",
        select: "status createdAt", // Only select needed fields
        options: { limit: 5 }, // Limit applications to reduce payload
      })
      .select("-__v") // Exclude version key
      .lean() // Use lean() for read-only query (faster)
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOptions),
    Job.countDocuments(query), // Parallel count query
  ]);

  const totalPages = Math.ceil(totalJobs / limitNumber);

  // Return a response even if no jobs are found
  return res.status(200).json({
    jobs,
    currentPage: pageNumber,
    totalPages,
    totalJobs,
    limit: limitNumber,
    success: true,
    status: 200,
    message:
      jobs.length === 0
        ? "No jobs found matching your criteria"
        : "Jobs retrieved successfully",
  });
});

const getJobById = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId)
    .populate({
      path: "company",
      select: "companyName location website logo description", // Only needed fields
    })
    .populate({
      path: "applications",
      select: "status createdAt applicant", // Only needed fields
      populate: {
        path: "applicant",
        select: "fullname email profile.profilePhoto", // Only needed fields
      },
    })
    .populate({
      path: "created_by",
      select: "fullname email", // Only needed fields
    })
    .lean(); // Use lean() for better performance

  if (!job) {
    const error = new ErrorHandler("Job Not Found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({ job, success: true, status: 200 });
});

const getAdminJobs = asyncErrorHandler(async (req, res) => {
  const adminId = req.user.id;
  const jobs = await Job.find({ created_by: adminId })
    .populate({
      path: "company",
      select: "companyName location logo", // Only needed fields
    })
    .select("-__v") // Exclude version key
    .lean() // Use lean() for better performance
    .sort({ createdAt: -1 }); // Sort by newest first

  return res.status(200).json({
    jobs,
    success: true,
    status: 200,
    message: jobs.length ? "Jobs retrieved successfully." : "You have not posted any jobs yet.",
  });
});

const updateJob = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experienceLevel,
    position,
    companyId,
  } = req.body;

  const userId = req.user.id;

  // Find the job to be updated
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new ErrorHandler("Job not found", 404);
    return error.sendError(res);
  }

  // Ensure the user is authorized to update this job
  const company = await Company.findById(companyId);
  if (!company || company.userId.toString() !== userId) {
    const error = new ErrorHandler(
      "You do not have permission to update this job.",
      403
    );
    return error.sendError(res);
  }

  // Update job details
  if (title) job.title = title;
  if (description) job.description = description;
  if (requirements) {
    job.requirements = Array.isArray(requirements)
      ? requirements?.map((req) => req.trim())
      : requirements.split(",").map((req) => req.trim());
  }
  if (salary) job.salary = Number(salary);
  if (location) job.location = location;
  if (jobType) job.jobType = jobType;
  if (experienceLevel) job.experienceLevel = experienceLevel;
  if (position) job.position = position;
  if (companyId) job.company = companyId;

  // Save the updated job
  await job.save();

  // Return the updated job
  return res.status(200).json({
    message: "Job updated successfully.",
    job,
    success: true,
    status: 200,
  });
});

const deleteAdminJobs = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        select: "applicant", // Only needed field
      })
      .populate({
        path: "company",
        select: "companyName", // Only needed field
      })
      .lean(); // Use lean() for read-only query

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const companyName = job.company?.companyName;
    const jobTitle = job?.title;
    const applicantIds = job?.applications
      ?.map((application) => application.applicant)
      .filter(Boolean); // Filter out undefined values

    // Optimize: Delete job first, then notify (non-blocking)
    await Job.findByIdAndDelete(jobId);
    
    if (applicantIds && applicantIds.length > 0) {
      const applicants = await User.find({ _id: { $in: applicantIds } })
        .select("email fullname")
        .lean();
      
      // Don't await - let notification run in background
      notifyJobDeletion(jobTitle, companyName, applicants).catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Error notifying job deletion:", err.message);
        }
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Job deleted successfully and applicants notified.",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

const getSimilarJobs = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      const error = new ErrorHandler("Job not found", 404);
      return error.sendError(res);
    }

    const query = {
      _id: { $ne: jobId },
      $or: [
        { title: { $regex: job.title, $options: "i" } },
        { location: { $regex: job.location, $options: "i" } },
        { jobType: job.jobType },
        { experienceLevel: job.experienceLevel },
      ],
    };

    const similarJobs = await Job.find(query)
      .populate({
        path: "company",
        select: "companyName location logo", // Only needed fields
      })
      .select("title location salary jobType experienceLevel company") // Only needed fields
      .lean() // Use lean() for better performance
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    if (similarJobs.length === 0) {
      const error = new ErrorHandler("No similar jobs found", 404);
      return error.sendError(res);
    }

    return res.status(200).json({
      success: true,
      jobs: similarJobs,
      totalJobs: similarJobs.length,
      status: 200,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching similar jobs:", error.message);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getJobFilters = asyncErrorHandler(async (req, res, next) => {
  // Optimize: Use parallel queries for better performance
  const [locations, jobTypes, salaryStats] = await Promise.all([
    Job.distinct("location"),
    Job.distinct("jobType"),
    Job.aggregate([
      {
        $group: {
          _id: null,
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" },
        },
      },
    ]),
  ]);

  let salaryRanges = [];

  if (salaryStats.length > 0) {
    const { minSalary, maxSalary } = salaryStats[0];

    const range = maxSalary - minSalary;
    let step = 10000;
    if (range > 3000000) {
      step = 500000; // 5 Lakhs step
    } else if (range > 1500000) {
      step = 200000; // 2 Lakhs step
    } else if (range > 800000) {
      step = 100000; // 1 Lakh step
    } else if (range > 400000) {
      step = 50000;  // 50k step
    } else if (range > 200000) {
      step = 25000;  // 25k step
    } else {
      step = 10000;
    }

    const startVal = Math.floor(minSalary / step) * step;
    for (let start = startVal; start < maxSalary; start += step) {
      const end = start + step;
      salaryRanges.push(`${start.toLocaleString()}-${end.toLocaleString()}`);
    }
  }

  const uniqueJobTypes = new Set();
  jobTypes.forEach((type) => {
    if (!type) return;
    let normalized = type.trim();
    if (/^full[- ]*time$/i.test(normalized)) {
      normalized = "Full-Time";
    } else if (/^part[- ]*time$/i.test(normalized)) {
      normalized = "Part-Time";
    } else {
      normalized = normalized
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    uniqueJobTypes.add(normalized);
  });
  const formattedJobTypes = Array.from(uniqueJobTypes);

  const filterData = [
    { filterType: "Location", array: locations },
    { filterType: "Job Type", array: formattedJobTypes },
    { filterType: "Salary", array: salaryRanges },
  ];

  return res.status(200).json({
    filterData,
    success: true,
    status: 200,
  });
});

const getJobsForCarousel = asyncErrorHandler(async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $sort: { createdAt: -1 }, // Latest job per title
      },
      {
        $group: {
          _id: "$title", // Group by title
          job: { $first: "$$ROOT" }, // Pick the latest job with this title
        },
      },
      {
        $replaceRoot: { newRoot: "$job" }, // Flatten the job object to top level
      },
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
      {
        $unwind: "$company",
      },
      {
        $limit: 20, // Limit results for carousel
      },
    ]);

    return res.status(200).json({
      jobs,
      success: true,
      status: 200,
      message: jobs.length
        ? "Unique title jobs retrieved successfully."
        : "No jobs found.",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching unique jobs:", error.message);
    }
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error while fetching jobs.",
    });
  }
});

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteAdminJobs,
  getSimilarJobs,
  getJobFilters,
  getJobsForCarousel,
};
