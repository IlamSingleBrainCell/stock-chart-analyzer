import { chartPatterns } from '../constants';

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
    } else { if (volatility > 4) { return null; } return { pattern: 'flag', strength: 0.4 }; }
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

  export const detectPatternFromPriceData = (prices) => {
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
    if (!patternData || !patternData.pattern || patternData.strength < patternStrengthThreshold) {
      const patternVariants = {'head-and-shoulders': ['head-and-shoulders', 'double-top'],'inverse-head-and-shoulders': ['inverse-head-and-shoulders', 'double-bottom'],'double-top': ['double-top', 'head-and-shoulders'],'double-bottom': ['double-bottom', 'inverse-head-and-shoulders'],'ascending-triangle': ['ascending-triangle', 'cup-and-handle'],'descending-triangle': ['descending-triangle', 'wedge-falling'],'flag': ['flag', 'ascending-triangle', 'descending-triangle'],'cup-and-handle': ['cup-and-handle', 'ascending-triangle'],'wedge-rising': ['wedge-rising', 'ascending-triangle'],'wedge-falling': ['wedge-falling', 'descending-triangle']};
      const variants = patternData && patternVariants[patternData.pattern];
      if (variants && variants.length > 0) {
        determinedPattern = variants[0];
      } else {
        determinedPattern = (patternData && patternData.pattern) || 'flag';
      }
    }
    return {pattern: determinedPattern, confidence: calculateDynamicConfidence({ ...patternData, pattern: determinedPattern }, currentRSI, priceVsSMA20, priceVsSMA50), technicals: {rsi: currentRSI, priceVsSMA20, priceVsSMA50, peaks: peaks.length, troughs: troughs.length}};
  };

  export const calculateKeyLevels = (prices) => {
    if (!prices || prices.length < 10) return null;
    const recentPrices = prices.slice(-60); const lows = recentPrices.map(p => p.low); const highs = recentPrices.map(p => p.high);
    const supportLevels = findPeaksAndTroughs(lows, false).sort((a,b) => a.value - b.value).slice(0, 2);
    const resistanceLevels = findPeaksAndTroughs(highs, true).sort((a,b) => b.value - a.value).slice(0, 2);
    return { support: supportLevels.map(s => parseFloat(s.value.toFixed(2))), resistance: resistanceLevels.map(r => parseFloat(r.value.toFixed(2))), };
  };

  export const calculateBreakoutTiming = (patternName, stockData, confidence) => {
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

  export const generateLongTermAssessment = (stockData, timeRangeString) => {
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

  export const generateRecommendation = (pattern, confidence) => {
    const { recommendation, prediction } = pattern; let action = recommendation.toUpperCase(); let reasoning = '';
    switch (recommendation) {
      case 'buy': reasoning = `Strong ${prediction} signal detected with ${confidence}% confidence. Consider accumulating positions.`; break;
      case 'sell': reasoning = `Bearish pattern confirmed with ${confidence}% confidence. Consider reducing positions or short selling.`; break;
      case 'hold': reasoning = `Consolidation pattern detected. Maintain current positions until clear breakout with ${confidence}% confidence.`; break;
      default: reasoning = `Mixed signals detected. Monitor closely for breakout direction. Confidence: ${confidence}%.`;
    }
    return { action, reasoning };
  };

  export const calculatePredictionAccuracy = (stockData, actualPattern) => {
    let correctPredictions = 0;
    let totalPredictions = 0;

    if (stockData && stockData.prices) {
      const analysis = detectPatternFromPriceData(stockData.prices);
      if (analysis && analysis.pattern) {
        if (analysis.pattern === actualPattern) {
          correctPredictions++;
        }
        totalPredictions++;
      }
    }

    return totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
  };
