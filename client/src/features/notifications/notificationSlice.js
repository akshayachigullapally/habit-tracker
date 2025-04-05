import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get user notifications
export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, thunkAPI) => {
    try {
      return await notificationService.markAllAsRead();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark a single notification as read
export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id, thunkAPI) => {
    try {
      return await notificationService.markAsRead(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, thunkAPI) => {
    try {
      return await notificationService.deleteNotification(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete all read notifications
export const deleteReadNotifications = createAsyncThunk(
  'notifications/deleteRead',
  async (_, thunkAPI) => {
    try {
      return await notificationService.deleteReadNotifications();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(notification => !notification.isRead).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        state.unreadCount = 0;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          notification => notification._id === action.payload._id
        );
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = state.notifications.filter(notification => !notification.isRead).length;
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const wasUnread = state.notifications.find(
          notification => notification._id === action.payload.id
        )?.isRead === false;
        
        state.notifications = state.notifications.filter(
          notification => notification._id !== action.payload.id
        );
        
        if (wasUnread) {
          state.unreadCount -= 1;
        }
      })
      .addCase(deleteReadNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.filter(
          notification => !notification.isRead
        );
      });
  },
});

export const { reset, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;