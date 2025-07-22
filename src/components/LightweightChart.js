import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const LightweightChart = ({ data, theme }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: theme === 'dark' ? '#2B2B43' : '#FFFFFF',
        textColor: theme === 'dark' ? '#D9D9D9' : '#191919',
      },
      grid: {
        vertLines: {
          color: theme === 'dark' ? '#444' : '#E6E6E6',
        },
        horzLines: {
          color: theme === 'dark' ? '#444' : '#E6E6E6',
        },
      },
      crosshair: {
        mode: 'normal',
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#444' : '#E6E6E6',
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#444' : '#E6E6E6',
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    candleSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, theme]);

  return <div ref={chartContainerRef} />;
};

export default LightweightChart;
