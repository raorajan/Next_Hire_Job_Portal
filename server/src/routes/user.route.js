const express = require("express");
const {
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
  getRecruiterStats,
  upgradeToPro,
} = require("../controllers/user.controller.js");
const isAuthenticated = require("../middlewares/auth.js");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/change-password").post(isAuthenticated, changePassword);
userRouter.route("/forget-password").post(forgetPassword);
userRouter.route("/reset-password/:token").post(resetPassword);
userRouter.route("/profile/update").post(isAuthenticated, updateProfile);
userRouter.route("/profile/upgrade").post(isAuthenticated, upgradeToPro);
userRouter.route("/profile/recruiter-stats").get(isAuthenticated, getRecruiterStats);

userRouter
  .route("/job-alerts")
  .get(isAuthenticated, getJobAlerts)
  .post(isAuthenticated, updateJobAlerts);
userRouter
  .route("/saved-searches")
  .get(isAuthenticated, getSavedSearches)
  .post(isAuthenticated, saveSavedSearch);
userRouter
  .route("/saved-searches/:searchId")
  .delete(isAuthenticated, deleteSavedSearch);
userRouter.route("/profile/skill-gap").get(isAuthenticated, getSkillGapInsights);
userRouter.route("/profile/completion").get(isAuthenticated, getProfileCompletion);
userRouter
  .route("/templates")
  .get(isAuthenticated, getQuickTemplates)
  .post(isAuthenticated, createQuickTemplate);
userRouter
  .route("/templates/:templateId")
  .put(isAuthenticated, updateQuickTemplate)
  .delete(isAuthenticated, deleteQuickTemplate);
userRouter.route("/search-history").get(isAuthenticated, getUserSearchHistory);
userRouter
  .route("/search-history/clear")
  .delete(isAuthenticated, clearUserSearchHistory);
const checkAiQuota = require("../middlewares/checkAiQuota.js");

userRouter.route("/recommended-jobs").get(isAuthenticated, getRecommendedJobs);
userRouter.route("/search").get(isAuthenticated, getSearchResult);
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/read-content").post(isAuthenticated, checkAiQuota, readDocumentContent);

module.exports = userRouter;
