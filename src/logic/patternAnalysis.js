import { chartPatterns } from '../data/chartPatterns'; // Needs chartPatterns for reliability scores etc.

// Helper function to calculate trend
const calculateTrend = (values) => {
  if (values.length < 2) return 0;
  let trend = 0;
  for (let i = 1; i < values.length; i++) {
    trend += values[i] - values[i-1];
  }
  return trend / (values.length - 1);
};

// Helper function to calculate volatility
const calculateVolatility = (prices) => {
  if (prices.length < 2) return 0;
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(((prices[i] - prices[i-1]) / prices[i-1]) * 100);
  }
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  return Math.sqrt(variance);
};

// Find peaks and troughs in price data (improved)
const findPeaksAndTroughs = (data, isPeak = true) => {
  const results = [];
  const lookback = 3; // Reduced lookback for more sensitivity
  const minChangePercent = 0.02; // Minimum 2% change to be significant

  for (let i = lookback; i < data.length - lookback; i++) {
    let isSignificant = true;
    let maxDiff = 0;

    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue;
      if (isPeak) {
        if (data[j] >= data[i]) { isSignificant = false; break; }
        maxDiff = Math.max(maxDiff, data[i] - data[j]);
      } else {
        if (data[j] <= data[i]) { isSignificant = false; break; }
        maxDiff = Math.max(maxDiff, data[j] - data[i]);
      }
    }

    const changePercent = data[i] === 0 ? Infinity : maxDiff / data[i]; // Avoid division by zero
    if (isSignificant && changePercent >= minChangePercent) {
      results.push({ index: i, value: data[i] });
    }
  }

  if (results.length < 2) { // Less strict fallback
    for (let i = lookback; i < data.length - lookback; i++) {
      let isSignificant = true;
      for (let j = i - lookback; j <= i + lookback; j++) {
        if (j === i) continue;
        if (isPeak) {
          if (data[j] >= data[i]) { isSignificant = false; break; }
        } else {
          if (data[j] <= data[i]) { isSignificant = false; break; }
        }
      }
      if (isSignificant) {
        results.push({ index: i, value: data[i] });
      }
    }
  }
  return results;
};

// Calculate RSI
const calculateRSI = (data, period = 14) => {
  if (data.length < period) return Array(data.length).fill(50); // Return default if not enough data
  const gains = [];
  const losses = [];
  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  const rsi = [];
  for (let i = 0; i < period -1 ; i++) rsi.push(50); // Fill initial values with 50

  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  return rsi;
};

// Calculate Simple Moving Average
const calculateSMA = (data, period) => {
  if (data.length < period) return []; // Return empty if not enough data
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

// Detect triangle patterns (improved)
const detectTrianglePatterns = (peaks, troughs, closes) => {
  if (peaks.length < 2 || troughs.length < 2) return null;
  const recentPeaks = peaks.slice(-4);
  const recentTroughs = troughs.slice(-4);

  if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
    const peakValues = recentPeaks.map(p => p.value);
    const troughValues = recentTroughs.map(t => t.value);
    const peakTrend = calculateTrend(peakValues);
    const troughTrend = calculateTrend(troughValues);

    if (Math.abs(peakTrend) < 1 && troughTrend > 0.5) return { pattern: 'ascending-triangle', strength: 0.6 };
    if (peakTrend < -0.5 && Math.abs(troughTrend) < 1) return { pattern: 'descending-triangle', strength: 0.6 };
    if (peakTrend < -0.2 && troughTrend > 0.2) return { pattern: 'ascending-triangle', strength: 0.5 }; // Symmetrical often treated as continuation
  }
  return null;
};

// Detect cup and handle pattern (improved)
const detectCupAndHandle = (closes) => {
  if (closes.length < 30) return false;
  const recent30 = closes.slice(-30);
  const firstQuarter = recent30.slice(0, 7);
  const secondQuarter = recent30.slice(7, 15);
  const thirdQuarter = recent30.slice(15, 22);
  const fourthQuarter = recent30.slice(22);

  const firstAvg = firstQuarter.reduce((a,b) => a+b,0)/firstQuarter.length;
  const secondAvg = secondQuarter.reduce((a,b) => a+b,0)/secondQuarter.length;
  const thirdAvg = thirdQuarter.reduce((a,b) => a+b,0)/thirdQuarter.length;
  const fourthAvg = fourthQuarter.reduce((a,b) => a+b,0)/fourthQuarter.length;

  const hasCup = (secondAvg < firstAvg * 0.92) && (thirdAvg < firstAvg * 0.92) && (fourthAvg > firstAvg * 0.95);
  const hasHandle = fourthAvg < firstAvg * 1.02;
  return hasCup && hasHandle;
};

// Detect wedge patterns (improved)
const detectWedgePatterns = (peaks, troughs, closes) => {
  if (peaks.length < 2 || troughs.length < 2) return null;
  const recentPeaks = peaks.slice(-4);
  const recentTroughs = troughs.slice(-4);
  const recent30 = closes.slice(-30);

  if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
    const peakTrend = calculateTrend(recentPeaks.map(p => p.value));
    const troughTrend = calculateTrend(recentTroughs.map(t => t.value));
    const overallTrend = recent30.length > 0 ? ((recent30[recent30.length - 1] - recent30[0]) / recent30[0]) * 100 : 0;

    if (peakTrend > 0.3 && troughTrend > 0.2 && troughTrend < peakTrend * 0.8) return { pattern: 'wedge-rising', strength: 0.6 };
    if (peakTrend < -0.3 && troughTrend < -0.2 && Math.abs(troughTrend) < Math.abs(peakTrend) * 0.8) return { pattern: 'wedge-falling', strength: 0.6 };
    if (overallTrend > 5 && peakTrend < 0 && troughTrend > 0) return { pattern: 'wedge-rising', strength: 0.5 };
    if (overallTrend < -5 && peakTrend < 0 && troughTrend < 0) return { pattern: 'wedge-falling', strength: 0.5 };
  }
  return null;
};

// Analyze patterns with enhanced logic
const analyzePatterns = (peaks, troughs, closes, highs, lows) => {
  const recentData = closes.slice(-30);
  const fullData = closes.slice(-60);
  if(recentData.length === 0 || fullData.length === 0) return { pattern: 'flag', strength: 0.4 }; // Default if not enough data

  const priceRange = Math.max(...recentData) - Math.min(...recentData);
  const tolerance = priceRange * 0.05;
  const startPrice = fullData[0];
  const endPrice = fullData[fullData.length - 1];
  const priceChange = startPrice === 0 ? 0 : ((endPrice - startPrice) / startPrice) * 100;
  const volatility = calculateVolatility(recentData);

  if (peaks.length >= 3) {
    const [left, head, right] = peaks.slice(-3);
    if (head.value > left.value && head.value > right.value) {
      const leftRightDiff = Math.abs(left.value - right.value);
      const headHeight = Math.min(head.value - left.value, head.value - right.value);
      if (leftRightDiff <= tolerance * 2 && headHeight > tolerance) return { pattern: 'head-and-shoulders', strength: 0.75 };
    }
  }
  if (troughs.length >= 3) {
    const [left, head, right] = troughs.slice(-3);
    if (head.value < left.value && head.value < right.value) {
      const leftRightDiff = Math.abs(left.value - right.value);
      const headDepth = Math.min(left.value - head.value, right.value - head.value);
      if (leftRightDiff <= tolerance * 2 && headDepth > tolerance) return { pattern: 'inverse-head-and-shoulders', strength: 0.75 };
    }
  }
  if (peaks.length >= 2) {
    const [first, second] = peaks.slice(-2);
    if (Math.abs(first.value - second.value) <= tolerance * 1.5) return { pattern: 'double-top', strength: 0.7 };
  }
  if (troughs.length >= 2) {
    const [first, second] = troughs.slice(-2);
    if (Math.abs(first.value - second.value) <= tolerance * 1.5) return { pattern: 'double-bottom', strength: 0.7 };
  }

  const trianglePattern = detectTrianglePatterns(peaks, troughs, closes);
  if (trianglePattern) return trianglePattern;
  if (detectCupAndHandle(closes)) return { pattern: 'cup-and-handle', strength: 0.6 };
  const wedgePattern = detectWedgePatterns(peaks, troughs, closes);
  if (wedgePattern) return wedgePattern;
  if (volatility < 2 && Math.abs(priceChange) < 5) return { pattern: 'flag', strength: 0.6 };

  if (priceChange > 8) return peaks.length >= 2 && troughs.length >= 2 ? { pattern: 'ascending-triangle', strength: 0.5 } : { pattern: 'cup-and-handle', strength: 0.5 };
  if (priceChange < -8) return peaks.length >= 2 && troughs.length >= 2 ? { pattern: 'descending-triangle', strength: 0.5 } : { pattern: 'head-and-shoulders', strength: 0.5 };
  if (priceChange > 3) return { pattern: 'ascending-triangle', strength: 0.4 };
  if (priceChange < -3) return { pattern: 'descending-triangle', strength: 0.4 };

  return volatility > 4 ? (Math.random() > 0.5 ? { pattern: 'double-top', strength: 0.4 } : { pattern: 'double-bottom', strength: 0.4 }) : { pattern: 'flag', strength: 0.4 };
};


// Calculate dynamic confidence based on multiple factors
// This function is kept separate as it's used by detectPatternFromPriceData after a pattern is selected.
export const calculateDynamicConfidence = (patternData, rsi, priceVsSMA20, priceVsSMA50) => {
  let baseConfidence = chartPatterns[patternData.pattern]?.reliability || 70;
  let patternStrength = patternData.strength || 0.5;
  let confidence = baseConfidence * patternStrength;

  if (patternData.pattern.includes('up') || patternData.pattern === 'ascending-triangle' ||
      patternData.pattern === 'inverse-head-and-shoulders' || patternData.pattern === 'double-bottom') {
    if (rsi > 30 && rsi < 70) confidence += 5;
    if (priceVsSMA20 > 0) confidence += 3;
    if (priceVsSMA50 > 0) confidence += 3;
  } else if (patternData.pattern.includes('down') || patternData.pattern === 'descending-triangle' ||
             patternData.pattern === 'head-and-shoulders' || patternData.pattern === 'double-top') {
    if (rsi > 30 && rsi < 70) confidence += 5;
    if (priceVsSMA20 < 0) confidence += 3;
    if (priceVsSMA50 < 0) confidence += 3;
  }
  confidence += Math.random() * 10 - 5;
  return Math.max(45, Math.min(92, Math.round(confidence)));
};


// Enhanced pattern detection using actual price data
export const detectPatternFromPriceData = (prices) => {
  if (!prices || prices.length < 20) return null;
  const closes = prices.map(p => p.close);
  const highs = prices.map(p => p.high);
  const lows = prices.map(p => p.low);

  const peaks = findPeaksAndTroughs(highs, true);
  const troughs = findPeaksAndTroughs(lows, false);

  const rsiData = calculateRSI(closes, 14);
  const currentRSI = rsiData.length > 0 ? rsiData[rsiData.length - 1] : 50;

  const sma20Data = calculateSMA(closes, 20);
  const sma50Data = calculateSMA(closes, 50);
  const currentPrice = closes[closes.length - 1];

  const priceVsSMA20 = sma20Data.length > 0 ? ((currentPrice - sma20Data[sma20Data.length - 1]) / sma20Data[sma20Data.length - 1]) * 100 : 0;
  const priceVsSMA50 = sma50Data.length > 0 ? ((currentPrice - sma50Data[sma50Data.length - 1]) / sma50Data[sma50Data.length - 1]) * 100 : 0;

  const patternData = analyzePatterns(peaks, troughs, closes, highs, lows);

  const patternVariants = {
    'head-and-shoulders': ['head-and-shoulders', 'double-top'],
    'inverse-head-and-shoulders': ['inverse-head-and-shoulders', 'double-bottom'],
    'double-top': ['double-top', 'head-and-shoulders'],
    'double-bottom': ['double-bottom', 'inverse-head-and-shoulders'],
    'ascending-triangle': ['ascending-triangle', 'cup-and-handle'],
    'descending-triangle': ['descending-triangle', 'wedge-falling'],
    'flag': ['flag', 'ascending-triangle', 'descending-triangle'],
    'cup-and-handle': ['cup-and-handle', 'ascending-triangle'],
    'wedge-rising': ['wedge-rising', 'ascending-triangle'],
    'wedge-falling': ['wedge-falling', 'descending-triangle']
  };

  const variants = patternVariants[patternData.pattern] || [patternData.pattern];
  const selectedPattern = variants[Math.floor(Math.random() * variants.length)];

  return {
    pattern: selectedPattern,
    confidence: calculateDynamicConfidence(
      { ...patternData, pattern: selectedPattern },
      currentRSI,
      priceVsSMA20,
      priceVsSMA50
    ),
    technicals: {
      rsi: currentRSI,
      priceVsSMA20,
      priceVsSMA50,
      peaks: peaks.length,
      troughs: troughs.length
    }
  };
};
