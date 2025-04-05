import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { toast } from 'react-toastify';
import { FaHandPaper, FaQuestionCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addXp } from '../features/auth/authSlice';

const HandGestureQuiz = () => {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [gestureHoldTime, setGestureHoldTime] = useState(0);
  const gestureTimerRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const stableFingerCountRef = useRef(0);
  const frameCountRef = useRef(0);

  // Quiz questions
  const quizQuestions = [
    {
      question: "What's the primary benefit of habit tracking?",
      options: [
        "Impressing others",
        "Building consistency",
        "Earning virtual rewards only",
        "Taking more time in your day"
      ]
    },
    {
      question: "How does gamification improve habit formation?",
      options: [
        "By increasing motivation through rewards",
        "By making habits more complex",
        "By removing the need for discipline",
        "By replacing habits with games"
      ]
    },
    {
      question: "What feature helps most with accountability?",
      options: [
        "Colorful interface",
        "Premium subscription",
        "Community support",
        "Automatic tracking"
      ]
    },
    {
      question: "Which tracking method is most effective for new habits?",
      options: [
        "Tracking only when you remember",
        "Daily consistent tracking",
        "Monthly reviews",
        "No tracking at all"
      ]
    },
    {
      question: "What's a key element of successful habit formation?",
      options: [
        "Setting extremely difficult goals",
        "Changing many habits at once",
        "Starting with small, achievable steps",
        "Focusing only on results, not process"
      ]
    }
  ];

  // Static correct answers (0-based index)
  const correctAnswers = [1, 0, 2, 1, 2]; // B, A, C, B, C

  // Load the handpose model
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      try {
        const loadedModel = await handpose.load();
        setModel(loadedModel);
        toast.success("Hand detection model loaded!");
        setIsModelLoading(false);
      } catch (error) {
        console.error("Could not load hand model:", error);
        toast.error("Failed to load hand detection");
        setIsModelLoading(false);
      }
    };

    tf.ready().then(() => {
      loadModel();
    });

    return () => {
      if (gestureTimerRef.current) {
        clearInterval(gestureTimerRef.current);
      }
    };
  }, []);

  // Start webcam and hand detection
  const startQuiz = () => {
    setIsWebcamActive(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setIsSelecting(false);
    setGestureHoldTime(0);
    stableFingerCountRef.current = 0;
    frameCountRef.current = 0;
    
    // Clear any existing interval
    if (gestureTimerRef.current) {
      clearInterval(gestureTimerRef.current);
    }
    
    // Start detection loop
    gestureTimerRef.current = setInterval(() => {
      detectHands();
    }, 100);
  };

  // Detect hands and process gestures
  const detectHands = async () => {
    if (!model || 
        !webcamRef.current || 
        !webcamRef.current.video || 
        webcamRef.current.video.readyState !== 4 || 
        isSelecting || 
        quizCompleted) {
      return;
    }

    try {
      frameCountRef.current++;
      
      // Only run detection every 2 frames for performance
      if (frameCountRef.current % 2 !== 0) return;
      
      const video = webcamRef.current.video;
      const predictions = await model.estimateHands(video);

      if (predictions.length > 0) {
        // Get hand landmarks
        const landmarks = predictions[0].landmarks;
        
        // Count fingers
        const count = countFingers(landmarks);
        
        // Update finger count display
        setFingerCount(count);
        
        // Only process valid finger counts (1-4)
        if (count >= 1 && count <= 4) {
          // Update selected option
          setSelectedOption(count - 1);
          
          // If finger count is stable, increment the hold time
          if (count === stableFingerCountRef.current) {
            setGestureHoldTime(prev => {
              // Increment by 0.1 seconds (assuming 100ms interval)
              const newValue = prev + 0.1;
              
              // If we've held the pose for 2 seconds, select the option
              if (newValue >= 2 && !isSelecting) {
                console.log(`Selecting option ${count} after stable hold`);
                setIsSelecting(true);
                selectAnswer(count - 1);
              }
              
              return newValue;
            });
          } else {
            // Finger count changed - reset stability counter
            stableFingerCountRef.current = count;
            setGestureHoldTime(0);
          }
        } else {
          // Invalid finger count - reset everything
          setSelectedOption(null);
          setGestureHoldTime(0);
        }
      } else {
        // No hand detected - reset all
        setFingerCount(0);
        setSelectedOption(null);
        setGestureHoldTime(0);
      }
    } catch (error) {
      console.error("Error in hand detection:", error);
    }
  };

  // Count fingers from hand landmarks
  const countFingers = (landmarks) => {
    // Get fingertip and middle knuckle positions
    const fingertips = [4, 8, 12, 16, 20]; 
    const middleJoints = [2, 6, 10, 14, 18]; // Using PIP joints for better comparison
    
    // Count extended fingers
    let extendedFingers = 0;
    
    // For each finger
    for (let i = 0; i < 5; i++) {
      const fingertip = landmarks[fingertips[i]];
      const middleJoint = landmarks[middleJoints[i]];
      
      // Check if finger is extended (y-coordinate is less than middle joint)
      // For thumb (i=0), we check differently as it extends sideways
      if (i === 0) {
        // Thumb is extended if it's far enough from the palm
        const palmPosition = landmarks[0];
        const distance = Math.sqrt(
          Math.pow(fingertip[0] - palmPosition[0], 2) +
          Math.pow(fingertip[1] - palmPosition[1], 2)
        );
        
        // Adjust threshold based on your testing
        if (distance > 60) {
          extendedFingers++;
        }
      } else if (fingertip[1] < middleJoint[1] - 20) { // Add some threshold for stability
        extendedFingers++;
      }
    }
    
    return Math.min(extendedFingers, 4); // Cap at 4 for quiz purposes
  };

  // Select an answer and move to next question
  const selectAnswer = (optionIndex) => {
    // Store the answer
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    // Reset for next question
    setGestureHoldTime(0);
    
    // Check if quiz is complete
    if (currentQuestion >= quizQuestions.length - 1) {
      // Pass the updated answers to completeQuiz
      completeQuiz(newAnswers);
    } else {
      // Show toast notification
      const letter = String.fromCharCode(65 + optionIndex);
      toast.info(`Option ${letter} selected!`, {
        position: "top-center",
        autoClose: 1000
      });
      
      // Add a delay before moving to next question
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsSelecting(false); // Re-enable selection for next question
      }, 1500);
    }
  };

  // Complete the quiz
  const completeQuiz = (finalAnswers) => {
    // Use the passed answers or fall back to state
    const answersToUse = finalAnswers || answers;
    
    // Calculate score with the complete answers
    const score = calculateScore(answersToUse);
    
    // Award XP based on score (10 XP per correct answer)
    const xpEarned = score * 10;
    dispatch(addXp(xpEarned));
    
    // Update answers state if using finalAnswers
    if (finalAnswers) {
      setAnswers(finalAnswers);
    }
    
    // Set quiz completed first to ensure proper rendering
    setQuizCompleted(true);
    setIsWebcamActive(false);
    
    // Clear detection interval
    if (gestureTimerRef.current) {
      clearInterval(gestureTimerRef.current);
      gestureTimerRef.current = null;
    }
    
    // Show toast with score and XP earned
    toast.success(`Quiz completed! You earned ${xpEarned} XP!`);
    
    console.log("Quiz completed! Score:", score, "XP earned:", xpEarned);
  };

  // Calculate score
  const calculateScore = (answersArray = answers) => {
    return answersArray.reduce((score, answer, index) => {
      return score + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);
  };

  // Get letter for option (0 = A, 1 = B, etc.)
  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  // Render quiz completion screen
  const renderQuizComplete = () => {
    const score = calculateScore();
    const totalQuestions = quizQuestions.length;
    const xpEarned = score * 10;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center animate-fade-in">
        <div className="text-3xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your score: <span className="font-bold text-blue-600 dark:text-blue-400">{score}/{totalQuestions}</span>
        </p>
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${(score/totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          <span className="font-bold text-green-600 dark:text-green-400">+{xpEarned} XP</span> earned!
        </div>
        
        {/* Show correct answers */}
        <div className="mt-6 mb-6 text-left">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Correct Answers:</h3>
          <div className="space-y-2">
            {quizQuestions.map((q, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs
                  ${answers[i] === correctAnswers[i] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {answers[i] === correctAnswers[i] ? '✓' : '✗'}
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm truncate">{q.question}</span>
                <span className="ml-2 text-sm font-medium">
                  Answer: {getOptionLetter(correctAnswers[i])}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => {
            setAnswers([]);
            setCurrentQuestion(0);
            setQuizCompleted(false);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  };

  // Render quiz question with webcam
  const renderQuizQuestion = () => {
    // Make sure currentQuestion is valid
    if (currentQuestion < 0 || currentQuestion >= quizQuestions.length) {
      return <div>Loading questions...</div>;
    }
    
    const question = quizQuestions[currentQuestion];
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Webcam area */}
        <div className="relative bg-black h-72 flex justify-center">
          {isWebcamActive ? (
            <Webcam
              ref={webcamRef}
              mirrored={true}
              screenshotFormat="image/jpeg"
              className="h-full w-auto"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-white">
              <div className="text-center">
                <FaHandPaper className="mx-auto text-5xl mb-4 text-gray-400" />
                <p className="mb-6">We'll use your webcam to detect hand gestures</p>
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isModelLoading}
                >
                  {isModelLoading ? "Loading..." : "Start Quiz"}
                </button>
              </div>
            </div>
          )}
          
          {/* Finger count indicator */}
          {isWebcamActive && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg flex items-center">
              <span>Fingers: {fingerCount}</span>
              <div className="ml-2 h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(gestureHoldTime/2) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Question area */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestion + 1}/{quizQuestions.length}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {question.question}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div 
                key={index}
                className={`p-4 border rounded-lg flex items-center ${
                  selectedOption === index 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 font-medium">
                  {getOptionLetter(index)}
                </div>
                <span className="text-gray-800 dark:text-white">{option}</span>
                {selectedOption === index && (
                  <div className="ml-auto">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaQuestionCircle className="mr-2" />
            <span>Show 1-4 fingers to select options A-D, hold for 2 seconds to confirm</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Hand Gesture Quiz
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Control this quiz using hand gestures! Show 1-4 fingers to select an answer.
      </p>

      {isModelLoading && !quizCompleted ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          <p className="ml-3 text-gray-600 dark:text-gray-400">Loading hand detection model...</p>
        </div>
      ) : quizCompleted ? renderQuizComplete() : renderQuizQuestion()}
      {console.log("Quiz state:", {
  isModelLoading, 
  quizCompleted,
  answersLength: answers.length,
  questionsLength: quizQuestions.length
})}
    </div>
  );
};

export default HandGestureQuiz;