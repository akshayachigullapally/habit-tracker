import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getHabits, completeHabit } from '../features/habits/habitSlice';
import { toast } from 'react-toastify';
import { FaPlus, FaCalendarAlt, FaTrophy, FaFire } from 'react-icons/fa';
import HabitCard from '../components/HabitCard';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { habits, isLoading } = useSelector((state) => state.habits);
  const { user } = useSelector((state) => state.auth);

  const [view, setView] = useState('daily');
  const [completingHabit, setCompletingHabit] = useState(null);

  const safeHabits = Array.isArray(habits) ? habits : [];

  useEffect(() => {
    dispatch(getHabits());
  }, [dispatch]);

  const handleComplete = async (habitId) => {
    setCompletingHabit(habitId);
    try {
      const result = await dispatch(completeHabit(habitId)).unwrap();
      toast.success(`+${result.xpGained} XP! Habit completed 🎉`);
    } catch (error) {
      toast.error(error || 'Failed to complete habit');
    } finally {
      setCompletingHabit(null);
    }
  };

  const filterHabits = () => {
    if (view === 'daily') return safeHabits;

    return safeHabits.filter(habit => {
      if (view === 'weekly' && habit.frequency === 'weekly') return true;
      if (view === 'important' && habit.priority === 'high') return true;
      return false;
    });
  };

  const filteredHabits = filterHabits();

  const totalHabits = safeHabits.length;
  const completedToday = safeHabits.filter(habit =>
    habit.completionHistory?.some(entry => {
      const entryDate = new Date(entry.date);
      const today = new Date();
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      );
    })
  );

  const completionRate =
    totalHabits > 0
      ? Math.round((completedToday.length / totalHabits) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your habits and build consistency
          </p>
        </div>

        <Link
          to="/habits/new"
          className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
        >
          <FaPlus className="mr-2" />
          Add New Habit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Today's Progress"
          value={`${completedToday.length}/${totalHabits}`}
          description={`${completionRate}% complete`}
          icon={<FaCalendarAlt className="text-blue-600 dark:text-blue-400" />}
          color="blue"
          progress={completionRate}
        />
        <StatsCard
          title="Current Streak"
          value={`${user?.currentStreak || 0} days`}
          description="Keep going!"
          icon={<FaFire className="text-orange-500" />}
          color="orange"
        />
        <StatsCard
          title="Level"
          value={user?.level || 1}
          description={`${user?.experience || 0}/${(user?.level || 1) * 100} XP`}
          icon={<FaTrophy className="text-amber-500" />}
          color="amber"
          progress={
            ((user?.experience || 0) / ((user?.level || 1) * 100)) * 100
          }
        />
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {['daily', 'weekly', 'important'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 font-medium text-sm ${
              view === v
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onComplete={handleComplete}
              isCompleting={completingHabit === habit._id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
            No habits yet!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {view === 'daily'
              ? "You haven't created any habits yet. Get started by adding your first habit!"
              : view === 'weekly'
              ? "You don't have any weekly habits. Try changing the frequency when creating a new habit."
              : "You don't have any high priority habits. You can set priorities when creating or editing habits."}
          </p>
          <Link
            to="/habits/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
          >
            <FaPlus className="mr-2" />
            Add Your First Habit
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
