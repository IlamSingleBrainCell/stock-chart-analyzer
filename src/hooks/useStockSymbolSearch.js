import { useState, useCallback } from 'react';
import React from 'react'; // Needed for JSX in highlightMatch

export const useStockSymbolSearch = (stockDatabase, onSuggestionSelected) => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const filterSuggestions = useCallback((input) => {
    if (!input || input.length < 1) return [];
    const query = input.toLowerCase();
    const matches = stockDatabase.filter(stock =>
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query) ||
      stock.sector.toLowerCase().includes(query) ||
      stock.market.toLowerCase().includes(query)
    );
    return matches.sort((a, b) => {
      const aSymbol = a.symbol.toLowerCase();
      const bSymbol = b.symbol.toLowerCase();
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aSymbol === query) return -1;
      if (bSymbol === query) return 1;
      if (aSymbol.startsWith(query) && !bSymbol.startsWith(query)) return -1;
      if (bSymbol.startsWith(query) && !aSymbol.startsWith(query)) return 1;
      if (aSymbol.startsWith(query) && bSymbol.startsWith(query)) return aSymbol.length - bSymbol.length;
      if (aName.includes(query) && bName.includes(query)) {
        if (a.market === 'US' && b.market === 'India') return -1;
        if (a.market === 'India' && b.market === 'US') return 1;
      }
      if (aName.includes(query) && !bName.includes(query)) return -1;
      if (bName.includes(query) && !aName.includes(query)) return 1;
      return 0;
    }).slice(0, 12);
  }, [stockDatabase]);

  const handleInputChange = useCallback((value) => {
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
  }, [filterSuggestions]);

  const selectSuggestion = useCallback((stock) => {
    setStockSymbol(stock.symbol); // Update local symbol state
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    if (onSuggestionSelected) {
      onSuggestionSelected(stock.symbol); // Call the callback with the selected symbol
    }
  }, [onSuggestionSelected]);

  const handleKeyDown = useCallback((e) => {
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
        } else if (stockSymbol.trim() && onSuggestionSelected) {
          // Allow Enter to submit current input if no suggestion is actively selected
          onSuggestionSelected(stockSymbol.toUpperCase());
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        // e.target.blur(); // Potentially blur, or let App.js manage inputRef
        break;
      case 'Tab': // Ensure Tab also closes suggestions
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default: break;
    }
  }, [showSuggestions, filteredSuggestions, selectedSuggestionIndex, stockSymbol, onSuggestionSelected, selectSuggestion]);

  const handleInputFocus = useCallback(() => {
    if (stockSymbol.length >= 1) {
      const suggestions = filterSuggestions(stockSymbol);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(true);
    }
  }, [stockSymbol, filterSuggestions]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => { setShowSuggestions(false); setSelectedSuggestionIndex(-1); }, 200);
  }, []);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ?
        <span key={index} style={{ backgroundColor: '#fef3c7', fontWeight: '600' }}>{part}</span> :
        part
    );
  };

  // Expose setStockSymbol to allow direct manipulation from App.js if needed (e.g. for quick stock buttons)
  return {
    stockSymbol,
    setStockSymbol, // Exposing this allows App.js to set the symbol directly
    filteredSuggestions,
    showSuggestions,
    selectedSuggestionIndex,
    handleInputChange,
    handleKeyDown,
    selectSuggestion, // Exposing this in case App.js wants to call it directly
    handleInputFocus,
    handleInputBlur,
    highlightMatch,
    setShowSuggestions, // Allow parent to control visibility if needed
    setSelectedSuggestionIndex // Allow parent to control selection if needed
  };
};
