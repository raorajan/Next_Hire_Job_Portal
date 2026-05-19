const express = require("express");
const isAuthenticated = require("../middlewares/auth.js");
const {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  getApplicationTimeline,
  getApplicationAiScore,
  getApplicationInterviewQuestions,
  getApplicationEmailDraft,
} = require("../controllers/application.controller.js");

const applicationRouter = express.Router();

applicationRouter.route("/apply/:jobId").post(isAuthenticated, applyJob);
applicationRouter.route("/get").get(isAuthenticated, getAppliedJobs);
applicationRouter.route("/:jobId/applicants").get(isAuthenticated, getApplicants);
applicationRouter
  .route("/status/:applicationId/update")
  .post(isAuthenticated, updateStatus);
applicationRouter
  .route("/:applicationId/timeline")
  .get(isAuthenticated, getApplicationTimeline);
applicationRouter
  .route("/:applicationId/ai-score")
  .get(isAuthenticated, getApplicationAiScore);
applicationRouter
  .route("/:applicationId/interview-questions")
  .get(isAuthenticated, getApplicationInterviewQuestions);
applicationRouter
  .route("/:applicationId/email-draft")
  .post(isAuthenticated, getApplicationEmailDraft);

module.exports = applicationRouter;
