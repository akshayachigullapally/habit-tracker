import React from 'react';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaBell, 
  FaTrophy, 
  FaUserFriends, 
  FaCheck, 
  FaExclamationTriangle,
  FaComment,
  FaThumbsUp,
  FaTrash,
  FaEllipsisH
} from 'react-icons/fa';
import TimeAgo from '../components/TimeAgo';
import { 
  getNotifications, 
  markAsRead, 
  deleteNotification, 
  deleteReadNotifications, 
  markAllAsRead 
} from '../features/notifications/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  
  const { notifications, isLoading, isError, message } = useSelector(
    (state) => state.notifications
  );
  
  const [filter, setFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);
  
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    // Mark notifications as read when viewed
    if (notifications.some(notification => !notification.isRead)) {
      dispatch(markAllAsRead());
    }
  }, [dispatch, isError, message, notifications]);
  
  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
    setShowDropdown(null);
  };
  
  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
    toast.success('Notification deleted');
    setShowDropdown(null);
  };
  
  const handleClearAllRead = () => {
    dispatch(deleteReadNotifications());
    toast.success('Read notifications cleared');
  };
  
  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <FaTrophy className="text-amber-500" />;
      case 'social':
        return <FaUserFriends className="text-blue-500" />;
      case 'system':
        return <FaBell className="text-purple-500" />;
      case 'reminder':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'comment':
        return <FaComment className="text-green-500" />;
      case 'like':
        return <FaThumbsUp className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Stay updated with your habit progress and community interactions
          </p>
        </div>
        
        {notifications.some(notification => notification.isRead) && (
          <button
            onClick={handleClearAllRead}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center"
          >
            <FaTrash className="mr-1" size={12} />
            Clear Read
          </button>
        )}
      </div>
      
      {/* Filters */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setFilter('all')}
            className={`mr-6 py-4 px-1 text-sm font-medium border-b-2 ${
              filter === 'all' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`mr-6 py-4 px-1 text-sm font-medium border-b-2 ${
              filter === 'unread' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('achievement')}
            className={`mr-6 py-4 px-1 text-sm font-medium border-b-2 ${
              filter === 'achievement' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setFilter('social')}
            className={`mr-6 py-4 px-1 text-sm font-medium border-b-2 ${
              filter === 'social' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Social
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`mr-6 py-4 px-1 text-sm font-medium border-b-2 ${
              filter === 'system' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            System
          </button>
        </div>
      </div>
      
      {/* Notifications list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {filteredNotifications.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification._id} 
                    className={`relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              <TimeAgo date={notification.createdAt} />
                            </span>
                            
                            {/* Notification actions dropdown */}
                            <div className="relative ml-2">
                              <button
                                onClick={() => setShowDropdown(showDropdown === notification._id ? null : notification._id)}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full"
                              >
                                <FaEllipsisH size={14} />
                              </button>
                              
                              {showDropdown === notification._id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                                  {!notification.isRead && (
                                    <button
                                      onClick={() => handleMarkAsRead(notification._id)}
                                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <FaCheck className="mr-2" size={12} />
                                      Mark as read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteNotification(notification._id)}
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <FaTrash className="mr-2" size={12} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        
                        {notification.actionUrl && (
                          <Link 
                            to="/dashboard" 
                            className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {notification.actionText || 'View details'}
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {!notification.isRead && (
                      <span className="absolute top-4 right-4 h-2 w-2 bg-blue-600 rounded-full"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <FaBell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' 
                  ? "You're all caught up! You don't have any notifications right now."
                  : `You don't have any ${filter} notifications right now.`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;