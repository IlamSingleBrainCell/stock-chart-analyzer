import React from 'react';
import { ThemeProvider } from './ThemeContext';
import StockChartAnalyzer from './components/StockChartAnalyzer';
import Logo from './logo';

function App() {
  return (
    <ThemeProvider>
      <div style={{ position: 'absolute', top: '20px', left: '20px', textAlign: 'center' }}>
        <Logo />
      </div>
      <StockChartAnalyzer />
    </ThemeProvider>
  );
}

export default App;
