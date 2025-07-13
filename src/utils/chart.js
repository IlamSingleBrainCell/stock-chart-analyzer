import { chartThemeColors } from '../constants';

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

export const drawPatternOnCanvas = (ctx, pattern, w, h) => {
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

export const createChartFromData = (stockData, currentKeyLevels, currentTheme = 'light', chartCanvasRef) => {
    const canvas = chartCanvasRef.current; if(!canvas) return null; const ctx = canvas.getContext('2d'); const colors = chartThemeColors[currentTheme] || chartThemeColors.light;
    canvas.width = 1000; canvas.height = 500; ctx.fillStyle = colors.background; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const prices = stockData.prices; if (!prices || prices.length === 0) return null;
    const margin = { top: 40, right: 60, bottom: 60, left: 80 }; const chartWidth = canvas.width - margin.left - margin.right; const chartHeight = canvas.height - margin.top - margin.bottom;
    const allPrices = prices.flatMap(p => [p.high, p.low]).filter(p => p != null); if(allPrices.length === 0) return null; // Ensure there are prices to calculate min/max
    const minPrice = Math.min(...allPrices); const maxPrice = Math.max(...allPrices); const priceRange = maxPrice - minPrice; const padding = priceRange * 0.1;
    const xScale = (index) => margin.left + (index / (prices.length > 1 ? prices.length - 1 : 1)) * chartWidth; // Avoid division by zero for single data point
    const yScale = (price) => margin.top + ((maxPrice + padding - price) / (priceRange + 2 * padding || 1)) * chartHeight; // Avoid division by zero
    const isIndianStock = stockData.symbol.includes('.NS'); const currencySymbol = isIndianStock ? '₹' : '$';
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 0.5;
    for (let i = 0; i <= 8; i++) { const y = margin.top + (i / 8) * chartHeight; ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(margin.left + chartWidth, y); ctx.stroke(); const price = maxPrice + padding - (i / 8) * (priceRange + 2 * padding); ctx.fillStyle = colors.label; ctx.font = '12px Inter, Arial, sans-serif'; ctx.textAlign = 'right'; ctx.fillText(currencySymbol + price.toFixed(2), margin.left - 10, y + 4); }
    const numVerticalGridLines = prices.length > 250 ? 5 : (prices.length > 60 ? 6 : 4);
    for (let i = 0; i <= numVerticalGridLines; i++) { const x = margin.left + (i / numVerticalGridLines) * chartWidth; ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, margin.top + chartHeight); ctx.stroke(); const priceIndex = Math.floor((i / numVerticalGridLines) * (prices.length - 1)); if (priceIndex < prices.length && prices[priceIndex]) { const date = new Date(prices[priceIndex].date); let dateFormatOptions = { month: 'short', day: 'numeric' }; if (prices.length > 365 * 2) { dateFormatOptions = { year: 'numeric', month: 'short' }; } else if (prices.length > 90) { dateFormatOptions = { month: 'short', day: 'numeric' }; } ctx.fillStyle = colors.label; ctx.font = '11px Inter, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(date.toLocaleDateString('en-US', dateFormatOptions), x, canvas.height - 20); } }
    ctx.strokeStyle = colors.mainLine; ctx.lineWidth = 2; ctx.beginPath();
    prices.forEach((price, index) => { if(price && price.close !== null) {const x = xScale(index); const y = yScale(price.close); if (index === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }} }); ctx.stroke();
    prices.forEach((price, index) => { if(price && price.open !== null && price.close !== null && price.high !== null && price.low !== null) {const x = xScale(index); const openY = yScale(price.open); const closeY = yScale(price.close); const highY = yScale(price.high); const lowY = yScale(price.low); const isGreen = price.close >= price.open; const candleColor = isGreen ? colors.candlestickGreen : colors.candlestickRed; ctx.strokeStyle = candleColor; ctx.fillStyle = candleColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke(); const bodyHeight = Math.abs(closeY - openY); const bodyY = Math.min(openY, closeY); const bodyWidth = Math.max(2, chartWidth / prices.length * 0.6); ctx.fillRect(x - bodyWidth/2, bodyY, bodyWidth, bodyHeight || 1);}});
    if (currentKeyLevels && currentKeyLevels.support && currentKeyLevels.resistance) { ctx.lineWidth = 1; ctx.font = 'bold 10px Inter, Arial, sans-serif'; currentKeyLevels.support.forEach(level => { if (level >= minPrice && level <= maxPrice) { const y = yScale(level); ctx.strokeStyle = colors.keyLevelSupport; ctx.fillStyle = colors.keyLevelSupport; ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(margin.left, y); ctx.lineTo(chartWidth + margin.left, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillText(`S: ${currencySymbol}${level.toFixed(2)}`, chartWidth + margin.left - 50, y - 2); } }); currentKeyLevels.resistance.forEach(level => { if (level >= minPrice && level <= maxPrice) { const y = yScale(level); ctx.strokeStyle = colors.keyLevelResistance; ctx.fillStyle = colors.keyLevelResistance; ctx.beginPath(); ctx.setLineDash([4, 4]); ctx.moveTo(margin.left, y); ctx.lineTo(chartWidth + margin.left, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillText(`R: ${currencySymbol}${level.toFixed(2)}`, chartWidth + margin.left - 50, y - 2); } }); }
    ctx.fillStyle = colors.text; ctx.font = 'bold 20px Inter, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${stockData.symbol} - ${stockData.companyName}`, margin.left, 25);
    ctx.font = '14px Inter, Arial, sans-serif'; ctx.fillStyle = colors.label; const currentPriceText = stockData.currentPrice !== undefined && stockData.currentPrice !== null ? stockData.currentPrice : (prices[prices.length -1]?.close); ctx.fillText(`Current: ${currencySymbol}${currentPriceText ? currentPriceText.toFixed(2) : 'N/A'} ${stockData.currency || (isIndianStock ? 'INR' : 'USD')}`, margin.left, margin.top - 5);
    if (stockData.isMockData) { ctx.fillStyle = (currentTheme === 'dark') ? chartThemeColors.dark.danger || '#f59e0b' : '#f59e0b'; ctx.font = 'italic 12px Inter, Arial, sans-serif'; ctx.fillText('Demo Data - API temporarily unavailable', margin.left + 300, 25); }
    return canvas.toDataURL('image/png', 1.0);
  };
