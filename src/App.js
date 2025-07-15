import React from 'react';
import { ThemeProvider } from './ThemeContext';
import StockChartAnalyzer from './components/StockChartAnalyzer';
import Logo from './logo';

function App() {
  return (
    <ThemeProvider>
      <StockChartAnalyzer />
    </ThemeProvider>
  );
}

export default App;
