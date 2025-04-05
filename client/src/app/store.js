import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import habitReducer from '../features/habits/habitSlice';
// Import any other reducers you have
import rewardReducer from '../features/rewards/rewardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    // Include any other reducers
    rewards: rewardReducer  // Make sure this is included
  },
});