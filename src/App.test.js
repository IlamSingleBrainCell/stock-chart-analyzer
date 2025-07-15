import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Stock Chart Analyzer title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Stock Chart Analyzer/i);
  expect(titleElement).toBeInTheDocument();
});
