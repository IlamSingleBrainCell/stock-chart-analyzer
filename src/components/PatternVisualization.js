import React, { useRef, useEffect } from 'react';
import { drawPattern } from '../utils/patternDrawing';

// Pattern Visualization Component
const PatternVisualization = ({ patternName, width = 300, height = 150 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !patternName) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw pattern based on type
    drawPattern(ctx, patternName, width, height);
  }, [patternName, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        background: '#ffffff',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

export default PatternVisualization;
