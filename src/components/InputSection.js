import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import FlagIcon from './FlagIcon'; // Assuming FlagIcon is in the same components directory

// Make sure to pass all necessary props from App.js
const InputSection = ({
  stockSymbol,
  handleInputChange,
  handleKeyDown,
  handleInputFocus,
  handleInputBlur,
  showSuggestions,
  filteredSuggestions,
  selectSuggestion,
  selectedSuggestionIndex, // Added this prop
  highlightMatch, // Added this prop
  inputRef,
  loading,
  financialDataLoading,
  fetchStockData,
  selectedTimeRange,
  handleTimeRangeChange,
  popularStocksData,
  selectStock,
  stockDatabase // For the count
}) => {
  return (
    <div className="input-section-card">
      <label className="input-label">
        <Search size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--text-color-light)' }} />
        Get Live Stock Chart Analysis
      </label>
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={stockSymbol}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={`Search: AAPL, TCS.NS, ${stockDatabase.length}+ stocks...`}
              className={`semrush-input ${showSuggestions ? 'input-focused-with-suggestions' : ''}`}
            />
            {showSuggestions && (
              <div className="suggestions-dropdown">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      onClick={() => selectSuggestion(stock)}
                      className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)} // Use setSelectedSuggestionIndex
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px' }}>{highlightMatch(stock.symbol, stockSymbol)}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-color-light)', marginTop: '2px' }}>{highlightMatch(stock.name, stockSymbol)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <div style={{ fontSize: '10px', color: stock.market === 'India' ? 'var(--danger-color)' : 'var(--primary-accent)', backgroundColor: stock.market === 'India' ? 'var(--danger-background)' : 'var(--primary-accent-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', border: `1px solid ${stock.market === 'India' ? 'var(--danger-border)' : 'var(--primary-accent-border)'}`, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <FlagIcon country={stock.market} size={12} />
                            {stock.market === 'India' ? 'NSE' : 'US'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-color-muted)', backgroundColor: 'var(--app-border)', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                            {stock.sector}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : stockSymbol.length >= 1 ? (
                  <div className="suggestion-item" style={{ textAlign: 'center', color: 'var(--text-color-light)' }}>
                    <div style={{ marginBottom: '8px' }}>🔍 No stocks found</div>
                    <div style={{ fontSize: '12px' }}>Try searching by symbol (AAPL) or company name (Apple)</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <button
            onClick={() => { if (stockSymbol.trim()) { fetchStockData(stockSymbol.toUpperCase(), selectedTimeRange); } }}
            disabled={loading || !stockSymbol.trim()}
            className="semrush-button semrush-button-primary"
            style={{ minWidth: '160px' }}
          >
            {loading && !financialDataLoading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
            {loading && !financialDataLoading ? 'Fetching...' : (financialDataLoading ? 'Financials...' : 'Get Data')}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px', marginTop: '20px' }}>
        <label className="input-label">Select Data Time Range:</label>
        <div className="button-group">
          {['3mo', '1y', '5y', '10y'].map(range => {
            let displayLabel = '';
            if (range === '3mo') displayLabel = '3 Months';
            else if (range === '1y') displayLabel = '1 Year';
            else if (range === '5y') displayLabel = '5 Years';
            else if (range === '10y') displayLabel = '10 Years';
            return (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`semrush-button semrush-button-secondary ${selectedTimeRange === range ? 'active' : ''}`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="input-label">Popular Stocks:</label>
        <div className="button-group">
          {popularStocksData.map(stock => (
            <button
              key={stock.symbol}
              onClick={() => selectStock(stock.symbol)}
              disabled={loading}
              className={`semrush-button semrush-button-secondary ${stockSymbol === stock.symbol ? 'active' : ''}`}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <FlagIcon country={stock.market} size={12} /> {stock.symbol.replace('.NS', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
