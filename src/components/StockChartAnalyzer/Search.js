import React from 'react';
import { Search as SearchIcon, RefreshCw } from 'lucide-react';
import FlagIcon from '../FlagIcon';

const Search = ({
    stockSymbol,
    handleInputChange,
    handleKeyDown,
    handleInputFocus,
    handleInputBlur,
    showSuggestions,
    filteredSuggestions,
    selectedSuggestionIndex,
    selectSuggestion,
    fetchAllData,
    selectedTimeRange,
    loading,
    popularStocksData,
    inputRef
}) => {
    return (
        <div className="search-section">
            <div className="search-container">
                <div className="search-input-container">
                    <input
                        ref={inputRef}
                        type="text"
                        value={stockSymbol}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="🔍 Search: AAPL, TCS.NS, Reliance, Microsoft, HDFC Bank..."
                        className="search-input"
                    />
                    {showSuggestions && (
                        <div className="suggestions-dropdown">
                            {filteredSuggestions.length > 0 ? (
                                filteredSuggestions.map((stock, index) => (
                                    <div
                                        key={stock.symbol}
                                        onClick={() => selectSuggestion(stock)}
                                        className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-color)' }}>{stock.symbol}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-color-lighter)', marginTop: '2px' }}>{stock.name}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                <div style={{ fontSize: '10px', color: stock.market === 'India' ? 'var(--danger-color)' : 'var(--primary-accent)', backgroundColor: stock.market === 'India' ? 'var(--danger-background)' : 'var(--primary-accent-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', border: `1px solid ${stock.market === 'India' ? 'var(--danger-border)' : 'var(--primary-accent-border')}`, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                    <FlagIcon country={stock.market} size={12} />
                                                    {stock.market === 'India' ? 'NSE' : 'US'}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-color-muted)', backgroundColor: 'var(--app-border)', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>{stock.sector}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : stockSymbol.length >= 1 ? (
                                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-color-lighter)', fontSize: '14px' }}>
                                    <div style={{ marginBottom: '8px' }}>🔍 No stocks found</div>
                                    <div style={{ fontSize: '12px' }}>Try searching by symbol (AAPL) or company name (Apple)</div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => {
                        if (stockSymbol.trim()) {
                            const symbolToFetch = stockSymbol.toUpperCase();
                            fetchAllData(symbolToFetch, selectedTimeRange);
                        }
                    }}
                    disabled={loading}
                    className="search-button"
                >
                    {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <SearchIcon size={16} />}
                    {loading ? 'Fetching...' : 'Get Chart'}
                </button>
            </div>
            <div className="popular-stocks">
                {popularStocksData.map(stock => (
                    <button
                        key={stock.symbol}
                        onClick={() => selectSuggestion(stock)}
                        disabled={loading}
                        className={`popular-stock-button ${stockSymbol === stock.symbol ? 'active' : ''}`}
                    >
                        <FlagIcon country={stock.market} size={12} />
                        {stock.symbol.replace('.NS', '')}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Search;
