import React from 'react';
import HandGestureQuiz from '../components/HandGestureQuiz';

const Quiz = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Habit Knowledge Quiz</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test your knowledge about habit building with this interactive hand gesture quiz
        </p>
      </div>

      <HandGestureQuiz />
    </div>
  );
};

export default Quiz;