import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Stock Chart Analyzer', () => {
  render(<App />);
  const linkElement = screen.getByText(/Stock Chart Pattern Analyzer/i);
  expect(linkElement).toBeInTheDocument();
});
