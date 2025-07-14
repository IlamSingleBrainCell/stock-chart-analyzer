import React from 'react';
import { ThemeProvider } from './ThemeContext';
import StockChartAnalyzer from './components/StockChartAnalyzer';
import Logo from './logo';

function App() {
  return (
    <ThemeProvider>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Logo />
      </div>
      <StockChartAnalyzer />
    </ThemeProvider>
  );
}

export default App;
