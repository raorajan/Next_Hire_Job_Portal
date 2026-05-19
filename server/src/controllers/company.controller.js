const Company = require("../models/company.model");
const Job = require("../models/job.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorHandler");

// Register Company
const registerCompany = asyncErrorHandler(async (req, res, next) => {
  const { companyName } = req.body;

  // Check if the user is a Recruiter
  if (req.user.role !== "recruiter") {
    const error = new ErrorHandler(
      "Only Recruiters are allowed to register a company. Please update your account role to Recruiter to proceed.",
      403
    ); // 403: Forbidden
    return error.sendError(res);
  }

  if (!companyName) {
    const error = new ErrorHandler("Company name is required", 400);
    return error.sendError(res);
  }

  let company = await Company.findOne({ companyName });
  if (company) {
    const error = new ErrorHandler(
      "A company with this name already exists",
      400
    );
    return error.sendError(res);
  }

  company = await Company.create({
    companyName,
    userId: req.user.id, // Assuming req.user.id contains the logged-in user ID
  });

  return res.status(201).json({
    message: "Company registered successfully.",
    company,
    success: true,
    status: 200,
  });
});

// Get Companies by User ID
const getCompany = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id;
  const companies = await Company.find({ userId })
    .select("-__v") // Exclude version key
    .lean() // Use lean() for better performance
    .sort({ createdAt: -1 }); // Sort by newest first

  if (!companies.length) {
    return res.status(200).json({
      companies: [],
      message: "You haven't created any companies yet.",
      success: true,
      status: 200,
    });
  }

  return res.status(200).json({
    companies,
    success: true,
    status: 200,
  });
});

// Get Company by ID
const getCompanyById = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.params.id;
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    company,
    success: true,
    status: 200,
  });
});

// Get Jobs by Company ID
const getJobsByCompanyId = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.params.id;
  
  // Optimize: Check company and fetch jobs in parallel
  const [company, jobs] = await Promise.all([
    Company.findById(companyId).select("companyName").lean(),
    Job.find({ company: companyId })
      .populate({
        path: "applications",
        select: "status createdAt", // Only needed fields
        options: { limit: 5 }, // Limit applications
      })
      .populate({
        path: "company",
        select: "companyName location logo", // Only needed fields
      })
      .select("-__v") // Exclude version key
      .lean() // Use lean() for better performance
      .sort({ createdAt: -1 }),
  ]);

  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    jobs,
    success: true,
    status: 200,
    message: jobs.length ? "Jobs fetched successfully." : "No jobs found for this company yet.",
  });
});

// Update Company
const updateCompany = asyncErrorHandler(async (req, res, next) => {
  const { companyName, description, website, location } = req.body;

  // Prepare the update data
  const updateData = {
    companyName,
    description,
    website,
    location,
  };

  // Check if a new logo file is uploaded
  if (req.files && req.files.logo && req.files.logo.tempFilePath) {
    const { logo } = req.files;
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB

    if (!allowedMimeTypes.includes(logo.mimetype)) {
      const error = new ErrorHandler(
        "Logo must be a PNG, JPG, or WEBP image.",
        400
      );
      return error.sendError(res);
    }

    if (logo.size > maxSizeBytes) {
      const error = new ErrorHandler("Logo must be smaller than 2MB.", 400);
      return error.sendError(res);
    }

    const myCloud = await cloudinary.uploader.upload(
      logo.tempFilePath,
      {
        folder: "logos",
        width: 150,
        crop: "scale",
      }
    );

    updateData.logo = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
    new: true, // Return the updated company
  });

  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    message: "Company information updated successfully.",
    company,
    success: true,
    status: 200,
  });
});



// Delete Company
const deleteCompany = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.params.id;

  // Check if the user is a Recruiter
  if (req.user.role !== "recruiter") {
    const error = new ErrorHandler(
      "Only Recruiters are allowed to delete a company.",
      403
    ); // 403: Forbidden
    return error.sendError(res);
  }

  const company = await Company.findById(companyId);
  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  // Check if the company belongs to the logged-in recruiter
  if (company.userId.toString() !== req.user.id.toString()) {
    const error = new ErrorHandler(
      "You are not authorized to delete this company.",
      403
    );
    return error.sendError(res);
  }

  // Delete the company's logo from Cloudinary if it exists
  if (company.logo && company.logo.public_id) {
    try {
      await cloudinary.uploader.destroy(company.logo.public_id);
    } catch (err) {
      console.error("Failed to delete company logo from Cloudinary:", err);
    }
  }

  // Delete all jobs associated with this company
  await Job.deleteMany({ company: companyId });

  // Delete the company itself
  await Company.findByIdAndDelete(companyId);

  return res.status(200).json({
    message: "Company and its associated postings deleted successfully.",
    success: true,
    status: 200,
  });
});

module.exports = {
  registerCompany,
  getCompany,
  getCompanyById,
  getJobsByCompanyId,
  updateCompany,
  deleteCompany,
};
