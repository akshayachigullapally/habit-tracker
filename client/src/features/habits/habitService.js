import axios from 'axios';

const API_URL = '/api/habits/';

// Create a new habit
const createHabit = async (habitData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(API_URL, habitData, config);
  return response.data;
};

// Get all habits
const getHabits = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get habit by ID
const getHabitById = async (habitId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(API_URL + habitId, config);
  return response.data;
};

// Update habit
const updateHabit = async (habitId, habitData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(API_URL + habitId, habitData, config);
  return response.data;
};

// Delete habit
const deleteHabit = async (habitId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(API_URL + habitId, config);
  return response.data;
};

// Complete habit
const completeHabit = async (habitId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(API_URL + habitId + '/complete', {}, config);
  return response.data;
};

// Get habit stats
const getHabitStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

const habitService = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitStats
};

export default habitService;