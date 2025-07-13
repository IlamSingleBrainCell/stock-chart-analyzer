import { useState } from 'react';
import { fetchYahooFinanceData } from '../services/stockService';
import { fetchStockNews } from '../services/newsService';
import { fetchFinancialDataForProsCons } from '../services/financialService';

export const useStockData = () => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stockNews, setStockNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [newsError, setNewsError] = useState(null);
    const [financialData, setFinancialData] = useState(null);
    const [financialDataLoading, setFinancialDataLoading] = useState(false);
    const [financialDataError, setFinancialDataError] = useState(null);

    const fetchStockData = async (symbol, timeRange = '3mo') => {
        if (!symbol.trim()) return;
        setLoading(true);
        setError(null);
        setStockData(null);
        setFinancialData(null);
        setFinancialDataError(null);

        try {
            const data = await fetchYahooFinanceData(symbol.trim().toUpperCase(), timeRange);
            setStockData(data);

            if (data && data.symbol) {
                // Fetch financial data
                setFinancialDataLoading(true);
                try {
                    const financialData = await fetchFinancialDataForProsCons(data.symbol);
                    setFinancialData(financialData);
                } catch (error) {
                    setFinancialDataError(error.message);
                } finally {
                    setFinancialDataLoading(false);
                }

                // Fetch news
                setNewsLoading(true);
                try {
                    const news = await fetchStockNews(data.symbol);
                    setStockNews(news);
                } catch (error) {
                    setNewsError(error.message);
                } finally {
                    setNewsLoading(false);
                }
            } else {
                throw new Error("No valid stock data received from Yahoo Finance.");
            }
        } catch (error) {
            setError(error.message);
            console.error('Stock data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        stockData,
        loading,
        error,
        stockNews,
        newsLoading,
        newsError,
        financialData,
        financialDataLoading,
        financialDataError,
        fetchStockData,
    };
};
