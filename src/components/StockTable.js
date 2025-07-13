import React, { useState, useEffect } from 'react';
import { fetchDhanData } from '../services/dhanService';

const StockTable = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreStocks = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchDhanData(page);
            if (data && data.data && data.data.length > 0) {
                setStocks(prevStocks => [...prevStocks, ...data.data]);
                setPage(prevPage => prevPage + 1);
                if (data.data.length < 50) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMoreStocks();
    }, []);

    const handleScroll = (e) => {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            loadMoreStocks();
        }
    };

    return (
        <div style={{ background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', padding: '24px', boxShadow: '0 8px 32px var(--card-shadow)' }} onScroll={handleScroll} >
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', textAlign: 'center' }}>
                Stock Market Overview
            </h2>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Symbol</th>
                            <th style={tableHeaderStyle}>Market Cap</th>
                            <th style={tableHeaderStyle}>1-Year High</th>
                            <th style| {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid var(--card-border)',
    color: 'var(--text-color-light)',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase'
};

const tableCellStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid var(--card-border)',
    color: 'var(--text-color)',
    fontSize: '14px'
};

export default StockTable;
