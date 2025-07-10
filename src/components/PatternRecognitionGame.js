import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

// Props are expected: PatternVisualization (component) and chartPatterns (object)
const PatternRecognitionGame = ({ PatternVisualization, chartPatterns }) => {
  const { theme } = useContext(ThemeContext);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentCorrectPattern, setCurrentCorrectPattern] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // 0-indexed internally
  const [totalQuestions] = useState(10);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const allPatternNames = chartPatterns ? Object.keys(chartPatterns) : [];

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
    if (!name) return "Unknown Pattern";
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const loadNextQuestion = () => {
    if (questionNumber >= totalQuestions) {
      setGameOver(true);
      return;
    }
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setFeedback('');
    setShowFeedback(false);
    setFeedbackType('');

    if (allPatternNames.length === 0) {
        console.error("Pattern Recognition Game: No patterns available to choose from in chartPatterns prop.");
        setFeedback("Error: No patterns loaded for the game.");
        setShowFeedback(true);
        setFeedbackType('incorrect');
        setGameOver(true);
        return;
    }
    const correctPatternName = allPatternNames[Math.floor(Math.random() * allPatternNames.length)];
    setCurrentCorrectPattern({
        name: correctPatternName,
        ...(chartPatterns ? chartPatterns[correctPatternName] : {})
    });

    let currentOptions = [correctPatternName];
    while (currentOptions.length < 4 && allPatternNames.length > currentOptions.length) {
      const randomDistractorName = allPatternNames[Math.floor(Math.random() * allPatternNames.length)];
      if (!currentOptions.includes(randomDistractorName)) {
        currentOptions.push(randomDistractorName);
      }
    }
    while (currentOptions.length < 4 && allPatternNames.length > 0) {
        currentOptions.push(allPatternNames[0]);
    }
    setOptions(shuffleArray(currentOptions));
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setQuestionNumber(0);
    setGameOver(false);
    setFeedback('');
    setShowFeedback(false);
    setFeedbackType('');
    loadNextQuestion();
  };

  const handleAnswer = (selectedOptionName) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(selectedOptionName);
    setIsAnswerChecked(true);
    setShowFeedback(true);

    if (currentCorrectPattern && selectedOptionName === currentCorrectPattern.name) {
      setScore(prevScore => prevScore + 1);
      setFeedback(`Correct! This is a ${formatPatternName(currentCorrectPattern.name)}.`);
      setFeedbackType('correct');
    } else {
      setFeedback(`Not quite! This is a ${formatPatternName(selectedOptionName)}. The correct answer was ${currentCorrectPattern ? formatPatternName(currentCorrectPattern.name) : 'N/A'}.`);
      setFeedbackType('incorrect');
    }

    if (questionNumber >= totalQuestions - 1) {
        setTimeout(() => {
            setGameOver(true);
        }, 2500);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = questionNumber + 1; // Calculate next index before setting state
    if (nextQuestionIndex < totalQuestions) {
        setQuestionNumber(nextQuestionIndex);
        // loadNextQuestion(); // useEffect will handle this due to questionNumber change
    } else {
        setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver ) { // Removed questionNumber > 0 to allow initial load if startGame didn't complete it
      loadNextQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumber, gameStarted, gameOver]); // Removed currentCorrectPattern, allPatternNames to avoid loops if they are stable.


  // Styles
   const gameContainerStyle = {
    padding: '30px',
    margin: '20px auto',
    maxWidth: '700px',
    backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
    color: theme === 'dark' ? '#e5e7eb' : '#111827',
    borderRadius: '16px',
    boxShadow: theme === 'dark'
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.07)',
    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif"
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: theme === 'dark' ? '#93c5fd' : '#3b82f6',
    marginBottom: '10px'
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: theme === 'dark' ? '#d1d5db' : '#4b5563',
    marginBottom: '25px',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    padding: '14px 28px',
    fontSize: '18px',
    margin: '10px 5px',
    cursor: 'pointer',
    backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease',
    fontWeight: '600',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
  };

  const optionButtonStyle = (optionName) => {
    let bgColor = theme === 'dark' ? '#4b5563' : '#9ca3af';
    let textColor = 'white';
    let border = `2px solid transparent`;

    if (isAnswerChecked) {
        if (currentCorrectPattern && optionName === currentCorrectPattern.name) {
            bgColor = theme === 'dark' ? '#10b981' : '#059669';
        } else if (optionName === selectedAnswer) {
            bgColor = theme === 'dark' ? '#ef4444' : '#dc2626';
        } else {
             bgColor = theme === 'dark' ? '#374151' : '#e5e7eb';
             textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
        }
    }
    return {
        ...buttonStyle,
        backgroundColor: bgColor,
        color: textColor,
        width: 'calc(50% - 12px)',
        minHeight: '70px',
        margin: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '1.3',
        border: border,
        boxShadow: isAnswerChecked && currentCorrectPattern && (optionName === currentCorrectPattern.name || optionName === selectedAnswer)
            ? `0 0 15px ${bgColor}`
            : '0 2px 4px rgba(0,0,0,0.05)'
    };
  };

  const feedbackContainerStyle = {
    marginTop: '25px',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: '600',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme === 'dark' ? '#111827' : '#ffffff',
    backgroundColor: feedbackType === 'correct'
      ? (theme === 'dark' ? '#10b981' : '#059669')
      : feedbackType === 'incorrect'
      ? (theme === 'dark' ? '#ef4444' : '#dc2626')
      : 'transparent',
    transition: 'all 0.3s ease-in-out',
    opacity: showFeedback ? 1 : 0,
    transform: showFeedback ? 'translateY(0)' : 'translateY(10px)',
  };

  const scoreHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: '10px',
    marginBottom: '25px'
  };

  const scoreTextStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: theme === 'dark' ? '#93c5fd' : '#3b82f6'
  };

  const progressTextStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: theme === 'dark' ? '#d1d5db' : '#4b5563'
  };

  if (!gameStarted) {
    return (
      <div style={gameContainerStyle}>
        <h2 style={titleStyle}>Pattern Recognition Challenge!</h2>
        <p style={descriptionStyle}>
          Welcome! Sharpen your technical analysis skills. You'll be shown a stock chart pattern.
          Your task is to identify it correctly from the given options. Good luck!
        </p>
        <button
          style={buttonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#60a5fa' : '#3b82f6'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#3b82f6' : '#2563eb'}
          onClick={startGame}
        >
          🚀 Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={gameContainerStyle}>
        <h2 style={{...titleStyle, fontSize: '32px', marginBottom: '20px'}}>🎉 Game Over! 🎉</h2>
        <p style={{...descriptionStyle, fontSize: '22px', fontWeight: '600'}}>
          Your final score: <span style={{color: theme === 'dark' ? '#86efac' : '#15803d'}}>{score}</span> / {totalQuestions}
        </p>
        <p style={descriptionStyle}>
            {score > totalQuestions / 2 ? "Great job! You've got a good eye for patterns." : "Keep practicing to improve your pattern recognition skills!"}
        </p>
        <button
          style={buttonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#60a5fa' : '#3b82f6'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#3b82f6' : '#2563eb'}
          onClick={startGame}
        >
          Play Again?
        </button>
      </div>
    );
  }

  return (
    <div style={gameContainerStyle}>
      <div style={scoreHeaderStyle}>
        <span style={scoreTextStyle}>Score: {score}</span>
        <span style={progressTextStyle}>Question: {questionNumber + 1} / {totalQuestions}</span>
      </div>

      {currentCorrectPattern && PatternVisualization && (
        <PatternVisualization
            patternName={currentCorrectPattern.name}
            theme={theme}
            width={400}
            height={220}
        />
      )}

      <p style={{...descriptionStyle, fontSize: '18px', fontWeight: '600', marginTop: '25px', marginBottom: '15px' }}>
        What pattern is this?
      </p>

      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0px' }}>
        {options.map((optionName, index) => (
          <button
            key={index}
            style={optionButtonStyle(optionName)}
            onClick={() => handleAnswer(optionName)}
            disabled={isAnswerChecked}
          >
            {formatPatternName(optionName)}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div style={feedbackContainerStyle}>
          {feedback}
        </div>
      )}

      {isAnswerChecked && !gameOver && questionNumber < totalQuestions - 1 && (
         <button
            style={{...buttonStyle, marginTop: '25px', backgroundColor: theme === 'dark' ? '#16a34a' : '#15803d'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#22c55e' : '#16a34a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#16a34a' : '#15803d'}
            onClick={handleNextQuestion}
        >
            Next Question ➔
        </button>
      )}

      {isAnswerChecked && questionNumber >= totalQuestions -1 && !gameOver && (
         <button
            style={{...buttonStyle, marginTop: '25px', backgroundColor: theme === 'dark' ? '#f97316' : '#ea580c'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#fb923c' : '#f97316'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#f97316' : '#ea580c'}
            onClick={() => setGameOver(true)}
        >
            Show Final Score 🏁
        </button>
      )}
    </div>
  );
};

export default PatternRecognitionGame;
