import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postJobApi,
  getAllJobsApi,
  getAdminJobsApi,
  getJobByIdApi,
  removeJobApi,
  fetchSimilarJobApi,
  filterOptionData,
  carouselData,
  getHighlightsApi,
  createHighlightApi,
  updateHighlightApi,
  deleteHighlightApi,
  getPrepResourcesApi,
  createPrepResourceApi,
  updatePrepResourceApi,
  deletePrepResourceApi,
  updateJobApi,
} from "../actions/job.action";

export const postJob = createAsyncThunk(
  "job/postJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await postJobApi(jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to post job");
    }
  }
);

// Thunk to get all jobs
export const getAllJobs = createAsyncThunk(
  "job/getAllJobs",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await getAllJobsApi(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch jobs");
    }
  }
);

// Thunk to get admin jobs
export const getAdminJobs = createAsyncThunk(
  "job/getAdminJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminJobsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch admin jobs"
      );
    }
  }
);

// Thunk to get job by ID
export const getJobById = createAsyncThunk(
  "job/getJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobByIdApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch job by ID"
      );
    }
  }
);

// Thunk to delete job by ID
export const deleteJob = createAsyncThunk(
  "job/deleteJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await removeJobApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch job by ID"
      );
    }
  }
);

// Thunk to delete job by ID
export const getSimilarJobs = createAsyncThunk(
  "job/similar",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await fetchSimilarJobApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch job by ID"
      );
    }
  }
);

export const getFitlerOptions = createAsyncThunk(
  "job/fitlerOption",
  async (_, { rejectWithValue }) => {
    try {
      const response = await filterOptionData();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "issue in getting filter option data"
      );
    }
  }
);
export const getCarouselData = createAsyncThunk(
  "job/carousel",
  async (_, { rejectWithValue }) => {
    try {
      const response = await carouselData();
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Getting issue in carousel data"
      );
    }
  }
);

export const getHighlights = createAsyncThunk(
  "job/getHighlights",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getHighlightsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch highlights");
    }
  }
);

export const getPrepResources = createAsyncThunk(
  "job/getPrepResources",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getPrepResourcesApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch prep resources");
    }
  }
);

export const createPrepResource = createAsyncThunk(
  "job/createPrepResource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createPrepResourceApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to create prep resource");
    }
  }
);

export const updatePrepResource = createAsyncThunk(
  "job/updatePrepResource",
  async ({ resourceId, data }, { rejectWithValue }) => {
    try {
      const response = await updatePrepResourceApi(resourceId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to update prep resource");
    }
  }
);

export const deletePrepResource = createAsyncThunk(
  "job/deletePrepResource",
  async (resourceId, { rejectWithValue }) => {
    try {
      const response = await deletePrepResourceApi(resourceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to delete prep resource");
    }
  }
);

export const createHighlight = createAsyncThunk(
  "job/createHighlight",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createHighlightApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to create highlight");
    }
  }
);

export const updateHighlight = createAsyncThunk(
  "job/updateHighlight",
  async ({ highlightId, data }, { rejectWithValue }) => {
    try {
      const response = await updateHighlightApi(highlightId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to update highlight");
    }
  }
);

export const deleteHighlight = createAsyncThunk(
  "job/deleteHighlight",
  async (highlightId, { rejectWithValue }) => {
    try {
      const response = await deleteHighlightApi(highlightId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to delete highlight");
    }
  }
);

export const updateJob = createAsyncThunk(
  "job/updateJob",
  async ({ jobId, data }, { rejectWithValue }) => {
    try {
      const response = await updateJobApi(jobId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to update job");
    }
  }
);

// Initial state
const initialState = {
  jobs: [],
  adminJobs: [],
  similarJobs: [],
  job: null,
  loading: false,
  error: null,
  success: false,
  filterOption: [],
  carousel: [],
  highlights: [],
};

// Job slice
const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Post job cases
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.jobs)) {
          state.jobs.push(action.payload.job); // Add newly posted job to jobs array
        } else {
          state.jobs = [action.payload.job];
        }
        state.success = true;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get Filter Options
      .addCase(getFitlerOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFitlerOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.filterOption = action.payload.filterData; // Set filter options
      })
      .addCase(getFitlerOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all jobs cases
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs || []; // Set jobs data
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Get all carousel data
      .addCase(getCarouselData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarouselData.fulfilled, (state, action) => {
        state.loading = false;
        state.carousel = action.payload;
      })
      .addCase(getCarouselData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get highlights
      .addCase(getHighlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHighlights.fulfilled, (state, action) => {
        state.loading = false;
        state.highlights = action.payload.highlights || [];
      })
      .addCase(getHighlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get admin jobs cases
      .addCase(getAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.adminJobs = action.payload;
      })
      .addCase(getAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get job by ID cases
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload; // Set job data
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get similar jobs cases
      .addCase(getSimilarJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSimilarJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.similarJobs = action.payload.similarJobs; // Set similar jobs data
      })
      .addCase(getSimilarJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get prep resources
      .addCase(getPrepResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrepResources.fulfilled, (state, action) => {
        state.loading = false;
        state.prepResources = action.payload.resources || [];
      })
      .addCase(getPrepResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create/Update/Delete prep resources
      .addCase(createPrepResource.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePrepResource.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePrepResource.fulfilled, (state) => {
        state.loading = false;
      })
      // Create/Update/Delete highlights
      .addCase(createHighlight.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateHighlight.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteHighlight.fulfilled, (state) => {
        state.loading = false;
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        // Update the job in the jobs array if it exists
        const updatedJob = action.payload.job;
        if (updatedJob && Array.isArray(state.jobs)) {
          const index = state.jobs.findIndex((j) => j._id === updatedJob._id);
          if (index !== -1) {
            state.jobs[index] = updatedJob;
          }
          if (state.job?._id === updatedJob._id) {
            state.job = updatedJob;
          }
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearErrors, clearSuccess } = jobSlice.actions;
export default jobSlice.reducer;
