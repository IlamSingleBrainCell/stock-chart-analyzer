import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { ProsConsProvider } from './ProsConsContext';
import StockChartAnalyzer from './components/StockChartAnalyzer';
import Logo from './logo';

function App() {
  return (
    <ThemeProvider>
      <ProsConsProvider>
        <div style={{ position: 'absolute', top: '20px', left: '20px', textAlign: 'center' }}>
          <Logo />
        </div>
        <StockChartAnalyzer />
      </ProsConsProvider>
    </ThemeProvider>
  );
}

export default App;
