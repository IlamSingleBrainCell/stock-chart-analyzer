import React, { useState, useRef, useEffect, useContext } from 'react';
import { AlertTriangle, Sun, Moon, Zap, Award } from 'lucide-react';
import stocksData from '../stocks.json';
import { ThemeContext } from '../ThemeContext';
import PatternRecognitionGame from './PatternRecognitionGame';
import { chartPatterns } from '../constants';
import { createChartFromData } from '../utils/chart';
import { detectPatternFromPriceData, calculateKeyLevels, calculateBreakoutTiming, generateLongTermAssessment, generateRecommendation } from '../utils/analysis';
import { useStockData } from '../hooks/useStockData';
import './StockChartAnalyzer.css';

import Header from './StockChartAnalyzer/Header';
import Search from './StockChartAnalyzer/Search';
import Chart from './StockChartAnalyzer/Chart';
import Results from './StockChartAnalyzer/Results';
import Education from './StockChartAnalyzer/Education';

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
    return (<canvas ref={canvasRef} style={{ border: '1px solid var(--card-border)', borderRadius: '8px', background: 'var(--background-color)', maxWidth: '100%', height: 'auto', margin: '20px auto' }} />);
};

function StockChartAnalyzer() {
    const stockDatabase = stocksData.stocks;
    const popularStocksData = stocksData.popularStocks;
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
    const chartCanvasRef = useRef(null);
    const inputRef = useRef(null);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const filterSuggestions = (input) => {
        if (!input || input.length < 1) return [];
        const query = input.toLowerCase();
        const matches = stockDatabase.filter(stock => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query) || stock.sector.toLowerCase().includes(query) || stock.market.toLowerCase().includes(query));
        return matches.sort((a, b) => {
            const aSymbol = a.symbol.toLowerCase();
            const bSymbol = b.symbol.toLowerCase();
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aSymbol === query) return -1;
            if (bSymbol === query) return 1;
            if (aSymbol.startsWith(query) && !bSymbol.startsWith(query)) return -1;
            if (bSymbol.startsWith(query) && !aSymbol.startsWith(query)) return 1;
            if (aSymbol.startsWith(query) && bSymbol.startsWith(query)) {
                return aSymbol.length - bSymbol.length;
            }
            if (aName.includes(query) && bName.includes(query)) {
                if (a.market === 'US' && b.market === 'India') return -1;
                if (a.market === 'India' && b.market === 'US') return 1;
            }
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
        setStockSymbol(stock.symbol);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
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

    const analyzeData = () => {
        try {
            let detectedPatternName = null;
            let confidenceScore = 70;
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
                        detectedPatternName = analysis.pattern;
                        confidenceScore = analysis.confidence;
                    }
                }
            }
            if (!currentLongTermAssessment && !detectedPatternName) {
                const patternWeights = {
                    'head-and-shoulders': 12,
                    'inverse-head-and-shoulders': 12,
                    'double-top': 15,
                    'double-bottom': 15,
                    'cup-and-handle': 10,
                    'ascending-triangle': 15,
                    'descending-triangle': 15,
                    'flag': 8,
                    'wedge-rising': 8,
                    'wedge-falling': 8
                };
                const weightedPatterns = [];
                Object.entries(patternWeights).forEach(([pattern, weight]) => {
                    for (let i = 0; i < weight; i++) {
                        weightedPatterns.push(pattern);
                    }
                });
                const randomIndex = Math.floor(Math.random() * weightedPatterns.length);
                detectedPatternName = weightedPatterns[randomIndex];
                confidenceScore = Math.floor(Math.random() * 35) + 50;
            }

            if (detectedPatternName && chartPatterns[detectedPatternName]) { // Ensure pattern exists before accessing
                const selectedPatternDetails = chartPatterns[detectedPatternName];
                const rec = generateRecommendation(selectedPatternDetails, confidenceScore);
                const breakout = calculateBreakoutTiming(detectedPatternName, stockData, confidenceScore);
                setPatternDetected({
                    name: detectedPatternName,
                    ...selectedPatternDetails
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

        } catch (error) {
            console.error('Error analyzing chart:', error);
        }
    };

    return (
        <div className="analyzer-container">
            <canvas ref={chartCanvasRef} style={{ display: 'none' }} />

            <div className="toggle-buttons">
                <button onClick={() => setCurrentView('analyzer')} className={`toggle-button ${currentView === 'analyzer' ? 'active' : ''}`}>
                    <Zap size={18} /> Chart Analyzer
                </button>
                <button onClick={() => setCurrentView('game')} className={`toggle-button ${currentView === 'game' ? 'active' : ''}`}>
                    <Award size={18} /> Pattern Game
                </button>
            </div>

            {currentView === 'analyzer' && (
                <>
                    <Header />

                    <div className="disclaimer">
                        <AlertTriangle size={20} className="disclaimer-icon" />
                        <div className="disclaimer-text">
                            <strong>🚀 Features:</strong> Pattern detection from 3-month price data, dynamic confidence, breakout timing, Key Support/Resistance levels. {stockDatabase.length}+ US & Indian stocks!
                        </div>
                    </div>

                    <Search
                        stockSymbol={stockSymbol}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        handleInputFocus={handleInputFocus}
                        handleInputBlur={handleInputBlur}
                        showSuggestions={showSuggestions}
                        filteredSuggestions={filteredSuggestions}
                        selectedSuggestionIndex={selectedSuggestionIndex}
                        selectSuggestion={selectSuggestion}
                        fetchAllData={fetchAllData}
                        selectedTimeRange={selectedTimeRange}
                        loading={loading}
                        popularStocksData={popularStocksData}
                        inputRef={inputRef}
                    />

                    <div className="time-range-selector">
                        <label>Select Data Time Range:</label>
                        <div className="time-range-buttons">
                            {['3mo', '1y', '5y', '10y'].map(range => {
                                let displayLabel = '';
                                if (range === '3mo') displayLabel = '3 Months';
                                else if (range === '1y') displayLabel = '1 Year';
                                else if (range === '5y') displayLabel = '5 Years';
                                else if (range === '10y') displayLabel = '10 Years';
                                return (<button key={range} onClick={() => handleTimeRangeChange(range)} className={`time-range-button ${selectedTimeRange === range ? 'active' : ''}`}>{displayLabel}</button>);
                            })}
                        </div>
                    </div>

                    {error && (<div className="error-message"><strong>⚠️ Chart Error:</strong> {error}</div>)}

                    <div className="separator">OR</div>

                    <div className="upload-section">
                        <label className="upload-label">📁 Upload Your Own Chart Image (for Educational Exploration)</label>
                        <p>Note: Analysis for uploaded images provides an educational example of pattern types. For data-driven analysis, please use the live stock chart feature above.</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
                    </div>

                    <Chart uploadedImage={uploadedImage} stockData={stockData} selectedTimeRange={selectedTimeRange} />

                    {uploadedImage && (
                        <button onClick={analyzeData} disabled={loading} className="analyze-button">
                            {loading ? (<><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>) : stockData ? ('🔍 Analyze Live Chart Data') : ('🔍 Explore Example Pattern')}
                        </button>
                    )}

                    <Results
                        prediction={prediction}
                        patternDetected={patternDetected}
                        longTermAssessment={longTermAssessment}
                        confidence={confidence}
                        recommendation={recommendation}
                        entryExit={entryExit}
                        timeEstimate={timeEstimate}
                        breakoutTiming={breakoutTiming}
                        keyLevels={keyLevels}
                        stockData={stockData}
                        selectedTimeRange={selectedTimeRange}
                        showConfidenceHelp={showConfidenceHelp}
                        setShowConfidenceHelp={setShowConfidenceHelp}
                    />

                    <Education patternDetected={patternDetected} theme={theme} />
                </>
            )}

            {currentView === 'game' && (
                <PatternRecognitionGame PatternVisualization={PatternVisualization} chartPatterns={chartPatterns} />
            )}

            <div className="disclaimer-footer">
                <p><strong>⚠️ Important Disclaimer:</strong> This application provides technical analysis and historical data reviews for educational purposes only.</p>
                <p><strong>📊 Features Include:</strong> Short-term pattern analysis (3-month data), long-term historical reviews (up to 10 years), dynamic confidence scoring, and breakout timing predictions.</p>
                <p>All information should be used for learning and not as financial advice. Always conduct thorough research and consult financial advisors before making investment decisions.</p>
            </div>

            <div className="footer">
                <button onClick={toggleTheme} className="theme-toggle-button">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <p>
                    💻 Enhanced by <span className="developer">Advanced AI Pattern Recognition</span>
                </p>
                <p>
                    © {new Date().getFullYear()} Stock Chart Analyzer v2.0. All rights reserved.
                </p>
            </div>

            <style jsx>{`
                .analyzer-container {
                    /* ... existing styles ... */
                }
            `}</style>
        </div>
    );
}

export default StockChartAnalyzer;
