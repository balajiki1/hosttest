import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Async actions
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await api.get('/jobs');
  return response.data;
});

export const addJob = createAsyncThunk('jobs/addJob', async (jobData) => {
  const response = await api.post('/jobs/create', jobData);
  return response.data;
});

export const editJob = createAsyncThunk('jobs/editJob', async ({ jobId, jobData }) => {
  await api.put(`/jobs/${jobId}`, jobData);
  return { jobId, jobData };
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (jobId) => {
  await api.delete(`/jobs/${jobId}`);
  return jobId;
});

// Job slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(editJob.fulfilled, (state, action) => {
        const { jobId, jobData } = action.payload;
        const index = state.jobs.findIndex((job) => job.jobId === jobId);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], ...jobData };
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.jobId !== action.payload);
      });
  },
});

export default jobSlice.reducer;
