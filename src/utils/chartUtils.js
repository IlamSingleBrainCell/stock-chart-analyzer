export const createChartFromData = (stockData, chartCanvasRef) => {
  const canvas = chartCanvasRef.current;
  if (!canvas) return null; // Ensure canvas ref is available
  const ctx = canvas.getContext('2d');

  // Set high resolution canvas
  canvas.width = 1000;
  canvas.height = 500;

  // Clear and set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const prices = stockData.prices.slice(-60);
  if (prices.length === 0) { // Handle case with no price data
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No price data available to draw chart.', canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png', 1.0);
  }

  const margin = { top: 40, right: 60, bottom: 60, left: 80 };
  const chartWidth = canvas.width - margin.left - margin.right;
  const chartHeight = canvas.height - margin.top - margin.bottom;

  // Find price range
  const allPrices = prices.flatMap(p => [p.high, p.low]).filter(p => p !== null && p !== undefined);
  if (allPrices.length === 0) {
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 20px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No valid price data to determine range.', canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png', 1.0);
  }
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange === 0 ? 10 : priceRange * 0.1; // Add padding for flat lines too

  // Scale functions
  const xScale = (index) => margin.left + (index / (prices.length - 1)) * chartWidth;
  const yScale = (price) => margin.top + ((maxPrice + padding - price) / (priceRange + 2 * padding)) * chartHeight;

  // Determine currency and market info
  const isIndianStock = stockData.symbol.includes('.NS');
  const currencySymbol = isIndianStock ? '₹' : '$';

  // Draw background grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;

  // Horizontal grid lines
  for (let i = 0; i <= 8; i++) {
    const y = margin.top + (i / 8) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(margin.left, y);
    ctx.lineTo(margin.left + chartWidth, y);
    ctx.stroke();

    // Price labels with correct currency
    const price = maxPrice + padding - (i / 8) * (priceRange + 2 * padding);
    ctx.fillStyle = '#666666';
    ctx.font = '12px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(currencySymbol + price.toFixed(2), margin.left - 10, y + 4);
  }

  // Vertical grid lines
  for (let i = 0; i <= 6; i++) {
    const x = margin.left + (i / 6) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, margin.top);
    ctx.lineTo(x, margin.top + chartHeight);
    ctx.stroke();

    // Date labels
    if (prices.length > 0 && i < 7) { // Ensure prices array is not empty
      const priceIndex = Math.floor((i / 6) * (prices.length - 1));
      const dateStr = prices[priceIndex]?.date;
      if (dateStr) {
        const date = new Date(dateStr);
        ctx.fillStyle = '#666666';
        ctx.font = '11px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x, canvas.height - 20);
      }
    }
  }

  // Draw price line (ensure prices are valid numbers)
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.beginPath();
  prices.forEach((price, index) => {
    if (typeof price.close === 'number' && !isNaN(price.close)) {
      const x = xScale(index);
      const y = yScale(price.close);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  });
  ctx.stroke();

  // Draw candlesticks
  prices.forEach((price, index) => {
    if (typeof price.open !== 'number' || typeof price.close !== 'number' || typeof price.high !== 'number' || typeof price.low !== 'number') {
      return; // Skip if data is invalid
    }
    const x = xScale(index);
    const openY = yScale(price.open);
    const closeY = yScale(price.close);
    const highY = yScale(price.high);
    const lowY = yScale(price.low);

    const isGreen = price.close >= price.open;
    const color = isGreen ? '#10b981' : '#ef4444';

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;

    // Draw wick (high-low line)
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    // Draw body (open-close rectangle)
    const bodyHeight = Math.abs(closeY - openY);
    const bodyY = Math.min(openY, closeY);
    const bodyWidth = 6;

    if (isGreen) {
      ctx.fillRect(x - bodyWidth / 2, bodyY, bodyWidth, bodyHeight || 1);
    } else {
      // For red candles, draw outline if bodyHeight is 0 (open === close)
      if (bodyHeight < 1) {
         ctx.beginPath();
         ctx.moveTo(x - bodyWidth / 2, bodyY);
         ctx.lineTo(x + bodyWidth / 2, bodyY);
         ctx.stroke();
      } else {
        ctx.fillRect(x - bodyWidth / 2, bodyY, bodyWidth, bodyHeight);
      }
    }
  });

  // Add title and info
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 20px Inter, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${stockData.symbol} - ${stockData.companyName}`, margin.left, 25);

  ctx.font = '14px Inter, Arial, sans-serif';
  ctx.fillStyle = '#4b5563';
  const currentPrice = stockData.currentPrice || (prices.length > 0 ? prices[prices.length - 1].close : 0);
  ctx.fillText(`Current: ${currencySymbol}${currentPrice.toFixed(2)} ${stockData.currency || (isIndianStock ? 'INR' : 'USD')}`, margin.left, margin.top - 5);

  if (stockData.isMockData) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic 12px Inter, Arial, sans-serif';
    ctx.fillText('Demo Data - API temporarily unavailable', margin.left + 300, 25);
  }

  // Convert to data URL
  return canvas.toDataURL('image/png', 1.0);
};
