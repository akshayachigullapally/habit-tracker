import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import habitService from './habitService';

const initialState = {
  habits: [],
  habit: null,
  stats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Create a new habit
export const createHabit = createAsyncThunk(
  'habits/create',
  async (habitData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.createHabit(habitData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all habits for a user
export const getHabits = createAsyncThunk(
  'habits/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.getHabits(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get a habit by ID
export const getHabitById = createAsyncThunk(
  'habits/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.getHabitById(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update a habit
export const updateHabit = createAsyncThunk(
  'habits/update',
  async ({ id, habitData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.updateHabit(id, habitData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a habit
export const deleteHabit = createAsyncThunk(
  'habits/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.deleteHabit(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Complete a habit
export const completeHabit = createAsyncThunk(
  'habits/complete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.completeHabit(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get habit stats
export const getHabitStats = createAsyncThunk(
  'habits/stats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await habitService.getHabitStats(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearHabit: (state) => {
      state.habit = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create habit
      .addCase(createHabit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habits.push(action.payload);
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get all habits
      .addCase(getHabits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habits = action.payload;
      })
      .addCase(getHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get habit by ID
      .addCase(getHabitById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHabitById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habit = action.payload;
      })
      .addCase(getHabitById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update habit
      .addCase(updateHabit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habits = state.habits.map(habit => 
          habit._id === action.payload._id ? action.payload : habit
        );
        state.habit = action.payload;
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete habit
      .addCase(deleteHabit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habits = state.habits.filter(habit => habit._id !== action.payload.id);
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Complete habit
      .addCase(completeHabit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.habits = state.habits.map(habit => 
          habit._id === action.payload.habit._id ? action.payload.habit : habit
        );
        state.habit = action.payload.habit;
      })
      .addCase(completeHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get habit stats
      .addCase(getHabitStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHabitStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getHabitStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearHabit } = habitSlice.actions;
export default habitSlice.reducer;