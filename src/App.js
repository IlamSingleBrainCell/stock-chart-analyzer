import React from 'react';
import { ThemeProvider } from './ThemeContext';
import StockChartAnalyzer from './components/StockChartAnalyzer';

function App() {
  return (
    <ThemeProvider>
      <StockChartAnalyzer />
    </ThemeProvider>
  );
}

export default App;
