import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAuthToken } from '../../api/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userDetailsResponse = await api.get(`/user/details?email=${email}`);
      const userDetails = userDetailsResponse.data;

      if (userDetails.status === 'inactive') {
        throw new Error('Your account is inactive. Please contact your admin.');
      }

      const response = await api.post('/user/login', { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      setAuthToken(token);

      return { token, userDetails };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      setAuthToken(null);
      state.user = null;
      state.token = null;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.userDetails;
        state.success = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
