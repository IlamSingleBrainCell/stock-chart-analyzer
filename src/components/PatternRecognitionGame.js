import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../ThemeContext'; // Assuming ThemeContext is in src for access to theme

import { ThemeContext } from '../ThemeContext';
import { useRef } from 'react'; // Added for canvasRef in PatternVisualization


// --- COPIED FROM App.js for now - START ---
// Will be refactored for shared use in a later step.

const chartThemeColors = {
  light: {
    background: '#ffffff',
    grid: '#f0f0f0',
    label: '#666666',
    text: '#1f2937',
    mainLine: '#2563eb',
    success: '#10b981',
    danger: '#dc2626',
    candlestickGreen: '#10b981',
    candlestickRed: '#ef4444',
    keyLevelSupport: '#22c55e',
    keyLevelResistance: '#ef4444',
  },
  dark: {
    background: '#1f2937',
    grid: '#374151',
    label: '#9ca3af',
    text: '#f3f4f6',
    mainLine: '#60a5fa',
    success: '#34d399',
    danger: '#f87171',
    candlestickGreen: '#34d399',
    candlestickRed: '#f87171',
    keyLevelSupport: '#34d399',
    keyLevelResistance: '#f87171',
  }
};

const drawLine = (ctx, points) => {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
};

const drawHeadAndShoulders = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.7], [margin + w * 0.2, margin + h * 0.4],
    [margin + w * 0.35, margin + h * 0.6], [margin + w * 0.5, margin + h * 0.1],
    [margin + w * 0.65, margin + h * 0.6], [margin + w * 0.8, margin + h * 0.4],
    [margin + w, margin + h * 0.8]
  ];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.35, margin + h * 0.6); ctx.lineTo(margin + w * 0.65, margin + h * 0.6); ctx.stroke(); ctx.setLineDash([]);
};

const drawInverseHeadAndShoulders = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.3], [margin + w * 0.2, margin + h * 0.6],
    [margin + w * 0.35, margin + h * 0.4], [margin + w * 0.5, margin + h * 0.9],
    [margin + w * 0.65, margin + h * 0.4], [margin + w * 0.8, margin + h * 0.6],
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.success; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.35, margin + h * 0.4); ctx.lineTo(margin + w * 0.65, margin + h * 0.4); ctx.stroke(); ctx.setLineDash([]);
};

const drawDoubleTop = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.7], [margin + w * 0.25, margin + h * 0.2],
    [margin + w * 0.4, margin + h * 0.6], [margin + w * 0.6, margin + h * 0.2],
    [margin + w, margin + h * 0.8]
  ];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.6); ctx.lineTo(margin + w * 0.8, margin + h * 0.6); ctx.stroke(); ctx.setLineDash([]);
};

const drawDoubleBottom = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.3], [margin + w * 0.25, margin + h * 0.8],
    [margin + w * 0.4, margin + h * 0.4], [margin + w * 0.6, margin + h * 0.8],
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.success; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.4); ctx.lineTo(margin + w * 0.8, margin + h * 0.4); ctx.stroke(); ctx.setLineDash([]);
};

const drawCupAndHandle = (ctx, margin, w, h) => {
  ctx.beginPath(); ctx.moveTo(margin, margin + h * 0.3);
  ctx.quadraticCurveTo(margin + w * 0.35, margin + h * 0.8, margin + w * 0.7, margin + h * 0.3); ctx.stroke();
  const points = [
    [margin + w * 0.7, margin + h * 0.3], [margin + w * 0.8, margin + h * 0.45],
    [margin + w * 0.9, margin + h * 0.4], [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
};

const drawAscendingTriangle = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.8], [margin + w * 0.3, margin + h * 0.6],
    [margin + w * 0.5, margin + h * 0.4], [margin + w * 0.7, margin + h * 0.5],
    [margin + w * 0.85, margin + h * 0.35], [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.3, margin + h * 0.3); ctx.lineTo(margin + w, margin + h * 0.3); ctx.stroke();
  ctx.strokeStyle = colors.success; ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.8); ctx.lineTo(margin + w * 0.85, margin + h * 0.35); ctx.stroke(); ctx.setLineDash([]);
};

const drawDescendingTriangle = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.2], [margin + w * 0.3, margin + h * 0.4],
    [margin + w * 0.5, margin + h * 0.6], [margin + w * 0.7, margin + h * 0.5],
    [margin + w * 0.85, margin + h * 0.65], [margin + w, margin + h * 0.8]
  ];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.success; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.3, margin + h * 0.7); ctx.lineTo(margin + w, margin + h * 0.7); ctx.stroke();
  ctx.strokeStyle = colors.danger; ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.2); ctx.lineTo(margin + w * 0.85, margin + h * 0.65); ctx.stroke(); ctx.setLineDash([]);
};

const drawRisingWedge = (ctx, margin, w, h) => {
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.success; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(margin, margin + h * 0.8); ctx.lineTo(margin + w, margin + h * 0.4); ctx.stroke();
  ctx.strokeStyle = colors.danger; ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.3); ctx.lineTo(margin + w, margin + h * 0.2); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3;
  const points = [
    [margin, margin + h * 0.6], [margin + w * 0.2, margin + h * 0.7],
    [margin + w * 0.4, margin + h * 0.5], [margin + w * 0.6, margin + h * 0.6],
    [margin + w * 0.8, margin + h * 0.4], [margin + w, margin + h * 0.3]
  ];
  drawLine(ctx, points);
};

const drawFallingWedge = (ctx, margin, w, h) => {
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(margin, margin + h * 0.2); ctx.lineTo(margin + w, margin + h * 0.6); ctx.stroke();
  ctx.strokeStyle = colors.success; ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.7); ctx.lineTo(margin + w, margin + h * 0.8); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3;
  const points = [
    [margin, margin + h * 0.4], [margin + w * 0.2, margin + h * 0.3],
    [margin + w * 0.4, margin + h * 0.5], [margin + w * 0.6, margin + h * 0.4],
    [margin + w * 0.8, margin + h * 0.6], [margin + w, margin + h * 0.7]
  ];
  drawLine(ctx, points);
};

const drawFlag = (ctx, margin, w, h) => {
  const points1 = [[margin, margin + h * 0.9], [margin + w * 0.4, margin + h * 0.2]]; drawLine(ctx, points1);
  const points2 = [
    [margin + w * 0.4, margin + h * 0.2], [margin + w * 0.5, margin + h * 0.3],
    [margin + w * 0.6, margin + h * 0.25], [margin + w * 0.7, margin + h * 0.35],
    [margin + w * 0.8, margin + h * 0.3], [margin + w, margin + h * 0.1]
  ];
  drawLine(ctx, points2);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.2); ctx.lineTo(margin + w * 0.8, margin + h * 0.25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.35); ctx.lineTo(margin + w * 0.8, margin + h * 0.4); ctx.stroke(); ctx.setLineDash([]);
};

const drawGenericPattern = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.5], [margin + w * 0.2, margin + h * 0.3],
    [margin + w * 0.4, margin + h * 0.7], [margin + w * 0.6, margin + h * 0.4],
    [margin + w * 0.8, margin + h * 0.6], [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
};

const drawPattern = (ctx, pattern, w, h) => {
  const margin = 20;
  const chartW = w - 2 * margin;
  const chartH = h - 2 * margin;
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;

  ctx.fillStyle = colors.background; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = margin + (i / 4) * chartH;
    ctx.beginPath(); ctx.moveTo(margin, y); ctx.lineTo(w - margin, y); ctx.stroke();
  }
  ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3;

  switch (pattern) {
    case 'head-and-shoulders': drawHeadAndShoulders(ctx, margin, chartW, chartH); break;
    case 'inverse-head-and-shoulders': drawInverseHeadAndShoulders(ctx, margin, chartW, chartH); break;
    case 'double-top': drawDoubleTop(ctx, margin, chartW, chartH); break;
    case 'double-bottom': drawDoubleBottom(ctx, margin, chartW, chartH); break;
    case 'cup-and-handle': drawCupAndHandle(ctx, margin, chartW, chartH); break;
    case 'ascending-triangle': drawAscendingTriangle(ctx, margin, chartW, chartH); break;
    case 'descending-triangle': drawDescendingTriangle(ctx, margin, chartW, chartH); break;
    case 'wedge-rising': drawRisingWedge(ctx, margin, chartW, chartH); break;
    case 'wedge-falling': drawFallingWedge(ctx, margin, chartW, chartH); break;
    case 'flag': drawFlag(ctx, margin, chartW, chartH); break;
    default: drawGenericPattern(ctx, margin, chartW, chartH);
  }
  ctx.fillStyle = colors.text; ctx.font = 'bold 12px Inter, Arial, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(pattern.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), w / 2, h - 5);
};

const PatternVisualization = ({ patternName, theme = 'light', width = 300, height = 150 }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !patternName) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = width; canvas.height = height;
    ctx.theme = theme; // Pass theme to context
    drawPattern(ctx, patternName, width, height);
  }, [patternName, width, height, theme]);
  return <canvas ref={canvasRef} style={{ border: '1px solid var(--card-border)', borderRadius: '8px', background: 'var(--background-color)', maxWidth: '100%', height: 'auto', margin: '20px auto' }} />;
};

const chartPatterns = {
  'head-and-shoulders': { description: 'A bearish reversal pattern with three peaks, the middle being the highest', prediction: 'down', timeframe: '7-21 days' },
  'inverse-head-and-shoulders': { description: 'A bullish reversal pattern with three troughs, the middle being the lowest', prediction: 'up', timeframe: '7-21 days' },
  'double-top': { description: 'A bearish reversal pattern showing two distinct peaks at similar price levels', prediction: 'down', timeframe: '14-28 days' },
  'double-bottom': { description: 'A bullish reversal pattern showing two distinct troughs at similar price levels', prediction: 'up', timeframe: '14-28 days' },
  'cup-and-handle': { description: 'A bullish continuation pattern resembling a cup followed by a short downward trend', prediction: 'up', timeframe: '30-60 days' },
  'ascending-triangle': { description: 'A bullish continuation pattern with a flat upper resistance and rising lower support', prediction: 'up', timeframe: '21-35 days' },
  'descending-triangle': { description: 'A bearish continuation pattern with a flat lower support and falling upper resistance', prediction: 'down', timeframe: '21-35 days' },
  'flag': { description: 'A short-term consolidation pattern that typically continues the prior trend', prediction: 'continuation', timeframe: '7-14 days' },
  'wedge-rising': { description: 'A bearish reversal pattern with converging upward trending lines', prediction: 'down', timeframe: '14-28 days' },
  'wedge-falling': { description: 'A bullish reversal pattern with converging downward trending lines', prediction: 'up', timeframe: '14-28 days' }
};
const allPatternNames = Object.keys(chartPatterns);

// --- COPIED FROM App.js - END ---


const PatternRecognitionGame = () => {
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

    // 1. Select a random correct pattern
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
    setQuestionNumber(prev => prev + 1);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setQuestionNumber(0); // Will be incremented by loadNextQuestion
    setGameOver(false);
    setFeedback('');
    loadNextQuestion();
  };

  const handleAnswer = (selectedOptionName) => {
    if (isAnswerChecked) return; // Prevent multiple checks for the same question

    setSelectedAnswer(selectedOptionName);
    setIsAnswerChecked(true);

    if (selectedOptionName === currentCorrectPattern.name) {
      setScore(prevScore => prevScore + 1);
      setFeedback(`Correct! It's a ${formatPatternName(currentCorrectPattern.name)}.`);
    } else {
      setFeedback(`Incorrect. The correct answer was ${formatPatternName(currentCorrectPattern.name)}. This is a ${formatPatternName(selectedOptionName)}.`);
    }

    // If it's the last question, game over immediately after feedback
    if (questionNumber >= totalQuestions) {
        // Wait a bit before setting game over to show feedback
        setTimeout(() => {
            setGameOver(true);
        }, 2000);
    }
  };

  // Initial effect to start game or show start screen
  useEffect(() => {
    // startGame will call loadNextQuestion, so this might not be needed here
    // or could be adjusted if we want to auto-start.
    // For now, user clicks "Start Game" button.
  }, []);


  // Styles (basic inline for now, can be moved to CSS or styled-components later)
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
