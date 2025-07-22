import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatternRecognitionGame from './PatternRecognitionGame';

const mockChartPatterns = {
  'head-and-shoulders': {
    description: 'A bearish reversal pattern.',
  },
  'double-top': {
    description: 'A bearish reversal pattern.',
  },
  'ascending-triangle': {
    description: 'A bullish continuation pattern.',
  },
  'descending-triangle': {
    description: 'A bearish continuation pattern.',
  },
};

const MockPatternVisualization = ({ patternName }) => (
  <div>{patternName}</div>
);

describe('PatternRecognitionGame Component', () => {
  test('renders difficulty selection screen first', () => {
    render(
      <PatternRecognitionGame
        PatternVisualization={MockPatternVisualization}
        chartPatterns={mockChartPatterns}
      />
    );

    expect(screen.getByText('Pattern Recognition Challenge!')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  test('starts the game when a difficulty is selected', () => {
    render(
      <PatternRecognitionGame
        PatternVisualization={MockPatternVisualization}
        chartPatterns={mockChartPatterns}
      />
    );

    fireEvent.click(screen.getByText('Medium'));

    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(screen.getByText(/Question: 1/)).toBeInTheDocument();
  });

  test('shows hint when hint button is clicked', () => {
    render(
      <PatternRecognitionGame
        PatternVisualization={MockPatternVisualization}
        chartPatterns={mockChartPatterns}
      />
    );

    fireEvent.click(screen.getByText('Hard'));
    fireEvent.click(screen.getByText('Show Hint'));

    expect(screen.getByText(/Hint:/)).toBeInTheDocument();
  });
});
