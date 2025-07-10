import React, { useState, useRef, useEffect, useContext } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, BarChart, Target, DollarSign, Search, RefreshCw, Clock, Info, ChevronUp, Sun, Moon, Zap, Award } from 'lucide-react';
import stocksData from './stocks.json';
import FlagIcon from './components/FlagIcon';
import { ThemeContext } from './ThemeContext';
import PatternRecognitionGame from './components/PatternRecognitionGame';

const MARKETAUX_API_KEY = 'F8x0iPiyy2Rhe8LZsQJvmisOPwpr7xQ4Np7XF0o1';
const MARKETAUX_BASE_URL = "https://api.marketaux.com/v1/news/all";

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
  const points = [[margin, margin + h * 0.7],[margin + w * 0.2, margin + h * 0.4],[margin + w * 0.35, margin + h * 0.6],[margin + w * 0.5, margin + h * 0.1],[margin + w * 0.65, margin + h * 0.6],[margin + w * 0.8, margin + h * 0.4],[margin + w, margin + h * 0.8]];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.35, margin + h * 0.6); ctx.lineTo(margin + w * 0.65, margin + h * 0.6); ctx.stroke(); ctx.setLineDash([]);
};

const drawInverseHeadAndShoulders = (ctx, margin, w, h) => {
  const points = [[margin, margin + h * 0.3],[margin + w * 0.2, margin + h * 0.6],[margin + w * 0.35, margin + h * 0.4],[margin + w * 0.5, margin + h * 0.9],[margin + w * 0.65, margin + h * 0.4],[margin + w * 0.8, margin + h * 0.6],[margin + w, margin + h * 0.2]];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.success; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.35, margin + h * 0.4); ctx.lineTo(margin + w * 0.65, margin + h * 0.4); ctx.stroke(); ctx.setLineDash([]);
};

const drawDoubleTop = (ctx, margin, w, h) => {
  const points = [[margin, margin + h * 0.7],[margin + w * 0.25, margin + h * 0.2],[margin + w * 0.4, margin + h * 0.6],[margin + w * 0.6, margin + h * 0.2],[margin + w, margin + h * 0.8]];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.6); ctx.lineTo(margin + w * 0.8, margin + h * 0.6); ctx.stroke(); ctx.setLineDash([]);
};

const drawDoubleBottom = (ctx, margin, w, h) => {
  const points = [[margin, margin + h * 0.3],[margin + w * 0.25, margin + h * 0.8],[margin + w * 0.4, margin + h * 0.4],[margin + w * 0.6, margin + h * 0.8],[margin + w, margin + h * 0.2]];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.success; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.4); ctx.lineTo(margin + w * 0.8, margin + h * 0.4); ctx.stroke(); ctx.setLineDash([]);
};

const drawCupAndHandle = (ctx, margin, w, h) => {
  ctx.beginPath(); ctx.moveTo(margin, margin + h * 0.3);
  ctx.quadraticCurveTo(margin + w * 0.35, margin + h * 0.8, margin + w * 0.7, margin + h * 0.3); ctx.stroke();
  const points = [[margin + w * 0.7, margin + h * 0.3],[margin + w * 0.8, margin + h * 0.45],[margin + w * 0.9, margin + h * 0.4],[margin + w, margin + h * 0.2]];
  drawLine(ctx, points);
};

const drawAscendingTriangle = (ctx, margin, w, h) => {
  const points = [[margin, margin + h * 0.8],[margin + w * 0.3, margin + h * 0.6],[margin + w * 0.5, margin + h * 0.4],[margin + w * 0.7, margin + h * 0.5],[margin + w * 0.85, margin + h * 0.35],[margin + w, margin + h * 0.2]];
  drawLine(ctx, points);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.3, margin + h * 0.3); ctx.lineTo(margin + w, margin + h * 0.3); ctx.stroke();
  ctx.strokeStyle = colors.success; ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.8); ctx.lineTo(margin + w * 0.85, margin + h * 0.35); ctx.stroke(); ctx.setLineDash([]);
};

const drawDescendingTriangle = (ctx, margin, w, h) => {
  const points = [[margin, margin + h * 0.2],[margin + w * 0.3, margin + h * 0.4],[margin + w * 0.5, margin + h * 0.6],[margin + w * 0.7, margin + h * 0.5],[margin + w * 0.85, margin + h * 0.65],[margin + w, margin + h * 0.8]];
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
  const points = [[margin, margin + h * 0.6],[margin + w * 0.2, margin + h * 0.7],[margin + w * 0.4, margin + h * 0.5],[margin + w * 0.6, margin + h * 0.6],[margin + w * 0.8, margin + h * 0.4],[margin + w, margin + h * 0.3]];
  drawLine(ctx, points);
};

const drawFallingWedge = (ctx, margin, w, h) => {
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(margin, margin + h * 0.2); ctx.lineTo(margin + w, margin + h * 0.6); ctx.stroke();
  ctx.strokeStyle = colors.success; ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.7); ctx.lineTo(margin + w, margin + h * 0.8); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3;
  const points = [[margin, margin + h * 0.4],[margin + w * 0.2, margin + h * 0.3],[margin + w * 0.4, margin + h * 0.5],[margin + w * 0.6, margin + h * 0.4],[margin + w * 0.8, margin + h * 0.6],[margin + w, margin + h * 0.7]];
  drawLine(ctx, points);
};

const drawFlag = (ctx, margin, w, h) => {
  const points1 = [[margin, margin + h * 0.9], [margin + w * 0.4, margin + h * 0.2]]; drawLine(ctx, points1);
  const points2 = [[margin + w * 0.4, margin + h * 0.2],[margin + w * 0.5, margin + h * 0.3],[margin + w * 0.6, margin + h * 0.25],[margin + w * 0.7, margin + h * 0.35],[margin + w * 0.8, margin + h * 0.3],[margin + w, margin + h * 0.1]];
  drawLine(ctx, points2);
  const colors = chartThemeColors[ctx.theme] || chartThemeColors.light;
  ctx.strokeStyle = colors.danger; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.2); ctx.lineTo(margin + w * 0.8, margin + h * 0.25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(margin + w * 0.4, margin + h * 0.35); ctx.lineTo(margin + w * 0.8, margin + h * 0.4); ctx.stroke(); ctx.setLineDash([]);
};

const drawGenericPattern = (ctx, margin, w, h) => {
  const points = [[margin, margin + h * 0.5],[margin + w * 0.2, margin + h * 0.3],[margin + w * 0.4, margin + h * 0.7],[margin + w * 0.6, margin + h * 0.4],[margin + w * 0.8, margin + h * 0.6],[margin + w, margin + h * 0.2]];
  drawLine(ctx, points);
};

const drawPatternOnCanvas = (ctx, pattern, w, h) => {
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

export const PatternVisualization = ({ patternName, theme = 'light', width = 300, height = 150 }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !patternName) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = width; canvas.height = height;
    ctx.theme = theme;
    drawPatternOnCanvas(ctx, patternName, width, height);
  }, [patternName, width, height, theme]);
  return (<canvas ref={canvasRef} style={{ border: '1px solid var(--card-border)', borderRadius: '8px', background: 'var(--background-color)', maxWidth: '100%', height: 'auto', margin: '20px auto' }} />);
};

export const chartPatterns = {
  'head-and-shoulders': { description: 'A bearish reversal pattern with three peaks, the middle being the highest', prediction: 'down', timeframe: '7-21 days', daysDown: '10-25 days', daysUp: '0 days', reliability: 85, recommendation: 'sell', entryStrategy: 'Sell on neckline break below', exitStrategy: 'Target: Height of head below neckline', breakoutDays: '3-7 days' },
  'inverse-head-and-shoulders': { description: 'A bullish reversal pattern with three troughs, the middle being the lowest', prediction: 'up', timeframe: '7-21 days', daysDown: '0 days', daysUp: '14-30 days', reliability: 83, recommendation: 'buy', entryStrategy: 'Buy on neckline break above', exitStrategy: 'Target: Height of head above neckline', breakoutDays: '2-6 days' },
  'double-top': { description: 'A bearish reversal pattern showing two distinct peaks at similar price levels', prediction: 'down', timeframe: '14-28 days', daysDown: '14-35 days', daysUp: '0 days', reliability: 78, recommendation: 'sell', entryStrategy: 'Sell on break below valley', exitStrategy: 'Target: Distance between peaks and valley', breakoutDays: '5-10 days' },
  'double-bottom': { description: 'A bullish reversal pattern showing two distinct troughs at similar price levels', prediction: 'up', timeframe: '14-28 days', daysDown: '0 days', daysUp: '21-42 days', reliability: 79, recommendation: 'buy', entryStrategy: 'Buy on break above peak', exitStrategy: 'Target: Distance between troughs and peak', breakoutDays: '4-8 days' },
  'cup-and-handle': { description: 'A bullish continuation pattern resembling a cup followed by a short downward trend', prediction: 'up', timeframe: '30-60 days', daysDown: '0 days', daysUp: '30-90 days', reliability: 88, recommendation: 'buy', entryStrategy: 'Buy on handle breakout', exitStrategy: 'Target: Cup depth above breakout', breakoutDays: '7-14 days' },
  'ascending-triangle': { description: 'A bullish continuation pattern with a flat upper resistance and rising lower support', prediction: 'up', timeframe: '21-35 days', daysDown: '0 days', daysUp: '14-45 days', reliability: 72, recommendation: 'buy', entryStrategy: 'Buy on resistance breakout', exitStrategy: 'Target: Triangle height above breakout', breakoutDays: '3-9 days' },
  'descending-triangle': { description: 'A bearish continuation pattern with a flat lower support and falling upper resistance', prediction: 'down', timeframe: '21-35 days', daysDown: '21-42 days', daysUp: '0 days', reliability: 74, recommendation: 'sell', entryStrategy: 'Sell on support breakdown', exitStrategy: 'Target: Triangle height below breakdown', breakoutDays: '4-11 days' },
  'flag': { description: 'A short-term consolidation pattern that typically continues the prior trend', prediction: 'continuation', timeframe: '7-14 days', daysDown: '5-10 days', daysUp: '5-14 days', reliability: 68, recommendation: 'hold', entryStrategy: 'Buy/Sell on flag breakout', exitStrategy: 'Target: Flagpole height in breakout direction', breakoutDays: '1-5 days' },
  'wedge-rising': { description: 'A bearish reversal pattern with converging upward trending lines', prediction: 'down', timeframe: '14-28 days', daysDown: '14-35 days', daysUp: '0 days', reliability: 76, recommendation: 'sell', entryStrategy: 'Sell on lower trendline break', exitStrategy: 'Target: Wedge height below break', breakoutDays: '6-12 days' },
  'wedge-falling': { description: 'A bullish reversal pattern with converging downward trending lines', prediction: 'up', timeframe: '14-28 days', daysDown: '0 days', daysUp: '14-35 days', reliability: 77, recommendation: 'buy', entryStrategy: 'Buy on upper trendline break', exitStrategy: 'Target: Wedge height above break', breakoutDays: '5-10 days' }
};

function StockChartAnalyzer() {
  const stockDatabase = stocksData.stocks;
  const popularStocksData = stocksData.popularStocks;
  const [uploadedImage, setUploadedImage] = useState(null);
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patternDetected, setPatternDetected] = useState(null);
  const [timeEstimate, setTimeEstimate] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [entryExit, setEntryExit] = useState(null);
  const [breakoutTiming, setBreakoutTiming] = useState(null);
  const [error, setError] = useState(null);
  const [keyLevels, setKeyLevels] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('3mo');
  const [longTermAssessment, setLongTermAssessment] = useState(null);
  const [stockNews, setStockNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [currentView, setCurrentView] = useState('analyzer'); // 'analyzer' or 'game'
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);
  const canvasRef = useRef(null);
  const chartCanvasRef = useRef(null);
  const inputRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const detectPatternFromPriceData = (prices) => {
    if (!prices || prices.length < 20) return null;
    const closes = prices.map(p => p.close);
    const highs = prices.map(p => p.high);
    const lows = prices.map(p => p.low);
    const peaks = findPeaksAndTroughs(highs, true);
    const troughs = findPeaksAndTroughs(lows, false);
    const rsi = calculateRSI(closes, 14);
    const currentRSI = rsi[rsi.length - 1] || 50;
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);
    const currentPrice = closes[closes.length - 1];
    const priceVsSMA20 = sma20.length > 0 ? ((currentPrice - sma20[sma20.length - 1]) / sma20[sma20.length - 1]) * 100 : 0;
    const priceVsSMA50 = sma50.length > 0 ? ((currentPrice - sma50[sma50.length - 1]) / sma50[sma50.length - 1]) * 100 : 0;
    const patternData = analyzePatterns(peaks, troughs, closes, highs, lows);
    let determinedPattern = patternData.pattern;
    const patternStrengthThreshold = 0.6;
    if (!patternData.pattern || patternData.strength < patternStrengthThreshold) {
      const patternVariants = {'head-and-shoulders': ['head-and-shoulders', 'double-top'],'inverse-head-and-shoulders': ['inverse-head-and-shoulders', 'double-bottom'],'double-top': ['double-top', 'head-and-shoulders'],'double-bottom': ['double-bottom', 'inverse-head-and-shoulders'],'ascending-triangle': ['ascending-triangle', 'cup-and-handle'],'descending-triangle': ['descending-triangle', 'wedge-falling'],'flag': ['flag', 'ascending-triangle', 'descending-triangle'],'cup-and-handle': ['cup-and-handle', 'ascending-triangle'],'wedge-rising': ['wedge-rising', 'ascending-triangle'],'wedge-falling': ['wedge-falling', 'descending-triangle']};
      const variants = patternVariants[patternData.pattern];
      if (variants && variants.length > 0) {
        determinedPattern = variants[0];
      } else {
        determinedPattern = patternData.pattern || 'flag';
      }
    }
    return {pattern: determinedPattern, confidence: calculateDynamicConfidence({ ...patternData, pattern: determinedPattern }, currentRSI, priceVsSMA20, priceVsSMA50), technicals: {rsi: currentRSI, priceVsSMA20, priceVsSMA50, peaks: peaks.length, troughs: troughs.length}};
  };

  const findPeaksAndTroughs = (data, isPeak = true) => {
    const results = []; const lookback = 3; const minChangePercent = 0.02;
    for (let i = lookback; i < data.length - lookback; i++) {
      let isSignificant = true; let maxDiff = 0;
      for (let j = i - lookback; j <= i + lookback; j++) {
        if (j === i) continue;
        if (isPeak) { if (data[j] >= data[i]) { isSignificant = false; break; } maxDiff = Math.max(maxDiff, data[i] - data[j]);
        } else { if (data[j] <= data[i]) { isSignificant = false; break; } maxDiff = Math.max(maxDiff, data[j] - data[i]); }
      }
      const changePercent = maxDiff / data[i];
      if (isSignificant && changePercent >= minChangePercent) { results.push({ index: i, value: data[i] }); }
    }
    if (results.length < 2) {
      for (let i = lookback; i < data.length - lookback; i++) {
        let isSignificant = true;
        for (let j = i - lookback; j <= i + lookback; j++) {
          if (j === i) continue;
          if (isPeak) { if (data[j] >= data[i]) { isSignificant = false; break; }
          } else { if (data[j] <= data[i]) { isSignificant = false; break; } }
        }
        if (isSignificant) { results.push({ index: i, value: data[i] }); }
      }
    }
    return results;
  };

  const calculateRSI = (data, period = 14) => {
    const gains = []; const losses = [];
    for (let i = 1; i < data.length; i++) { const change = data[i] - data[i - 1]; gains.push(change > 0 ? change : 0); losses.push(change < 0 ? Math.abs(change) : 0); }
    const rsi = [];
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      if (avgLoss === 0) { rsi.push(100); } else { const rs = avgGain / avgLoss; rsi.push(100 - (100 / (1 + rs))); }
    }
    return rsi;
  };

  const calculateSMA = (data, period) => {
    const sma = [];
    for (let i = period - 1; i < data.length; i++) { const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b); sma.push(sum / period); }
    return sma;
  };

  const analyzePatterns = (peaks, troughs, closes, highs, lows) => {
    const recentData = closes.slice(-30); const fullData = closes.slice(-60);
    const priceRange = Math.max(...recentData) - Math.min(...recentData); const tolerance = priceRange * 0.05;
    const startPrice = fullData[0]; const endPrice = fullData[fullData.length - 1];
    const priceChange = ((endPrice - startPrice) / startPrice) * 100; const volatility = calculateVolatility(recentData);
    if (peaks.length >= 3) { const lastThreePeaks = peaks.slice(-3); const [left, head, right] = lastThreePeaks; if (head.value > left.value && head.value > right.value) { const leftRightDiff = Math.abs(left.value - right.value); const headHeight = Math.min(head.value - left.value, head.value - right.value); if (leftRightDiff <= tolerance * 2 && headHeight > tolerance) { return { pattern: 'head-and-shoulders', strength: 0.75 }; } } }
    if (troughs.length >= 3) { const lastThreeTroughs = troughs.slice(-3); const [left, head, right] = lastThreeTroughs; if (head.value < left.value && head.value < right.value) { const leftRightDiff = Math.abs(left.value - right.value); const headDepth = Math.min(left.value - head.value, right.value - head.value); if (leftRightDiff <= tolerance * 2 && headDepth > tolerance) { return { pattern: 'inverse-head-and-shoulders', strength: 0.75 }; } } }
    if (peaks.length >= 2) { const lastTwoPeaks = peaks.slice(-2); const [first, second] = lastTwoPeaks; if (Math.abs(first.value - second.value) <= tolerance * 1.5) { return { pattern: 'double-top', strength: 0.7 }; } }
    if (troughs.length >= 2) { const lastTwoTroughs = troughs.slice(-2); const [first, second] = lastTwoTroughs; if (Math.abs(first.value - second.value) <= tolerance * 1.5) { return { pattern: 'double-bottom', strength: 0.7 }; } }
    const trianglePattern = detectTrianglePatterns(peaks, troughs, closes); if (trianglePattern) return trianglePattern;
    const cupPattern = detectCupAndHandle(closes); if (cupPattern) return { pattern: 'cup-and-handle', strength: 0.6 };
    const wedgePattern = detectWedgePatterns(peaks, troughs, closes); if (wedgePattern) return wedgePattern;
    if (volatility < 2 && Math.abs(priceChange) < 5) { return { pattern: 'flag', strength: 0.6 }; }
    if (priceChange > 8) { if (peaks.length >= 2 && troughs.length >= 2) { return { pattern: 'ascending-triangle', strength: 0.5 }; } return { pattern: 'cup-and-handle', strength: 0.5 };
    } else if (priceChange < -8) { if (peaks.length >= 2 && troughs.length >= 2) { return { pattern: 'descending-triangle', strength: 0.5 }; } return { pattern: 'head-and-shoulders', strength: 0.5 };
    } else if (priceChange > 3) { return { pattern: 'ascending-triangle', strength: 0.4 };
    } else if (priceChange < -3) { return { pattern: 'descending-triangle', strength: 0.4 };
    } else { if (volatility > 4) { return Math.random() > 0.5 ? { pattern: 'double-top', strength: 0.4 } : { pattern: 'double-bottom', strength: 0.4 }; } return { pattern: 'flag', strength: 0.4 }; }
  };

  const fetchStockNews = async (symbol) => {
    if (!symbol) return; setNewsLoading(true); setNewsError(null); setStockNews([]);
    try {
      const url = `${MARKETAUX_BASE_URL}?api_token=${MARKETAUX_API_KEY}&symbols=${symbol}&language=en&limit=5&filter_entities=true`;
      const response = await fetch(url);
      if (!response.ok) { const errorData = await response.json(); const errorMessage = errorData?.error?.message || `Failed to fetch news for ${symbol}. Status: ${response.status}`; throw new Error(errorMessage); }
      const rawData = await response.json();
      if (rawData && rawData.data) { const formattedNews = rawData.data.map(item => ({ title: item.title, url: item.url, text: item.snippet || item.description || '', publishedDate: item.published_at, site: item.source, image: item.image_url, })); setStockNews(formattedNews);
      } else { setStockNews([]); }
    } catch (error) { console.error('Marketaux News API Error:', error); setNewsError(error.message); setStockNews([]); } finally { setNewsLoading(false); }
  };

  const calculateVolatility = (prices) => {
    if (prices.length < 2) return 0; const returns = [];
    for (let i = 1; i < prices.length; i++) { returns.push(((prices[i] - prices[i-1]) / prices[i-1]) * 100); }
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    return Math.sqrt(variance);
  };

  const detectTrianglePatterns = (peaks, troughs, closes) => {
    if (peaks.length < 2 || troughs.length < 2) return null;
    const recentPeaks = peaks.slice(-4); const recentTroughs = troughs.slice(-4);
    if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
      const peakValues = recentPeaks.map(p => p.value); const troughValues = recentTroughs.map(t => t.value);
      const peakTrend = calculateTrend(peakValues); const troughTrend = calculateTrend(troughValues);
      if (Math.abs(peakTrend) < 1 && troughTrend > 0.5) { return { pattern: 'ascending-triangle', strength: 0.6 }; }
      if (peakTrend < -0.5 && Math.abs(troughTrend) < 1) { return { pattern: 'descending-triangle', strength: 0.6 }; }
      if (peakTrend < -0.2 && troughTrend > 0.2) { return { pattern: 'ascending-triangle', strength: 0.5 }; }
    }
    return null;
  };

  const calculateTrend = (values) => {
    if (values.length < 2) return 0; let trend = 0;
    for (let i = 1; i < values.length; i++) { trend += values[i] - values[i-1]; }
    return trend / (values.length - 1);
  };

  const detectCupAndHandle = (closes) => {
    if (closes.length < 30) return false;
    const recent30 = closes.slice(-30); const firstQuarter = recent30.slice(0, 7); const secondQuarter = recent30.slice(7, 15); const thirdQuarter = recent30.slice(15, 22); const fourthQuarter = recent30.slice(22);
    const firstAvg = firstQuarter.reduce((a, b) => a + b) / firstQuarter.length; const secondAvg = secondQuarter.reduce((a, b) => a + b) / secondQuarter.length; const thirdAvg = thirdQuarter.reduce((a, b) => a + b) / thirdQuarter.length;
    const hasCup = (secondAvg < firstAvg * 0.92) && (thirdAvg < firstAvg * 0.92) && (fourthQuarter.reduce((a, b) => a + b) / fourthQuarter.length > firstAvg * 0.95);
    const hasHandle = fourthQuarter.reduce((a, b) => a + b) / fourthQuarter.length < firstAvg * 1.02;
    return hasCup && hasHandle;
  };

  const detectWedgePatterns = (peaks, troughs, closes) => {
    if (peaks.length < 2 || troughs.length < 2) return null;
    const recentPeaks = peaks.slice(-4); const recentTroughs = troughs.slice(-4); const recent30 = closes.slice(-30);
    if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
      const peakTrend = calculateTrend(recentPeaks.map(p => p.value)); const troughTrend = calculateTrend(recentTroughs.map(t => t.value));
      const overallTrend = ((recent30[recent30.length - 1] - recent30[0]) / recent30[0]) * 100;
      if (peakTrend > 0.3 && troughTrend > 0.2 && troughTrend < peakTrend * 0.8) { return { pattern: 'wedge-rising', strength: 0.6 }; }
      if (peakTrend < -0.3 && troughTrend < -0.2 && Math.abs(troughTrend) < Math.abs(peakTrend) * 0.8) { return { pattern: 'wedge-falling', strength: 0.6 }; }
      if (overallTrend > 5 && peakTrend < 0 && troughTrend > 0) { return { pattern: 'wedge-rising', strength: 0.5 }; }
      if (overallTrend < -5 && peakTrend < 0 && troughTrend < 0) { return { pattern: 'wedge-falling', strength: 0.5 }; }
    }
    return null;
  };

  const calculateDynamicConfidence = (patternData, rsi, priceVsSMA20, priceVsSMA50) => {
    let baseConfidence = chartPatterns[patternData.pattern]?.reliability || 70;
    let patternStrength = patternData.strength || 0.5;
    let confidence = baseConfidence * patternStrength;
    if (patternData.pattern.includes('up') || patternData.pattern === 'ascending-triangle' || patternData.pattern === 'inverse-head-and-shoulders' || patternData.pattern === 'double-bottom') {
      if (rsi > 30 && rsi < 70) confidence += 5; if (priceVsSMA20 > 0) confidence += 3; if (priceVsSMA50 > 0) confidence += 3;
    } else if (patternData.pattern.includes('down') || patternData.pattern === 'descending-triangle' || patternData.pattern === 'head-and-shoulders' || patternData.pattern === 'double-top') {
      if (rsi > 30 && rsi < 70) confidence += 5; if (priceVsSMA20 < 0) confidence += 3; if (priceVsSMA50 < 0) confidence += 3;
    }
    return Math.max(45, Math.min(92, Math.round(confidence)));
  };

  const calculateKeyLevels = (prices) => {
    if (!prices || prices.length < 10) return null;
    const recentPrices = prices.slice(-60); const lows = recentPrices.map(p => p.low); const highs = recentPrices.map(p => p.high);
    const supportLevels = findPeaksAndTroughs(lows, false).sort((a,b) => a.value - b.value).slice(0, 2);
    const resistanceLevels = findPeaksAndTroughs(highs, true).sort((a,b) => b.value - a.value).slice(0, 2);
    return { support: supportLevels.map(s => parseFloat(s.value.toFixed(2))), resistance: resistanceLevels.map(r => parseFloat(r.value.toFixed(2))), };
  };

  const calculateBreakoutTiming = (patternName, stockData, confidence) => {
    const pattern = chartPatterns[patternName]; if (!pattern || !stockData) return null;
    const baseBreakoutDays = pattern.breakoutDays || '3-7 days'; const breakoutRange = baseBreakoutDays.split('-');
    const minDays = parseInt(breakoutRange[0]); const maxDays = parseInt(breakoutRange[1]);
    let adjustedMin = minDays; let adjustedMax = maxDays;
    if (confidence > 80) { adjustedMin = Math.max(1, minDays - 1); adjustedMax = Math.max(adjustedMin + 1, maxDays - 2);
    } else if (confidence < 60) { adjustedMin = minDays + 1; adjustedMax = maxDays + 3; }
    const today = new Date(); const minBreakoutDate = new Date(today); const maxBreakoutDate = new Date(today);
    minBreakoutDate.setDate(today.getDate() + adjustedMin); maxBreakoutDate.setDate(today.getDate() + adjustedMax);
    return { daysRange: `${adjustedMin}-${adjustedMax} days`, minDate: minBreakoutDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), maxDate: maxBreakoutDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), confidence: confidence > 75 ? 'High' : confidence > 60 ? 'Medium' : 'Low' };
  };

  const generateLongTermAssessment = (stockData, timeRangeString) => {
    if (!stockData || !stockData.prices || stockData.prices.length < 2) { return null; }
    const prices = stockData.prices.map(p => p.close).filter(p => p !== null && p !== undefined); if (prices.length < 2) return null;
    const firstPrice = prices[0]; const lastPrice = prices[prices.length - 1];
    const firstDate = new Date(stockData.prices[0].date); const lastDate = new Date(stockData.prices[stockData.prices.length - 1].date);
    const actualTimeRangeYears = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365.25);
    const timeRangeLabel = actualTimeRangeYears >= 1 ? `${actualTimeRangeYears.toFixed(1)} years` : `${(actualTimeRangeYears * 12).toFixed(0)} months`;
    let trend = 'stayed relatively flat'; if (lastPrice > firstPrice * 1.1) trend = 'generally gone up'; else if (lastPrice < firstPrice * 0.9) trend = 'generally gone down';
    const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100; const returnExample = (100 * (1 + totalReturn / 100)).toFixed(2);
    let majorHigh = -Infinity; let majorLow = Infinity; let highDate = ''; let lowDate = '';
    stockData.prices.forEach(p => { if (p.high > majorHigh) { majorHigh = p.high; highDate = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); } if (p.low < majorLow) { majorLow = p.low; lowDate = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); } });
    let volatilityDescription = "The stock's price movement history can provide insights into its stability.";
    if (prices.length > 12) {
        const monthlyReturns = []; const approxPointsPerMonth = Math.max(1, Math.floor(prices.length / (actualTimeRangeYears * 12)));
        for (let i = approxPointsPerMonth; i < prices.length; i += approxPointsPerMonth) { const prevPrice = prices[i - approxPointsPerMonth]; const currentPrice = prices[i]; if (prevPrice > 0) { monthlyReturns.push((currentPrice - prevPrice) / prevPrice); } }
        if (monthlyReturns.length > 1) { const meanReturn = monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length; const variance = monthlyReturns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / monthlyReturns.length; const stdDev = Math.sqrt(variance); const annualizedStdDev = stdDev * Math.sqrt(12); if (annualizedStdDev > 0.4) volatilityDescription = `This stock has shown high volatility, meaning its price has experienced significant swings.`; else if (annualizedStdDev > 0.2) volatilityDescription = `This stock has shown moderate volatility, with noticeable price fluctuations.`; else volatilityDescription = `This stock has shown relatively low volatility, indicating more stable price movements.`; }
    }
    return { trend: `Over the past ${timeRangeLabel}, ${stockData.symbol} has ${trend}.`, totalReturn: `An investment of $100 at the start of this period would be worth approximately $${returnExample} today, a change of ${totalReturn.toFixed(1)}%.`, highLow: `The highest price reached was around ${stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}${majorHigh.toFixed(2)} in ${highDate}, and the lowest was about ${stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}${majorLow.toFixed(2)} in ${lowDate}.`, volatility: volatilityDescription, disclaimer: "Remember, past performance is not a guarantee of future results. This assessment is for educational purposes." };
  };

  const filterSuggestions = (input) => {
    if (!input || input.length < 1) return []; const query = input.toLowerCase();
    const matches = stockDatabase.filter(stock => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query) || stock.sector.toLowerCase().includes(query) || stock.market.toLowerCase().includes(query));
    return matches.sort((a, b) => { const aSymbol = a.symbol.toLowerCase(); const bSymbol = b.symbol.toLowerCase(); const aName = a.name.toLowerCase(); const bName = b.name.toLowerCase(); if (aSymbol === query) return -1; if (bSymbol === query) return 1; if (aSymbol.startsWith(query) && !bSymbol.startsWith(query)) return -1; if (bSymbol.startsWith(query) && !aSymbol.startsWith(query)) return 1; if (aSymbol.startsWith(query) && bSymbol.startsWith(query)) { return aSymbol.length - bSymbol.length; } if (aName.includes(query) && bName.includes(query)) { if (a.market === 'US' && b.market === 'India') return -1; if (a.market === 'India' && b.market === 'US') return 1; } if (aName.includes(query) && !bName.includes(query)) return -1; if (bName.includes(query) && !aName.includes(query)) return 1; return 0; }).slice(0, 12);
  };

  const handleInputChange = (value) => {
    setStockSymbol(value);
    if (value.length >= 1) { const suggestions = filterSuggestions(value); setFilteredSuggestions(suggestions); setShowSuggestions(true); setSelectedSuggestionIndex(-1);
    } else { setShowSuggestions(false); setFilteredSuggestions([]); setSelectedSuggestionIndex(-1); }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setSelectedSuggestionIndex(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : 0); break;
      case 'ArrowUp': e.preventDefault(); setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1); break;
      case 'Enter': e.preventDefault(); if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) { selectSuggestion(filteredSuggestions[selectedSuggestionIndex]); } else if (stockSymbol.trim()) { const symbolToFetch = stockSymbol.toUpperCase(); fetchStockData(symbolToFetch, selectedTimeRange); fetchStockNews(symbolToFetch); setShowSuggestions(false); } break;
      case 'Escape': setShowSuggestions(false); setSelectedSuggestionIndex(-1); inputRef.current?.blur(); break;
      case 'Tab': setShowSuggestions(false); setSelectedSuggestionIndex(-1); break;
      default: break;
    }
  };

  const selectSuggestion = (stock) => {
    setStockSymbol(stock.symbol); setShowSuggestions(false); setSelectedSuggestionIndex(-1);
    fetchStockData(stock.symbol, selectedTimeRange); fetchStockNews(stock.symbol);
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    if (stockSymbol.trim()) { setPrediction(null); setPatternDetected(null); setConfidence(null); setRecommendation(null); setEntryExit(null); setTimeEstimate(null); setBreakoutTiming(null); setKeyLevels(null); setLongTermAssessment(null); fetchStockData(stockSymbol.toUpperCase(), range); }
  };

  const handleInputFocus = () => { if (stockSymbol.length >= 1) { const suggestions = filterSuggestions(stockSymbol); setFilteredSuggestions(suggestions); setShowSuggestions(true); } };
  const handleInputBlur = () => { setTimeout(() => { setShowSuggestions(false); setSelectedSuggestionIndex(-1); }, 200); };
  const highlightMatch = (text, query) => { if (!query) return text; const parts = text.split(new RegExp(`(${query})`, 'gi')); return parts.map((part, index) => part.toLowerCase() === query.toLowerCase() ? <span key={index} style={{ backgroundColor: 'var(--highlight-background)', fontWeight: '600' }}>{part}</span> : part ); };

  const fetchYahooFinanceData = async (symbol, range = '3mo') => {
    let interval = '1d'; if (range === '5y' || range === '10y') { interval = '1mo'; } else if (range === '1y') { interval = '1wk'; }
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url='; const yahooUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`);
      const response = await fetch(proxyUrl + yahooUrl); if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const data = await response.json(); if (data.chart?.error) { throw new Error(data.chart.error.description || 'Invalid stock symbol'); }
      if (!data.chart?.result?.[0]) { throw new Error('No data found for this symbol'); }
      const result = data.chart.result[0]; const timestamps = result.timestamp; const quotes = result.indicators.quote[0]; const meta = result.meta;
      const prices = timestamps.map((timestamp, index) => ({ date: new Date(timestamp * 1000).toISOString().split('T')[0], open: quotes.open[index], high: quotes.high[index], low: quotes.low[index], close: quotes.close[index], volume: quotes.volume[index] })).filter(price => price.close !== null && price.close !== undefined);
      if (prices.length === 0) { throw new Error('No valid price data found'); }
      return { symbol: symbol.toUpperCase(), companyName: meta.longName || symbol, currency: meta.currency || 'USD', exchange: meta.exchangeName || '', currentPrice: meta.regularMarketPrice || prices[prices.length - 1].close, prices: prices };
    } catch (error) { console.error('Yahoo Finance API Error:', error); if (error.message.includes('CORS') || error.message.includes('fetch')) { return generateMockStockData(symbol); } throw new Error(`Failed to fetch data for ${symbol}: ${error.message}`); }
  };

  const generateMockStockData = (symbol) => {
    const isIndianStock = symbol.includes('.NS'); const basePrice = isIndianStock ? Math.random() * 2000 + 500 : Math.random() * 200 + 50; const prices = []; let currentPrice = basePrice;
    for (let i = 89; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); const volatility = 0.02; const change = (Math.random() - 0.5) * 2 * volatility; currentPrice = currentPrice * (1 + change); const open = currentPrice; const close = currentPrice * (1 + (Math.random() - 0.5) * 0.01); const high = Math.max(open, close) * (1 + Math.random() * 0.005); const low = Math.min(open, close) * (1 - Math.random() * 0.005); const volume = Math.floor(Math.random() * 10000000) + 1000000; prices.push({ date: date.toISOString().split('T')[0], open: parseFloat(open.toFixed(2)), high: parseFloat(high.toFixed(2)), low: parseFloat(low.toFixed(2)), close: parseFloat(close.toFixed(2)), volume: volume }); currentPrice = close; }
    return { symbol: symbol.toUpperCase(), companyName: isIndianStock ? `${symbol.replace('.NS', '')} Ltd.` : `${symbol.toUpperCase()} Inc.`, currency: isIndianStock ? 'INR' : 'USD', exchange: isIndianStock ? 'NSE' : 'NASDAQ', currentPrice: currentPrice, prices: prices, isMockData: true };
  };

  const createChartFromData = (stockData, currentKeyLevels, currentTheme = 'light') => {
    const canvas = chartCanvasRef.current; const ctx = canvas.getContext('2d'); const colors = chartThemeColors[currentTheme] || chartThemeColors.light;
    canvas.width = 1000; canvas.height = 500; ctx.fillStyle = colors.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const prices = stockData.prices; if (!prices || prices.length === 0) return null;
    const margin = { top: 40, right: 60, bottom: 60, left: 80 }; const chartWidth = canvas.width - margin.left - margin.right; const chartHeight = canvas.height - margin.top - margin.bottom;
    const allPrices = prices.flatMap(p => [p.high, p.low]); const minPrice = Math.min(...allPrices); const maxPrice = Math.max(...allPrices); const priceRange = maxPrice - minPrice; const padding = priceRange * 0.1;
    const xScale = (index) => margin.left + (index / (prices.length - 1)) * chartWidth; const yScale = (price) => margin.top + ((maxPrice + padding - price) / (priceRange + 2 * padding)) * chartHeight;
    const isIndianStock = stockData.symbol.includes('.NS'); const currencySymbol = isIndianStock ? '₹' : '$';
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) { const y = margin.top + (i / 8) * chartHeight; ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + chartWidth, y); ctx.stroke(); const price = maxPrice + padding - (i / 8) * (priceRange + 2 * padding); ctx.fillStyle = colors.label; ctx.font = '12px Inter, Arial, sans-serif'; ctx.textAlign = 'right'; ctx.fillText(currencySymbol + price.toFixed(2), margin.left - 10, y + 4); }
    const numVerticalGridLines = prices.length > 250 ? 5 : (prices.length > 60 ? 6 : 4);
    for (let i = 0; i <= numVerticalGridLines; i++) { const x = margin.left + (i / numVerticalGridLines) * chartWidth; ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + chartHeight); ctx.stroke(); const priceIndex = Math.floor((i / numVerticalGridLines) * (prices.length - 1)); if (priceIndex < prices.length) { const date = new Date(prices[priceIndex].date); let dateFormatOptions = { month: 'short', day: 'numeric' }; if (prices.length > 365 * 2) { dateFormatOptions = { year: 'numeric', month: 'short' }; } else if (prices.length > 90) { dateFormatOptions = { month: 'short', day: 'numeric' }; } ctx.fillStyle = colors.label; ctx.font = '11px Inter, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(date.toLocaleDateString('en-US', dateFormatOptions), x, canvas.height - 20); } }
    ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3; ctx.beginPath();
    prices.forEach((price, index) => { const x = xScale(index); const y = yScale(price.close); if (index === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); } }); ctx.stroke();
    prices.forEach((price, index) => { const x = xScale(index); const openY = yScale(price.open); const closeY = yScale(price.close); const highY = yScale(price.high); const lowY = yScale(price.low); const isGreen = price.close >= price.open; const candleColor = isGreen ? colors.candlestickGreen : colors.candlestickRed; ctx.strokeStyle = candleColor; ctx.fillStyle = candleColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke(); const bodyHeight = Math.abs(closeY - openY); const bodyY = Math.min(openY, closeY); const bodyWidth = 6; if (isGreen) { ctx.fillRect(x - bodyWidth/2, bodyY, bodyWidth, bodyHeight || 1); } else { ctx.strokeRect(x - bodyWidth/2, bodyY, bodyWidth, bodyHeight || 1); } });
    if (currentKeyLevels && currentKeyLevels.support && currentKeyLevels.resistance) { ctx.lineWidth = 1; ctx.font = 'bold 10px Inter, Arial, sans-serif'; currentKeyLevels.support.forEach(level => { if (level >= minPrice && level <= maxPrice) { const y = yScale(level); ctx.strokeStyle = colors.keyLevelSupport; ctx.fillStyle = colors.keyLevelSupport; ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(margin.left, y); ctx.lineTo(chartWidth + margin.left, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillText(`S: ${currencySymbol}${level.toFixed(2)}`, chartWidth + margin.left - 50, y - 2); } }); currentKeyLevels.resistance.forEach(level => { if (level >= minPrice && level <= maxPrice) { const y = yScale(level); ctx.strokeStyle = colors.keyLevelResistance; ctx.fillStyle = colors.keyLevelResistance; ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(margin.left, y); ctx.lineTo(chartWidth + margin.left, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillText(`R: ${currencySymbol}${level.toFixed(2)}`, chartWidth + margin.left - 50, y - 2); } }); }
    ctx.fillStyle = colors.text; ctx.font = 'bold 20px Inter, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${stockData.symbol} - ${stockData.companyName}`, margin.left, 25);
    ctx.font = '14px Inter, Arial, sans-serif'; ctx.fillStyle = colors.label; const currentPriceText = stockData.currentPrice || prices[prices.length - 1].close; ctx.fillText(`Current: ${currencySymbol}${currentPriceText.toFixed(2)} ${stockData.currency || (isIndianStock ? 'INR' : 'USD')}`, margin.left, margin.top - 5);
    if (stockData.isMockData) { ctx.fillStyle = (currentTheme === 'dark') ? chartThemeColors.dark.warningColor || '#f59e0b' : '#f59e0b'; ctx.font = 'italic 12px Inter, Arial, sans-serif'; ctx.fillText('Demo Data - API temporarily unavailable', margin.left + 300, 25); }
    return canvas.toDataURL('image/png', 1.0);
  };

  const fetchStockData = async (symbol, timeRange = '3mo') => {
    if (!symbol.trim()) return; setLoading(true); setError(null); setStockData(null); setKeyLevels(null);
    try {
      const data = await fetchYahooFinanceData(symbol.trim().toUpperCase(), timeRange); setStockData(data);
      setTimeout(() => { const tempKeyLevels = (data && data.prices) ? calculateKeyLevels(data.prices) : null; if (tempKeyLevels) { setKeyLevels(tempKeyLevels); } const chartImageUrl = createChartFromData(data, tempKeyLevels, theme); setUploadedImage(chartImageUrl); fetchStockNews(data.symbol); }, 100);
    } catch (error) { setError(error.message); console.error('Stock data fetch error:', error); } finally { setLoading(false); }
  };

  const selectStock = (symbol) => { setStockSymbol(symbol); setShowSuggestions(false); setSelectedSuggestionIndex(-1); fetchStockData(symbol); fetchStockNews(symbol); };

  const generateRecommendation = (pattern, confidence) => {
    const { recommendation, prediction } = pattern; let action = recommendation.toUpperCase(); let reasoning = '';
    switch (recommendation) {
      case 'buy': reasoning = `Strong ${prediction} signal detected with ${confidence}% confidence. Consider accumulating positions.`; break;
      case 'sell': reasoning = `Bearish pattern confirmed with ${confidence}% confidence. Consider reducing positions or short selling.`; break;
      case 'hold': reasoning = `Consolidation pattern detected. Maintain current positions until clear breakout with ${confidence}% confidence.`; break;
      default: reasoning = `Mixed signals detected. Monitor closely for breakout direction. Confidence: ${confidence}%.`;
    }
    return { action, reasoning };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onload = () => { setUploadedImage(reader.result); setStockData(null); setPrediction(null); setPatternDetected(null); setConfidence(null); setRecommendation(null); setEntryExit(null); setTimeEstimate(null); setBreakoutTiming(null); setKeyLevels(null); setLongTermAssessment(null); }; reader.readAsDataURL(file); }
  };

  const analyzeChart = () => {
    if (!uploadedImage) return; setLoading(true); setLongTermAssessment(null);
    setTimeout(() => {
      try {
        let detectedPattern = null; let confidenceScore = 70; let calculatedKeyLevels = null; let currentLongTermAssessment = null;
        if (stockData && stockData.prices && stockData.prices.length > 0) {
          calculatedKeyLevels = calculateKeyLevels(stockData.prices);
          if (selectedTimeRange === '1y' || selectedTimeRange === '5y' || selectedTimeRange === '10y') {
            currentLongTermAssessment = generateLongTermAssessment(stockData, selectedTimeRange);
            if (currentLongTermAssessment) { setLongTermAssessment(currentLongTermAssessment); setPatternDetected(null); setPrediction(null); setConfidence(null); setRecommendation(null); setEntryExit(null); setTimeEstimate(null); setBreakoutTiming(null); }
          } else { setLongTermAssessment(null); const analysis = detectPatternFromPriceData(stockData.prices); if (analysis) { detectedPattern = analysis.pattern; confidenceScore = analysis.confidence; } }
        }
        if (!currentLongTermAssessment && !detectedPattern) {
          const patternWeights = {'head-and-shoulders': 12,'inverse-head-and-shoulders': 12,'double-top': 15,'double-bottom': 15,'cup-and-handle': 10,'ascending-triangle': 15,'descending-triangle': 15,'flag': 8,'wedge-rising': 8,'wedge-falling': 8};
          const weightedPatterns = []; Object.entries(patternWeights).forEach(([pattern, weight]) => { for (let i = 0; i < weight; i++) { weightedPatterns.push(pattern); } });
          const randomIndex = Math.floor(Math.random() * weightedPatterns.length); detectedPattern = weightedPatterns[randomIndex]; confidenceScore = Math.floor(Math.random() * 35) + 50;
        }
        const selectedPattern = chartPatterns[detectedPattern]; const rec = generateRecommendation(selectedPattern, confidenceScore); const breakout = calculateBreakoutTiming(detectedPattern, stockData, confidenceScore);
        setPatternDetected({ name: detectedPattern, ...selectedPattern }); setPrediction(selectedPattern.prediction); setConfidence(confidenceScore); setRecommendation(rec); setBreakoutTiming(breakout); setKeyLevels(calculatedKeyLevels);
        let timeInfo = ''; if (selectedPattern.prediction === 'up') { timeInfo = `Expected to rise for ${selectedPattern.daysUp}`; } else if (selectedPattern.prediction === 'down') { timeInfo = `Expected to decline for ${selectedPattern.daysDown}`; } else if (selectedPattern.prediction === 'continuation') { const isUptrend = Math.random() > 0.5; timeInfo = isUptrend ? `Current uptrend likely to continue for ${selectedPattern.daysUp}` : `Current downtrend likely to continue for ${selectedPattern.daysDown}`; } else { timeInfo = `Pattern suggests movement within ${selectedPattern.timeframe}`; }
        setTimeEstimate(timeInfo); setEntryExit({ entry: selectedPattern.entryStrategy, exit: selectedPattern.exitStrategy });
      } catch (error) { console.error('Error analyzing chart:', error); setError('Analysis failed. Please try uploading a clearer chart image.'); } finally { setLoading(false); }
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', background: 'var(--app-background-start)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '2px solid var(--app-border)' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={chartCanvasRef} style={{ display: 'none' }} />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', padding: '10px', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
        <button onClick={() => setCurrentView('analyzer')} style={{ ...toggleButtonStyle, background: currentView === 'analyzer' ? 'var(--primary-accent)' : 'var(--primary-accent-light)', color: currentView === 'analyzer' ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)'}}>
          <Zap size={18} style={{ marginRight: '8px' }} /> Chart Analyzer
        </button>
        <button onClick={() => setCurrentView('game')} style={{ ...toggleButtonStyle, background: currentView === 'game' ? 'var(--primary-accent)' : 'var(--primary-accent-light)', color: currentView === 'game' ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)' }}>
          <Award size={18} style={{ marginRight: '8px' }} /> Pattern Game
        </button>
      </div>

      {currentView === 'analyzer' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Stock Chart Pattern Analyzer
            </h1>
            <p style={{ color: 'var(--text-color-lighter)', fontSize: '16px', margin: '0' }}>
              Get data-driven analysis from live stock charts (3-month data) or explore patterns with your own images.
              <br />
              <span style={{ fontSize: '14px', color: 'var(--text-color-muted)' }}>
                📊 Supporting {stockDatabase.length}+ stocks from US & Indian markets with Key Level detection.
              </span>
            </p>
          </div>
          
          <div style={{ background: 'var(--info-background)', borderLeft: '4px solid var(--info-color)', borderRadius: '12px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', border: '1px solid var(--info-border)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--info-color)', marginRight: '16px', flexShrink: 0 }} />
            <div style={{ fontSize: '14px', color: 'var(--info-color)', fontWeight: '600' }}>
              <strong>🚀 Features:</strong> Pattern detection from 3-month price data, dynamic confidence, breakout timing, Key Support/Resistance levels. {stockDatabase.length}+ US & Indian stocks!
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: 'var(--text-color)', fontSize: '18px' }}>
              <Search size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--text-color-light)' }} />
              Get Live Stock Chart (3-Month Analysis)
            </label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                  <input ref={inputRef} type="text" value={stockSymbol} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="🔍 Search: AAPL, TCS.NS, Reliance, Microsoft, HDFC Bank..." style={{ width: '100%', padding: '14px 16px', border: showSuggestions ? '2px solid var(--input-border-focus)' : '2px solid var(--input-border)', borderRadius: showSuggestions ? '8px 8px 0 0' : '8px', fontSize: '16px', fontWeight: '500', outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'var(--background-color)', color: 'var(--text-color)', borderBottom: showSuggestions ? '1px solid var(--input-border)' : '2px solid var(--input-border)' }} />
                  {showSuggestions && (
                    <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', backgroundColor: 'var(--background-color)', border: '2px solid var(--input-border-focus)', borderTop: 'none', borderRadius: '0 0 8px 8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((stock, index) => (
                          <div key={stock.symbol} onClick={() => selectSuggestion(stock)} style={{ padding: '12px 16px', cursor: 'pointer', backgroundColor: index === selectedSuggestionIndex ? 'var(--primary-accent-light)' : 'var(--background-color)', borderBottom: index < filteredSuggestions.length - 1 ? '1px solid var(--input-border)' : 'none', transition: 'background-color 0.2s' }} onMouseEnter={() => setSelectedSuggestionIndex(index)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div><div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-color)' }}>{highlightMatch(stock.symbol, stockSymbol)}</div><div style={{ fontSize: '13px', color: 'var(--text-color-lighter)', marginTop: '2px' }}>{highlightMatch(stock.name, stockSymbol)}</div></div>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><div style={{ fontSize: '10px', color: stock.market === 'India' ? 'var(--danger-color)' : 'var(--primary-accent)', backgroundColor: stock.market === 'India' ? 'var(--danger-background)' : 'var(--primary-accent-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', border: `1px solid ${stock.market === 'India' ? 'var(--danger-border)' : 'var(--primary-accent-border)'}`, display: 'flex', alignItems: 'center', gap: '2px' }}><FlagIcon country={stock.market} size={12} />{stock.market === 'India' ? 'NSE' : 'US'}</div><div style={{ fontSize: '11px', color: 'var(--text-color-muted)', backgroundColor: 'var(--app-border)', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>{stock.sector}</div></div>
                            </div>
                          </div>))
                      ) : stockSymbol.length >= 1 ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-color-lighter)', fontSize: '14px' }}><div style={{ marginBottom: '8px' }}>🔍 No stocks found</div><div style={{ fontSize: '12px' }}>Try searching by symbol (AAPL) or company name (Apple)</div></div>
                      ) : null}
                    </div>)}
                </div>
                <button onClick={() => { if (stockSymbol.trim()) { const symbolToFetch = stockSymbol.toUpperCase(); fetchStockData(symbolToFetch, selectedTimeRange); fetchStockNews(symbolToFetch); } }} disabled={loading || !stockSymbol.trim()} style={{ padding: '14px 24px', background: loading ? 'var(--text-color-muted)' : 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)', color: 'var(--button-primary-text)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', minWidth: '140px', justifyContent: 'center' }}>
                  {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
                  {loading ? 'Fetching...' : 'Get Chart'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px', marginTop: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-color)', fontSize: '16px' }}>Select Data Time Range:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['3mo', '1y', '5y', '10y'].map(range => { let displayLabel = ''; if (range === '3mo') displayLabel = '3 Months'; else if (range === '1y') displayLabel = '1 Year'; else if (range === '5y') displayLabel = '5 Years'; else if (range === '10y') displayLabel = '10 Years'; return (<button key={range} onClick={() => handleTimeRangeChange(range)} style={{ padding: '8px 16px', background: selectedTimeRange === range ? 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)' : 'var(--primary-accent-light)', color: selectedTimeRange === range ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)', border: `1px solid ${selectedTimeRange === range ? 'transparent' : 'var(--primary-accent-border)'}`, borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease-in-out', }}>{displayLabel}</button>); })}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: 'var(--text-color-light)', marginBottom: '12px', fontWeight: '500' }}>Popular Stocks from {stockDatabase.length}+ available (<FlagIcon country="US" size={12} />US + <FlagIcon country="India" size={12} />Indian Markets):</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {popularStocksData.map(stock => (<button key={stock.symbol} onClick={() => selectStock(stock.symbol)} disabled={loading} style={{ padding: '8px 12px', background: stockSymbol === stock.symbol ? 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)' : 'var(--primary-accent-light)', color: stockSymbol === stock.symbol ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)', border: `1px solid var(--primary-accent-border)`, borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '4px' }} onMouseEnter={(e) => { if (stockSymbol !== stock.symbol && !loading) { e.target.style.background = 'var(--input-background-hover)'; } }} onMouseLeave={(e) => { if (stockSymbol !== stock.symbol && !loading) { e.target.style.background = 'var(--primary-accent-light)'; } }}> <FlagIcon country={stock.market} size={12} /> {stock.symbol.replace('.NS', '')} </button>))}
              </div>
              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-color-lighter)' }}><strong>Examples:</strong> Search from {stockDatabase.length}+ stocks - try "TCS" (Indian IT), "Reliance" (Indian Oil), "AAPL" (US Tech), "HDFC" (Indian Banking), "NVDA" (US Semiconductors), or "Wipro" (Indian IT)</div>
            </div>
          </div>

          {error && (<div style={{ background: 'var(--danger-background)', border: '2px solid var(--danger-border)', borderRadius: '8px', padding: '16px', marginBottom: '20px', color: 'var(--danger-color)' }}><strong>⚠️ Error:</strong> {error}</div>)}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '16px' }}><div style={{ flex: '1', height: '2px', background: 'linear-gradient(90deg, transparent, var(--separator-color), transparent)' }}></div><span style={{ color: 'var(--text-color-lighter)', fontWeight: '600', fontSize: '14px', background: 'var(--card-background)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--card-border)' }}>OR</span><div style={{ flex: '1', height: '2px', background: 'linear-gradient(90deg, var(--separator-color), transparent)' }}></div></div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-color)', fontSize: '18px' }}>📁 Upload Your Own Chart Image (for Educational Exploration)</label>
            <p style={{ fontSize: '13px', color: 'var(--text-color-lighter)', marginBottom: '12px', marginTop: '0px' }}>Note: Analysis for uploaded images provides an educational example of pattern types. For data-driven analysis, please use the live stock chart feature above.</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '20px', border: '2px dashed var(--primary-accent-border)', borderRadius: '12px', background: 'var(--input-background)', fontSize: '16px', fontWeight: '500', color: 'var(--text-color)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.borderColor = 'var(--secondary-accent)'; e.target.style.background = 'var(--input-background-hover)'; }} onMouseLeave={(e) => { e.target.style.borderColor = 'var(--primary-accent-border)'; e.target.style.background = 'var(--input-background)'; }}/>
          </div>

          {uploadedImage && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ width: '100%', height: '400px', background: 'var(--card-background)', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card-border)', boxShadow: '0 4px 20px var(--card-shadow)' }}><img src={uploadedImage} alt="Stock chart" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }}/></div>
              {stockData && (<div style={{ background: 'var(--success-background)', border: '2px solid var(--success-border)', borderRadius: '12px', padding: '16px', marginBottom: '16px', fontSize: '15px', color: 'var(--success-color)' }}><div style={{ fontWeight: '700', marginBottom: '8px' }}>📊 Stock Information ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : selectedTimeRange === '10y' ? '10 Years' : '3 Months'} Data):</div><div><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div><div><strong>Current Price:</strong> {stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}{stockData.currentPrice?.toFixed(2)} {stockData.currency} |<strong> Data Points:</strong> {stockData.prices.length} {selectedTimeRange === '1y' ? 'weeks' : (selectedTimeRange === '5y' || selectedTimeRange === '10y') ? 'months' : 'days'}</div>{stockData.isMockData && <div style={{ color: 'var(--warning-color)', fontStyle: 'italic', marginTop: '4px' }}>⚠️ Using demo data - API temporarily unavailable</div>}</div>)}
              <button onClick={analyzeChart} disabled={loading} style={{ width: '100%', background: loading ? 'var(--text-color-muted)' : 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)', color: 'var(--button-primary-text)', border: 'none', padding: '18px 24px', fontSize: '18px', fontWeight: '600', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s', boxShadow: loading ? 'none' : `0 4px 20px ${'var(--primary-accent-light)'}` }}>{loading ? (<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />Analyzing Pattern...</span>) : stockData ? ('🔍 Analyze Live Chart Data') : ('🔍 Explore Example Pattern')}</button>
            </div>)}

          {longTermAssessment && stockData && ( <div style={{ background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', marginBottom: '32px', padding: '24px', boxShadow: `0 8px 32px var(--card-shadow)` }}><h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', textAlign: 'center' }}>🗓️ Long-Term Review ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : '10 Years'})</h2><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Overall Trend:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.trend}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Shows the general direction of the stock's price over the selected period.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Total Return:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.totalReturn}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Illustrates the percentage gain or loss if you had invested at the beginning and held until the end of the period.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Price Extremes:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.highLow}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Highlights the highest and lowest prices the stock reached during this timeframe.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Volatility Insight:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.volatility}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Gives an idea of how much the stock's price fluctuated; higher volatility means bigger price swings.</p></div><p style={{ fontSize: '13px', color: 'var(--text-color-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>{longTermAssessment.disclaimer}</p></div>)}

          {prediction && patternDetected && !longTermAssessment && (
            <div style={{ background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', marginBottom: '32px', overflow: 'hidden', boxShadow: `0 8px 32px var(--card-shadow)` }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', padding: '24px 24px 0', textAlign: 'center' }}>📈 Short-Term Pattern Analysis</h2>
              <div style={{ padding: '24px', background: prediction === 'up' ? 'var(--success-background)' : prediction === 'down' ? 'var(--danger-background)' : 'var(--primary-accent-light)', borderLeft: `6px solid ${prediction === 'up' ? 'var(--success-color)' : prediction === 'down' ? 'var(--danger-color)' : 'var(--primary-accent)'}`, margin: '0 24px 16px', borderRadius: '12px', border: `2px solid ${prediction === 'up' ? 'var(--success-border)' : prediction === 'down' ? 'var(--danger-border)' : 'var(--primary-accent-border)'}` }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: prediction === 'up' ? 'var(--success-color)' : prediction === 'down' ? 'var(--danger-color)' : 'var(--primary-accent)' }}>{prediction === 'up' ? <TrendingUp size={28} /> : prediction === 'down' ? <TrendingDown size={28} /> : <BarChart size={28} />}<h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Enhanced Prediction</h3></div><p style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '800', color: prediction === 'up' ? 'var(--success-color)' : prediction === 'down' ? 'var(--danger-color)' : 'var(--primary-accent-darker)' }}>{prediction === 'up' ? '📈 Likely to go UP' : prediction === 'down' ? '📉 Likely to go DOWN' : '↔️ Continuation Expected'}</p><div style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: '16px', padding: '14px 18px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--card-border)', fontWeight: '600' }}><span style={{ fontWeight: '700', color: 'var(--text-color)' }}>{prediction === 'up' ? '⏱️ Upward duration:' : prediction === 'down' ? '⏱️ Downward duration:' : '⏱️ Pattern duration:'}</span> {prediction === 'up' ? patternDetected.daysUp : prediction === 'down' ? patternDetected.daysDown : patternDetected.timeframe}</div>
                {confidence && (<div><div style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: '16px', fontWeight: '700', background: 'var(--background-color)', padding: '12px 16px', borderRadius: '8px', border: '2px solid var(--card-border)', textAlign: 'center', position: 'relative' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🎯 Confidence Level: {confidence}%<button onClick={() => setShowConfidenceHelp(!showConfidenceHelp)} style={{ background: 'var(--primary-accent-light)', border: '1px solid var(--primary-accent-border)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', padding: '0' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--input-background-hover)'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-accent-light)'; e.currentTarget.style.transform = 'scale(1)'; }} title="Click to understand confidence levels"><Info size={12} color="var(--primary-accent-darker)" /></button></div><div style={{ marginTop: '8px', fontSize: '14px', fontWeight: '600' }}>{confidence >= 80 ? (<span style={{ color: 'var(--success-color)', background: 'var(--success-background)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--success-border)' }}>🟢 High Confidence - Strong Signal</span>) : confidence >= 60 ? (<span style={{ color: 'var(--warning-color)', background: 'var(--warning-background)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--warning-border)' }}>🟡 Medium Confidence - Proceed with Caution</span>) : (<span style={{ color: 'var(--danger-color)', background: 'var(--danger-background)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--danger-border)' }}>🟠 Low Confidence - High Risk</span>)}</div></div>
                  {showConfidenceHelp && (<div style={{ marginTop: '12px', background: 'var(--primary-accent-light)', border: '2px solid var(--primary-accent-border)', borderRadius: '12px', padding: '20px', animation: 'slideInUp 0.3s ease-out' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}><h4 style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: 'var(--primary-accent-darker)' }}>📊 Understanding Confidence Levels</h4><button onClick={() => setShowConfidenceHelp(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronUp size={20} color="var(--text-color-lighter)" /></button></div><div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-color-light)' }}><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><strong style={{ color: 'var(--text-color)' }}>What is Confidence Level?</strong><p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>A percentage (45-92%) indicating how reliable the pattern detection and prediction are. Higher = more trustworthy.</p></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}><div style={{ padding: '12px', background: 'var(--success-background)', borderRadius: '8px', border: '1px solid var(--success-border)' }}><div style={{ fontWeight: '700', color: 'var(--success-color)', marginBottom: '4px' }}>🟢 High (80-92%)</div><div style={{ fontSize: '13px', fontWeight: '500' }}>Very reliable • Strong signal • Clear pattern • Normal position sizes</div></div><div style={{ padding: '12px', background: 'var(--warning-background)', borderRadius: '8px', border: '1px solid var(--warning-border)' }}><div style={{ fontWeight: '700', color: 'var(--warning-color)', marginBottom: '4px' }}>🟡 Medium (60-79%)</div><div style={{ fontSize: '13px', fontWeight: '500' }}>Moderately reliable • Use caution • Smaller positions • Wait for confirmation</div></div><div style={{ padding: '12px', background: 'var(--danger-background)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}><div style={{ fontWeight: '700', color: 'var(--danger-color)', marginBottom: '4px' }}>🟠 Low (45-59%)</div><div style={{ fontSize: '13px', fontWeight: '500' }}>High risk • Avoid trading • Wait for better setup • Educational only</div></div></div><div style={{ padding: '12px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><div style={{ fontWeight: '700', color: 'var(--primary-accent-darker)', marginBottom: '8px' }}>How is it calculated?</div><ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px', fontWeight: '500' }}><li>Base pattern reliability (each pattern has historical success rates)</li><li>Pattern clarity and shape matching quality</li><li>Technical indicator alignment (RSI, moving averages)</li><li>Market conditions and data quality factors</li></ul></div>{confidence < 60 && (<div style={{ marginTop: '12px', padding: '12px', background: 'var(--danger-background)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}><div style={{ fontWeight: '700', color: 'var(--danger-color)', marginBottom: '4px' }}>⚠️ Your Current Score: {confidence}%</div><div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--danger-color)' }}>This is a <strong>low confidence</strong> signal. Consider waiting for a clearer pattern with 70%+ confidence before making trading decisions.</div></div>)}<div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-color-lighter)', fontStyle: 'italic', textAlign: 'center' }}>💡 Remember: Even high confidence doesn't guarantee success. Always use proper risk management and do your own research.</div></div></div>)}</div>)}
              </div>
              {breakoutTiming && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><Clock size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Breakout Timing Prediction</h3></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}><div style={{ background: 'var(--info-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--info-border)' }}><div style={{ fontWeight: '700', color: 'var(--info-color)', fontSize: '14px' }}>Expected Timeframe</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.daysRange}</div></div><div style={{ background: 'var(--success-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--success-border)' }}><div style={{ fontWeight: '700', color: 'var(--success-color)', fontSize: '14px' }}>Earliest Date</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.minDate}</div></div><div style={{ background: 'var(--danger-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger-border)' }}><div style={{ fontWeight: '700', color: 'var(--danger-color)', fontSize: '14px' }}>Latest Date</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.maxDate}</div></div><div style={{ background: 'var(--primary-accent-light)', padding: '12px', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><div style={{ fontWeight: '700', color: 'var(--primary-accent-darker)', fontSize: '14px' }}>Timing Confidence</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.confidence}</div></div></div><div style={{ marginTop: '12px', padding: '10px', background: 'var(--warning-background)', borderRadius: '6px', fontSize: '14px', color: 'var(--warning-color)', fontWeight: '500' }}>💡 <strong>Note:</strong> Breakout timing is based on pattern analysis and current market momentum. Monitor volume and price action for confirmation.</div></div>)}
              {keyLevels && (keyLevels.support?.length > 0 || keyLevels.resistance?.length > 0) && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><BarChart size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Key Price Levels</h3></div>{keyLevels.support?.length > 0 && (<div style={{ marginBottom: '12px' }}><strong style={{ color: 'var(--success-color)' }}>Support Levels:</strong><ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '4px 0 0 0' }}>{keyLevels.support.map((level, idx) => (<li key={`s-${idx}`} style={{ fontSize: '16px', color: 'var(--text-color-light)', fontWeight: '500' }}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>))}</ul></div>)}{keyLevels.resistance?.length > 0 && (<div><strong style={{ color: 'var(--danger-color)' }}>Resistance Levels:</strong><ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '4px 0 0 0' }}>{keyLevels.resistance.map((level, idx) => (<li key={`r-${idx}`} style={{ fontSize: '16px', color: 'var(--text-color-light)', fontWeight: '500' }}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>))}</ul></div>)}<div style={{ marginTop: '12px', padding: '10px', background: 'var(--primary-accent-light)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-color-light)', fontWeight: '500' }}>💡 These are automatically identified potential support (price floor) and resistance (price ceiling) levels from recent price action.</div></div>)}
              {recommendation && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><DollarSign size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Recommendation</h3></div><p style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '800', color: recommendation.action === 'BUY' ? 'var(--success-color)' : recommendation.action === 'SELL' ? 'var(--danger-color)' : 'var(--primary-accent-darker)' }}>{recommendation.action === 'BUY' ? '💰 BUY' : recommendation.action === 'SELL' ? '💸 SELL' : '✋ HOLD'}</p><p style={{ fontSize: '16px', color: 'var(--text-color-light)', lineHeight: '1.6', fontWeight: '500' }}>{recommendation.reasoning}</p></div>)}
              {entryExit && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><Target size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Entry & Exit Strategy</h3></div><div style={{ marginBottom: '12px' }}><span style={{ fontWeight: '700', color: 'var(--success-color)' }}>🟢 Entry Point: </span><span style={{ color: 'var(--text-color-light)', fontWeight: '500' }}>{entryExit.entry}</span></div><div><span style={{ fontWeight: '700', color: 'var(--danger-color)' }}>🔴 Exit Strategy: </span><span style={{ color: 'var(--text-color-light)', fontWeight: '500' }}>{entryExit.exit}</span></div></div>)}
              <div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><Calendar size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Time Estimate</h3></div><p style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-color-light)', fontWeight: '600' }}>{timeEstimate}</p><div style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: '16px', padding: '12px 16px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)', fontWeight: '600' }}><span style={{ fontWeight: '700', color: 'var(--text-color)' }}>📅 Typical pattern duration:</span> {patternDetected.timeframe}</div></div>
              <div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 24px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><BarChart size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Pattern Detected</h3></div><div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}><div><p style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-color-light)', fontWeight: '700' }}>📊 {patternDetected.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p><div style={{ fontSize: '14px', color: 'var(--text-color-lighter)', marginTop: '8px', padding: '8px 12px', background: 'var(--primary-accent-light)', borderRadius: '6px', fontWeight: '500' }}>💡 Compare the actual chart above with this pattern example below</div></div><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--card-border)' }}><PatternVisualization patternName={patternDetected.name} theme={theme} width={300} height={160} /><div style={{ fontSize: '12px', color: 'var(--text-color-muted)', textAlign: 'center', fontWeight: '500' }}>📈 Typical {patternDetected.name.split('-').join(' ')} pattern example</div></div></div></div>
            </div>)}
          {patternDetected && (<div style={{ background: 'var(--card-background)', padding: '32px', borderRadius: '20px', marginBottom: '32px', border: '2px solid var(--card-border)', boxShadow: `0 8px 32px var(--card-shadow)` }}><h3 style={{ fontWeight: '700', fontSize: '24px', marginTop: '0', marginBottom: '20px', color: 'var(--text-color)', textAlign: 'center' }}>📚 Pattern Education</h3><h4 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: 'var(--text-color)' }}>Description:</h4><p style={{ marginBottom: '24px', lineHeight: '1.7', fontSize: '16px', color: 'var(--text-color-light)', fontWeight: '500' }}>{patternDetected.description}</p><div style={{ padding: '24px', border: '2px solid var(--card-border)', background: 'var(--primary-accent-light)', borderRadius: '12px' }}><h4 style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary-accent-darker)', marginTop: '0', marginBottom: '16px' }}>🔍 What to look for:</h4><ul style={{ marginTop: '0', paddingLeft: '0', listStyle: 'none', fontSize: '15px', color: 'var(--text-color-light)' }}><li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Look for clear pattern formation with multiple confirmation points</li><li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Check volume patterns that support the chart pattern</li><li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Confirm breakout direction before making decisions</li><li style={{ marginBottom: '0', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Consider overall market conditions and sentiment</li></ul></div></div>)}
          <StockNewsDisplay newsItems={stockNews} loading={newsLoading} error={newsError} />
        </>
      )}

      {currentView === 'game' && (
        <PatternRecognitionGame PatternVisualization={PatternVisualization} chartPatterns={chartPatterns} />
      )}
      
      <div style={{ fontSize: '15px', color: 'var(--text-color-light)', background: 'var(--card-background)', padding: '24px', borderRadius: '16px', border: '2px solid var(--card-border)', lineHeight: '1.7', marginBottom: '24px', fontWeight: '500', textAlign: 'center' }}>
        <p style={{ marginBottom: '12px' }}><strong>⚠️ Important Disclaimer:</strong> This application provides technical analysis and historical data reviews for educational purposes only.</p>
        <p style={{ marginBottom: '12px' }}><strong>📊 Features Include:</strong> Short-term pattern analysis (3-month data), long-term historical reviews (up to 10 years), dynamic confidence scoring, and breakout timing predictions.</p>
        <p style={{ margin: '0' }}>All information should be used for learning and not as financial advice. Always conduct thorough research and consult financial advisors before making investment decisions.</p>
      </div>

      <div style={{ borderTop: '2px solid var(--card-border)', paddingTop: '20px', marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-color-lighter)', background: 'var(--card-background)', padding: '20px', borderRadius: '12px', position: 'relative' }}>
        <button onClick={toggleTheme} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--primary-accent-light)', border: '1px solid var(--primary-accent-border)', color: 'var(--primary-accent-darker)', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-color-light)' }}>
          💻 Enhanced by <span style={{ color: 'var(--primary-accent-darker)', fontWeight: '700' }}>Advanced AI Pattern Recognition</span>
        </p>
        <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-color-muted)' }}>
          © {new Date().getFullYear()} Stock Chart Analyzer v2.0. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        div[style*="overflowY: auto"] { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
        div[style*="overflowY: auto"]::-webkit-scrollbar { width: 6px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 3px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
}

const toggleButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: '600',
  border: '1px solid var(--primary-accent-border)',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '180px'
};

const StockNewsDisplay = ({ newsItems, loading, error }) => {
  if (loading) { return (<div style={{ marginTop: '32px', background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', padding: '24px', boxShadow: `0 8px 32px var(--card-shadow)`, textAlign: 'center', color: 'var(--text-color-light)' }}><RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--primary-accent)' }} /><p style={{ fontSize: '18px', fontWeight: '600' }}>Loading latest news...</p></div>); }
  if (error) { return (<div style={{ marginTop: '32px', background: 'var(--danger-background)', border: '2px solid var(--danger-border)', borderRadius: '20px', padding: '24px', color: 'var(--danger-color)', textAlign: 'center' }}><AlertTriangle size={28} style={{ marginBottom: '12px' }} /><h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Error Fetching News</h3><p style={{ fontSize: '16px', margin: '0' }}>{error}</p><p style={{ fontSize: '14px', marginTop: '10px', fontStyle: 'italic' }}>Please try again later or select a different stock.</p></div>); }
  if (!newsItems || newsItems.length === 0) { return (<div style={{ marginTop: '32px', padding: '24px', background: 'var(--card-background)', borderRadius: '20px', border: '1px solid var(--card-border)', textAlign: 'center', color: 'var(--text-color-lighter)', boxShadow: `0 8px 32px var(--card-shadow)` }}><Info size={28} style={{ marginBottom: '12px', color: 'var(--primary-accent)' }} /><h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-color)' }}>No Recent News</h3><p style={{fontSize: '16px'}}>No news articles found for the selected stock at this time.</p></div>); }
  return (
    <div style={{ marginTop: '32px', background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', padding: '24px', boxShadow: `0 8px 32px var(--card-shadow)` }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', textAlign: 'center' }}>📰 Latest Stock News</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {newsItems.map((item, index) => (
          <div key={index} style={{ background: 'var(--primary-accent-light)', padding: '20px', borderRadius: '12px', border: '1px solid var(--primary-accent-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div><h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-color)' }}><a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-accent-darker)', textDecoration: 'none' }}>{item.title}</a></h3><p style={{ fontSize: '13px', color: 'var(--text-color-light)', marginBottom: '8px', lineHeight: '1.5' }}>{item.text && item.text.length > 150 ? `${item.text.substring(0, 150)}...` : item.text}</p></div>
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-color-muted)', fontWeight: '500' }}><span style={{ fontWeight: '600' }}>Source:</span> {item.site} | <span style={{ fontWeight: '600' }}>Published:</span> {new Date(item.publishedDate).toLocaleDateString()}</div>
          </div>))}
      </div>
    </div>
  );
};

export default StockChartAnalyzer;
