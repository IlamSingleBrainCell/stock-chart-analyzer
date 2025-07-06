// Generate realistic mock data as fallback
export const generateMockStockData = (symbol) => {
  const isIndianStock = symbol.includes('.NS');
  const basePrice = isIndianStock ? Math.random() * 2000 + 500 : Math.random() * 200 + 50; // Higher base price for Indian stocks in INR
  const prices = [];
  let currentPrice = basePrice;

  // Generate 90 days of realistic price data
  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const volatility = 0.02;
    const change = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice * (1 + change);

    const open = currentPrice;
    const close = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = Math.floor(Math.random() * 10000000) + 1000000;

    prices.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });

    currentPrice = close;
  }

  return {
    symbol: symbol.toUpperCase(),
    companyName: isIndianStock ? `${symbol.replace('.NS', '')} Ltd.` : `${symbol.toUpperCase()} Inc.`,
    currency: isIndianStock ? 'INR' : 'USD',
    exchange: isIndianStock ? 'NSE' : 'NASDAQ',
    currentPrice: currentPrice,
    prices: prices,
    isMockData: true
  };
};

export const fetchYahooFinanceData = async (symbol) => {
  try {
    // Using a CORS proxy service to bypass CORS restrictions
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const yahooUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`);

    const response = await fetch(proxyUrl + yahooUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.chart?.error) {
      throw new Error(data.chart.error.description || 'Invalid stock symbol');
    }

    if (!data.chart?.result?.[0]) {
      throw new Error('No data found for this symbol');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    const meta = result.meta;

    const prices = timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      close: quotes.close[index],
      volume: quotes.volume[index]
    })).filter(price => price.close !== null && price.close !== undefined);

    if (prices.length === 0) {
      throw new Error('No valid price data found');
    }

    return {
      symbol: symbol.toUpperCase(),
      companyName: meta.longName || symbol,
      currency: meta.currency || 'USD',
      exchange: meta.exchangeName || '',
      currentPrice: meta.regularMarketPrice || prices[prices.length - 1].close,
      prices: prices
    };
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);

    // Fallback: Generate realistic mock data if API fails
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      return generateMockStockData(symbol);
    }

    throw new Error(`Failed to fetch data for ${symbol}: ${error.message}`);
  }
};
