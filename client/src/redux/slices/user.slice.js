import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserApi,
  registerUserApi,
  logoutUserApi,
  getUserSearchHistoryApi,
  clearUserSearchHistoryApi,
  updateUserProfileApi,
  fetchRecommendedJobs,
  fetchSearchResult,
  deleteSearchHistory,
  emailVerification,
  changeCurrentPassword,
  resetPassword,
  forgetPassword,
  getJobAlertsApi,
  updateJobAlertsApi,
  getProfileCompletionApi,
  getQuickTemplatesApi,
  createQuickTemplateApi,
  updateQuickTemplateApi,
  deleteQuickTemplateApi,
  getSavedSearchesApi,
  saveSavedSearchApi,
  deleteSavedSearchApi,
  getSkillGapInsightsApi,
  getRecruiterStatsApi,
} from "../actions/user.action";

// Initial state for user
const initialState = {
  user: null,
  isAuthenticated: false,
  searchHistory: [],
  recommended: [],
  searchResult: [],
  jobAlerts: null,
  profileCompletion: null,
  quickTemplates: [],
  savedSearches: [],
  skillGapInsights: null,
  recruiterStats: null,
  loading: false,
  error: null,
  message: null,
};

// Thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for user registration
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUserApi();
      return response.data; // Make sure to return the response data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for fetching user search history
export const getUserSearchHistory = createAsyncThunk(
  "searchHistory/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserSearchHistoryApi();
      return response.data.searchHistory;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch search history"
      );
    }
  }
);

// Thunk for clearing user search history
export const clearUserSearchHistory = createAsyncThunk(
  "searchHistory/clear",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearUserSearchHistoryApi();
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to clear search history"
      );
    }
  }
);

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "profile/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileApi(formData); // API call
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update profile"
      );
    }
  }
);

export const getRecommendedJobs = createAsyncThunk(
  "profile/recommend",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await fetchRecommendedJobs(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update profile"
      );
    }
  }
);

export const getSearchResult = createAsyncThunk(
  "profile/search",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await fetchSearchResult(searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to get Search Result"
      );
    }
  }
);

export const clearSearchHistory = createAsyncThunk(
  "profile/search",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteSearchHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to get Search Result"
      );
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "profile/verifyEmail",
  async (params, { rejectWithValue }) => {
    try {
      const response = await emailVerification(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to email verification"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await changeCurrentPassword(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to email verification"
      );
    }
  }
);

export const forgetPassPassword = createAsyncThunk(
  "profile/forgetPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await forgetPassword(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to email verification"
      );
    }
  }
);

export const resetPassPassword = createAsyncThunk(
  "profile/resetPassword",
  async (params, { rejectWithValue }) => {
    try {
      const response = await resetPassword(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to email verification"
      );
    }
  }
);

export const getJobAlerts = createAsyncThunk(
  "user/getJobAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getJobAlertsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch job alerts");
    }
  }
);

export const updateJobAlerts = createAsyncThunk(
  "user/updateJobAlerts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateJobAlertsApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to update job alerts");
    }
  }
);

export const getProfileCompletion = createAsyncThunk(
  "user/getProfileCompletion",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileCompletionApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch profile completion");
    }
  }
);

export const getQuickTemplates = createAsyncThunk(
  "user/getQuickTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getQuickTemplatesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch templates");
    }
  }
);

export const createQuickTemplate = createAsyncThunk(
  "user/createQuickTemplate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createQuickTemplateApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to create template");
    }
  }
);

export const updateQuickTemplate = createAsyncThunk(
  "user/updateQuickTemplate",
  async ({ templateId, data }, { rejectWithValue }) => {
    try {
      const response = await updateQuickTemplateApi(templateId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to update template");
    }
  }
);

export const deleteQuickTemplate = createAsyncThunk(
  "user/deleteQuickTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await deleteQuickTemplateApi(templateId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to delete template");
    }
  }
);

export const getSavedSearches = createAsyncThunk(
  "user/getSavedSearches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSavedSearchesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch saved searches");
    }
  }
);

export const saveSavedSearch = createAsyncThunk(
  "user/saveSavedSearch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await saveSavedSearchApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to save search");
    }
  }
);

export const deleteSavedSearch = createAsyncThunk(
  "user/deleteSavedSearch",
  async (searchId, { rejectWithValue }) => {
    try {
      const response = await deleteSavedSearchApi(searchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to delete saved search");
    }
  }
);

export const getSkillGapInsights = createAsyncThunk(
  "user/getSkillGapInsights",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getSkillGapInsightsApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch skill gap insights");
    }
  }
);

export const getRecruiterStats = createAsyncThunk(
  "user/getRecruiterStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRecruiterStatsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch recruiter stats");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // Store token regardless of verification status to allow login
        // User will be prompted to verify email but can still access the app
        if (action?.payload?.token) {
          localStorage.setItem("token", action?.payload?.token);
          if (action?.payload?.user?.profile?.profilePhoto?.url) {
            localStorage.setItem(
              "profile",
              action?.payload?.user?.profile?.profilePhoto?.url
            );
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch search history
      .addCase(getUserSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSearchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.searchHistory = action.payload;
      })
      .addCase(getUserSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear search history
      .addCase(clearUserSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserSearchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.searchHistory = [];
        state.message = action.payload;
      })
      .addCase(clearUserSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        const payloadUser = action.payload?.data?.user;
        if (!state.user) {
          state.user = payloadUser || {};
        }
        if (state.user && !state.user.profile) {
          state.user.profile = {};
        }
        
        if (payloadUser?.fullname) {
          state.user.fullname = payloadUser.fullname;
        }
        if (payloadUser?.email) {
          state.user.email = payloadUser.email;
        }
        if (payloadUser?.profile?.bio !== undefined) {
          state.user.profile.bio = payloadUser.profile.bio;
        }
        if (payloadUser?.profile?.skills !== undefined) {
          state.user.profile.skills = payloadUser.profile.skills;
        }
        if (payloadUser?.profile?.resume !== undefined) {
          state.user.profile.resume = payloadUser.profile.resume;
        }
        if (payloadUser?.profile?.profilePhoto !== undefined) {
          state.user.profile.profilePhoto = payloadUser.profile.profilePhoto;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recommended jobs
      .addCase(getRecommendedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommended = action.payload;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recommended jobs
      .addCase(getSearchResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchResult.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
      })
      .addCase(getSearchResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgetPassPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.message;
      })
      .addCase(forgetPassPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.message;
      })
      .addCase(resetPassPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Job alerts
      .addCase(getJobAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.jobAlerts = action.payload.jobAlerts;
      })
      .addCase(getJobAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJobAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.jobAlerts = action.payload.jobAlerts;
      })
      .addCase(updateJobAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile completion
      .addCase(getProfileCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.profileCompletion = action.payload;
      })
      .addCase(getProfileCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Quick templates
      .addCase(getQuickTemplates.fulfilled, (state, action) => {
        state.quickTemplates = action.payload.templates || [];
      })
      .addCase(createQuickTemplate.fulfilled, (state, action) => {
        state.quickTemplates = action.payload.templates || [];
      })
      .addCase(updateQuickTemplate.fulfilled, (state, action) => {
        state.quickTemplates = action.payload.templates || [];
      })
      .addCase(deleteQuickTemplate.fulfilled, (state, action) => {
        state.quickTemplates = action.payload.templates || [];
      })
      // Saved searches
      .addCase(getSavedSearches.fulfilled, (state, action) => {
        state.savedSearches = action.payload.savedSearches || [];
      })
      .addCase(saveSavedSearch.fulfilled, (state, action) => {
        state.savedSearches = action.payload.savedSearches || [];
      })
      .addCase(deleteSavedSearch.fulfilled, (state, action) => {
        state.savedSearches = action.payload.savedSearches || [];
      })
      // Skill gap insights
      .addCase(getSkillGapInsights.fulfilled, (state, action) => {
        state.skillGapInsights = action.payload;
      })
      .addCase(getSkillGapInsights.rejected, (state) => {
        state.skillGapInsights = null;
      })
      // Recruiter stats
      .addCase(getRecruiterStats.fulfilled, (state, action) => {
        state.recruiterStats = action.payload.stats;
      });
  },
});

// Export actions
export const { clearErrors, clearMessage } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
