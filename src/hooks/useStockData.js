import { useState } from 'react';
import { fetchYahooFinanceData } from '../services/stockService';

export const useStockData = () => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllData = async (symbol, timeRange = '3mo') => {
        if (!symbol.trim()) return;
        setLoading(true);
        setError(null);
        setStockData(null);

        try {
            const data = await fetchYahooFinanceData(symbol.trim().toUpperCase(), timeRange);
            setStockData(data);

        } catch (error) {
            setError(error.message);
            console.error('Stock data fetch error:', error);
            setStockData(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        stockData,
        loading,
        error,
        fetchAllData,
    };
};
