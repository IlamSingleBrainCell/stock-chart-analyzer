import React, { useRef, useEffect } from 'react';

const PatternVisualizationChart = ({ stockData, detectedPoints, theme }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !stockData || !stockData.prices || stockData.prices.length === 0) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        const prices = stockData.prices.map(p => p.close);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = maxPrice - minPrice;

        const getX = (index) => (index / (prices.length - 1)) * width;
        const getY = (price) => height - ((price - minPrice) / priceRange) * height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw price line
        ctx.beginPath();
        ctx.strokeStyle = theme === 'light' ? '#000000' : '#FFFFFF';
        ctx.lineWidth = 2;
        prices.forEach((price, index) => {
            const x = getX(index);
            const y = getY(price);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw detected points and trendlines
        if (detectedPoints && detectedPoints.length > 0) {
            ctx.fillStyle = 'red';
            detectedPoints.forEach(point => {
                const x = getX(point.index);
                const y = getY(point.value);
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });

            // Draw trendlines (example for a simple line between the first two points)
            if (detectedPoints.length >= 2) {
                ctx.beginPath();
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 1;
                const firstPoint = detectedPoints[0];
                const secondPoint = detectedPoints[1];
                ctx.moveTo(getX(firstPoint.index), getY(firstPoint.value));
                ctx.lineTo(getX(secondPoint.index), getY(secondPoint.value));
                ctx.stroke();
            }
        }

    }, [stockData, detectedPoints, theme]);

    return (
        <canvas
            ref={canvasRef}
            width="600"
            height="300"
            style={{ border: '1px solid var(--card-border)', borderRadius: '8px' }}
        />
    );
};

export default PatternVisualizationChart;
