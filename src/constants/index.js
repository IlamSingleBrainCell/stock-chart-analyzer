export const MARKETAUX_API_KEY = 'F8x0iPiyy2Rhe8LZsQJvmisOPwpr7xQ4Np7XF0o1';
export const MARKETAUX_BASE_URL = "https://api.marketaux.com/v1/news/all";

export const FMP_API_KEY = "6Mdo6RRKRk0tofiGn2J4qVTBtCXu3zVC"; // Replace with your actual key
export const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

export const chartThemeColors = {
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
