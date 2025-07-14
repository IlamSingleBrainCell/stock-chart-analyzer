import { chartPatterns } from '../constants';

/**
 * Finds peaks or troughs in a given dataset.
 * @param {number[]} data - The input data array (e.g., prices).
 * @param {boolean} isPeak - True to find peaks, false to find troughs.
 * @returns {object[]} - An array of objects, each containing the index and value of a peak/trough.
 */
const findPeaksAndTroughs = (data, isPeak = true) => {
    const results = [];
    const lookback = 3;
    const minChangePercent = 0.02;

    for (let i = lookback; i < data.length - lookback; i++) {
        let isSignificant = true;
        let maxDiff = 0;
        for (let j = i - lookback; j <= i + lookback; j++) {
            if (j === i) continue;
            if (isPeak) {
                if (data[j] >= data[i]) {
                    isSignificant = false;
                    break;
                }
                maxDiff = Math.max(maxDiff, data[i] - data[j]);
            } else {
                if (data[j] <= data[i]) {
                    isSignificant = false;
                    break;
                }
                maxDiff = Math.max(maxDiff, data[j] - data[i]);
            }
        }
        const changePercent = data[i] !== 0 ? maxDiff / data[i] : 0;
        if (isSignificant && changePercent >= minChangePercent) {
            results.push({ index: i, value: data[i] });
        }
    }

    if (results.length < 2) {
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
    }
    return results;
};

/**
 * Calculates the Relative Strength Index (RSI) for a given dataset.
 * @param {number[]} data - The input data array.
 * @param {number} period - The RSI period.
 * @returns {number[]} - An array of RSI values.
 */
const calculateRSI = (data, period = 14) => {
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

/**
 * Calculates the Simple Moving Average (SMA) for a given dataset.
 * @param {number[]} data - The input data array.
 * @param {number} period - The SMA period.
 * @returns {number[]} - An array of SMA values.
 */
const calculateSMA = (data, period) => {
    const sma = [];
    for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b);
        sma.push(sum / period);
    }
    return sma;
};

/**
 * Analyzes chart patterns from peaks, troughs, and price data.
 * @param {object[]} peaks - Array of peak objects.
 * @param {object[]} troughs - Array of trough objects.
 * @param {number[]} closes - Array of closing prices.
 * @param {number[]} highs - Array of high prices.
 * @param {number[]} lows - Array of low prices.
 * @returns {object|null} - An object with the detected pattern and its strength, or null if no pattern is detected.
 */
const calculatePatternAccuracy = (detectedPoints, idealPoints) => {
    if (detectedPoints.length !== idealPoints.length) {
        return 0;
    }
    // This is a simplified accuracy calculation. A more robust implementation would
    // involve more complex geometric comparisons.
    const similarity = detectedPoints.reduce((acc, point, i) => {
        const ideal = idealPoints[i];
        const distance = Math.sqrt(Math.pow(point.x - ideal.x, 2) + Math.pow(point.y - ideal.y, 2));
        return acc + (1 / (1 + distance));
    }, 0);

    return Math.min(100, Math.round((similarity / detectedPoints.length) * 100));
};

const analyzePatternsDeterministic = (peaks, troughs, closes, highs, lows) => {
    const recentData = closes.slice(-30);
    const priceRange = Math.max(...recentData) - Math.min(...recentData);
    const tolerance = priceRange * 0.05;

    // Head and Shoulders
    if (peaks.length >= 3) {
        for (let i = 0; i < peaks.length - 2; i++) {
            const [left, head, right] = peaks.slice(i, i + 3);
            if (head.value > left.value && head.value > right.value) {
                const neckline = troughs.filter(t => t.index > left.index && t.index < right.index);
                if (neckline.length >= 2) {
                    const detectedPoints = [left, head, right, ...neckline];
                    return {
                        pattern: 'head-and-shoulders',
                        strength: 0.8,
                        accuracy: calculatePatternAccuracy(detectedPoints, [{x:0, y:0}, {x:1, y:1}, {x:2, y:0}]),
                        detectedPoints,
                    };
                }
            }
        }
    }

    // Inverse Head and Shoulders
    if (troughs.length >= 3) {
        for (let i = 0; i < troughs.length - 2; i++) {
            const [left, head, right] = troughs.slice(i, i + 3);
            if (head.value < left.value && head.value < right.value) {
                const neckline = peaks.filter(p => p.index > left.index && p.index < right.index);
                if (neckline.length >= 2) {
                    const detectedPoints = [left, head, right, ...neckline];
                    return {
                        pattern: 'inverse-head-and-shoulders',
                        strength: 0.8,
                        accuracy: calculatePatternAccuracy(detectedPoints, [{x:0, y:1}, {x:1, y:0}, {x:2, y:1}]),
                        detectedPoints,
                    };
                }
            }
        }
    }

    // Double Top
    if (peaks.length >= 2) {
        for (let i = 0; i < peaks.length - 1; i++) {
            const [first, second] = peaks.slice(i, i + 2);
            if (Math.abs(first.value - second.value) <= tolerance * 1.5) {
                const troughBetween = troughs.find(t => t.index > first.index && t.index < second.index);
                if (troughBetween) {
                    const detectedPoints = [first, second, troughBetween];
                    return {
                        pattern: 'double-top',
                        strength: 0.7,
                        accuracy: calculatePatternAccuracy(detectedPoints, [{x:0, y:1}, {x:1, y:1}]),
                        detectedPoints,
                    };
                }
            }
        }
    }

    // Double Bottom
    if (troughs.length >= 2) {
        for (let i = 0; i < troughs.length - 1; i++) {
            const [first, second] = troughs.slice(i, i + 2);
            if (Math.abs(first.value - second.value) <= tolerance * 1.5) {
                const peakBetween = peaks.find(p => p.index > first.index && p.index < second.index);
                if (peakBetween) {
                    const detectedPoints = [first, second, peakBetween];
                    return {
                        pattern: 'double-bottom',
                        strength: 0.7,
                        accuracy: calculatePatternAccuracy(detectedPoints, [{x:0, y:0}, {x:1, y:0}]),
                        detectedPoints,
                    };
                }
            }
        }
    }

    const trianglePattern = detectTrianglePatterns(peaks, troughs, closes);
    if (trianglePattern) return trianglePattern;

    const cupPattern = detectCupAndHandle(closes);
    if (cupPattern) {
        return {
            pattern: 'cup-and-handle',
            strength: 0.6,
            accuracy: 85, // Placeholder
            detectedPoints: [], // Placeholder
        };
    }

    const wedgePattern = detectWedgePatterns(peaks, troughs, closes);
    if (wedgePattern) return wedgePattern;

    return null;
};


/**
 * Detects triangle patterns from peaks and troughs.
 * @param {object[]} peaks - Array of peak objects.
 * @param {object[]} troughs - Array of trough objects.
 * @returns {object|null} - An object with the detected pattern and its strength, or null.
 */
const detectTrianglePatterns = (peaks, troughs) => {
    if (peaks.length < 2 || troughs.length < 2) return null;
    const recentPeaks = peaks.slice(-4);
    const recentTroughs = troughs.slice(-4);

    if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
        const peakValues = recentPeaks.map(p => p.value);
        const troughValues = recentTroughs.map(t => t.value);
        const peakTrend = calculateTrend(peakValues);
        const troughTrend = calculateTrend(troughValues);

        // Ascending Triangle: Flat top, rising bottom
        if (Math.abs(peakTrend) < 0.1 && troughTrend > 0.1) {
            return {
                pattern: 'ascending-triangle',
                strength: 0.7,
                accuracy: 90, // Placeholder
                detectedPoints: [...recentPeaks, ...recentTroughs],
            };
        }

        // Descending Triangle: Falling top, flat bottom
        if (peakTrend < -0.1 && Math.abs(troughTrend) < 0.1) {
            return {
                pattern: 'descending-triangle',
                strength: 0.7,
                accuracy: 90, // Placeholder
                detectedPoints: [...recentPeaks, ...recentTroughs],
            };
        }

        // Symmetrical Triangle: Converging trendlines
        if (peakTrend < -0.1 && troughTrend > 0.1) {
            return {
                pattern: 'symmetrical-triangle',
                strength: 0.6,
                accuracy: 85, // Placeholder
                detectedPoints: [...recentPeaks, ...recentTroughs],
            };
        }
    }
    return null;
};

/**
 * Calculates the trend of a given set of values.
 * @param {number[]} values - The input values.
 * @returns {number} - The trend.
 */
const calculateTrend = (values) => {
    if (values.length < 2) return 0;
    let trend = 0;
    for (let i = 1; i < values.length; i++) {
        trend += values[i] - values[i - 1];
    }
    return trend / (values.length - 1);
};

/**
 * Detects a cup and handle pattern.
 * @param {number[]} closes - Array of closing prices.
 * @returns {boolean} - True if the pattern is detected, false otherwise.
 */
const detectCupAndHandle = (closes) => {
    if (closes.length < 30) return false;
    const recent30 = closes.slice(-30);
    const firstQuarter = recent30.slice(0, 7);
    const secondQuarter = recent30.slice(7, 15);
    const thirdQuarter = recent30.slice(15, 22);
    const fourthQuarter = recent30.slice(22);
    if (firstQuarter.length === 0 || secondQuarter.length === 0 || thirdQuarter.length === 0 || fourthQuarter.length === 0) return false;
    const firstAvg = firstQuarter.reduce((a, b) => a + b) / firstQuarter.length;
    const secondAvg = secondQuarter.reduce((a, b) => a + b) / secondQuarter.length;
    const thirdAvg = thirdQuarter.reduce((a, b) => a + b) / thirdQuarter.length;
    const hasCup = (secondAvg < firstAvg * 0.92) && (thirdAvg < firstAvg * 0.92) && (fourthQuarter.reduce((a, b) => a + b) / fourthQuarter.length > firstAvg * 0.95);
    const hasHandle = fourthQuarter.reduce((a, b) => a + b) / fourthQuarter.length < firstAvg * 1.02;
    return hasCup && hasHandle;
};

/**
 * Detects wedge patterns from peaks and troughs.
 * @param {object[]} peaks - Array of peak objects.
 * @param {object[]} troughs - Array of trough objects.
 * @param {number[]} closes - Array of closing prices.
 * @returns {object|null} - An object with the detected pattern and its strength, or null.
 */
const detectWedgePatterns = (peaks, troughs, closes) => {
    if (peaks.length < 2 || troughs.length < 2) return null;
    const recentPeaks = peaks.slice(-4);
    const recentTroughs = troughs.slice(-4);

    if (recentPeaks.length >= 2 && recentTroughs.length >= 2) {
        const peakTrend = calculateTrend(recentPeaks.map(p => p.value));
        const troughTrend = calculateTrend(recentTroughs.map(t => t.value));

        // Rising Wedge: Both trendlines slope upward, converging
        if (peakTrend > 0.1 && troughTrend > 0.1 && peakTrend > troughTrend) {
            return {
                pattern: 'wedge-rising',
                strength: 0.6,
                accuracy: 80, // Placeholder
                detectedPoints: [...recentPeaks, ...recentTroughs],
            };
        }

        // Falling Wedge: Both trendlines slope downward, converging
        if (peakTrend < -0.1 && troughTrend < -0.1 && peakTrend < troughTrend) {
            return {
                pattern: 'wedge-falling',
                strength: 0.6,
                accuracy: 80, // Placeholder
                detectedPoints: [...recentPeaks, ...recentTroughs],
            };
        }
    }
    return null;
};

/**
 * Calculates the dynamic confidence of a detected pattern.
 * @param {object} patternData - The detected pattern data.
 * @param {number} rsi - The current RSI value.
 * @param {number} priceVsSMA20 - The percentage difference between the current price and SMA20.
 * @param {number} priceVsSMA50 - The percentage difference between the current price and SMA50.
 * @returns {number} - The confidence score.
 */
const calculateDynamicConfidence = (patternData, rsi, priceVsSMA20, priceVsSMA50) => {
    let baseConfidence = chartPatterns[patternData.pattern]?.reliability || 70;
    let patternStrength = patternData.strength || 0.5;
    let confidence = baseConfidence * patternStrength;
    if (patternData.pattern.includes('up') || patternData.pattern === 'ascending-triangle' || patternData.pattern === 'inverse-head-and-shoulders' || patternData.pattern === 'double-bottom') {
        if (rsi > 30 && rsi < 70) confidence += 5;
        if (priceVsSMA20 > 0) confidence += 3;
        if (priceVsSMA50 > 0) confidence += 3;
    } else if (patternData.pattern.includes('down') || patternData.pattern === 'descending-triangle' || patternData.pattern === 'head-and-shoulders' || patternData.pattern === 'double-top') {
        if (rsi > 30 && rsi < 70) confidence += 5;
        if (priceVsSMA20 < 0) confidence += 3;
        if (priceVsSMA50 < 0) confidence += 3;
    }
    return Math.max(45, Math.min(92, Math.round(confidence)));
};

/**
 * Detects a chart pattern from price data.
 * @param {object[]} prices - The input price data.
 * @returns {object|null} - An object with the detected pattern and its confidence, or null.
 */
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

    const patternData = analyzePatternsDeterministic(peaks, troughs, closes, highs, lows);

    if (!patternData || !patternData.pattern) {
        return null;
    }

    const confidence = calculateDynamicConfidence(patternData, currentRSI, priceVsSMA20, priceVsSMA50);

    return {
        pattern: patternData.pattern,
        confidence: confidence,
        accuracy: patternData.accuracy,
        detectedPoints: patternData.detectedPoints,
        technicals: {
            rsi: currentRSI,
            priceVsSMA20,
            priceVsSMA50,
            peaks: peaks.length,
            troughs: troughs.length
        }
    };
};

/**
 * Calculates key support and resistance levels.
 * @param {object[]} prices - The input price data.
 * @returns {object|null} - An object with support and resistance levels, or null.
 */
export const calculateKeyLevels = (prices) => {
    if (!prices || prices.length < 10) return null;
    const recentPrices = prices.slice(-60);
    const lows = recentPrices.map(p => p.low);
    const highs = recentPrices.map(p => p.high);
    const supportLevels = findPeaksAndTroughs(lows, false).sort((a, b) => a.value - b.value).slice(0, 2);
    const resistanceLevels = findPeaksAndTroughs(highs, true).sort((a, b) => b.value - a.value).slice(0, 2);
    return {
        support: supportLevels.map(s => parseFloat(s.value.toFixed(2))),
        resistance: resistanceLevels.map(r => parseFloat(r.value.toFixed(2))),
    };
};

/**
 * Calculates the estimated breakout timing for a pattern.
 * @param {string} patternName - The name of the detected pattern.
 * @param {object} stockData - The stock data.
 * @param {number} confidence - The confidence score of the pattern.
 * @returns {object|null} - An object with breakout timing information, or null.
 */
export const calculateBreakoutTiming = (patternName, stockData, confidence) => {
    const pattern = chartPatterns[patternName];
    if (!pattern || !stockData) return null;
    const baseBreakoutDays = pattern.breakoutDays || '3-7 days';
    const breakoutRange = baseBreakoutDays.split('-');
    const minDays = parseInt(breakoutRange[0]);
    const maxDays = parseInt(breakoutRange[1]);
    let adjustedMin = minDays;
    let adjustedMax = maxDays;
    if (confidence > 80) {
        adjustedMin = Math.max(1, minDays - 1);
        adjustedMax = Math.max(adjustedMin + 1, maxDays - 2);
    } else if (confidence < 60) {
        adjustedMin = minDays + 1;
        adjustedMax = maxDays + 3;
    }
    const today = new Date();
    const minBreakoutDate = new Date(today);
    const maxBreakoutDate = new Date(today);
    minBreakoutDate.setDate(today.getDate() + adjustedMin);
    maxBreakoutDate.setDate(today.getDate() + adjustedMax);
    return {
        daysRange: `${adjustedMin}-${adjustedMax} days`,
        minDate: minBreakoutDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        maxDate: maxBreakoutDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        confidence: confidence > 75 ? 'High' : confidence > 60 ? 'Medium' : 'Low'
    };
};

/**
 * Generates a long-term assessment of a stock.
 * @param {object} stockData - The stock data.
 * @param {string} timeRangeString - The time range string (e.g., '1y', '5y').
 * @returns {object|null} - An object with the long-term assessment, or null.
 */
export const generateLongTermAssessment = (stockData, timeRangeString) => {
    if (!stockData || !stockData.prices || stockData.prices.length < 2) {
        return null;
    }
    const prices = stockData.prices.map(p => p.close).filter(p => p !== null && p !== undefined);
    if (prices.length < 2) return null;
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const firstDate = new Date(stockData.prices[0].date);
    const lastDate = new Date(stockData.prices[stockData.prices.length - 1].date);
    const actualTimeRangeYears = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365.25);
    const timeRangeLabel = actualTimeRangeYears >= 1 ? `${actualTimeRangeYears.toFixed(1)} years` : `${(actualTimeRangeYears * 12).toFixed(0)} months`;
    let trend = 'stayed relatively flat';
    if (lastPrice > firstPrice * 1.1) trend = 'generally gone up';
    else if (lastPrice < firstPrice * 0.9) trend = 'generally gone down';
    const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100;
    const returnExample = (100 * (1 + totalReturn / 100)).toFixed(2);
    let majorHigh = -Infinity;
    let majorLow = Infinity;
    let highDate = '';
    let lowDate = '';
    stockData.prices.forEach(p => {
        if (p.high > majorHigh) {
            majorHigh = p.high;
            highDate = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }
        if (p.low < majorLow) {
            majorLow = p.low;
            lowDate = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }
    });
    let volatilityDescription = "The stock's price movement history can provide insights into its stability.";
    if (prices.length > 12 && actualTimeRangeYears > 0) {
        const monthlyReturns = [];
        const approxPointsPerMonth = Math.max(1, Math.floor(prices.length / (actualTimeRangeYears * 12 || 1)));
        for (let i = approxPointsPerMonth; i < prices.length; i += approxPointsPerMonth) {
            const prevPrice = prices[i - approxPointsPerMonth];
            const currentPrice = prices[i];
            if (prevPrice > 0) {
                monthlyReturns.push((currentPrice - prevPrice) / prevPrice);
            }
        }
        if (monthlyReturns.length > 1) {
            const meanReturn = monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length;
            const variance = monthlyReturns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / monthlyReturns.length;
            const stdDev = Math.sqrt(variance);
            const annualizedStdDev = stdDev * Math.sqrt(12);
            if (annualizedStdDev > 0.4) volatilityDescription = `This stock has shown high volatility, meaning its price has experienced significant swings.`;
            else if (annualizedStdDev > 0.2) volatilityDescription = `This stock has shown moderate volatility, with noticeable price fluctuations.`;
            else volatilityDescription = `This stock has shown relatively low volatility, indicating more stable price movements.`;
        }
    }
    return {
        trend: `Over the past ${timeRangeLabel}, ${stockData.symbol} has ${trend}.`,
        totalReturn: `An investment of $100 at the start of this period would be worth approximately $${returnExample} today, a change of ${totalReturn.toFixed(1)}%.`,
        highLow: `The highest price reached was around ${stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}${majorHigh.toFixed(2)} in ${highDate}, and the lowest was about ${stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}${majorLow.toFixed(2)} in ${lowDate}.`,
        volatility: volatilityDescription,
        disclaimer: "Remember, past performance is not a guarantee of future results. This assessment is for educational purposes."
    };
};

/**
 * Generates a recommendation based on a detected pattern.
 * @param {object} pattern - The detected pattern.
 * @param {number} confidence - The confidence score of the pattern.
 * @returns {object} - An object with the recommendation action and reasoning.
 */
export const generateRecommendation = (pattern, confidence) => {
    const { recommendation, prediction } = pattern;
    let action = recommendation.toUpperCase();
    let reasoning = '';
    switch (recommendation) {
        case 'buy':
            reasoning = `Strong ${prediction} signal detected with ${confidence}% confidence. Consider accumulating positions.`;
            break;
        case 'sell':
            reasoning = `Bearish pattern confirmed with ${confidence}% confidence. Consider reducing positions or short selling.`;
            break;
        case 'hold':
            reasoning = `Consolidation pattern detected. Maintain current positions until clear breakout with ${confidence}% confidence.`;
            break;
        default:
            reasoning = `Mixed signals detected. Monitor closely for breakout direction. Confidence: ${confidence}%.`;
    }
    return { action, reasoning };
};
