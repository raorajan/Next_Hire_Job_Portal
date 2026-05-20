const express = require("express");
const isAuthenticated = require("../middlewares/auth.js");
const {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  deleteAdminJobs,
  getSimilarJobs,
  updateJob,
  getJobFilters,
  getJobsForCarousel,
  generateJobDescription,
} = require("../controllers/job.controller.js");

const checkAiQuota = require("../middlewares/checkAiQuota.js");
const validate = require("../middlewares/validate.js");
const { postJobSchema } = require("../validations/job.validation.js");

const jobRouter = express.Router();

jobRouter.route("/post").post(isAuthenticated, validate(postJobSchema), postJob);
jobRouter.route("/generate-description").post(isAuthenticated, checkAiQuota, generateJobDescription);
jobRouter.route("/get").get(getAllJobs);
jobRouter.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
jobRouter.route("/get/:id").get(getJobById);
jobRouter.route("/update/:id").put(isAuthenticated, updateJob);
jobRouter.route("/delete/:id").delete(isAuthenticated, deleteAdminJobs);
jobRouter.route("/:id/similar").get(getSimilarJobs);
jobRouter.route("/filters").get(getJobFilters);
jobRouter.route("/carousel").get(getJobsForCarousel);

module.exports = jobRouter;
