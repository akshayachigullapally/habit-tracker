import React from 'react';

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaHome, 
  FaPlus, 
  FaUser, 
  FaTrophy, 
  FaUsers, 
  FaBell, 
  FaCog,
  FaTimes,
  FaChartLine
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Calculate progress to next level
  const currentXP = user?.experience || 0;
  const requiredXP = (user?.level || 1) * 100;
  const progressPercentage = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-30 transition-transform duration-300 transform w-64 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">HabitQuest</h2>
          <button onClick={onClose} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaTimes />
          </button>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
              ) : (
                <span className="text-xl font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{user?.username || 'User'}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">Level {user?.level || 1}</div>
            </div>
          </div>
          
          {/* XP Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
              <span>XP: {currentXP}/{requiredXP}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded">
              <div 
                className="bg-blue-500 h-2 rounded" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <FaHome className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/habits"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <FaPlus className="w-5 h-5 mr-3" />
                Habits
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/achievements"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <FaTrophy className="w-5 h-5 mr-3" />
                Achievements
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <FaUsers className="w-5 h-5 mr-3" />
                Community
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <FaUser className="w-5 h-5 mr-3" />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <FaCog className="w-5 h-5 mr-3" />
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Gamified Habit Tracker v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;