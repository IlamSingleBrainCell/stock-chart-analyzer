import React, { useState, useRef, useEffect } from 'react';

const Typeahead = ({
    value,
    onChange,
    onSelect,
    filterSuggestions,
    placeholder,
    onKeyDown,
    onFocus,
    onBlur,
    inputRef
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        if (inputValue.length >= 1) {
            const suggestions = filterSuggestions(inputValue);
            setFilteredSuggestions(suggestions);
            setShowSuggestions(true);
            setSelectedSuggestionIndex(-1);
        } else {
            setShowSuggestions(false);
            setFilteredSuggestions([]);
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) {
            if (onKeyDown) onKeyDown(e);
            return;
        }
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
                } else if (value.trim()) {
                    if (onKeyDown) onKeyDown(e);
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
                if (onKeyDown) onKeyDown(e);
                break;
        }
    };

    const selectSuggestion = (stock) => {
        onSelect(stock);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
    };

    const handleFocus = (e) => {
        if (value.length >= 1) {
            const suggestions = filterSuggestions(value);
            setFilteredSuggestions(suggestions);
            setShowSuggestions(true);
        }
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setTimeout(() => {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
        }, 200);
        if (onBlur) onBlur(e);
    };

    return (
        <div className="typeahead-container">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`typeahead-input ${showSuggestions ? 'suggestions-active' : ''}`}
            />
            {showSuggestions && (
                <div className="suggestions-list">
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((stock, index) => (
                            <div
                                key={stock.symbol}
                                onClick={() => selectSuggestion(stock)}
                                className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            >
                                <div className="suggestion-content">
                                    <div className="suggestion-symbol">{stock.symbol}</div>
                                    <div className="suggestion-name">{stock.name}</div>
                                </div>
                                <div className="suggestion-market">
                                    <span className={`market-tag ${stock.market.toLowerCase()}`}>
                                        {stock.market === 'India' ? 'NSE' : 'US'}
                                    </span>
                                    <span className="sector-tag">{stock.sector}</span>
                                </div>
                            </div>
                        ))
                    ) : value.length >= 1 ? (
                        <div className="no-suggestions">
                            <div>🔍 No stocks found</div>
                            <div>Try searching by symbol (AAPL) or company name (Apple)</div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Typeahead;
