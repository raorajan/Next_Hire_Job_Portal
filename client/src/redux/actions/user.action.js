import fetchFromApiServer from "@/services";

// User login API
export const loginUserApi = async (data) => {
  const url = `api/v1/user/login`;
  return await fetchFromApiServer("POST", url, data);
};

// User register API
export const registerUserApi = async (data) => {
  const url = `api/v1/user/register`;
  return await fetchFromApiServer("MULTIPART", url, data);
};

// User logout API
export const logoutUserApi = async () => {
  const url = `api/v1/user/logout`;
  return await fetchFromApiServer("GET", url);
};

export const changeCurrentPassword = async (data) => {
  const url = `api/v1/user/change-password`;
  return await fetchFromApiServer("POST", url, data);
};

export const forgetPassword = async (data) => {
  const url = `api/v1/user/forget-password`;
  return await fetchFromApiServer("POST", url, data);
};

export const resetPassword = async ({ token, password }) => {
  const url = `api/v1/user/reset-password/${token}`;
  return await fetchFromApiServer("POST", url, { newPassword: password });
};

// Fetch search history API
export const getUserSearchHistoryApi = async () => {
  const url = `api/v1/user/search-history`;
  return await fetchFromApiServer("GET", url);
};

// Clear search history API
export const clearUserSearchHistoryApi = async () => {
  const url = `api/v1/user/search-history`;
  return await fetchFromApiServer("DELETE", url);
};

// Update user profile API
export const updateUserProfileApi = async (formData) => {
  const url = `api/v1/user/profile/update`;
  return await fetchFromApiServer("MULTIPART", url, formData);
};

export const fetchRecommendedJobs = async (params) => {
  const url = `api/v1/user/recommended-jobs`;
  return await fetchFromApiServer("GET", url, {}, { params });
};

export const fetchSearchResult = async (params) => {
  const url = `api/v1/user/search`;
  return await fetchFromApiServer("GET", url, {}, { params });
};

export const deleteSearchHistory = async () => {
  const url = `api/v1/user/search-history/clear`;
  return await fetchFromApiServer("DELETE", url);
};

export const emailVerification = async (params) => {
  const { token } = params;
  const url = `api/v1/user/verify-email?token=${token}`;
  return await fetchFromApiServer("POST", url);
};

// Job alerts
export const getJobAlertsApi = async () => {
  const url = `api/v1/user/job-alerts`;
  return await fetchFromApiServer("GET", url);
};

export const updateJobAlertsApi = async (data) => {
  const url = `api/v1/user/job-alerts`;
  return await fetchFromApiServer("POST", url, data);
};

// Profile completion
export const getProfileCompletionApi = async () => {
  const url = `api/v1/user/profile/completion`;
  return await fetchFromApiServer("GET", url);
};

// Quick apply templates
export const getQuickTemplatesApi = async () => {
  const url = `api/v1/user/templates`;
  return await fetchFromApiServer("GET", url);
};

export const createQuickTemplateApi = async (data) => {
  const url = `api/v1/user/templates`;
  return await fetchFromApiServer("POST", url, data);
};

export const updateQuickTemplateApi = async (templateId, data) => {
  const url = `api/v1/user/templates/${templateId}`;
  return await fetchFromApiServer("PUT", url, data);
};

export const deleteQuickTemplateApi = async (templateId) => {
  const url = `api/v1/user/templates/${templateId}`;
  return await fetchFromApiServer("DELETE", url);
};

// Saved searches
export const getSavedSearchesApi = async () => {
  const url = `api/v1/user/saved-searches`;
  return await fetchFromApiServer("GET", url);
};

export const saveSavedSearchApi = async (data) => {
  const url = `api/v1/user/saved-searches`;
  return await fetchFromApiServer("POST", url, data);
};

export const deleteSavedSearchApi = async (searchId) => {
  const url = `api/v1/user/saved-searches/${searchId}`;
  return await fetchFromApiServer("DELETE", url);
};

// Skill gap insights
export const getSkillGapInsightsApi = async (jobId) => {
  const url = `api/v1/user/profile/skill-gap?jobId=${jobId}`;
  return await fetchFromApiServer("GET", url);
};

// Read document content (for resume parsing)
export const readDocumentContentApi = async (data) => {
  const url = `api/v1/user/read-content`;
  return await fetchFromApiServer("POST", url, data);
};

export const getRecruiterStatsApi = async () => {
  const url = `api/v1/user/profile/recruiter-stats`;
  return await fetchFromApiServer("GET", url);
};

// Get signed URL for secure resume access
export const getResumeSignedUrlApi = async (userId) => {
  const url = `api/v1/user/resume-url/${userId}`;
  return await fetchFromApiServer("GET", url);
};