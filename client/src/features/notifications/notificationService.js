import axios from 'axios';

const API_URL = '/api/notifications';

// Get user notifications
const getNotifications = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Mark all notifications as read
const markAllAsRead = async () => {
  const response = await axios.put(`${API_URL}/mark-read`);
  return response.data;
};

// Mark notification as read
const markAsRead = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/mark-read`);
  return response.data;
};

// Delete a notification
const deleteNotification = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Delete all read notifications
const deleteReadNotifications = async () => {
  const response = await axios.delete(`${API_URL}/read`);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  deleteReadNotifications,
};

export default notificationService;