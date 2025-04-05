import axios from 'axios';

const API_URL = '/api/achievements';

// Get all achievements
const getAchievements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Check achievement progress (triggers server to check if any achievements are completed)
const checkAchievements = async () => {
  const response = await axios.post(`${API_URL}/check`);
  return response.data;
};

const achievementService = {
  getAchievements,
  checkAchievements,
};

export default achievementService;