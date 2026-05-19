import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerCompanyApi,
  getCompaniesApi,
  getCompanyByIdApi,
  updateCompanyApi,
  getJobsByCompanyApi,
  deleteCompanyApi,
} from "../actions/company.action";

/**
 * Thunk to register a new company.
 * Dispatches an API call and handles response or error.
 */
export const registerCompany = createAsyncThunk(
  "company/register",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await registerCompanyApi(companyData);
      return response.data; // Return registered company data from API
    } catch (error) {
      return rejectWithValue(error?.response?.data); // Return error response if API call fails
    }
  }
);

/**
 * Thunk to fetch all companies associated with the logged-in user.
 * Dispatches an API call to get all companies.
 */
export const getCompanies = createAsyncThunk(
  "company/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompaniesApi();
      return response.data; // Return list of companies from API
    } catch (error) {
      return rejectWithValue(error?.response?.data); // Return error response if API call fails
    }
  }
);

/**
 * Thunk to fetch a specific company by its ID.
 * Dispatches an API call to get company details by ID.
 */
export const getCompanyById = createAsyncThunk(
  "company/getById",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await getCompanyByIdApi(companyId);
      return response.data; // Return company data from API
    } catch (error) {
      return rejectWithValue(error?.response?.data); // Return error response if API call fails
    }
  }
);

/**
 * Thunk to fetch jobs by a specific company ID.
 * Dispatches an API call to get jobs related to the company.
 */
export const getJobsByCompany = createAsyncThunk(
  "company/getJobByCompanyId",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await getJobsByCompanyApi(companyId);
      return response.data; // Return jobs data from API
    } catch (error) {
      return rejectWithValue(error?.response?.data); // Return error response if API call fails
    }
  }
);

/**
 * Thunk to update a company's details.
 * Dispatches an API call to update a company's information.
 */
export const updateCompany = createAsyncThunk(
  "company/update",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const response = await updateCompanyApi(companyId, companyData);
      return response.data; // Return updated company data from API
    } catch (error) {
      return rejectWithValue(error?.response?.data); // Return error response if API call fails
    }
  }
);

/**
 * Thunk to delete a company's profile.
 * Dispatches an API call to delete a company.
 */
export const deleteCompany = createAsyncThunk(
  "company/delete",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await deleteCompanyApi(companyId);
      return { companyId, data: response.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Initial state for the company slice
const initialState = {
  companies: [], // Stores the list of all companies
  company: null, // Stores the data of the selected company
  loading: false, // Tracks the loading state for all async operations
  error: null, // Stores error messages if API calls fail
  message: null, // General message (if needed)
  success: false, // Indicates whether an action was successful
};

/**
 * Redux slice for managing company-related state and actions.
 * Includes reducers for clearing errors and messages.
 * Extra reducers handle async thunks for interacting with the API.
 */
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    // Clear any existing error messages
    clearErrors: (state) => {
      state.error = null;
    },
    // Clear any success or general messages
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle registration of a new company
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false; // Reset success flag
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload); // Add new company to the companies list
        state.success = true; // Indicate success
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message if registration fails
      })

      // Handle fetching all companies
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies || []; // Populate companies list
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message if fetching fails
      })

      // Handle fetching a company by ID
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null; // Set the selected company
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message if fetching fails
      })

      // Handle fetching jobs by company ID
      .addCase(getJobsByCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobsByCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = {
          ...state.company,
          jobs: action.payload.jobs || [], // Add jobs data to the selected company
        };
      })
      .addCase(getJobsByCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message if fetching fails
      })

      // Handle updating a company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false; // Reset success flag
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null; // Update the company with new data
        state.success = true; // Indicate success
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message if updating fails
      })

      // Handle deleting a company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (c) => c._id !== action.payload.companyId
        );
        state.success = true;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions for clearing errors and messages
export const { clearErrors, clearMessage } = companySlice.actions;

// Export the reducer to be used in the store
export default companySlice.reducer;
