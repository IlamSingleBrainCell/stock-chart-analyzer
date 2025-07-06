import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import FlagIcon from './FlagIcon'; // Import FlagIcon directly

const StockSearch = ({
  stockSymbol,
  handleInputChange,
  handleKeyDown,
  handleInputFocus,
  handleInputBlur,
  showSuggestions,
  filteredSuggestions,
  selectedSuggestionIndex,
  selectSuggestion,
  loading,
  fetchStockData,
  popularStocksData,
  selectStock,
  highlightMatch,
  inputRef,
  stockDatabase // Added: needed for the "Supporting X stocks" text
}) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#1a202c', fontSize: '18px' }}>
        <Search size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
        Get Live Stock Chart (3-Month Analysis)
      </label>

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={stockSymbol}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="🔍 Search: AAPL, TCS.NS, Reliance, Microsoft, HDFC Bank..."
              style={{
                width: '100%',
                padding: '14px 16px',
                border: showSuggestions ? '2px solid #6366f1' : '2px solid rgba(99, 102, 241, 0.2)',
                borderRadius: showSuggestions ? '8px 8px 0 0' : '8px',
                fontSize: '16px',
                fontWeight: '500',
                outline: 'none',
                transition: 'border-color 0.2s',
                borderBottom: showSuggestions ? '1px solid rgba(99, 102, 241, 0.2)' : '2px solid rgba(99, 102, 241, 0.2)'
              }}
            />

            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                backgroundColor: 'white',
                border: '2px solid #6366f1',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      onClick={() => selectSuggestion(stock)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: index === selectedSuggestionIndex ? '#f3f4f6' : 'white',
                        borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #e5e7eb' : 'none',
                        transition: 'background-color 0.2s'
                      }}
                      // onMouseEnter={() => setSelectedSuggestionIndex(index)} // This function needs to be passed if used
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>
                            {highlightMatch(stock.symbol, stockSymbol)}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                            {highlightMatch(stock.name, stockSymbol)}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <div style={{
                            fontSize: '10px',
                            color: stock.market === 'India' ? '#dc2626' : '#2563eb',
                            backgroundColor: stock.market === 'India' ? '#fef2f2' : '#eff6ff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            border: `1px solid ${stock.market === 'India' ? '#fecaca' : '#dbeafe'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <FlagIcon country={stock.market} size={12} />
                            {stock.market === 'India' ? 'NSE' : 'US'}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            backgroundColor: '#f3f4f6',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}>
                            {stock.sector}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : stockSymbol.length >= 1 ? (
                  <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    <div style={{ marginBottom: '8px' }}>🔍 No stocks found</div>
                    <div style={{ fontSize: '12px' }}>
                      Try searching by symbol (AAPL) or company name (Apple)
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <button
            onClick={() => stockSymbol.trim() && fetchStockData(stockSymbol.toUpperCase())}
            disabled={loading || !stockSymbol.trim()}
            style={{
              padding: '14px 24px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              minWidth: '140px',
              justifyContent: 'center'
            }}
          >
            {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
            {loading ? 'Fetching...' : 'Get Chart'}
          </button>
        </div>
      </div>

      <div>
        <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '12px', fontWeight: '500' }}>
          Popular Stocks from {stockDatabase.length}+ available (<FlagIcon country="US" size={12} />US + <FlagIcon country="India" size={12} />Indian Markets):
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {popularStocksData.map(stock => (
            <button
              key={stock.symbol}
              onClick={() => selectStock(stock.symbol)}
              disabled={loading}
              style={{
                padding: '8px 12px',
                background: stockSymbol === stock.symbol ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(99, 102, 241, 0.1)',
                color: stockSymbol === stock.symbol ? 'white' : '#4f46e5',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                if (stockSymbol !== stock.symbol && !loading) {
                  e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (stockSymbol !== stock.symbol && !loading) {
                  e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                }
              }}
            >
              <FlagIcon country={stock.market} size={12} />
              {stock.symbol.replace('.NS', '')}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
          <strong>Examples:</strong> Search from {stockDatabase.length}+ stocks - try "TCS" (Indian IT), "Reliance" (Indian Oil), "AAPL" (US Tech), "HDFC" (Indian Banking), "NVDA" (US Semiconductors), or "Wipro" (Indian IT)
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
