// Pattern drawing utility functions
export const drawLine = (ctx, points) => {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
};

export const drawHeadAndShoulders = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.7],
    [margin + w * 0.2, margin + h * 0.4],  // Left shoulder
    [margin + w * 0.35, margin + h * 0.6], // Valley
    [margin + w * 0.5, margin + h * 0.1],  // Head
    [margin + w * 0.65, margin + h * 0.6], // Valley
    [margin + w * 0.8, margin + h * 0.4],  // Right shoulder
    [margin + w, margin + h * 0.8]
  ];
  drawLine(ctx, points);

  // Draw neckline
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.35, margin + h * 0.6);
  ctx.lineTo(margin + w * 0.65, margin + h * 0.6);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawInverseHeadAndShoulders = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.3],
    [margin + w * 0.2, margin + h * 0.6],  // Left shoulder
    [margin + w * 0.35, margin + h * 0.4], // Peak
    [margin + w * 0.5, margin + h * 0.9],  // Head
    [margin + w * 0.65, margin + h * 0.4], // Peak
    [margin + w * 0.8, margin + h * 0.6],  // Right shoulder
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);

  // Draw neckline
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.35, margin + h * 0.4);
  ctx.lineTo(margin + w * 0.65, margin + h * 0.4);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawDoubleTop = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.7],
    [margin + w * 0.25, margin + h * 0.2], // First peak
    [margin + w * 0.4, margin + h * 0.6],  // Valley
    [margin + w * 0.6, margin + h * 0.2],  // Second peak
    [margin + w, margin + h * 0.8]
  ];
  drawLine(ctx, points);

  // Draw support line
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.4, margin + h * 0.6);
  ctx.lineTo(margin + w * 0.8, margin + h * 0.6);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawDoubleBottom = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.3],
    [margin + w * 0.25, margin + h * 0.8], // First trough
    [margin + w * 0.4, margin + h * 0.4],  // Peak
    [margin + w * 0.6, margin + h * 0.8],  // Second trough
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);

  // Draw resistance line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.4, margin + h * 0.4);
  ctx.lineTo(margin + w * 0.8, margin + h * 0.4);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawCupAndHandle = (ctx, margin, w, h) => {
  // Cup
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.3);
  ctx.quadraticCurveTo(margin + w * 0.35, margin + h * 0.8, margin + w * 0.7, margin + h * 0.3);
  ctx.stroke();

  // Handle
  const points = [
    [margin + w * 0.7, margin + h * 0.3],
    [margin + w * 0.8, margin + h * 0.45],
    [margin + w * 0.9, margin + h * 0.4],
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
};

export const drawAscendingTriangle = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.8],
    [margin + w * 0.3, margin + h * 0.6],
    [margin + w * 0.5, margin + h * 0.4],
    [margin + w * 0.7, margin + h * 0.5],
    [margin + w * 0.85, margin + h * 0.35],
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);

  // Resistance line (horizontal)
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.3, margin + h * 0.3);
  ctx.lineTo(margin + w, margin + h * 0.3);
  ctx.stroke();

  // Support line (ascending)
  ctx.strokeStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.8);
  ctx.lineTo(margin + w * 0.85, margin + h * 0.35);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawDescendingTriangle = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.2],
    [margin + w * 0.3, margin + h * 0.4],
    [margin + w * 0.5, margin + h * 0.6],
    [margin + w * 0.7, margin + h * 0.5],
    [margin + w * 0.85, margin + h * 0.65],
    [margin + w, margin + h * 0.8]
  ];
  drawLine(ctx, points);

  // Support line (horizontal)
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.3, margin + h * 0.7);
  ctx.lineTo(margin + w, margin + h * 0.7);
  ctx.stroke();

  // Resistance line (descending)
  ctx.strokeStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.2);
  ctx.lineTo(margin + w * 0.85, margin + h * 0.65);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawRisingWedge = (ctx, margin, w, h) => {
  // Lower trend line (rising)
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.8);
  ctx.lineTo(margin + w, margin + h * 0.4);
  ctx.stroke();

  // Upper trend line (rising slower)
  ctx.strokeStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.3);
  ctx.lineTo(margin + w, margin + h * 0.2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Price line
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  const points = [
    [margin, margin + h * 0.6],
    [margin + w * 0.2, margin + h * 0.7],
    [margin + w * 0.4, margin + h * 0.5],
    [margin + w * 0.6, margin + h * 0.6],
    [margin + w * 0.8, margin + h * 0.4],
    [margin + w, margin + h * 0.3]
  ];
  drawLine(ctx, points);
};

export const drawFallingWedge = (ctx, margin, w, h) => {
  // Upper trend line (falling)
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.2);
  ctx.lineTo(margin + w, margin + h * 0.6);
  ctx.stroke();

  // Lower trend line (falling faster)
  ctx.strokeStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(margin, margin + h * 0.7);
  ctx.lineTo(margin + w, margin + h * 0.8);
  ctx.stroke();
  ctx.setLineDash([]);

  // Price line
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  const points = [
    [margin, margin + h * 0.4],
    [margin + w * 0.2, margin + h * 0.3],
    [margin + w * 0.4, margin + h * 0.5],
    [margin + w * 0.6, margin + h * 0.4],
    [margin + w * 0.8, margin + h * 0.6],
    [margin + w, margin + h * 0.7]
  ];
  drawLine(ctx, points);
};

export const drawFlag = (ctx, margin, w, h) => {
  // Strong move up (flagpole)
  const points1 = [
    [margin, margin + h * 0.9],
    [margin + w * 0.4, margin + h * 0.2]
  ];
  drawLine(ctx, points1);

  // Consolidation (flag)
  const points2 = [
    [margin + w * 0.4, margin + h * 0.2],
    [margin + w * 0.5, margin + h * 0.3],
    [margin + w * 0.6, margin + h * 0.25],
    [margin + w * 0.7, margin + h * 0.35],
    [margin + w * 0.8, margin + h * 0.3],
    [margin + w, margin + h * 0.1]
  ];
  drawLine(ctx, points2);

  // Flag boundaries
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.4, margin + h * 0.2);
  ctx.lineTo(margin + w * 0.8, margin + h * 0.25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(margin + w * 0.4, margin + h * 0.35);
  ctx.lineTo(margin + w * 0.8, margin + h * 0.4);
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawGenericPattern = (ctx, margin, w, h) => {
  const points = [
    [margin, margin + h * 0.5],
    [margin + w * 0.2, margin + h * 0.3],
    [margin + w * 0.4, margin + h * 0.7],
    [margin + w * 0.6, margin + h * 0.4],
    [margin + w * 0.8, margin + h * 0.6],
    [margin + w, margin + h * 0.2]
  ];
  drawLine(ctx, points);
};

export const drawPattern = (ctx, pattern, w, h) => {
  const margin = 20;
  const chartW = w - 2 * margin;
  const chartH = h - 2 * margin;

  // Set default styles
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = margin + (i / 4) * chartH;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(w - margin, y);
    ctx.stroke();
  }

  // Reset line style for pattern
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;

  switch (pattern) {
    case 'head-and-shoulders':
      drawHeadAndShoulders(ctx, margin, chartW, chartH);
      break;
    case 'inverse-head-and-shoulders':
      drawInverseHeadAndShoulders(ctx, margin, chartW, chartH);
      break;
    case 'double-top':
      drawDoubleTop(ctx, margin, chartW, chartH);
      break;
    case 'double-bottom':
      drawDoubleBottom(ctx, margin, chartW, chartH);
      break;
    case 'cup-and-handle':
      drawCupAndHandle(ctx, margin, chartW, chartH);
      break;
    case 'ascending-triangle':
      drawAscendingTriangle(ctx, margin, chartW, chartH);
      break;
    case 'descending-triangle':
      drawDescendingTriangle(ctx, margin, chartW, chartH);
      break;
    case 'wedge-rising':
      drawRisingWedge(ctx, margin, chartW, chartH);
      break;
    case 'wedge-falling':
      drawFallingWedge(ctx, margin, chartW, chartH);
      break;
    case 'flag':
      drawFlag(ctx, margin, chartW, chartH);
      break;
    default:
      drawGenericPattern(ctx, margin, chartW, chartH);
  }

  // Add pattern name
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 12px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(pattern.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' '), w / 2, h - 5);
};
