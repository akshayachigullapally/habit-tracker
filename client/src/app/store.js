import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import habitReducer from '../features/habits/habitSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import achievementReducer from '../features/achievements/achievementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    notifications: notificationReducer,
    achievements: achievementReducer,
  },
});