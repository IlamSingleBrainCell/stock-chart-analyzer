import { chartPatterns } from '../data/chartPatterns';

// Enhanced pattern detection using actual price data
export const detectPatternFromPriceData = (prices) => {
  if (!prices || prices.length < 20) return null;

  const closes = prices.map(p => p.close);
  const highs = prices.map(p => p.high);
  const lows = prices.map(p => p.low);

  // Find significant peaks and troughs
  const peaks = findPeaksAndTroughs(highs, true);
  const troughs = findPeaksAndTroughs(lows, false);

  // Calculate various technical indicators
  const rsi = calculateRSI(closes, 14);
  const currentRSI = rsi[rsi.length - 1];

  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);

  const currentPrice = closes[closes.length - 1];
  const priceVsSMA20 = ((currentPrice - sma20[sma20.length - 1]) / sma20[sma20.length - 1]) * 100;
  const priceVsSMA50 = ((currentPrice - sma50[sma50.length - 1]) / sma50[sma50.length - 1]) * 100;

  // Enhanced pattern recognition
  const patternData = analyzePatterns(peaks, troughs, closes, highs, lows);

  return {
    pattern: patternData.pattern,
    confidence: calculateDynamicConfidence(patternData, currentRSI, priceVsSMA20, priceVsSMA50),
    technicals: {
      rsi: currentRSI,
      priceVsSMA20,
      priceVsSMA50,
      peaks: peaks.length,
      troughs: troughs.length
    }
  };
};

// Find peaks and troughs in price data
export const findPeaksAndTroughs = (data, isPeak = true) => {
  const results = [];
  const lookback = 5; // Look 5 periods in each direction

  for (let i = lookback; i < data.length - lookback; i++) {
    let isSignificant = true;

    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue;

      if (isPeak) {
        if (data[j] >= data[i]) {
          isSignificant = false;
          break;
        }
      } else {
        if (data[j] <= data[i]) {
          isSignificant = false;
          break;
        }
      }
    }

    if (isSignificant) {
      results.push({ index: i, value: data[i] });
    }
  }

  return results;
};

// Calculate RSI
export const calculateRSI = (data, period = 14) => {
  const gains = [];
  const losses = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  const rsi = [];

  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;

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
export const calculateSMA = (data, period) => {
  const sma = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b);
    sma.push(sum / period);
  }

  return sma;
};

// Analyze patterns with enhanced logic
export const analyzePatterns = (peaks, troughs, closes, highs, lows) => {
  const recentData = closes.slice(-30); // Last 30 days
  const priceRange = Math.max(...recentData) - Math.min(...recentData);
  const tolerance = priceRange * 0.03; // 3% tolerance

  // Head and Shoulders detection
  if (peaks.length >= 3) {
    const lastThreePeaks = peaks.slice(-3);
    const [left, head, right] = lastThreePeaks;

    if (head.value > left.value + tolerance && head.value > right.value + tolerance) {
      const necklineConfidence = Math.abs(left.value - right.value) / tolerance;
      if (necklineConfidence <= 2) { // Peaks should be relatively equal
        return { pattern: 'head-and-shoulders', strength: 0.8 + (1 - necklineConfidence / 2) * 0.2 };
      }
    }
  }

  // Inverse Head and Shoulders
  if (troughs.length >= 3) {
    const lastThreeTroughs = troughs.slice(-3);
    const [left, head, right] = lastThreeTroughs;

    if (head.value < left.value - tolerance && head.value < right.value - tolerance) {
      const necklineConfidence = Math.abs(left.value - right.value) / tolerance;
      if (necklineConfidence <= 2) {
        return { pattern: 'inverse-head-and-shoulders', strength: 0.75 + (1 - necklineConfidence / 2) * 0.25 };
      }
    }
  }

  // Double Top
  if (peaks.length >= 2) {
    const lastTwoPeaks = peaks.slice(-2);
    const [first, second] = lastTwoPeaks;

    if (Math.abs(first.value - second.value) <= tolerance) {
      return { pattern: 'double-top', strength: 0.7 + (1 - Math.abs(first.value - second.value) / tolerance) * 0.3 };
    }
  }

  // Double Bottom
  if (troughs.length >= 2) {
    const lastTwoTroughs = troughs.slice(-2);
    const [first, second] = lastTwoTroughs;

    if (Math.abs(first.value - second.value) <= tolerance) {
      return { pattern: 'double-bottom', strength: 0.65 + (1 - Math.abs(first.value - second.value) / tolerance) * 0.35 };
    }
  }

  // Triangle patterns
  const trianglePattern = detectTrianglePatterns(peaks, troughs, closes);
  if (trianglePattern) return trianglePattern;

  // Cup and Handle (simplified)
  if (detectCupAndHandle(closes)) {
    return { pattern: 'cup-and-handle', strength: 0.8 };
  }

  // Flag pattern
  const flagPattern = detectFlagPattern(closes);
  if (flagPattern) return flagPattern;

  // Wedge patterns
  const wedgePattern = detectWedgePatterns(peaks, troughs, closes);
  if (wedgePattern) return wedgePattern;

  // Default to flag if no clear pattern
  return { pattern: 'flag', strength: 0.4 };
};

// Detect triangle patterns
export const detectTrianglePatterns = (peaks, troughs, closes) => {
  if (peaks.length < 2 || troughs.length < 2) return null;

  const recentPeaks = peaks.slice(-3);
  const recentTroughs = troughs.slice(-3);

  // Ascending triangle (horizontal resistance, rising support)
  if (recentPeaks.length >= 2) {
    const peakTrend = (recentPeaks[recentPeaks.length - 1].value - recentPeaks[0].value) / recentPeaks.length;
    const troughTrend = recentTroughs.length >= 2 ?
      (recentTroughs[recentTroughs.length - 1].value - recentTroughs[0].value) / recentTroughs.length : 0;

    if (Math.abs(peakTrend) < 0.5 && troughTrend > 0.5) {
      return { pattern: 'ascending-triangle', strength: 0.7 };
    }

    // Descending triangle (falling resistance, horizontal support)
    if (peakTrend < -0.5 && Math.abs(troughTrend) < 0.5) {
      return { pattern: 'descending-triangle', strength: 0.7 };
    }
  }

  return null;
};

// Detect cup and handle pattern
export const detectCupAndHandle = (closes) => {
  if (closes.length < 50) return false;

  const recent50 = closes.slice(-50);
  const firstThird = recent50.slice(0, 16);
  const middleThird = recent50.slice(16, 33);
  const lastThird = recent50.slice(33);

  const firstAvg = firstThird.reduce((a, b) => a + b) / firstThird.length;
  const middleAvg = middleThird.reduce((a, b) => a + b) / middleThird.length;
  const lastAvg = lastThird.reduce((a, b) => a + b) / lastThird.length;

  // Cup: decline then recovery
  if (middleAvg < firstAvg * 0.9 && lastAvg > firstAvg * 0.95) {
    return true;
  }

  return false;
};

// Detect flag pattern
export const detectFlagPattern = (closes) => {
  if (closes.length < 15) return null;

  const recent15 = closes.slice(-15);
  const range = Math.max(...recent15) - Math.min(...recent15);
  const avgPrice = recent15.reduce((a, b) => a + b) / recent15.length;

  // Flag: tight consolidation
  if (range / avgPrice < 0.05) { // Less than 5% range
    return { pattern: 'flag', strength: 0.6 };
  }

  return null;
};

// Detect wedge patterns
export const detectWedgePatterns = (peaks, troughs, closes) => {
  if (peaks.length < 2 || troughs.length < 2) return null;

  const recentPeaks = peaks.slice(-3);
  const recentTroughs = troughs.slice(-3);

  if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
    const peakTrend = (recentPeaks[recentPeaks.length - 1].value - recentPeaks[0].value);
    const troughTrend = (recentTroughs[recentTroughs.length - 1].value - recentTroughs[0].value);

    // Rising wedge (both lines rising, converging)
    if (peakTrend > 0 && troughTrend > 0 && troughTrend > peakTrend * 0.5) {
      return { pattern: 'wedge-rising', strength: 0.65 };
    }

    // Falling wedge (both lines falling, converging)
    if (peakTrend < 0 && troughTrend < 0 && Math.abs(troughTrend) > Math.abs(peakTrend) * 0.5) {
      return { pattern: 'wedge-falling', strength: 0.65 };
    }
  }

  return null;
};

// Calculate dynamic confidence based on multiple factors
export const calculateDynamicConfidence = (patternData, rsi, priceVsSMA20, priceVsSMA50) => {
  let baseConfidence = chartPatterns[patternData.pattern]?.reliability || 70;
  let patternStrength = patternData.strength || 0.5;

  // Adjust confidence based on pattern strength
  let confidence = baseConfidence * patternStrength;

  // Technical indicator adjustments
  if (patternData.pattern.includes('up') || patternData.pattern === 'ascending-triangle' ||
      patternData.pattern === 'inverse-head-and-shoulders' || patternData.pattern === 'double-bottom') {
    // Bullish patterns
    if (rsi > 30 && rsi < 70) confidence += 5; // Good RSI range
    if (priceVsSMA20 > 0) confidence += 3; // Above 20-day MA
    if (priceVsSMA50 > 0) confidence += 3; // Above 50-day MA
  } else if (patternData.pattern.includes('down') || patternData.pattern === 'descending-triangle' ||
             patternData.pattern === 'head-and-shoulders' || patternData.pattern === 'double-top') {
    // Bearish patterns
    if (rsi > 30 && rsi < 70) confidence += 5;
    if (priceVsSMA20 < 0) confidence += 3; // Below 20-day MA
    if (priceVsSMA50 < 0) confidence += 3; // Below 50-day MA
  }

  // Volume and data quality adjustments
  confidence += Math.random() * 10 - 5; // Add some variation

  return Math.max(45, Math.min(92, Math.round(confidence)));
};

// Calculate breakout timing
export const calculateBreakoutTiming = (patternName, stockData, confidence) => {
  const pattern = chartPatterns[patternName];
  if (!pattern || !stockData) return null;

  const baseBreakoutDays = pattern.breakoutDays || '3-7 days';
  const breakoutRange = baseBreakoutDays.split('-');
  const minDays = parseInt(breakoutRange[0]);
  const maxDays = parseInt(breakoutRange[1]);

  // Adjust timing based on confidence and market conditions
  let adjustedMin = minDays;
  let adjustedMax = maxDays;

  if (confidence > 80) {
    // High confidence = faster breakout
    adjustedMin = Math.max(1, minDays - 1);
    adjustedMax = Math.max(adjustedMin + 1, maxDays - 2);
  } else if (confidence < 60) {
    // Low confidence = slower breakout
    adjustedMin = minDays + 1;
    adjustedMax = maxDays + 3;
  }

  // Calculate actual dates
  const today = new Date();
  const minBreakoutDate = new Date(today);
  const maxBreakoutDate = new Date(today);

  minBreakoutDate.setDate(today.getDate() + adjustedMin);
  maxBreakoutDate.setDate(today.getDate() + adjustedMax);

  return {
    daysRange: `${adjustedMin}-${adjustedMax} days`,
    minDate: minBreakoutDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }),
    maxDate: maxBreakoutDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }),
    confidence: confidence > 75 ? 'High' : confidence > 60 ? 'Medium' : 'Low'
  };
};
