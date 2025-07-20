import React, { useState, useRef, useEffect, useContext } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart, Target, DollarSign, Search, RefreshCw, Clock, Info, ChevronUp, Sun, Moon, Zap, Award } from 'lucide-react';
import classnames from 'classnames';
import FlagIcon from '../components/FlagIcon';
import { ThemeContext } from '../ThemeContext';
import PatternRecognitionGame from '../components/PatternRecognitionGame';
import PatternDetectionModal from '../components/PatternDetectionModal';
import { chartPatterns } from '../constants';
import { drawPatternOnCanvas, createChartFromData } from '../utils/chart';
import { detectPatternFromPriceData, calculateKeyLevels, calculateBreakoutTiming, generateLongTermAssessment, generateRecommendation } from '../utils/analysis';
import { highlightMatch } from '../utils/helpers';
import { useStockData } from '../hooks/useStockData';
import styles from './StockChartAnalyzer.module.css';

export const PatternVisualization = ({ patternName, theme = 'light', width = 300, height = 150 }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current || !patternName) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.theme = theme;
        drawPatternOnCanvas(ctx, patternName, width, height);
    }, [patternName, width, height, theme]);
    return (<canvas ref={canvasRef} className={styles.patternVisualization} />);
};

function StockChartAnalyzer() {
    const [stockDatabase, setStockDatabase] = useState([]);
    const popularStocksData = [
        { symbol: "AAPL", name: "Apple", market: "US" },
        { symbol: "GOOGL", name: "Google", market: "US" },
        { symbol: "MSFT", name: "Microsoft", market: "US" },
        { symbol: "TSLA", name: "Tesla", market: "US" },
        { symbol: "TCS.NS", name: "TCS", market: "India" },
        { symbol: "RELIANCE.NS", name: "Reliance", market: "India" },
        { symbol: "HDFCBANK.NS", name: "HDFC Bank", market: "India" },
        { symbol: "INFY.NS", name: "Infosys", market: "India" },
        { symbol: "JIOFIN.NS", name: "Jio Financial", market: "India" },
    ];
    const [uploadedImage, setUploadedImage] = useState(null);
    const [stockSymbol, setStockSymbol] = useState('');
    const {
        stockData,
        loading,
        error,
        fetchAllData,
    } = useStockData();

    const [prediction, setPrediction] = useState(null);
    const [patternDetected, setPatternDetected] = useState(null);
    const [timeEstimate, setTimeEstimate] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [entryExit, setEntryExit] = useState(null);
    const [breakoutTiming, setBreakoutTiming] = useState(null);
    const [keyLevels, setKeyLevels] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState('3mo');
    const [longTermAssessment, setLongTermAssessment] = useState(null);
    const [currentView, setCurrentView] = useState('analyzer');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canvasRef = useRef(null);
    const chartCanvasRef = useRef(null);
    const inputRef = useRef(null);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        fetch('/stockDatabase.json')
            .then(response => response.json())
            .then(data => setStockDatabase(data))
            .catch(error => console.error('Error fetching stock database:', error));
    }, []);

    const filterSuggestions = (input) => {
        if (!input || input.length < 1) return [];
        const query = input.toLowerCase();
        const matches = stockDatabase.filter(stock => {
            const symbolMatch = stock.symbol.toLowerCase().includes(query);
            const nameMatch = stock.name.toLowerCase().includes(query);
            const sectorMatch = stock.sector && stock.sector.toLowerCase().includes(query);
            const marketMatch = stock.market.toLowerCase().includes(query);
            // Specific check for Indian stocks without typing ".NS"
            const indianStockMatch = stock.market === 'India' && stock.symbol.toLowerCase().startsWith(query) && query.endsWith('.ns') === false;
            return symbolMatch || nameMatch || sectorMatch || marketMatch || indianStockMatch;
        });

        return matches.sort((a, b) => {
            const aSymbol = a.symbol.toLowerCase();
            const bSymbol = b.symbol.toLowerCase();
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            // Prioritize exact symbol matches
            if (aSymbol === query) return -1;
            if (bSymbol === query) return 1;

            // Prioritize symbols starting with the query
            const aSymbolStartsWith = aSymbol.startsWith(query);
            const bSymbolStartsWith = bSymbol.startsWith(query);
            if (aSymbolStartsWith && !bSymbolStartsWith) return -1;
            if (bSymbolStartsWith && !aSymbolStartsWith) return 1;
            if (aSymbolStartsWith && bSymbolStartsWith) {
                return aSymbol.length - bSymbol.length;
            }

            // Prioritize by market (US > India)
            if (a.market === 'US' && b.market === 'India') return -1;
            if (b.market === 'US' && a.market === 'India') return 1;

            // Lastly, sort by name
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
                    const symbolToFetch = stockSymbol.toUpperCase();
                    fetchAllData(symbolToFetch, selectedTimeRange);
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
        setStockSymbol(stock.symbol.replace('.NS', ''));
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setPrediction(null);
        setPatternDetected(null);
        setConfidence(null);
        setRecommendation(null);
        setEntryExit(null);
        setTimeEstimate(null);
        setBreakoutTiming(null);
        setKeyLevels(null);
        setLongTermAssessment(null);
        fetchAllData(stock.symbol, selectedTimeRange);
    };

    const handleTimeRangeChange = (range) => {
        setSelectedTimeRange(range);
        if (stockSymbol.trim()) {
            setPrediction(null);
            setPatternDetected(null);
            setConfidence(null);
            setRecommendation(null);
            setEntryExit(null);
            setTimeEstimate(null);
            setBreakoutTiming(null);
            setKeyLevels(null);
            setLongTermAssessment(null);
            fetchAllData(stockSymbol.toUpperCase(), range);
        }
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

    const clearAnalysis = () => {
        setUploadedImage(null);
        setStockSymbol('');
        setPrediction(null);
        setPatternDetected(null);
        setConfidence(null);
        setRecommendation(null);
        setEntryExit(null);
        setTimeEstimate(null);
        setBreakoutTiming(null);
        setKeyLevels(null);
        setLongTermAssessment(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
                setStockSymbol('');
                setPrediction(null);
                setPatternDetected(null);
                setConfidence(null);
                setRecommendation(null);
                setEntryExit(null);
                setTimeEstimate(null);
                setBreakoutTiming(null);
                setKeyLevels(null);
                setLongTermAssessment(null);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (stockData) {
            const chartImageUrl = createChartFromData(stockData, keyLevels, theme, chartCanvasRef);
            setUploadedImage(chartImageUrl);
        }
    }, [stockData, keyLevels, theme]);


    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <canvas ref={chartCanvasRef} style={{ display: 'none' }} />

            <div className={styles.toggleButtons}>
                <button onClick={() => setCurrentView('analyzer')} className={classnames(styles.toggleButton, { [styles.toggleButtonActive]: currentView === 'analyzer', [styles.toggleButtonInactive]: currentView !== 'analyzer' })}>
                    <Zap size={18} style={{ marginRight: '8px' }} /> Chart Analyzer
                </button>
                <button onClick={() => setCurrentView('game')} className={classnames(styles.toggleButton, { [styles.toggleButtonActive]: currentView === 'game', [styles.toggleButtonInactive]: currentView !== 'game' })}>
                    <Award size={18} style={{ marginRight: '8px' }} /> Pattern Game
                </button>
            </div>

            {currentView === 'analyzer' && (
                <>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            Stock Chart Pattern Analyzer
                        </h1>
                        <p className={styles.subtitle}>
                            Get data-driven analysis from live stock charts (3-month data) or explore patterns with your own images.
                            <br />
                            <span className={styles.subtitleSecondary}>
                                📊 Supporting 2000+ stocks from US & Indian markets with Key Level detection.
                            </span>
                        </p>
                    </div>


                    <div className={styles.searchSection}>
                        <label className={styles.searchLabel}>
                            <Search size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--text-color-light)' }} />
                            Get Live Stock Chart (3-Month Analysis)
                        </label>
                        <div className={styles.searchInputContainer}>
                            <div className={styles.searchInputWrapper}>
                                <div className={styles.searchInput}>
                                    <input ref={inputRef} type="text" value={stockSymbol} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="🔍 Search: AAPL, TCS.NS, Reliance, Microsoft, HDFC Bank..." className={classnames(styles.searchInputField, { [styles.searchInputFieldActive]: showSuggestions })} />
                                    {showSuggestions && (
                                        <div className={styles.suggestionsContainer}>
                                            {filteredSuggestions.length > 0 ? (
                                                filteredSuggestions.map((stock, index) => (
                                                    <div key={stock.symbol} onClick={() => selectSuggestion(stock)} className={classnames(styles.suggestionItem, { [styles.suggestionItemActive]: index === selectedSuggestionIndex })} onMouseEnter={() => setSelectedSuggestionIndex(index)}>
                                                        <div className={styles.suggestionItemHeader}>
                                                            <div><div className={styles.suggestionItemName}>{highlightMatch(stock.symbol, stockSymbol)}</div><div className={styles.suggestionItemSymbol}>{highlightMatch(stock.name, stockSymbol)}</div></div>
                                                            <div className={styles.suggestionItemMarket}><div className={classnames(styles.suggestionItemMarketTag, { [styles.suggestionItemMarketTagIndia]: stock.market === 'India', [styles.suggestionItemMarketTagUs]: stock.market !== 'India' })}><FlagIcon country={stock.market} size={12} />{stock.market === 'India' ? 'NSE' : 'US'}</div><div className={styles.suggestionItemSector}>{stock.sector}</div></div>
                                                        </div>
                                                    </div>))
                                            ) : stockSymbol.length >= 1 ? (
                                                <div className={styles.noSuggestions}><div style={{ marginBottom: '8px' }}>🔍 No stocks found</div><div style={{ fontSize: '12px' }}>Try searching by symbol (AAPL) or company name (Apple)</div></div>
                                            ) : null}
                                        </div>)}
                                </div>
                                <div className={styles.searchButtonContainer}>
                                    <button onClick={() => { if (stockSymbol.trim()) { const symbolToFetch = stockSymbol.toUpperCase(); fetchAllData(symbolToFetch, selectedTimeRange); } }} disabled={loading} className={classnames(styles.searchButton, styles.searchButtonPrimary)}>
                                        {loading ? <RefreshCw size={16} className={styles.spin} /> : <Search size={16} />}
                                        {loading ? 'Fetching...' : 'Get Chart'}
                                    </button>
                                    <button onClick={clearAnalysis} className={classnames(styles.searchButton, styles.searchButtonSecondary)}>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.timeRangeSelector}>
                            <label className={styles.timeRangeLabel}>Select Data Time Range:</label>
                            <div className={styles.timeRangeButtons}>
                                {['3mo', '1y', '5y', '10y'].map(range => {
                                    let displayLabel = '';
                                    if (range === '3mo') displayLabel = '3 Months';
                                    else if (range === '1y') displayLabel = '1 Year';
                                    else if (range === '5y') displayLabel = '5 Years';
                                    else if (range === '10y') displayLabel = '10 Years';
                                    return (<button key={range} onClick={() => handleTimeRangeChange(range)} className={classnames(styles.timeRangeButton, { [styles.timeRangeButtonActive]: selectedTimeRange === range, [styles.timeRangeButtonInactive]: selectedTimeRange !== range })}>{displayLabel}</button>);
                                })}
                            </div>
                        </div>

                        <div className={styles.popularStocks}>
                            <p className={styles.popularStocksLabel}>Popular Stocks from {stockDatabase.length}+ available (<FlagIcon country="US" size={12} />US + <FlagIcon country="India" size={12} />Indian Markets):</p>
                            <div className={styles.popularStocksButtons}>
                                {popularStocksData.map(stock => (<button key={stock.symbol} onClick={() => selectSuggestion(stock)} disabled={loading} className={classnames(styles.popularStockButton, { [styles.popularStockButtonActive]: stockSymbol === stock.symbol, [styles.popularStockButtonInactive]: stockSymbol !== stock.symbol })} onMouseEnter={(e) => { if (stockSymbol !== stock.symbol && !loading) { e.target.style.background = 'var(--input-background-hover)'; } }} onMouseLeave={(e) => { if (stockSymbol !== stock.symbol && !loading) { e.target.style.background = 'var(--primary-accent-light)'; } }}> <FlagIcon country={stock.market} size={12} /> {stock.symbol.replace('.NS', '')} </button>))}
                            </div>
                            <div className={styles.popularStocksExamples}><strong>Examples:</strong> Search from {stockDatabase.length}+ stocks - try "TCS" (Indian IT), "Reliance" (Indian Oil), "AAPL" (US Tech), "HDFC" (Indian Banking), "NVDA" (US Semiconductors), or "Wipro" (Indian IT)</div>
                        </div>
                    </div>

                    {error && (<div className={styles.errorMessage}><strong>⚠️ Chart Error:</strong> {error}</div>)}


                    <div className={styles.separator}><div className={styles.separatorLineLeft}></div><span className={styles.separatorText}>OR</span><div className={styles.separatorLineRight}></div></div>

                    <div className={styles.uploadSection}>
                        <label className={styles.uploadLabel}>📁 Upload Your Own Chart Image (for Educational Exploration)</label>
                        <p className={styles.uploadSubtitle}>Note: Analysis for uploaded images provides an educational example of pattern types. For data-driven analysis, please use the live stock chart feature above.</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.uploadInput} onMouseEnter={(e) => { e.target.style.borderColor = 'var(--secondary-accent)'; e.target.style.background = 'var(--input-background-hover)'; }} onMouseLeave={(e) => { e.target.style.borderColor = 'var(--primary-accent-border)'; e.target.style.background = 'var(--input-background)'; }} />
                    </div>

                    {uploadedImage && (
                        <div className={styles.imagePreviewSection}>
                            <div className={styles.imagePreviewContainer}><img src={uploadedImage} alt="Stock chart" className={styles.imagePreview} /></div>
                            {stockData && (<div className={styles.stockInfo}><div className={styles.stockInfoTitle}>📊 Stock Information ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : selectedTimeRange === '10y' ? '10 Years' : '3 Months'} Data):</div><div className={styles.stockInfoDetails}><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div><div className={styles.stockInfoDetails}><strong>Current Price:</strong> {stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}{stockData.currentPrice?.toFixed(2)} {stockData.currency} |<strong> Data Points:</strong> {stockData.prices.length} {selectedTimeRange === '1y' ? 'weeks' : (selectedTimeRange === '5y' || selectedTimeRange === '10y') ? 'months' : 'days'}</div>{stockData.isMockData && <div className={styles.stockInfoWarning}>⚠️ Using demo data - API temporarily unavailable</div>}</div>)}
                            <button onClick={() => {
                                try {
                                    let calculatedKeyLevels = null;
                                    let currentLongTermAssessment = null;
                                    if (stockData && stockData.prices && stockData.prices.length > 0) {
                                        calculatedKeyLevels = calculateKeyLevels(stockData.prices);
                                        if (selectedTimeRange === '1y' || selectedTimeRange === '5y' || selectedTimeRange === '10y') {
                                            currentLongTermAssessment = generateLongTermAssessment(stockData, selectedTimeRange);
                                            if (currentLongTermAssessment) {
                                                setLongTermAssessment(currentLongTermAssessment);
                                                setPatternDetected(null);
                                                setPrediction(null);
                                                setConfidence(null);
                                                setRecommendation(null);
                                                setEntryExit(null);
                                                setTimeEstimate(null);
                                                setBreakoutTiming(null);
                                            }
                                        } else {
                                            setLongTermAssessment(null);
                                            const analysis = detectPatternFromPriceData(stockData.prices);
                                            if (analysis) {
                                                const { pattern: detectedPatternName, confidence: confidenceScore, accuracy, detectedPoints } = analysis;
                                                if (detectedPatternName && chartPatterns[detectedPatternName]) {
                                                    const selectedPatternDetails = chartPatterns[detectedPatternName];
                                                    const rec = generateRecommendation(selectedPatternDetails, confidenceScore);
                                                    const breakout = calculateBreakoutTiming(detectedPatternName, stockData, confidenceScore);
                                                    setPatternDetected({
                                                        name: detectedPatternName,
                                                        ...selectedPatternDetails,
                                                        accuracy: accuracy,
                                                        detectedPoints: detectedPoints,
                                                    });
                                                    setPrediction(selectedPatternDetails.prediction);
                                                    setConfidence(confidenceScore);
                                                    setRecommendation(rec);
                                                    setBreakoutTiming(breakout);
                                                    setKeyLevels(calculatedKeyLevels);
                                                    let timeInfo = '';
                                                    if (selectedPatternDetails.prediction === 'up') {
                                                        timeInfo = `Expected to rise for ${selectedPatternDetails.daysUp}`;
                                                    } else if (selectedPatternDetails.prediction === 'down') {
                                                        timeInfo = `Expected to decline for ${selectedPatternDetails.daysDown}`;
                                                    } else if (selectedPatternDetails.prediction === 'continuation') {
                                                        const isUptrend = Math.random() > 0.5;
                                                        timeInfo = isUptrend ? `Current uptrend likely to continue for ${selectedPatternDetails.daysUp}` : `Current downtrend likely to continue for ${selectedPatternDetails.daysDown}`;
                                                    } else {
                                                        timeInfo = `Pattern suggests movement within ${selectedPatternDetails.timeframe}`;
                                                    }
                                                    setTimeEstimate(timeInfo);
                                                    setEntryExit({
                                                        entry: selectedPatternDetails.entryStrategy,
                                                        exit: selectedPatternDetails.exitStrategy
                                                    });
                                                }
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.error('Error analyzing chart:', error);
                                }
                            }} disabled={loading} className={styles.analyzeButton}>{loading ? (<span className={styles.analyzeButtonContent}><RefreshCw size={20} className={styles.spin} />Analyzing Pattern...</span>) : stockData ? ('🔍 Analyze Live Chart Data') : ('🔍 Explore Example Pattern')}</button>
                        </div>)}

                    {longTermAssessment && stockData && (<div className={styles.longTermAssessment}><h2 className={styles.longTermAssessmentTitle}>🗓️ Long-Term Review ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : '10 Years'})</h2><div className={styles.longTermAssessmentItem}><p className={styles.longTermAssessmentItemTitle}>Overall Trend:</p><p className={styles.longTermAssessmentItemValue}>{longTermAssessment.trend}</p><p className={styles.longTermAssessmentItemDescription}>Shows the general direction of the stock's price over the selected period.</p></div><div className={styles.longTermAssessmentItem}><p className={styles.longTermAssessmentItemTitle}>Total Return:</p><p className={styles.longTermAssessmentItemValue}>{longTermAssessment.totalReturn}</p><p className={styles.longTermAssessmentItemDescription}>Illustrates the percentage gain or loss if you had invested at the beginning and held until the end of the period.</p></div><div className={styles.longTermAssessmentItem}><p className={styles.longTermAssessmentItemTitle}>Price Extremes:</p><p className={styles.longTermAssessmentItemValue}>{longTermAssessment.highLow}</p><p className={styles.longTermAssessmentItemDescription}>Highlights the highest and lowest prices the stock reached during this timeframe.</p></div><div className={styles.longTermAssessmentItem}><p className={styles.longTermAssessmentItemTitle}>Volatility Insight:</p><p className={styles.longTermAssessmentItemValue}>{longTermAssessment.volatility}</p><p className={styles.longTermAssessmentItemDescription}>Gives an idea of how much the stock's price fluctuated; higher volatility means bigger price swings.</p></div><p className={styles.longTermAssessmentDisclaimer}>{longTermAssessment.disclaimer}</p></div>)}

                    {prediction && patternDetected && !longTermAssessment && (
                        <div className={styles.shortTermAnalysis}>
                            <h2 className={styles.shortTermAnalysisTitle}>📈 Short-Term Pattern Analysis</h2>
                            <div className={classnames(styles.predictionSection, { [styles.predictionSectionUp]: prediction === 'up', [styles.predictionSectionDown]: prediction === 'down', [styles.predictionSectionNeutral]: prediction !== 'up' && prediction !== 'down' })}><div className={classnames(styles.predictionHeader, { [styles.predictionHeaderUp]: prediction === 'up', [styles.predictionHeaderDown]: prediction === 'down', [styles.predictionHeaderNeutral]: prediction !== 'up' && prediction !== 'down' })}>{prediction === 'up' ? <TrendingUp size={28} /> : prediction === 'down' ? <TrendingDown size={28} /> : <BarChart size={28} />}<h3 className={styles.predictionTitle}>Enhanced Prediction</h3></div><p className={classnames(styles.predictionValue, { [styles.predictionValueUp]: prediction === 'up', [styles.predictionValueDown]: prediction === 'down', [styles.predictionValueNeutral]: prediction !== 'up' && prediction !== 'down' })}>{prediction === 'up' ? '📈 Likely to go UP' : prediction === 'down' ? '📉 Likely to go DOWN' : '↔️ Continuation Expected'}</p><div className={styles.predictionDuration}><span className={styles.predictionDurationLabel}>{prediction === 'up' ? '⏱️ Upward duration:' : prediction === 'down' ? '⏱️ Downward duration:' : '⏱️ Pattern duration:'}</span> {prediction === 'up' ? patternDetected.daysUp : prediction === 'down' ? patternDetected.daysDown : patternDetected.timeframe}</div>
                                {confidence && (<div><div className={styles.confidenceSection}><div className={styles.confidenceHeader}>🎯 Confidence Level: {confidence}%<button onClick={() => setShowConfidenceHelp(!showConfidenceHelp)} className={styles.confidenceHelpButton} title="Click to understand confidence levels"><Info size={12} color="var(--primary-accent-darker)" /></button></div><div className={classnames(styles.confidenceLevel, { [styles.confidenceLevelHigh]: confidence >= 80, [styles.confidenceLevelMedium]: confidence >= 60 && confidence < 80, [styles.confidenceLevelLow]: confidence < 60 })}>{confidence >= 80 ? '🟢 High Confidence - Strong Signal' : confidence >= 60 ? '🟡 Medium Confidence - Proceed with Caution' : '🟠 Low Confidence - High Risk'}</div></div>
                                    {showConfidenceHelp && (<div className={styles.confidenceHelp}><div className={styles.confidenceHelpHeader}><h4 className={styles.confidenceHelpTitle}>📊 Understanding Confidence Levels</h4><button onClick={() => setShowConfidenceHelp(false)} className={styles.confidenceHelpCloseButton}><ChevronUp size={20} color="var(--text-color-lighter)" /></button></div><div className={styles.confidenceHelpContent}><div className={styles.confidenceHelpSection}><strong className={styles.confidenceHelpSectionTitle}>What is Confidence Level?</strong><p className={styles.confidenceHelpSectionText}>A percentage (45-92%) indicating how reliable the pattern detection and prediction are. Higher = more trustworthy.</p></div><div className={styles.confidenceHelpGrid}><div className={classnames(styles.confidenceHelpGridItem, styles.confidenceHelpGridItemHigh)}><div className={classnames(styles.confidenceHelpGridItemTitle, styles.confidenceHelpGridItemTitleHigh)}>🟢 High (80-92%)</div><div className={styles.confidenceHelpGridItemText}>Very reliable • Strong signal • Clear pattern • Normal position sizes</div></div><div className={classnames(styles.confidenceHelpGridItem, styles.confidenceHelpGridItemMedium)}><div className={classnames(styles.confidenceHelpGridItemTitle, styles.confidenceHelpGridItemTitleMedium)}>🟡 Medium (60-79%)</div><div className={styles.confidenceHelpGridItemText}>Moderately reliable • Use caution • Smaller positions • Wait for confirmation</div></div><div className={classnames(styles.confidenceHelpGridItem, styles.confidenceHelpGridItemLow)}><div className={classnames(styles.confidenceHelpGridItemTitle, styles.confidenceHelpGridItemTitleLow)}>🟠 Low (45-59%)</div><div className={styles.confidenceHelpGridItemText}>High risk • Avoid trading • Wait for better setup • Educational only</div></div></div><div className={styles.confidenceHelpCalculation}><div className={styles.confidenceHelpCalculationTitle}>How is it calculated?</div><ul className={styles.confidenceHelpCalculationList}><li>Base pattern reliability (each pattern has historical success rates)</li><li>Pattern clarity and shape matching quality</li><li>Technical indicator alignment (RSI, moving averages)</li><li>Market conditions and data quality factors</li></ul></div>{confidence < 60 && (<div className={styles.confidenceHelpWarning}><div className={styles.confidenceHelpWarningTitle}>⚠️ Your Current Score: {confidence}%</div><div className={styles.confidenceHelpWarningText}>This is a <strong>low confidence</strong> signal. Consider waiting for a clearer pattern with 70%+ confidence before making trading decisions.</div></div>)}<div className={styles.confidenceHelpDisclaimer}>💡 Remember: Even high confidence doesn't guarantee success. Always use proper risk management and do your own research.</div></div></div>)}</div>)}
                            </div>
                            {breakoutTiming && (<div className={styles.breakoutTiming}><div className={styles.breakoutTimingHeader}><Clock size={28} /><h3 className={styles.breakoutTimingTitle}>Breakout Timing Prediction</h3></div><div className={styles.breakoutTimingGrid}><div className={classnames(styles.breakoutTimingGridItem, styles.breakoutTimingGridItemInfo)}><div className={classnames(styles.breakoutTimingGridItemTitle, styles.breakoutTimingGridItemTitleInfo)}>Expected Timeframe</div><div className={styles.breakoutTimingGridItemValue}>{breakoutTiming.daysRange}</div></div><div className={classnames(styles.breakoutTimingGridItem, styles.breakoutTimingGridItemSuccess)}><div className={classnames(styles.breakoutTimingGridItemTitle, styles.breakoutTimingGridItemTitleSuccess)}>Earliest Date</div><div className={styles.breakoutTimingGridItemValue}>{breakoutTiming.minDate}</div></div><div className={classnames(styles.breakoutTimingGridItem, styles.breakoutTimingGridItemDanger)}><div className={classnames(styles.breakoutTimingGridItemTitle, styles.breakoutTimingGridItemTitleDanger)}>Latest Date</div><div className={styles.breakoutTimingGridItemValue}>{breakoutTiming.maxDate}</div></div><div className={classnames(styles.breakoutTimingGridItem, styles.breakoutTimingGridItemPrimary)}><div className={classnames(styles.breakoutTimingGridItemTitle, styles.breakoutTimingGridItemTitlePrimary)}>Timing Confidence</div><div className={styles.breakoutTimingGridItemValue}>{breakoutTiming.confidence}</div></div></div><div className={styles.breakoutTimingNote}>💡 <strong>Note:</strong> Breakout timing is based on pattern analysis and current market momentum. Monitor volume and price action for confirmation.</div></div>)}
                            {keyLevels && (keyLevels.support?.length > 0 || keyLevels.resistance?.length > 0) && (<div className={styles.keyLevels}><div className={styles.keyLevelsHeader}><BarChart size={28} /><h3 className={styles.keyLevelsTitle}>Key Price Levels</h3></div>{keyLevels.support?.length > 0 && (<div className={styles.keyLevelsListContainer}><strong className={classnames(styles.keyLevelsListTitle, styles.keyLevelsListTitleSupport)}>Support Levels:</strong><ul className={styles.keyLevelsList}>{keyLevels.support.map((level, idx) => (<li key={`s-${idx}`} className={styles.keyLevelsListItem}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>))}</ul></div>)}{keyLevels.resistance?.length > 0 && (<div><strong className={classnames(styles.keyLevelsListTitle, styles.keyLevelsListTitleResistance)}>Resistance Levels:</strong><ul className={styles.keyLevelsList}>{keyLevels.resistance.map((level, idx) => (<li key={`r-${idx}`} className={styles.keyLevelsListItem}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>))}</ul></div>)}<div className={styles.keyLevelsNote}>💡 These are automatically identified potential support (price floor) and resistance (price ceiling) levels from recent price action.</div></div>)}
                            {recommendation && (<div className={styles.recommendation}><div className={styles.recommendationHeader}><DollarSign size={28} /><h3 className={styles.recommendationTitle}>Recommendation</h3></div><p className={classnames(styles.recommendationAction, { [styles.recommendationActionBuy]: recommendation.action === 'BUY', [styles.recommendationActionSell]: recommendation.action === 'SELL', [styles.recommendationActionHold]: recommendation.action !== 'BUY' && recommendation.action !== 'SELL' })}>{recommendation.action === 'BUY' ? '💰 BUY' : recommendation.action === 'SELL' ? '💸 SELL' : '✋ HOLD'}</p><p className={styles.recommendationReasoning}>{recommendation.reasoning}</p></div>)}
                            {entryExit && (<div className={styles.entryExit}><div className={styles.entryExitHeader}><Target size={28} /><h3 className={styles.entryExitTitle}>Entry & Exit Strategy</h3></div><div className={styles.entryExitItem}><span className={classnames(styles.entryExitLabel, styles.entryExitLabelEntry)}>🟢 Entry Point: </span><span className={styles.entryExitValue}>{entryExit.entry}</span></div><div><span className={classnames(styles.entryExitLabel, styles.entryExitLabelExit)}>🔴 Exit Strategy: </span><span className={styles.entryExitValue}>{entryExit.exit}</span></div></div>)}
                            <div className={styles.timeEstimate}><div className={styles.timeEstimateHeader}><Calendar size={28} /><h3 className={styles.timeEstimateTitle}>Time Estimate</h3></div><p className={styles.timeEstimateValue}>{timeEstimate}</p><div className={styles.timeEstimateDuration}><span className={styles.timeEstimateDurationLabel}>📅 Typical pattern duration:</span> {patternDetected.timeframe}</div></div>
                            <div className={styles.patternDetected}>
                                <div className={styles.patternDetectedHeader}>
                                    <BarChart size={28} />
                                    <h3 className={styles.patternDetectedTitle}>Pattern Detected</h3>
                                </div>
                                <div className={styles.patternDetectedContent}>
                                    <div>
                                        <p className={styles.patternDetectedName}>
                                            📊 {patternDetected.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            <button onClick={() => setIsModalOpen(true)} className={styles.patternDetectedModalButton}>
                                                How was this detected?
                                            </button>
                                        </p>
                                        <div className={styles.patternDetectedNote}>💡 Compare the actual chart above with this pattern example below</div>
                                    </div>
                                    <div className={styles.patternVisualizationContainer}>
                                        <PatternVisualization patternName={patternDetected.name} theme={theme} width={300} height={160} />
                                        <div className={styles.patternVisualizationCaption}>📈 Typical {patternDetected.name.split('-').join(' ')} pattern example</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {patternDetected && (<div className={styles.patternEducation}><h3 className={styles.patternEducationTitle}>📚 Pattern Education</h3><h4 className={styles.patternEducationSubtitle}>Description:</h4><p className={styles.patternEducationDescription}>{patternDetected.description}</p><div className={styles.patternEducationLookFor}><h4 className={styles.patternEducationLookForTitle}>🔍 What to look for:</h4><ul className={styles.patternEducationLookForList}><li className={styles.patternEducationLookForListItem}><span className={styles.patternEducationLookForListItemArrow}>→</span>Look for clear pattern formation with multiple confirmation points</li><li className={styles.patternEducationLookForListItem}><span className={styles.patternEducationLookForListItemArrow}>→</span>Check volume patterns that support the chart pattern</li><li className={styles.patternEducationLookForListItem}><span className={styles.patternEducationLookForListItemArrow}>→</span>Confirm breakout direction before making decisions</li><li className={styles.patternEducationLookForListItem}><span className={styles.patternEducationLookForListItemArrow}>→</span>Consider overall market conditions and sentiment</li></ul></div></div>)}
                </>
            )}

            {currentView === 'game' && (
                <PatternRecognitionGame PatternVisualization={PatternVisualization} chartPatterns={chartPatterns} />
            )}

            <PatternDetectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pattern={patternDetected}
                stockData={stockData}
                theme={theme}
            />

            <div className={styles.disclaimer}>
                <p><strong>⚠️ Important Disclaimer:</strong> This application provides technical analysis and historical data reviews for educational purposes only.</p>
                <p><strong>📊 Features Include:</strong> Short-term pattern analysis (3-month data), long-term historical reviews (up to 10 years), dynamic confidence scoring, and breakout timing predictions.</p>
                <p>All information should be used for learning and not as financial advice. Always conduct thorough research and consult financial advisors before making investment decisions.</p>
            </div>
        </div>
    );
}

export default StockChartAnalyzer;
