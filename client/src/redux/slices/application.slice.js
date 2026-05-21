import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  applyJobApi,
  getAppliedJobsApi,
  getApplicantsApi,
  updateApplicationStatusApi,
  getApplicationTimelineApi,
  evaluateMockInterviewApi,
  getMockInterviewResultApi,
  optimizeResumeApi,
  getCandidateInsightsApi,
  getCandidateRadarApi,
} from "../actions/application.action";

// Thunk to apply for a job
export const applyJob = createAsyncThunk(
  "application/apply",
  async ({ jobId, data = {} }, { rejectWithValue }) => {
    try {
      const response = await applyJobApi(jobId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to apply for job"
      );
    }
  }
);

// Thunk to get applied jobs
export const getAppliedJobs = createAsyncThunk(
  "application/getAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAppliedJobsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch applied jobs"
      );
    }
  }
);

// Thunk to get applicants for a specific job
export const getApplicants = createAsyncThunk(
  "application/getApplicants",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getApplicantsApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch applicants"
      );
    }
  }
);

// Thunk to update application status
export const updateApplicationStatus = createAsyncThunk(
  "application/updateStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await updateApplicationStatusApi(applicationId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update application status"
      );
    }
  }
);

// Thunk to get application timeline
export const getApplicationTimeline = createAsyncThunk(
  "application/getTimeline",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await getApplicationTimelineApi(applicationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch application timeline"
      );
    }
  }
);

// Thunk to evaluate mock interview answers
export const evaluateMockInterview = createAsyncThunk(
  "application/evaluateMock",
  async ({ applicationId, answers }, { rejectWithValue }) => {
    try {
      const response = await evaluateMockInterviewApi(applicationId, answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to evaluate mock interview"
      );
    }
  }
);

// Thunk to get mock interview result
export const getMockInterviewResult = createAsyncThunk(
  "application/getMockResult",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await getMockInterviewResultApi(applicationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch mock interview result"
      );
    }
  }
);

// Thunk to optimize resume for a job
export const optimizeResume = createAsyncThunk(
  "application/optimizeResume",
  async ({ jobId, customResumeText }, { rejectWithValue }) => {
    try {
      const response = await optimizeResumeApi(jobId, customResumeText);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to optimize resume"
      );
    }
  }
);

// Thunk to get candidate insights
export const fetchCandidateInsights = createAsyncThunk(
  "application/fetchInsights",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await getCandidateInsightsApi(applicationId);
      return { applicationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch candidate insights"
      );
    }
  }
);

// Thunk to get candidate radar
export const fetchCandidateRadar = createAsyncThunk(
  "application/fetchRadar",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await getCandidateRadarApi(applicationId);
      return { applicationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch candidate radar data"
      );
    }
  }
);

// Initial state for application
const initialState = {
  applications: [],
  applicants: [],
  timeline: null,
  mockInterview: null,
  resumeOptimization: null,
  candidateInsights: {},
  candidateRadar: {},
  loading: false,
  error: null,
  success: null,
  message: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply job cases
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get applied jobs cases
      .addCase(getAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get applicants for a job cases
      .addCase(getApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
      })
      .addCase(getApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update application status cases
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get application timeline
      .addCase(getApplicationTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.timeline = action.payload;
      })
      .addCase(getApplicationTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Evaluate mock interview cases
      .addCase(evaluateMockInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(evaluateMockInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.mockInterview = action.payload.mockInterviewResult;
        state.message = action.payload.message;
      })
      .addCase(evaluateMockInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get mock interview cases
      .addCase(getMockInterviewResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMockInterviewResult.fulfilled, (state, action) => {
        state.loading = false;
        state.mockInterview = action.payload.mockInterviewResult;
      })
      .addCase(getMockInterviewResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Optimize resume cases
      .addCase(optimizeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(optimizeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeOptimization = action.payload.optimization;
        state.message = action.payload.message;
      })
      .addCase(optimizeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Candidate insights cases
      .addCase(fetchCandidateInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateInsights[action.payload.applicationId] = action.payload.data.insights;
      })
      .addCase(fetchCandidateInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Candidate radar cases
      .addCase(fetchCandidateRadar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateRadar.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateRadar[action.payload.applicationId] = action.payload.data.radar;
      })
      .addCase(fetchCandidateRadar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearErrors, clearMessages } = applicationSlice.actions;

// Export reducer
export default applicationSlice.reducer;
