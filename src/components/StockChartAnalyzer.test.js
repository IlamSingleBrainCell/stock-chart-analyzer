import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StockChartAnalyzer from './StockChartAnalyzer';
import * as stockService from '../services/stockService';
import { ThemeContext } from '../ThemeContext';

// Mock the services
jest.mock('../services/stockService');

describe('StockChartAnalyzer', () => {
    beforeEach(() => {
        stockService.fetchNASDAQListed.mockResolvedValue([
            { symbol: 'NDAQ', name: 'Nasdaq Inc.', market: 'US', sector: 'Financials' }
        ]);
        stockService.fetchYahooFinanceData.mockResolvedValue({
            symbol: 'AAPL',
            companyName: 'Apple Inc.',
            currency: 'USD',
            exchange: 'NASDAQ',
            currentPrice: 150.0,
            prices: [{ date: '2023-01-01', close: 150.0 }]
        });
    });

    const renderWithTheme = (ui) => {
        return render(
            <ThemeContext.Provider value={{ theme: 'light', toggleTheme: jest.fn() }}>
                {ui}
            </ThemeContext.Provider>
        );
    };

    test('renders the main title', async () => {
        renderWithTheme(<StockChartAnalyzer />);
        await waitFor(() => {
            expect(screen.getByText(/Stock Chart Pattern Analyzer/i)).toBeInTheDocument();
        });
    });

    test('fetches and displays a stock chart', async () => {
        renderWithTheme(<StockChartAnalyzer />);
        const input = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(input, { target: { value: 'AAPL' } });
        fireEvent.click(screen.getByText(/Get Chart/i));

        await waitFor(() => {
            expect(stockService.fetchYahooFinanceData).toHaveBeenCalledWith('AAPL', '3mo');
        });

        await waitFor(() => {
            const image = screen.getByAltText('Stock chart');
            expect(image).toBeInTheDocument();
        });
    });

    test('shows typeahead suggestions', async () => {
        renderWithTheme(<StockChartAnalyzer />);
        const input = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(input, { target: { value: 'App' } });

        await waitFor(() => {
            expect(screen.getByText(/Apple Inc./i)).toBeInTheDocument();
        });
    });

    test('selects a stock from suggestions', async () => {
        renderWithTheme(<StockChartAnalyzer />);
        const input = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(input, { target: { value: 'App' } });

        await waitFor(() => {
            fireEvent.click(screen.getByText(/Apple Inc./i));
        });

        await waitFor(() => {
            expect(input.value).toBe('AAPL');
        });

        await waitFor(() => {
            expect(stockService.fetchYahooFinanceData).toHaveBeenCalledWith('AAPL', '3mo');
        });
    });
});
