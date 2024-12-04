import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import jobReducer from './slice/jobSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer
  },
});

export default store;
