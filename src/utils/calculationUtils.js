import { chartPatterns } from '../data/chartPatterns';

export const calculateBreakoutTiming = (patternName, stockData, confidence) => {
  const pattern = chartPatterns[patternName];
  // stockData might not be strictly necessary for breakout timing based on its current usage,
  // but it's passed in App.js, so we keep the signature.
  // If it were used (e.g., for volatility checks affecting timing), it would be relevant.
  if (!pattern) return null;

  const baseBreakoutDays = pattern.breakoutDays || '3-7 days'; // Default if not specified
  const breakoutRange = baseBreakoutDays.split('-');

  let minDays, maxDays;
  if (breakoutRange.length === 2) {
    minDays = parseInt(breakoutRange[0]);
    maxDays = parseInt(breakoutRange[1]);
  } else {
    // Handle cases where breakoutDays might not be a range, e.g. "5 days"
    minDays = parseInt(breakoutRange[0]);
    maxDays = minDays; // Assume same day if not a range
  }

  if (isNaN(minDays) || isNaN(maxDays)) { // Check for parsing errors
    console.error("Could not parse breakoutDays:", baseBreakoutDays);
    return { // Return a default or error indicator
        daysRange: 'N/A',
        minDate: 'N/A',
        maxDate: 'N/A',
        confidence: confidence > 75 ? 'High' : confidence > 60 ? 'Medium' : 'Low'
    };
  }

  let adjustedMin = minDays;
  let adjustedMax = maxDays;

  if (confidence > 80) {
    adjustedMin = Math.max(1, minDays - 1);
    adjustedMax = Math.max(adjustedMin + 1, maxDays - 2);
  } else if (confidence < 60) {
    adjustedMin = minDays + 1;
    adjustedMax = maxDays + 3;
  }

  // Ensure min is less than or equal to max after adjustments
  if (adjustedMin > adjustedMax) {
    adjustedMin = adjustedMax;
  }


  const today = new Date();
  const minBreakoutDate = new Date(today);
  minBreakoutDate.setDate(today.getDate() + adjustedMin);

  const maxBreakoutDate = new Date(today);
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
