import React, { useState, useEffect } from 'react';

// Props are expected: PatternVisualization (component) and chartPatterns (object)
const PatternRecognitionGame = ({ PatternVisualization, chartPatterns }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentCorrectPattern, setCurrentCorrectPattern] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // 0-indexed internally, for logic
  const [totalQuestions] = useState(10);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(''); // 'correct' or 'incorrect'
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Assuming theme is handled by global CSS variables now, so no direct theme context needed here for component's own styles.
  // The 'theme' prop passed to PatternVisualization is for its internal canvas drawing logic if it still uses it.
  // For this component, we'll rely on CSS variables set in index.css.

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
        console.error("Pattern Recognition Game: No patterns available.");
        setFeedback("Error: No patterns loaded.");
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
     while (currentOptions.length < 4 && currentOptions.length < allPatternNames.length) {
        const distractor = allPatternNames.find(pn => !currentOptions.includes(pn));
        if (distractor) currentOptions.push(distractor);
        else break; // Should not happen if allPatternNames.length >=4
    }
     while (currentOptions.length < 4 && allPatternNames.length > 0) { // Fallback if not enough unique
        currentOptions.push(allPatternNames[0]); // Just push first one to fill, will be duplicates
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

    if (questionNumber >= totalQuestions - 1) { // If it's the last question
        setTimeout(() => {
            setGameOver(true); // Automatically go to game over after showing feedback
        }, 2500); // Delay to allow user to see feedback
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = questionNumber + 1;
    if (nextQuestionIndex < totalQuestions) {
        setQuestionNumber(nextQuestionIndex);
    } else {
        setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      loadNextQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumber, gameStarted, gameOver]);


   const gameContainerStyle = {
    padding: 'var(--container-padding, 30px)',
    margin: 'var(--section-gap, 20px) auto',
    maxWidth: '700px',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    borderRadius: 'var(--app-border-radius, 16px)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--app-border)',
    textAlign: 'center',
    fontFamily: 'var(--font-family-sans-serif)'
  };

  const titleStyle = {
    fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
    fontWeight: '700',
    color: 'var(--primary-accent-darker)',
    marginBottom: 'var(--element-gap, 10px)'
  };

  const descriptionStyle = {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    color: 'var(--text-color-light)',
    marginBottom: 'var(--section-gap, 25px)',
    lineHeight: '1.6'
  };

  const baseButtonStyle = {
    padding: '12px 24px',
    fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
    margin: '10px 5px',
    cursor: 'pointer',
    color: 'var(--button-primary-text)',
    border: 'none',
    borderRadius: 'var(--app-border-radius-small, 8px)',
    transition: 'var(--app-transition, all 0.2s ease-in-out)',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const primaryButtonStyle = { // For Start Game, Play Again
    ...baseButtonStyle,
    backgroundColor: 'var(--primary-accent)',
  };
   const primaryButtonHoverStyle = { // For JS-driven hover (not ideal, prefer CSS)
    backgroundColor: 'var(--primary-accent-darker)',
  };

  const successButtonStyle = { // For "Next Question"
    ...baseButtonStyle,
    backgroundColor: 'var(--success-color)', // Solid color
  };
   const successButtonHoverStyle = {
    backgroundColor: 'var(--success-darker, #12693E)', // Need to define --success-darker or use a calculated one
  };

  const warningButtonStyle = { // For "Show Final Score"
    ...baseButtonStyle,
    backgroundColor: 'var(--warning-color)', // Solid color
    color: 'var(--warning-text-color)' // Ensure contrast if background is light
  };
   const warningButtonHoverStyle = {
    backgroundColor: 'var(--warning-darker, #C79002)', // Need to define
  };

  const optionButtonStyle = (optionName) => {
    let currentBgColor = 'var(--primary-accent-light)';
    let currentTextColor = 'var(--primary-accent-darker)';
    let currentBorder = '1px solid var(--primary-accent-border)';
    let currentBoxShadow = '0 1px 2px rgba(0,0,0,0.05)';

    if (isAnswerChecked) {
        if (currentCorrectPattern && optionName === currentCorrectPattern.name) { // Correctly selected
            currentBgColor = 'var(--success-background)';
            currentTextColor = 'var(--success-color)';
            currentBorder = '1px solid var(--success-border)';
        } else if (optionName === selectedAnswer) { // Incorrectly selected
            currentBgColor = 'var(--danger-background)';
            currentTextColor = 'var(--danger-color)';
            currentBorder = '1px solid var(--danger-border)';
        } else { // Other options after an answer is checked
             currentBgColor = 'var(--background-color)';
             currentTextColor = 'var(--text-color-muted)';
             currentBorder = '1px solid var(--separator-color)';
        }
    }
    return {
        ...baseButtonStyle, // Base for padding, font-size etc.
        backgroundColor: currentBgColor,
        color: currentTextColor,
        border: currentBorder,
        width: 'calc(50% - 12px)',
        minHeight: '60px',
        margin: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        fontSize: 'clamp(0.85rem, 1.9vw, 0.95rem)',
        lineHeight: '1.3',
        padding: '10px',
        boxShadow: currentBoxShadow,
    };
  };

  const feedbackContainerStyle = {
    marginTop: 'var(--element-gap, 20px)',
    padding: 'var(--element-gap, 15px)',
    borderRadius: 'var(--app-border-radius-small, 8px)',
    fontSize: 'clamp(0.95rem, 2.1vw, 1.05rem)',
    fontWeight: '600',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--button-primary-text)', // Text should be light for dark backgrounds
    backgroundColor: feedbackType === 'correct'
      ? 'var(--success-color)' // Solid success color
      : feedbackType === 'incorrect'
      ? 'var(--danger-color)' // Solid danger color
      : 'transparent', // Should not happen if showFeedback is true
    transition: 'all 0.3s ease-in-out',
    opacity: showFeedback ? 1 : 0,
    transform: showFeedback ? 'translateY(0)' : 'translateY(10px)',
  };

  const scoreHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--element-gap, 10px) var(--container-padding, 20px)',
    background: 'var(--background-color)',
    borderRadius: 'var(--app-border-radius-small, 8px)',
    marginBottom: 'var(--section-gap, 25px)',
    border: '1px solid var(--separator-color)'
  };

  const scoreTextStyle = {
    fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
    fontWeight: '700',
    color: 'var(--primary-accent-darker)'
  };

  const progressTextStyle = {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    fontWeight: '500',
    color: 'var(--text-color-light)'
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
          style={primaryButtonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor}
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
        <h2 style={{...titleStyle, fontSize: 'clamp(1.75rem, 4.5vw, 2rem)', marginBottom: 'var(--element-gap)'}}>🎉 Game Over! 🎉</h2>
        <p style={{...descriptionStyle, fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: '600'}}>
          Your final score: <span style={{color: 'var(--success-color)'}}>{score}</span> / {totalQuestions}
        </p>
        <p style={descriptionStyle}>
            {score > totalQuestions / 2 ? "Great job! You've got a good eye for patterns." : "Keep practicing to improve your pattern recognition skills!"}
        </p>
        <button
          style={primaryButtonStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor}
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
            theme={'light'} // Keep passing theme if PatternVisualization expects it for canvas
            width={Math.min(600, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 600)}
            height={Math.min(330, typeof window !== 'undefined' ? window.innerHeight * 0.4 : 330)}
        />
      )}

      <p style={{...descriptionStyle, fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', fontWeight: '600', marginTop: 'var(--section-gap)', marginBottom: 'var(--element-gap)' }}>
        What pattern is this?
      </p>

      <div style={{ marginTop: 'var(--element-gap)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0px' }}> {/* gap is handled by margin in optionButtonStyle */}
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
            style={{...successButtonStyle, marginTop: 'var(--section-gap)'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = successButtonHoverStyle.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = successButtonStyle.backgroundColor}
            onClick={handleNextQuestion}
        >
            Next Question ➔
        </button>
      )}

      {isAnswerChecked && questionNumber >= totalQuestions -1 && !gameOver && (
         <button
            style={{...warningButtonStyle, marginTop: 'var(--section-gap)'}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = warningButtonHoverStyle.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = warningButtonStyle.backgroundColor}
            onClick={() => setGameOver(true)}
        >
            Show Final Score 🏁
        </button>
      )}
    </div>
  );
};

export default PatternRecognitionGame;
