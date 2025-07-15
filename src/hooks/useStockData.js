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
            const query = symbol.trim().toLowerCase();
            const stock = stockDatabase.find(s => s.symbol.toLowerCase() === `${query}.ns` || s.name.toLowerCase().includes(query) || s.symbol.toLowerCase() === query);

            let symbolToFetch;
            if (stock) {
                symbolToFetch = stock.symbol;
            } else {
                symbolToFetch = symbol.trim().toUpperCase();
                // If it's likely an Indian stock and doesn't have .NS, add it.
                if (!symbolToFetch.endsWith('.NS') && stockDatabase.some(s => s.market === 'India' && s.name.toLowerCase().includes(query))) {
                    symbolToFetch += '.NS';
                }
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
