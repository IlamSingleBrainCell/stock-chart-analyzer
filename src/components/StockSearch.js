import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import FlagIcon from './FlagIcon';
import { highlightMatch } from '../utils/helpers';

const StockSearch = ({ onSelect, stockDatabase }) => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);

  const filterSuggestions = (input) => {
    if (!input || input.length < 1) return [];
    const query = input.toLowerCase();
    const matches = stockDatabase.filter(stock => {
      const symbolMatch = stock.symbol.toLowerCase().includes(query);
      const nameMatch = stock.name.toLowerCase().includes(query);
      const sectorMatch = stock.sector && stock.sector.toLowerCase().includes(query);
      const marketMatch = stock.market.toLowerCase().includes(query);
      const indianStockMatch = stock.market === 'India' && stock.symbol.toLowerCase().startsWith(query) && query.endsWith('.ns') === false;
      return symbolMatch || nameMatch || sectorMatch || marketMatch || indianStockMatch;
    });

    return matches.sort((a, b) => {
      const aSymbol = a.symbol.toLowerCase();
      const bSymbol = b.symbol.toLowerCase();
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (aSymbol === query) return -1;
      if (bSymbol === query) return 1;

      const aSymbolStartsWith = aSymbol.startsWith(query);
      const bSymbolStartsWith = bSymbol.startsWith(query);
      if (aSymbolStartsWith && !bSymbolStartsWith) return -1;
      if (bSymbolStartsWith && !aSymbolStartsWith) return 1;
      if (aSymbolStartsWith && bSymbolStartsWith) {
        return aSymbol.length - bSymbol.length;
      }

      if (a.market === 'US' && b.market === 'India') return -1;
      if (b.market === 'US' && a.market === 'India') return 1;

      if (aName.includes(query) && !bName.includes(query)) return -1;
      if (bName.includes(query) && !aName.includes(query)) return 1;

      return 0;
    }).slice(0, 12);
  };

  const handleInputChange = (value) => {
    setStockSymbol(value);
    if (value.length >= 1) {
      const suggestions = filterSuggestions(value);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) {
          selectSuggestion(filteredSuggestions[selectedSuggestionIndex]);
        } else if (stockSymbol.trim()) {
          onSelect({ symbol: stockSymbol.toUpperCase() });
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  const selectSuggestion = (stock) => {
    const displaySymbol = stock.market === 'India' ? stock.symbol.replace('.NS', '') : stock.symbol;
    setStockSymbol(displaySymbol);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    onSelect(stock);
  };

  const handleInputFocus = () => {
    if (stockSymbol.length >= 1) {
      const suggestions = filterSuggestions(stockSymbol);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={stockSymbol}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search for a stock..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => { if (stockSymbol.trim()) onSelect({ symbol: stockSymbol.toUpperCase() }); }}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          <Search size={20} />
        </button>
      </div>
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((stock, index) => (
              <div
                key={stock.symbol}
                onClick={() => selectSuggestion(stock)}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${index === selectedSuggestionIndex ? 'bg-gray-100' : ''}`}
              >
                <div className="flex justify-between">
                  <div>
                    <span className="font-semibold">{highlightMatch(stock.symbol, stockSymbol)}</span>
                    <span className="ml-2 text-sm text-gray-500">{highlightMatch(stock.name, stockSymbol)}</span>
                  </div>
                  <div className="flex items-center">
                    <FlagIcon country={stock.market} size={16} />
                    <span className="ml-2 text-xs">{stock.sector}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
