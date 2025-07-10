import React, { useState, useEffect, useContext, useRef } from 'react';
// Corrected: Only one import for ThemeContext
import { ThemeContext } from '../ThemeContext';

// Props are expected: PatternVisualization (component) and chartPatterns (object)
const PatternRecognitionGame = ({ PatternVisualization, chartPatterns }) => {
  const { theme } = useContext(ThemeContext);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentCorrectPattern, setCurrentCorrectPattern] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // Current question index (0-9 for 10 questions)
  const [totalQuestions] = useState(10);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false); // Control visibility of feedback
  const [feedbackType, setFeedbackType] = useState(''); // 'correct' or 'incorrect'
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // The pattern name string of the selected option
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Use allPatternNames derived from the passed chartPatterns prop
  // Ensure chartPatterns is defined before trying to get its keys
  const allPatternNames = chartPatterns ? Object.keys(chartPatterns) : [];

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const formatPatternName = (name) => {
    // Add a check for undefined or null name, which can happen if a pattern is not found
    if (!name) return "Unknown Pattern";
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const loadNextQuestion = () => {
    // questionNumber is 0-indexed internally for logic (0 to totalQuestions-1)
    // This condition means if we've already processed `totalQuestions` number of questions.
    if (questionNumber >= totalQuestions) {
      setGameOver(true);
      return;
    }

    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setFeedback('');
    setShowFeedback(false);
    setFeedbackType('');

    // 1. Select a random correct pattern
    if (allPatternNames.length === 0) {
        console.error("Pattern Recognition Game: No patterns available to choose from in chartPatterns prop.");
        setFeedback("Error: No patterns loaded for the game.");
        setShowFeedback(true);
        setFeedbackType('incorrect'); // Treat as an error state
        setGameOver(true);
        return;
    }
    const correctPatternName = allPatternNames[Math.floor(Math.random() * allPatternNames.length)];
    setCurrentCorrectPattern({
        name: correctPatternName,
        ...chartPatterns[correctPatternName]
    });

    // 2. Generate multiple-choice options (3 distractors + 1 correct)
    let currentOptions = [correctPatternName];
    while (currentOptions.length < 4) {
      const randomDistractorName = allPatternNames[Math.floor(Math.random() * allPatternNames.length)];
      if (!currentOptions.includes(randomDistractorName)) {
        currentOptions.push(randomDistractorName);
      }
    }
    setOptions(shuffleArray(currentOptions));
    // `questionNumber` state is updated by `handleNextQuestion` or `startGame` for the first question.
    // Here, we are just loading the data for the question index `questionNumber`.
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setQuestionNumber(0); // Reset to the first question index
    setGameOver(false);
    setFeedback('');
    loadNextQuestion();
  };

  const handleAnswer = (selectedOptionName) => {
    if (isAnswerChecked) return; // Prevent multiple checks for the same question

    setSelectedAnswer(selectedOptionName);
    setIsAnswerChecked(true);

    if (currentCorrectPattern && selectedOptionName === currentCorrectPattern.name) {
      setScore(prevScore => prevScore + 1);
      setFeedback(`Correct! This is a ${formatPatternName(currentCorrectPattern.name)}.`);
      setFeedbackType('correct');
    } else {
      setFeedback(`Not quite! This is a ${formatPatternName(selectedOptionName)}. The correct answer was ${currentCorrectPattern ? formatPatternName(currentCorrectPattern.name) : 'N/A'}.`);
      setFeedbackType('incorrect');
    }

    // If it's the last question (e.g. questionNumber is 9 for 10 questions)
    // (questionNumber is 0-indexed, so compare with totalQuestions - 1)
    if (questionNumber >= totalQuestions - 1) {
        setTimeout(() => {
            setGameOver(true);
        }, 2500); // Allow time to read feedback
    }
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions - 1) {
        setQuestionNumber(prev => prev + 1); // Move to next question index
        // loadNextQuestion will be triggered by useEffect watching questionNumber, or call directly
        loadNextQuestion();
    } else {
        setGameOver(true);
    }
  };

  // Load question data when questionNumber changes (and game has started)
  useEffect(() => {
    if (gameStarted && !gameOver && questionNumber < totalQuestions) {
      // This effect might be redundant if loadNextQuestion is called directly by startGame and handleNextQuestion
      // However, it ensures that if questionNumber changes externally, the question loads.
      // For now, let's rely on direct calls.
    }
  }, [questionNumber, gameStarted, gameOver, totalQuestions]);

  // Styles
  const gameContainerStyle = {
    padding: '20px',
    margin: '20px auto',
    maxWidth: '700px',
    backgroundColor: theme === 'dark' ? '#2c3e50' : '#ffffff',
    color: theme === 'dark' ? '#ecf0f1' : '#2c3e50',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    border: `1px solid ${theme === 'dark' ? '#34495e' : '#e0e0e0'}`,
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    margin: '10px 5px',
    cursor: 'pointer',
    backgroundColor: theme === 'dark' ? '#3498db' : '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  };

  const optionButtonStyle = (isSelected) => ({
    ...buttonStyle,
    backgroundColor: isSelected ? (theme === 'dark' ? '#8e44ad' : '#9b59b6') : (theme === 'dark' ? '#566573' : '#7f8c8d'),
    width: 'calc(50% - 10px)', // Two buttons per row
    minHeight: '60px'
  });

  const feedbackStyle = {
    marginTop: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    minHeight: '24px'
  };

  if (!gameStarted) {
    return (
      <div style={gameContainerStyle}>
        <h2>Welcome to the Pattern Recognition Game!</h2>
        <p>Test your knowledge of stock chart patterns.</p>
        <p>You will be shown a pattern and you need to select the correct name from the options.</p>
        <button style={buttonStyle} onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={gameContainerStyle}>
        <h2>Game Over!</h2>
        <p>Your final score: {score} / {totalQuestions}</p>
        <button style={buttonStyle} onClick={startGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div style={gameContainerStyle}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Score: {score}</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Question: {questionNumber + 1} / {totalQuestions}</span>
      </div>

      {/* Current Pattern Visualization - Placeholder */}
      {/* <PatternVisualization patternName={currentQuestion ? currentQuestion.name : "loading..."} theme={theme} width={300} height={150} /> */}
      <div>Pattern Visualization will appear here.</div>


      <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Options Buttons - Placeholder */}
        {/* {options.map((option, index) => (
          <button
            key={index}
            style={optionButtonStyle(selectedAnswer === option)}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))} */}
        <p>Option buttons will appear here.</p>
      </div>

      {feedback && (
        <div style={{...feedbackStyle, color: feedback.startsWith("Correct") ? (theme === 'dark' ? '#2ecc71' : '#27ae60') : (theme === 'dark' ? '#e74c3c' : '#c0392b')}}>
          {feedback}
        </div>
      )}

      {selectedAnswer !== null && !gameOver && (
        // <button style={buttonStyle} onClick={loadNextQuestion}>Next Question</button> // Placeholder
        <p>Next Question button will appear here.</p>
      )}

      {/* Temporary way to end game for testing structure */}
      {questionNumber >= totalQuestions -1 && selectedAnswer !== null && (
         <button style={{...buttonStyle, backgroundColor: theme === 'dark' ? '#e67e22' : '#d35400'}} onClick={resetGame}>End Game (Temp)</button>
      )}
    </div>
  );
};

export default PatternRecognitionGame;
