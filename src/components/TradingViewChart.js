import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    script.onload = () => {
      const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
        width: 800,
        height: 500,
        layout: {
          backgroundColor: '#ffffff',
          textColor: 'rgba(33, 56, 77, 1)',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
        crosshair: {
          mode: window.LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#ff4976',
        wickUpColor: '#4bffb5',
      });

      candleSeries.setData(data);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
};

export default TradingViewChart;
