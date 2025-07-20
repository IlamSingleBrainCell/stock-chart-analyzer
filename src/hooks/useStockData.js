import { useState, useEffect, useCallback } from 'react';
import { fetchYahooFinanceData } from '../services/stockService';

export const useStockData = () => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stockDatabase, setStockDatabase] = useState([]);

    useEffect(() => {
        fetch('/stockDatabase.json')
            .then(response => response.json())
            .then(data => setStockDatabase(data))
            .catch(error => console.error('Error fetching stock database:', error));
    }, []);

    const fetchAllData = useCallback(async (symbol, timeRange = '3mo') => {
        if (!symbol.trim()) return;
        setLoading(true);
        setError(null);
        setStockData(null);

        try {
            let symbolToFetch = symbol.trim().toUpperCase();
            const isIndianStock = stockDatabase.some(s => s.market === 'India' && (s.symbol.toLowerCase() === `${symbol.toLowerCase()}.ns` || s.name.toLowerCase().includes(symbol.toLowerCase())));
            if (isIndianStock && !symbolToFetch.endsWith('.NS')) {
                symbolToFetch += '.NS';
            }

            const data = await fetchYahooFinanceData(symbolToFetch, timeRange);
            setStockData(data);

        } catch (error) {
            setError(error.message);
            console.error('Stock data fetch error:', error);
            setStockData(null);
        } finally {
            setLoading(false);
        }
    }, [stockDatabase]);

    return {
        stockData,
        loading,
        error,
        fetchAllData,
    };
};
