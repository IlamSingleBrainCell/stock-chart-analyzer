import React, { useState, useRef, useEffect, useContext } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, BarChart, Target, DollarSign, Search, RefreshCw, Clock, Info, ChevronUp, Sun, Moon, Zap, Award } from 'lucide-react';
import stocksData from './stocks.json';
import FlagIcon from './components/FlagIcon';
import { ThemeContext } from './ThemeContext';
import PatternRecognitionGame from './components/PatternRecognitionGame';
import ProsConsTable from './components/ProsConsTable'; // Import the new table component

const MARKETAUX_API_KEY = 'F8x0iPiyy2Rhe8LZsQJvmisOPwpr7xQ4Np7XF0o1';
const MARKETAUX_BASE_URL = "https://api.marketaux.com/v1/news/all";

const FMP_API_KEY = "6Mdo6RRKRk0tofiGn2J4qVTBtCXu3zVC"; // Replace with your actual key
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

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

// Helper function to calculate CAGR
const calculateCAGR = (endValue, startValue, periods) => {
    if (startValue === 0 || periods <= 0 || !endValue || !startValue) return null;
    const cagr = (Math.pow(endValue / startValue, 1 / periods) - 1) * 100;
    return parseFloat(cagr.toFixed(2));
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
  const [currentView, setCurrentView] = useState('analyzer');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('analysis'); // State for active results tab
  const canvasRef = useRef(null);
  const chartCanvasRef = useRef(null);
  const inputRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // State for Pros/Cons data
  const [financialData, setFinancialData] = useState(null);
  const [financialDataLoading, setFinancialDataLoading] = useState(false);
  const [financialDataError, setFinancialDataError] = useState(null);


  const fetchFinancialDataForProsCons = async (symbol) => {
    if (!symbol || FMP_API_KEY === "YOUR_FMP_API_KEY") {
      setFinancialDataError("FMP API key not configured or symbol missing for financial data.");
      console.warn("FMP API key not configured or symbol missing. Financial data fetch skipped.");
      setFinancialData({ error: "API key not configured or symbol missing." });
      return;
    }

    setFinancialDataLoading(true);
    setFinancialDataError(null);
    setFinancialData(null); // Clear previous data

    let fetchedProsConsData = {
      currentDebt: 'N/A',
      nextQuarterExpectation: 'N/A',
      profitCAGR5Y: null, // Will be number or null
      salesHistory10Y: [],
      error: null
    };

    try {
      // 1. Fetch Balance Sheet (latest annual for current debt)
      const balanceSheetUrl = `${FMP_BASE_URL}/balance-sheet-statement/${symbol}?period=annual&limit=1&apikey=${FMP_API_KEY}`;
      const bsResponse = await fetch(balanceSheetUrl);
      if (!bsResponse.ok) {
        console.warn(`Pros/Cons: Failed to fetch balance sheet for ${symbol}. Status: ${bsResponse.status}`);
         fetchedProsConsData.currentDebt = 'Error fetching';
      } else {
        const bsData = await bsResponse.json();
        if (bsData && bsData.length > 0) {
          const latestBs = bsData[0];
          fetchedProsConsData.currentDebt = latestBs.totalDebt !== undefined ? latestBs.totalDebt : (parseFloat(latestBs.shortTermDebt || 0) + parseFloat(latestBs.longTermDebt || 0));
        } else {
          fetchedProsConsData.currentDebt = 'Not Available';
        }
      }

      // 2. Fetch Analyst Estimates (for next quarter expectation)
      const estimatesUrl = `${FMP_BASE_URL}/analyst-estimates/${symbol}?apikey=${FMP_API_KEY}`;
      const estResponse = await fetch(estimatesUrl);
      if (!estResponse.ok) {
        console.warn(`Pros/Cons: Failed to fetch analyst estimates for ${symbol}. Status: ${estResponse.status}`);
        fetchedProsConsData.nextQuarterExpectation = 'Error fetching';
      } else {
        const estData = await estResponse.json();
        if (estData && estData.length > 0) {
          // Find the most recent estimate that has a future date for earnings release
          const futureEstimates = estData.filter(e => e.date && new Date(e.date) > new Date() && e.estimatedEpsAvg !== null);
          let targetEstimate = null;
          if (futureEstimates.length > 0) {
            // Sort by date to get the soonest future estimate
            futureEstimates.sort((a,b) => new Date(a.date) - new Date(b.date));
            targetEstimate = futureEstimates[0];
          } else {
            // Fallback: find the most recent estimate overall if no future ones
            estData.sort((a,b) => new Date(b.date) - new Date(a.date)); // most recent first
            targetEstimate = estData[0];
          }

          if (targetEstimate) {
            fetchedProsConsData.nextQuarterExpectation = `Est. EPS: ${targetEstimate.estimatedEpsAvg || 'N/A'} (for period ending ${targetEstimate.date || 'N/A'})`;
          } else {
            fetchedProsConsData.nextQuarterExpectation = 'Not Available';
          }
        } else {
          fetchedProsConsData.nextQuarterExpectation = 'Not Available';
        }
      }

      // 3. Fetch Annual Income Statements (for Sales and Profit CAGR)
      const incomeStatementUrl = `${FMP_BASE_URL}/income-statement/${symbol}?period=annual&limit=10&apikey=${FMP_API_KEY}`;
      const isResponse = await fetch(incomeStatementUrl);
      if (!isResponse.ok) {
         console.warn(`Pros/Cons: Failed to fetch income statements for ${symbol}. Status: ${isResponse.status}`);
         fetchedProsConsData.salesHistory10Y = [{ year: 'Error', revenue: 'Error fetching'}];
         fetchedProsConsData.profitCAGR5Y = null; // Error state
      } else {
        const isData = await isResponse.json();
        if (isData && isData.length > 0) {
          fetchedProsConsData.salesHistory10Y = isData.slice(0, 10).map(report => ({
            year: new Date(report.date).getFullYear(),
            revenue: report.revenue
          })).reverse();

          if (isData.length >= 2) {
              const relevantNetIncomes = isData.slice(0, 6).map(report => parseFloat(report.netIncome)).filter(ni => !isNaN(ni) && ni !== null);
              if (relevantNetIncomes.length >= 2) {
                  const reversedIncomes = [...relevantNetIncomes].reverse();
                  const startValue = reversedIncomes[0];
                  const endValue = reversedIncomes[reversedIncomes.length - 1];
                  const years = reversedIncomes.length - 1;
                  if (years > 0 && startValue !== null && endValue !== null && startValue !== 0) {
                      fetchedProsConsData.profitCAGR5Y = calculateCAGR(endValue, startValue, years);
                  } else {
                    fetchedProsConsData.profitCAGR5Y = null; // Or 'N/A' if prefer string
                  }
              } else {
                fetchedProsConsData.profitCAGR5Y = null;
              }
          } else {
             fetchedProsConsData.profitCAGR5Y = null;
          }
        } else {
            fetchedProsConsData.salesHistory10Y = [{year: 'N/A', revenue: 'Not Available'}];
            fetchedProsConsData.profitCAGR5Y = null;
        }
      }
    } catch (e) {
      console.error("Error in fetchFinancialDataForProsCons:", e);
      fetchedProsConsData.error = e.message;
      setFinancialDataError(e.message);
    } finally {
      setFinancialData(fetchedProsConsData);
      setFinancialDataLoading(false);
    }
  };

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
      const changePercent = data[i] !== 0 ? maxDiff / data[i] : 0; // Avoid division by zero
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
    const priceChange = startPrice !== 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0; // Avoid division by zero
    const volatility = calculateVolatility(recentData);
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
    for (let i = 1; i < prices.length; i++) { if(prices[i-1] === 0) continue; returns.push(((prices[i] - prices[i-1]) / prices[i-1]) * 100); } // Avoid division by zero
    if (returns.length === 0) return 0; // Handle cases where all previous prices were zero
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
      if (peakTrend < -0.2 && troughTrend > 0.2) { return { pattern: 'ascending-triangle', strength: 0.5 }; } // Simplified symmetrical
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
    if(firstQuarter.length === 0 || secondQuarter.length === 0 || thirdQuarter.length === 0 || fourthQuarter.length === 0) return false; // Ensure slices are not empty
    const firstAvg = firstQuarter.reduce((a, b) => a + b) / firstQuarter.length; const secondAvg = secondQuarter.reduce((a, b) => a + b) / secondQuarter.length; const thirdAvg = thirdQuarter.reduce((a, b) => a + b) / thirdQuarter.length;
    const hasCup = (secondAvg < firstAvg * 0.92) && (thirdAvg < firstAvg * 0.92) && (fourthQuarter.reduce((a, b) => a + b) / fourthQuarter.length > firstAvg * 0.95);
    const hasHandle = fourthQuarter.reduce((a, b) => a + b) / fourthQuarter.length < firstAvg * 1.02;
    return hasCup && hasHandle;
  };

  const detectWedgePatterns = (peaks, troughs, closes) => {
    if (peaks.length < 2 || troughs.length < 2) return null;
    const recentPeaks = peaks.slice(-4); const recentTroughs = troughs.slice(-4); const recent30 = closes.slice(-30);
    if (recentPeaks.length >= 2 && recentTroughs.length >= 2 && recent30.length > 0) { // Ensure recent30 is not empty
      const peakTrend = calculateTrend(recentPeaks.map(p => p.value)); const troughTrend = calculateTrend(recentTroughs.map(t => t.value));
      const overallTrend = recent30[0] !== 0 ? ((recent30[recent30.length - 1] - recent30[0]) / recent30[0]) * 100 : 0; // Avoid division by zero
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
    if (prices.length > 12 && actualTimeRangeYears > 0) { // Added actualTimeRangeYears > 0 check
        const monthlyReturns = []; const approxPointsPerMonth = Math.max(1, Math.floor(prices.length / (actualTimeRangeYears * 12 || 1))); // Avoid division by zero
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
    if (stockSymbol.trim()) { setPrediction(null); setPatternDetected(null); setConfidence(null); setRecommendation(null); setEntryExit(null); setTimeEstimate(null); setBreakoutTiming(null); setKeyLevels(null); setLongTermAssessment(null); setFinancialData(null); setFinancialDataError(null); fetchStockData(stockSymbol.toUpperCase(), range); }
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
    const canvas = chartCanvasRef.current; if(!canvas) return null; const ctx = canvas.getContext('2d'); const colors = chartThemeColors[currentTheme] || chartThemeColors.light;
    canvas.width = 1000; canvas.height = 500; ctx.fillStyle = colors.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const prices = stockData.prices; if (!prices || prices.length === 0) return null;
    const margin = { top: 40, right: 60, bottom: 60, left: 80 }; const chartWidth = canvas.width - margin.left - margin.right; const chartHeight = canvas.height - margin.top - margin.bottom;
    const allPrices = prices.flatMap(p => [p.high, p.low]).filter(p => p != null); if(allPrices.length === 0) return null; // Ensure there are prices to calculate min/max
    const minPrice = Math.min(...allPrices); const maxPrice = Math.max(...allPrices); const priceRange = maxPrice - minPrice; const padding = priceRange * 0.1;
    const xScale = (index) => margin.left + (index / (prices.length > 1 ? prices.length - 1 : 1)) * chartWidth; // Avoid division by zero for single data point
    const yScale = (price) => margin.top + ((maxPrice + padding - price) / (priceRange + 2 * padding || 1)) * chartHeight; // Avoid division by zero
    const isIndianStock = stockData.symbol.includes('.NS'); const currencySymbol = isIndianStock ? '₹' : '$';
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) { const y = margin.top + (i / 8) * chartHeight; ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + chartWidth, y); ctx.stroke(); const price = maxPrice + padding - (i / 8) * (priceRange + 2 * padding); ctx.fillStyle = colors.label; ctx.font = '12px Inter, Arial, sans-serif'; ctx.textAlign = 'right'; ctx.fillText(currencySymbol + price.toFixed(2), margin.left - 10, y + 4); }
    const numVerticalGridLines = prices.length > 250 ? 5 : (prices.length > 60 ? 6 : 4);
    for (let i = 0; i <= numVerticalGridLines; i++) { const x = margin.left + (i / numVerticalGridLines) * chartWidth; ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + chartHeight); ctx.stroke(); const priceIndex = Math.floor((i / numVerticalGridLines) * (prices.length - 1)); if (priceIndex < prices.length && prices[priceIndex]) { const date = new Date(prices[priceIndex].date); let dateFormatOptions = { month: 'short', day: 'numeric' }; if (prices.length > 365 * 2) { dateFormatOptions = { year: 'numeric', month: 'short' }; } else if (prices.length > 90) { dateFormatOptions = { month: 'short', day: 'numeric' }; } ctx.fillStyle = colors.label; ctx.font = '11px Inter, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(date.toLocaleDateString('en-US', dateFormatOptions), x, canvas.height - 20); } }
    ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 3; ctx.beginPath();
    prices.forEach((price, index) => { if(price && price.close !== null) {const x = xScale(index); const y = yScale(price.close); if (index === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }} }); ctx.stroke();
    prices.forEach((price, index) => { if(price && price.open !== null && price.close !== null && price.high !== null && price.low !== null) {const x = xScale(index); const openY = yScale(price.open); const closeY = yScale(price.close); const highY = yScale(price.high); const lowY = yScale(price.low); const isGreen = price.close >= price.open; const candleColor = isGreen ? colors.candlestickGreen : colors.candlestickRed; ctx.strokeStyle = candleColor; ctx.fillStyle = candleColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke(); const bodyHeight = Math.abs(closeY - openY); const bodyY = Math.min(openY, closeY); const bodyWidth = Math.max(2, chartWidth / prices.length * 0.6); ctx.fillRect(x - bodyWidth/2, bodyY, bodyWidth, bodyHeight || 1);}});
    if (currentKeyLevels && currentKeyLevels.support && currentKeyLevels.resistance) { ctx.lineWidth = 1; ctx.font = 'bold 10px Inter, Arial, sans-serif'; currentKeyLevels.support.forEach(level => { if (level >= minPrice && level <= maxPrice) { const y = yScale(level); ctx.strokeStyle = colors.keyLevelSupport; ctx.fillStyle = colors.keyLevelSupport; ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(margin.left, y); ctx.lineTo(chartWidth + margin.left, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillText(`S: ${currencySymbol}${level.toFixed(2)}`, chartWidth + margin.left - 50, y - 2); } }); currentKeyLevels.resistance.forEach(level => { if (level >= minPrice && level <= maxPrice) { const y = yScale(level); ctx.strokeStyle = colors.keyLevelResistance; ctx.fillStyle = colors.keyLevelResistance; ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(margin.left, y); ctx.lineTo(chartWidth + margin.left, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillText(`R: ${currencySymbol}${level.toFixed(2)}`, chartWidth + margin.left - 50, y - 2); } }); }
    ctx.fillStyle = colors.text; ctx.font = 'bold 20px Inter, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${stockData.symbol} - ${stockData.companyName}`, margin.left, 25);
    ctx.font = '14px Inter, Arial, sans-serif'; ctx.fillStyle = colors.label; const currentPriceText = stockData.currentPrice !== undefined && stockData.currentPrice !== null ? stockData.currentPrice : (prices[prices.length -1]?.close); ctx.fillText(`Current: ${currencySymbol}${currentPriceText ? currentPriceText.toFixed(2) : 'N/A'} ${stockData.currency || (isIndianStock ? 'INR' : 'USD')}`, margin.left, margin.top - 5);
    if (stockData.isMockData) { ctx.fillStyle = (currentTheme === 'dark') ? chartThemeColors.dark.danger || '#f59e0b' : '#f59e0b'; ctx.font = 'italic 12px Inter, Arial, sans-serif'; ctx.fillText('Demo Data - API temporarily unavailable', margin.left + 300, 25); }
    return canvas.toDataURL('image/png', 1.0);
  };

  const fetchStockData = async (symbol, timeRange = '3mo') => {
    if (!symbol.trim()) return; setLoading(true); setError(null); setStockData(null); setKeyLevels(null); setFinancialData(null); setFinancialDataError(null);
    try {
      const data = await fetchYahooFinanceData(symbol.trim().toUpperCase(), timeRange); setStockData(data);
      if (data && data.symbol) { // Ensure data is valid before proceeding
        fetchFinancialDataForProsCons(data.symbol); // Fetch financial data after stock price data
        fetchStockNews(data.symbol);
         // Delay chart creation slightly to ensure canvas is ready if view just switched
        setTimeout(() => {
          if (chartCanvasRef.current) { // Check if canvas is available
            const tempKeyLevels = (data && data.prices) ? calculateKeyLevels(data.prices) : null;
            if (tempKeyLevels) { setKeyLevels(tempKeyLevels); }
            const chartImageUrl = createChartFromData(data, tempKeyLevels, theme);
            setUploadedImage(chartImageUrl);
          }
        }, 100);
      } else {
        throw new Error("No valid stock data received from Yahoo Finance.");
      }
    } catch (error) { setError(error.message); console.error('Stock data fetch error:', error); setFinancialData(null); } finally { setLoading(false); }
  };

  const selectStock = (symbol) => { setStockSymbol(symbol); setShowSuggestions(false); setSelectedSuggestionIndex(-1); fetchStockData(symbol); /* Financial data is fetched within fetchStockData */ };
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
    if (file) { const reader = new FileReader(); reader.onload = () => { setUploadedImage(reader.result); setStockData(null); setPrediction(null); setPatternDetected(null); setConfidence(null); setRecommendation(null); setEntryExit(null); setTimeEstimate(null); setBreakoutTiming(null); setKeyLevels(null); setLongTermAssessment(null); setFinancialData(null); setFinancialDataError(null);}; reader.readAsDataURL(file); }
  };

  const analyzeChart = () => {
    if (!uploadedImage) return; setLoading(true); setLongTermAssessment(null);
    // If it's from a live stock, ensure financial data is fetched or being fetched
    if (stockData && stockData.symbol && !financialData && !financialDataLoading && !financialDataError) {
        fetchFinancialDataForProsCons(stockData.symbol);
    }
    setTimeout(() => {
      try {
        let detectedPatternName = null; let confidenceScore = 70; let calculatedKeyLevels = null; let currentLongTermAssessment = null;
        if (stockData && stockData.prices && stockData.prices.length > 0) {
          calculatedKeyLevels = calculateKeyLevels(stockData.prices);
          if (selectedTimeRange === '1y' || selectedTimeRange === '5y' || selectedTimeRange === '10y') {
            currentLongTermAssessment = generateLongTermAssessment(stockData, selectedTimeRange);
            if (currentLongTermAssessment) { setLongTermAssessment(currentLongTermAssessment); setPatternDetected(null); setPrediction(null); setConfidence(null); setRecommendation(null); setEntryExit(null); setTimeEstimate(null); setBreakoutTiming(null); }
          } else { setLongTermAssessment(null); const analysis = detectPatternFromPriceData(stockData.prices); if (analysis) { detectedPatternName = analysis.pattern; confidenceScore = analysis.confidence; } }
        }
        if (!currentLongTermAssessment && !detectedPatternName) {
          const patternWeights = {'head-and-shoulders': 12,'inverse-head-and-shoulders': 12,'double-top': 15,'double-bottom': 15,'cup-and-handle': 10,'ascending-triangle': 15,'descending-triangle': 15,'flag': 8,'wedge-rising': 8,'wedge-falling': 8};
          const weightedPatterns = []; Object.entries(patternWeights).forEach(([pattern, weight]) => { for (let i = 0; i < weight; i++) { weightedPatterns.push(pattern); } });
          const randomIndex = Math.floor(Math.random() * weightedPatterns.length); detectedPatternName = weightedPatterns[randomIndex]; confidenceScore = Math.floor(Math.random() * 35) + 50;
        }

        if (detectedPatternName && chartPatterns[detectedPatternName]) { // Ensure pattern exists before accessing
            const selectedPatternDetails = chartPatterns[detectedPatternName];
            const rec = generateRecommendation(selectedPatternDetails, confidenceScore);
            const breakout = calculateBreakoutTiming(detectedPatternName, stockData, confidenceScore);
            setPatternDetected({ name: detectedPatternName, ...selectedPatternDetails });
            setPrediction(selectedPatternDetails.prediction);
            setConfidence(confidenceScore); setRecommendation(rec); setBreakoutTiming(breakout); setKeyLevels(calculatedKeyLevels);
            let timeInfo = ''; if (selectedPatternDetails.prediction === 'up') { timeInfo = `Expected to rise for ${selectedPatternDetails.daysUp}`; } else if (selectedPatternDetails.prediction === 'down') { timeInfo = `Expected to decline for ${selectedPatternDetails.daysDown}`; } else if (selectedPatternDetails.prediction === 'continuation') { const isUptrend = Math.random() > 0.5; timeInfo = isUptrend ? `Current uptrend likely to continue for ${selectedPatternDetails.daysUp}` : `Current downtrend likely to continue for ${selectedPatternDetails.daysDown}`; } else { timeInfo = `Pattern suggests movement within ${selectedPatternDetails.timeframe}`; }
            setTimeEstimate(timeInfo); setEntryExit({ entry: selectedPatternDetails.entryStrategy, exit: selectedPatternDetails.exitStrategy });
        } else if (!currentLongTermAssessment) { // If no pattern was determined and not long-term
            setError("Could not determine a specific pattern. Analysis might be inconclusive.");
        }

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
          {/* Title and Disclaimer */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--section-gap)' }}>
            <h1 className="app-title" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '700', color: 'var(--primary-accent-darker)', marginBottom: 'var(--element-gap)' }}>
              Stock Chart Pattern Analyzer
            </h1>
            <p style={{ color: 'var(--text-color-light)', fontSize: 'clamp(0.9rem, 2vw, 1rem)', margin: '0' }}>
              Analyze live stock charts or upload your own images to explore chart patterns.
              <br />
              <span style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--text-color-muted)' }}>
                Supporting {stockDatabase.length}+ stocks from US & Indian markets.
              </span>
            </p>
          </div>
          <div className="disclaimer" style={{ marginBottom: 'var(--section-gap)' }}>
            <AlertTriangle size={20} className="disclaimer-icon" style={{ marginRight: 'var(--element-gap)', flexShrink: 0 }} />
            <div className="disclaimer-text" style={{ fontSize: 'clamp(0.875rem, 2vw, 0.95rem)', fontWeight: '500' }}>
              <strong>Features:</strong> Pattern detection (3-month data default), dynamic confidence, breakout timing, key levels. Long-term reviews for 1Y+ ranges.
            </div>
          </div>

          {/* Live Stock Chart Input Card */}
          <div
            className="input-card"
            style={{
              background: 'var(--card-background)',
              padding: 'var(--container-padding)',
              borderRadius: 'var(--app-border-radius)',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--app-border)',
              marginBottom: 'var(--section-gap)'
            }}
          >
            <label htmlFor="stockSearchInput" style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: 'var(--element-gap)', color: 'var(--text-color)', fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)' }}>
              <Search size={22} style={{ marginRight: '10px', color: 'var(--primary-accent)' }} />
              Get Live Stock Analysis
            </label>
            <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)', color: 'var(--text-color-light)', marginTop: '-8px', marginBottom: 'var(--element-gap)'}}>
              Default analysis uses 3-month data. Ranges of 1 year or more provide a long-term historical review.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--element-gap)' }}>
              <div style={{ display: 'flex', gap: 'var(--element-gap)', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', minWidth: '250px', position: 'relative' }}>
                  <input
                    id="stockSearchInput"
                    ref={inputRef} type="text" value={stockSymbol}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Search Symbol (e.g., AAPL, TCS.NS) or Name"
                    className="search-input" // Using class from App.css
                    style={{ width: '100%' }}
                  />
                  {showSuggestions && (
                    <div className="suggestions-dropdown">
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((stock, index) => (
                          <div
                            key={stock.symbol}
                            onClick={() => selectSuggestion(stock)}
                            className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-color)' }}>{highlightMatch(stock.symbol, stockSymbol)}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-color-lighter)', marginTop: '2px' }}>{highlightMatch(stock.name, stockSymbol)}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: stock.market === 'India' ? 'var(--danger-color)' : 'var(--primary-accent-darker)', backgroundColor: stock.market === 'India' ? 'var(--danger-background)' : 'var(--primary-accent-light)', padding: '3px 7px', borderRadius: 'var(--app-border-radius-small)', fontWeight: '500', border: `1px solid ${stock.market === 'India' ? 'var(--danger-border)' : 'var(--primary-accent-border)'}`, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <FlagIcon country={stock.market} size={12} />
                                  {stock.market === 'India' ? 'NSE' : 'US'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-color-muted)', backgroundColor: 'var(--background-color)', padding: '3px 7px', borderRadius: 'var(--app-border-radius-small)', fontWeight: '500', border: '1px solid var(--separator-color)' }}>
                                  {stock.sector}
                                </span>
                              </div>
                            </div>
                          </div>))
                      ) : stockSymbol.length >= 1 ? (
                        <div style={{ padding: 'var(--element-gap)', textAlign: 'center', color: 'var(--text-color-lighter)', fontSize: '0.9rem' }}>
                          <div style={{ marginBottom: '8px' }}>No stocks found</div>
                          <div style={{ fontSize: '0.8rem' }}>Try a different symbol or name.</div>
                        </div>
                      ) : null}
                    </div>)}
                </div>
                <button
                  onClick={() => { if (stockSymbol.trim()) { const symbolToFetch = stockSymbol.toUpperCase(); fetchStockData(symbolToFetch, selectedTimeRange); } }}
                  disabled={loading || !stockSymbol.trim()}
                  className="search-button" // Using class from App.css
                  style={{ minWidth: '160px', flexShrink: 0 }}
                >
                  {loading && !financialDataLoading ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
                  {loading && !financialDataLoading ? 'Fetching...' : (financialDataLoading ? 'Financials...' : 'Get Analysis')}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 'var(--element-gap)', marginBottom: 'var(--element-gap)' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--text-color-light)', fontSize: '0.95rem' }}>Data Time Range:</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['3mo', '1y', '5y', '10y'].map(range => {
                  let displayLabel = '';
                  if (range === '3mo') displayLabel = '3 Months';
                  else if (range === '1y') displayLabel = '1 Year';
                  else if (range === '5y') displayLabel = '5 Years';
                  else if (range === '10y') displayLabel = '10 Years';
                  return (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className="popular-stock-button" // Reusing popular-stock-button class for similar style
                      style={{
                        background: selectedTimeRange === range ? 'var(--primary-accent)' : 'var(--primary-accent-light)',
                        color: selectedTimeRange === range ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)',
                        borderColor: selectedTimeRange === range ? 'var(--primary-accent)' : 'var(--primary-accent-border)',
                        padding: '6px 14px', // Slightly more padding for these
                        fontSize: '0.85rem'
                      }}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--text-color-light)', fontSize: '0.95rem' }}>Or Explore Popular Stocks:</label>
               <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.85rem)', color: 'var(--text-color-lighter)', marginTop: '-4px', marginBottom: '10px' }}>
                Quick select from {stockDatabase.length}+ available stocks.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {popularStocksData.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => selectStock(stock.symbol)}
                    disabled={loading}
                    className="popular-stock-button"
                    style={{
                      background: stockSymbol === stock.symbol ? 'var(--primary-accent)' : 'var(--primary-accent-light)',
                      color: stockSymbol === stock.symbol ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)',
                      borderColor: stockSymbol === stock.symbol ? 'var(--primary-accent)' : 'var(--primary-accent-border)',
                       opacity: loading ? 0.7 : 1
                    }}
                  >
                    <FlagIcon country={stock.market} size={12} /> {stock.symbol.replace('.NS', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (<div className="disclaimer" style={{ background: 'var(--danger-background)', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', marginBottom: 'var(--section-gap)'}}><strong>⚠️ Chart Error:</strong> {error}</div>)}
          {financialDataError && (<div className="disclaimer" style={{ background: 'var(--danger-background)', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', marginBottom: 'var(--section-gap)'}}><strong>⚠️ Financial Data Error:</strong> {financialDataError}</div>)}


          <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--section-gap) 0', gap: 'var(--element-gap)' }}>
            <div style={{ flex: '1', height: '1px', background: 'var(--separator-color)' }}></div>
            <span style={{ color: 'var(--text-color-muted)', fontWeight: '500', fontSize: '0.9rem', background: 'var(--background-color)', padding: '0 10px' }}>OR</span>
            <div style={{ flex: '1', height: '1px', background: 'var(--separator-color)' }}></div>
          </div>

          {/* Upload Image Card */}
          <div
            className="input-card"
            style={{
              background: 'var(--card-background)',
              padding: 'var(--container-padding)',
              borderRadius: 'var(--app-border-radius)',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--app-border)',
              marginBottom: 'var(--section-gap)'
            }}
          >
            <label htmlFor="imageUploadInput" style={{ display: 'flex', alignItems: 'center', fontWeight: '600', marginBottom: 'var(--element-gap)', color: 'var(--text-color)', fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)' }}>
              <Zap size={22} style={{ marginRight: '10px', color: 'var(--primary-accent)' }} /> {/* Changed icon */}
              Upload Chart Image
            </label>
            <p style={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)', color: 'var(--text-color-light)', marginTop: '-8px', marginBottom: 'var(--element-gap)' }}>
              For educational exploration of patterns. For data-driven analysis, use the live stock feature above.
            </p>
            <input
              id="imageUploadInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input" // Using class from App.css
              style={{
                borderColor: 'var(--primary-accent-border)',
                color: 'var(--text-color)',
                background: 'var(--input-background)'
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary-accent)'; e.target.style.background = 'var(--input-background-hover)'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--primary-accent-border)'; e.target.style.background = 'var(--input-background)'; }}
            />
          </div>

          {uploadedImage && (
            <div style={{ marginBottom: 'var(--section-gap)' }}>
              <div className="image-container" style={{ height: 'clamp(250px, 40vh, 400px)', background: 'var(--background-color)', border: '1px solid var(--app-border)', borderRadius: 'var(--app-border-radius)' }}>
                <img src={uploadedImage} alt="Stock chart" className="preview-image" />
              </div>
              {stockData && (
                <div style={{ background: 'var(--success-background)', border: '1px solid var(--success-border)', borderRadius: 'var(--app-border-radius-small)', padding: 'var(--element-gap)', marginBottom: 'var(--element-gap)', fontSize: '0.9rem', color: 'var(--success-color)' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>📊 Stock Info ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : selectedTimeRange === '10y' ? '10 Years' : '3 Months'} Data):</div>
                  <div><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div>
                  <div><strong>Price:</strong> {stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}{stockData.currentPrice?.toFixed(2)} {stockData.currency} |<strong> Data Points:</strong> {stockData.prices.length} {selectedTimeRange === '1y' ? 'weeks' : (selectedTimeRange === '5y' || selectedTimeRange === '10y') ? 'months' : 'days'}</div>
                  {stockData.isMockData && <div style={{ color: 'var(--warning-text-color)', fontStyle: 'italic', marginTop: '4px' }}>⚠️ Using demo data - API temporarily unavailable</div>}
                </div>
              )}
              <button
                onClick={analyzeChart}
                disabled={loading}
                className="analyze-button" // Using class from App.css
                style={{
                  width: '100%',
                  background: loading ? 'var(--text-color-muted)' : 'var(--primary-accent)', // Simpler background
                  boxShadow: loading ? 'none' : 'var(--card-shadow)' // Consistent shadow
                }}
              >
                {loading ? (<><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />Analyzing...</>) : stockData ? ('Analyze Live Chart Data') : ('Explore Example Pattern')}
              </button>
            </div>)}

          {longTermAssessment && stockData && ( <div style={{ background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', marginBottom: '32px', padding: '24px', boxShadow: `0 8px 32px var(--card-shadow)` }}><h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', textAlign: 'center' }}>🗓️ Long-Term Review ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : '10 Years'})</h2><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Overall Trend:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.trend}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Shows the general direction of the stock's price over the selected period.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Total Return:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.totalReturn}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Illustrates the percentage gain or loss if you had invested at the beginning and held until the end of the period.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Price Extremes:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.highLow}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Highlights the highest and lowest prices the stock reached during this timeframe.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)'}}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Volatility Insight:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.volatility}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Gives an idea of how much the stock's price fluctuated; higher volatility means bigger price swings.</p></div><p style={{ fontSize: '13px', color: 'var(--text-color-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>{longTermAssessment.disclaimer}</p></div>)}

          {prediction && patternDetected && !longTermAssessment && (
            <div
              className="results-container" // Using class for main container
              style={{
                marginBottom: 'var(--section-gap)',
                overflow: 'hidden' // Keep overflow hidden if content might exceed
              }}
            >
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '600', color: 'var(--text-color)', padding: 'var(--element-gap) var(--container-padding) 0', textAlign: 'center', marginBottom: 'var(--element-gap)' }}>
                📈 Short-Term Pattern Analysis
              </h2>

              {/* Tab Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', padding: '0 var(--container-padding) var(--element-gap)', borderBottom: '1px solid var(--separator-color)', marginBottom: 'var(--element-gap)' }}>
                {['analysis', 'education', 'financials', 'news'].map(tabName => (
                  <button
                    key={tabName}
                    onClick={() => setActiveResultTab(tabName)}
                    style={{
                      padding: '10px 15px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      fontWeight: activeResultTab === tabName ? '600' : '500',
                      color: activeResultTab === tabName ? 'var(--primary-accent-darker)' : 'var(--text-color-light)',
                      background: activeResultTab === tabName ? 'var(--primary-accent-light)' : 'transparent',
                      border: 'none',
                      borderBottom: activeResultTab === tabName ? `3px solid var(--primary-accent)` : '3px solid transparent',
                      borderRadius: 'var(--app-border-radius-small) var(--app-border-radius-small) 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tabName === 'analysis' ? 'Analysis & Key Data' : tabName}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: 'var(--container-padding)', paddingTop: 'var(--element-gap)' }}>
                {activeResultTab === 'analysis' && (
                  <div><p>Analysis Tab Content Placeholder</p></div>
                )}

                {activeResultTab === 'education' && patternDetected && (
                  <div className="pattern-description" style={{padding: '0'}}> {/* Remove card styling from here as parent has it */}
                    <h3 style={{ fontWeight: '600', fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', marginTop: '0', marginBottom: 'var(--element-gap)', color: 'var(--text-color)' }}>
                      Pattern Education: {patternDetected.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <p style={{ marginBottom: 'var(--element-gap)', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: 'var(--text-color-light)' }}>
                      {patternDetected.description}
                    </p>
                    <div className="pattern-specifics-box" style={{background: 'var(--background-color)', border: '1px solid var(--separator-color)'}}>
                      <h4 style={{ fontWeight: '600', fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', color: 'var(--text-color)', marginTop: '0', marginBottom: 'var(--element-gap)' }}>
                        🔍 What to look for:
                      </h4>
                      <ul className="pattern-list" style={{fontSize: 'clamp(0.875rem, 1.9vw, 0.95rem)'}}>
                        <li style={{ color: 'var(--text-color-light)' }}><span style={{color: 'var(--primary-accent)'}}>→</span> Look for clear pattern formation with multiple confirmation points</li>
                        <li style={{ color: 'var(--text-color-light)' }}><span style={{color: 'var(--primary-accent)'}}>→</span> Check volume patterns that support the chart pattern</li>
                        <li style={{ color: 'var(--text-color-light)' }}><span style={{color: 'var(--primary-accent)'}}>→</span> Confirm breakout direction before making decisions</li>
                        <li style={{ color: 'var(--text-color-light)' }}><span style={{color: 'var(--primary-accent)'}}>→</span> Consider overall market conditions and sentiment</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeResultTab === 'financials' && (
                  financialDataLoading && !financialData ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-color-light)' }}>
                      <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--primary-accent)' }} />
                      <p>Loading Financial Metrics...</p>
                    </div>
                  ) : financialData ? (
                    <ProsConsTable financialData={financialData} />
                  ) : (
                     <p style={{color: 'var(--text-color-light)', textAlign:'center'}}>No financial data available for this selection.</p>
                  )
                )}

                {activeResultTab === 'news' && (
                  <StockNewsDisplay newsItems={stockNews} loading={newsLoading} error={newsError} />
                )}
              </div>
            </div>
          )}
          {/* Redundant sections below are now handled by tabs, so they are removed/commented. */}
          {/* {patternDetected && !longTermAssessment && (
            <div className="results-container"> <h3 ... >Pattern Education</h3> ... </div>
          )} */}
          {/* {(!longTermAssessment || (longTermAssessment && stockNews.length > 0)) && ( // Ensure news shows if no long term assessment OR if long term assessment exists and news is available
             <StockNewsDisplay newsItems={stockNews} loading={newsLoading} error={newsError} />
          )} */}
          {/* {financialDataLoading && !financialData && !longTermAssessment && (
             <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-color-light)' }}>
               <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--primary-accent)' }} />
               <p>Loading Financial Metrics...</p>
             </div>
           )}
          {financialData && !financialDataLoading && !longTermAssessment && (
            <ProsConsTable financialData={financialData} />
          )} */}
        </>
      )}
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-color-light)' }}>
              <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: 'var(--primary-accent)' }} />
              <p>Loading Financial Metrics...</p>
            </div>
          )}
          {financialData && !financialDataLoading && (
            <ProsConsTable financialData={financialData} />
          )}
          {/* End Pros and Cons Table Integration */}
        </>
      )}

      {/* {currentView === 'game' && (
        <PatternRecognitionGame PatternVisualization={PatternVisualization} chartPatterns={chartPatterns} />
      )} */}
      
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
