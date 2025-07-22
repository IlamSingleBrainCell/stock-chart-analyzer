import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import StockChartAnalyzer from './components/StockChartAnalyzer';
import GlobalStyles from './globalStyles';
import MatrixRain from './components/layout/MatrixRain';

function App() {
  const [konami, setKonami] = useState(false);

  useEffect(() => {
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let index = 0;

    const onKeyDown = (event) => {
      if (event.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          setKonami(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <GlobalStyles />
      {konami && <MatrixRain />}
      <StockChartAnalyzer />
    </ThemeProvider>
  );
}

export default App;
