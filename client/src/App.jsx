import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import { getHabits } from './features/habits/habitSlice';
import { scheduleHabitReminders, checkNotificationPermission } from './utils/notificationService';
import { getNotifications } from './features/notifications/notificationSlice';

// Layout components
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';

// Protected pages
import Dashboard from './pages/Dashboard';
import HabitDetails from './pages/HabitDetails';
import HabitForm from './pages/HabitForm';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Achievements from './pages/Achievements';
import Notifications from './pages/Notifications';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost'; 
import Post from './pages/Post';
import Leaderboard from './pages/Leaderboard';
import Quiz from './pages/Quiz'; // Import the new Quiz page

// Components
import NotificationPopupManager from './components/NotificationPopupManager';
import LevelUpNotification from './components/LevelUpNotification';
import MysteryBox from './components/MysteryBox';

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { habits } = useSelector((state) => state.habits);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [prevLevel, setPrevLevel] = useState(user?.level || 1);
  
  // Check system preference and localStorage for dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else if (prefersDark) {
      setIsDarkMode(true);
    }
  }, []);
  
  // Update localStorage and apply class when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);
  
  // Check for level up
  useEffect(() => {
    if (user && user.level > prevLevel) {
      // Show level up notification
      setShowLevelUpNotification(true);
      setPrevLevel(user.level);
      
      // Hide notification after 15 seconds if not clicked
      const timer = setTimeout(() => {
        setShowLevelUpNotification(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [user?.level, prevLevel]);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  const handleOpenMysteryBox = () => {
    setShowMysteryBox(true);
    setShowLevelUpNotification(false); // Hide notification when box is opened
  };
  
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick={true}  // This ensures clicking anywhere on toast closes it
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={isDarkMode ? "dark" : "light"}
              closeButton={true}   // Ensure close button is visible
            />
            
            <NotificationPopupManager />
            
            {/* Level up notification and Mystery Box */}
            <LevelUpNotification 
              show={showLevelUpNotification} 
              onClick={handleOpenMysteryBox} 
              level={user?.level || 1}
            />
            
            <MysteryBox 
              isOpen={showMysteryBox} 
              onClose={() => setShowMysteryBox(false)} 
              level={user?.level || 1}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Route>
              
              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/habits/:id" element={
                  <ProtectedRoute>
                    <HabitDetails />
                  </ProtectedRoute>
                } />
                <Route path="/habits/new" element={
                  <ProtectedRoute>
                    <HabitForm />
                  </ProtectedRoute>
                } />
                <Route path="/habits/edit/:id" element={
                  <ProtectedRoute>
                    <HabitForm isEditMode={true} />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/achievements" element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } />
                <Route path="/community/new" element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } />
                <Route path="/community/post/:id" element={
                  <ProtectedRoute>
                    <Post />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
                <Route path="/quiz" element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
