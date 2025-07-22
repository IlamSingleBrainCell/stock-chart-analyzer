import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createChart } from 'lightweight-charts';

const MainChartWrapper = styled.main`
  flex-grow: 1;
  padding: 20px;
  position: relative;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const FloatingToolbar = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  background: var(--surface);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
`;

const MainChart = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: 'var(--bg)',
        textColor: 'var(--text-primary)',
      },
      grid: {
        vertLines: {
          color: 'var(--surface-hover)',
        },
        horzLines: {
          color: 'var(--surface-hover)',
        },
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: 'var(--success)',
      downColor: 'var(--danger)',
      borderDownColor: 'var(--danger)',
      borderUpColor: 'var(--success)',
      wickDownColor: 'var(--danger)',
      wickUpColor: 'var(--success)',
    });

    const data = [
      { time: '2019-05-28', open: 180, high: 185, low: 178, close: 182 },
      { time: '2019-05-29', open: 182, high: 183, low: 175, close: 177 },
      { time: '2019-05-30', open: 177, high: 181, low: 176, close: 179 },
      { time: '2019-05-31', open: 179, high: 182, low: 178, close: 181 },
      { time: '2019-06-03', open: 181, high: 188, low: 180, close: 185 },
    ];

    candleSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <MainChartWrapper>
      <FloatingToolbar>
        <p>Toolbar</p>
      </FloatingToolbar>
      <ChartContainer ref={chartContainerRef} />
    </MainChartWrapper>
  );
};

export default MainChart;
