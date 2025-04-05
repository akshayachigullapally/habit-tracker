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
import CreateHabit from './pages/CreateHabit';
import EditHabit from './pages/EditHabit';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import Community from './pages/Community';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { habits } = useSelector((state) => state.habits);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Initialize notifications when app loads if user is logged in
  useEffect(() => {
    if (user) {
      dispatch(getHabits()).then(result => {
        if (result.payload && !result.error) {
          checkNotificationPermission().then(granted => {
            if (granted) {
              scheduleHabitReminders(result.payload);
            }
          });
        }
      });
    }
  }, [dispatch, user]);

  // Request notification permissions as soon as app loads
  useEffect(() => {
    checkNotificationPermission().then(granted => {
      console.log('Notification permission:', granted ? 'granted' : 'denied');
    });
  }, []);
  
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
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={isDarkMode ? "dark" : "light"}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
                <Route path="/reset-password/:token" element={user ? <Navigate to="/dashboard" /> : <ResetPassword />} />
              </Route>
              
              {/* Protected Routes */}
              <Route element={<Layout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />}>
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/habits/new" element={user ? <CreateHabit /> : <Navigate to="/login" />} />
                <Route path="/habits/:id" element={user ? <HabitDetails /> : <Navigate to="/login" />} />
                <Route path="/habits/:id/edit" element={user ? <EditHabit /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/achievements" element={user ? <Achievements /> : <Navigate to="/login" />} />
                <Route path="/community" element={user ? <Community /> : <Navigate to="/login" />} />
                <Route path="/community/post/:id" element={user ? <Post /> : <Navigate to="/login" />} />
                <Route path="/community/new" element={user ? <CreatePost /> : <Navigate to="/login" />} />
                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
