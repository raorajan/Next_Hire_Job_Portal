import fetchFromApiServer from "@/services"; // Your service for API requests

// Apply for a job API
export const applyJobApi = async (jobId, data = {}) => {
  const url = `api/v1/application/apply/${jobId}`;
  return await fetchFromApiServer("POST", url, data);
};

// Get all jobs applied for by the user
export const getAppliedJobsApi = async () => {
  const url = `api/v1/application/get`;
  return await fetchFromApiServer("GET", url);
};

// Get applicants for a specific job
export const getApplicantsApi = async (jobId) => {
  const url = `api/v1/application/${jobId}/applicants`;
  return await fetchFromApiServer("GET", url);
};

// Update the status of an application
export const updateApplicationStatusApi = async (applicationId, status) => {
  const url = `api/v1/application/status/${applicationId}/update`;
  return await fetchFromApiServer("POST", url, { status });
};

// Get application timeline
export const getApplicationTimelineApi = async (applicationId) => {
  const url = `api/v1/application/${applicationId}/timeline`;
  return await fetchFromApiServer("GET", url);
};

// Evaluate Mock Interview API
export const evaluateMockInterviewApi = async (applicationId, answers) => {
  const url = `api/v1/application/${applicationId}/mock-interview/evaluate`;
  return await fetchFromApiServer("POST", url, { answers });
};

// Get Mock Interview Result API
export const getMockInterviewResultApi = async (applicationId) => {
  const url = `api/v1/application/${applicationId}/mock-interview`;
  return await fetchFromApiServer("GET", url);
};

// Optimize Resume for Job API
export const optimizeResumeApi = async (jobId, customResumeText) => {
  const url = `api/v1/application/${jobId}/optimize-resume`;
  return await fetchFromApiServer("POST", url, { customResumeText });
};

// Get Candidate Insights API
export const getCandidateInsightsApi = async (applicationId) => {
  const url = `api/v1/application/${applicationId}/insights`;
  return await fetchFromApiServer("GET", url);
};

// Get Candidate Radar Data API
export const getCandidateRadarApi = async (applicationId) => {
  const url = `api/v1/application/${applicationId}/radar`;
  return await fetchFromApiServer("GET", url);
};

// Schedule Interview API (public — no auth needed)
export const scheduleInterviewApi = async (applicationId, date, time) => {
  const url = `api/v1/application/${applicationId}/schedule`;
  return await fetchFromApiServer("POST", url, { date, time });
};
