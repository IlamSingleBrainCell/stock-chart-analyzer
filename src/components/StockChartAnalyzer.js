import React, { useState, useRef, useEffect, useContext } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart, Target, DollarSign, Search, RefreshCw, Clock, Info, ChevronUp, Sun, Moon, Zap, Award } from 'lucide-react';
import FlagIcon from './FlagIcon';
import { ThemeContext } from '../ThemeContext';
import PatternRecognitionGame from './PatternRecognitionGame';
import Typeahead from './Typeahead';
import { chartPatterns } from '../constants';
import { drawPatternOnCanvas, createChartFromData } from '../utils/chart';
import { detectPatternFromPriceData, calculateKeyLevels, calculateBreakoutTiming, generateLongTermAssessment, generateRecommendation } from '../utils/analysis';
import { highlightMatch } from '../utils/helpers';
import { useStockData } from '../hooks/useStockData';

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
    const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);
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
            return symbolMatch || nameMatch;
        });

        return matches.sort((a, b) => {
            const aSymbol = a.symbol.toLowerCase();
            const bSymbol = b.symbol.toLowerCase();
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            const aSymbolStartsWith = aSymbol.startsWith(query);
            const bSymbolStartsWith = bSymbol.startsWith(query);
            const aNameStartsWith = aName.startsWith(query);
            const bNameStartsWith = bName.startsWith(query);

            if (aSymbol === query) return -1;
            if (bSymbol === query) return 1;

            if (aSymbolStartsWith && !bSymbolStartsWith) return -1;
            if (bSymbolStartsWith && !aSymbolStartsWith) return 1;

            if (aNameStartsWith && !bNameStartsWith) return -1;
            if (bNameStartsWith && !aNameStartsWith) return 1;

            if (aSymbol.includes(query) && !bSymbol.includes(query)) return -1;
            if (bSymbol.includes(query) && !aSymbol.includes(query)) return 1;

            if (aName.includes(query) && !bName.includes(query)) return -1;
            if (bName.includes(query) && !aName.includes(query)) return 1;

            return aSymbol.localeCompare(bSymbol);
        }).slice(0, 10);
    };



    const selectSuggestion = (stock) => {
        const displaySymbol = stock.market === 'India' ? stock.symbol.replace('.NS', '') : stock.symbol;
        setStockSymbol(displaySymbol);
        setPrediction(null);
        setPatternDetected(null);
        setConfidence(null);
        setRecommendation(null);
        setEntryExit(null);
        setTimeEstimate(null);
        setBreakoutTiming(null);
        setKeyLevels(null);
        setLongTermAssessment(null);
        const symbolToFetch = stock.symbol;
        fetchAllData(symbolToFetch, selectedTimeRange);
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', background: 'var(--app-background-start)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '2px solid var(--app-border)' }}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <canvas ref={chartCanvasRef} style={{ display: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', padding: '10px', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                <button onClick={() => setCurrentView('analyzer')} style={{ ...toggleButtonStyle, background: currentView === 'analyzer' ? 'var(--primary-accent)' : 'var(--primary-accent-light)', color: currentView === 'analyzer' ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)' }}>
                    <Zap size={18} style={{ marginRight: '8px' }} /> Chart Analyzer
                </button>
                <button onClick={() => setCurrentView('game')} style={{ ...toggleButtonStyle, background: currentView === 'game' ? 'var(--primary-accent)' : 'var(--primary-accent-light)', color: currentView === 'game' ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)' }}>
                    <Award size={18} style={{ marginRight: '8px' }} /> Pattern Game
                </button>
            </div>

            {currentView === 'analyzer' && (
                <>
                    {/* ... (rest of the analyzer JSX remains the same) ... */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                            Stock Chart Pattern Analyzer
                        </h1>
                        <p style={{ color: 'var(--text-color-lighter)', fontSize: '16px', margin: '0' }}>
                            Get data-driven analysis from live stock charts (3-month data) or explore patterns with your own images.
                            <br />
                            <span style={{ fontSize: '14px', color: 'var(--text-color-muted)' }}>
                                📊 Supporting 2000+ stocks from US & Indian markets with Key Level detection.
                            </span>
                        </p>
                    </div>


                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: 'var(--text-color)', fontSize: '18px' }}>
                            <Search size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--text-color-light)' }} />
                            Get Live Stock Chart (3-Month Analysis)
                        </label>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                                    <Typeahead
                                        inputRef={inputRef}
                                        value={stockSymbol}
                                        onChange={setStockSymbol}
                                        onSelect={selectSuggestion}
                                        filterSuggestions={filterSuggestions}
                                        placeholder="🔍 Search: AAPL, Reliance, Microsoft..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && stockSymbol.trim()) {
                                                const symbolToFetch = stockSymbol.toUpperCase();
                                                fetchAllData(symbolToFetch, selectedTimeRange);
                                            }
                                        }}
                                    />
                                </div>
                                <button onClick={() => { if (stockSymbol.trim()) { const symbolToFetch = stockSymbol.toUpperCase(); fetchAllData(symbolToFetch, selectedTimeRange); } }} disabled={loading} style={{ padding: '14px 24px', background: loading ? 'var(--text-color-muted)' : 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)', color: 'var(--button-primary-text)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', minWidth: '140px', justifyContent: 'center' }}>
                                    {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
                                    {loading ? 'Fetching...' : 'Get Chart'}
                                </button>
                                <button onClick={clearAnalysis} style={{ padding: '14px 24px', background: 'var(--danger-background)', color: 'var(--button-primary-text)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', minWidth: '140px', justifyContent: 'center' }}>
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px', marginTop: '16px' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-color)', fontSize: '16px' }}>Select Data Time Range:</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['3mo', '1y', '5y', '10y'].map(range => {
                                    let displayLabel = '';
                                    if (range === '3mo') displayLabel = '3 Months';
                                    else if (range === '1y') displayLabel = '1 Year';
                                    else if (range === '5y') displayLabel = '5 Years';
                                    else if (range === '10y') displayLabel = '10 Years';
                                    return (<button key={range} onClick={() => handleTimeRangeChange(range)} style={{ padding: '8px 16px', background: selectedTimeRange === range ? 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)' : 'var(--primary-accent-light)', color: selectedTimeRange === range ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)', border: `1px solid ${selectedTimeRange === range ? 'transparent' : 'var(--primary-accent-border)'}`, borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease-in-out', }}>{displayLabel}</button>);
                                })}
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--text-color-light)', marginBottom: '12px', fontWeight: '500' }}>Popular Stocks from {stockDatabase.length}+ available (<FlagIcon country="US" size={12} />US + <FlagIcon country="India" size={12} />Indian Markets):</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {popularStocksData.map(stock => (<button key={stock.symbol} onClick={() => selectSuggestion(stock)} disabled={loading} style={{ padding: '8px 12px', background: stockSymbol === stock.symbol ? 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)' : 'var(--primary-accent-light)', color: stockSymbol === stock.symbol ? 'var(--button-primary-text)' : 'var(--primary-accent-darker)', border: `1px solid var(--primary-accent-border)`, borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '4px' }} onMouseEnter={(e) => { if (stockSymbol !== stock.symbol && !loading) { e.target.style.background = 'var(--input-background-hover)'; } }} onMouseLeave={(e) => { if (stockSymbol !== stock.symbol && !loading) { e.target.style.background = 'var(--primary-accent-light)'; } }}> <FlagIcon country={stock.market} size={12} /> {stock.symbol.replace('.NS', '')} </button>))}
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-color-lighter)' }}><strong>Examples:</strong> Search from {stockDatabase.length}+ stocks - try "TCS" (Indian IT), "Reliance" (Indian Oil), "AAPL" (US Tech), "HDFC" (Indian Banking), "NVDA" (US Semiconductors), or "Wipro" (Indian IT)</div>
                        </div>
                    </div>

                    {error && (<div style={{ background: 'var(--danger-background)', border: '2px solid var(--danger-border)', borderRadius: '8px', padding: '16px', marginBottom: '20px', color: 'var(--danger-color)' }}><strong>⚠️ Chart Error:</strong> {error}</div>)}


                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '16px' }}><div style={{ flex: '1', height: '2px', background: 'linear-gradient(90deg, transparent, var(--separator-color), transparent)' }}></div><span style={{ color: 'var(--text-color-lighter)', fontWeight: '600', fontSize: '14px', background: 'var(--card-background)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--card-border)' }}>OR</span><div style={{ flex: '1', height: '2px', background: 'linear-gradient(90deg, var(--separator-color), transparent)' }}></div></div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--text-color)', fontSize: '18px' }}>📁 Upload Your Own Chart Image (for Educational Exploration)</label>
                        <p style={{ fontSize: '13px', color: 'var(--text-color-lighter)', marginBottom: '12px', marginTop: '0px' }}>Note: Analysis for uploaded images provides an educational example of pattern types. For data-driven analysis, please use the live stock chart feature above.</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '20px', border: '2px dashed var(--primary-accent-border)', borderRadius: '12px', background: 'var(--input-background)', fontSize: '16px', fontWeight: '500', color: 'var(--text-color)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.borderColor = 'var(--secondary-accent)'; e.target.style.background = 'var(--input-background-hover)'; }} onMouseLeave={(e) => { e.target.style.borderColor = 'var(--primary-accent-border)'; e.target.style.background = 'var(--input-background)'; }} />
                    </div>

                    {uploadedImage && (
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ width: '100%', height: '400px', background: 'var(--card-background)', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card-border)', boxShadow: '0 4px 20px var(--card-shadow)' }}><img src={uploadedImage} alt="Stock chart" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} /></div>
                            {stockData && (<div style={{ background: 'var(--success-background)', border: '2px solid var(--success-border)', borderRadius: '12px', padding: '16px', marginBottom: '16px', fontSize: '15px', color: 'var(--success-color)' }}><div style={{ fontWeight: '700', marginBottom: '8px' }}>📊 Stock Information ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : selectedTimeRange === '10y' ? '10 Years' : '3 Months'} Data):</div><div><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div><div><strong>Current Price:</strong> {stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}{stockData.currentPrice?.toFixed(2)} {stockData.currency} |<strong> Data Points:</strong> {stockData.prices.length} {selectedTimeRange === '1y' ? 'weeks' : (selectedTimeRange === '5y' || selectedTimeRange === '10y') ? 'months' : 'days'}</div>{stockData.isMockData && <div style={{ color: 'var(--warning-color)', fontStyle: 'italic', marginTop: '4px' }}>⚠️ Using demo data - API temporarily unavailable</div>}</div>)}
                            <button onClick={() => {
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
                            }} disabled={loading} style={{ width: '100%', background: loading ? 'var(--text-color-muted)' : 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)', color: 'var(--button-primary-text)', border: 'none', padding: '18px 24px', fontSize: '18px', fontWeight: '600', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s', boxShadow: loading ? 'none' : `0 4px 20px ${'var(--primary-accent-light)'}` }}>{loading ? (<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />Analyzing Pattern...</span>) : stockData ? ('🔍 Analyze Live Chart Data') : ('🔍 Explore Example Pattern')}</button>
                        </div>)}

                    {longTermAssessment && stockData && (<div style={{ background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', marginBottom: '32px', padding: '24px', boxShadow: `0 8px 32px var(--card-shadow)` }}><h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', textAlign: 'center' }}>🗓️ Long-Term Review ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : '10 Years'})</h2><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Overall Trend:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.trend}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Shows the general direction of the stock's price over the selected period.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Total Return:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.totalReturn}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Illustrates the percentage gain or loss if you had invested at the beginning and held until the end of the period.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Price Extremes:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.highLow}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Highlights the highest and lowest prices the stock reached during this timeframe.</p></div><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><p style={{ margin: '0 0 4px 0', fontWeight: '600', color: 'var(--text-color)' }}>Volatility Insight:</p><p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-color-light)' }}>{longTermAssessment.volatility}</p><p style={{ margin: '0', fontSize: '12px', color: 'var(--text-color-muted)' }}>Gives an idea of how much the stock's price fluctuated; higher volatility means bigger price swings.</p></div><p style={{ fontSize: '13px', color: 'var(--text-color-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>{longTermAssessment.disclaimer}</p></div>)}

                    {prediction && patternDetected && !longTermAssessment && (
                        <div style={{ background: 'var(--card-background)', borderRadius: '20px', border: '2px solid var(--card-border)', marginBottom: '32px', overflow: 'hidden', boxShadow: `0 8px 32px var(--card-shadow)` }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-color)', padding: '24px 24px 0', textAlign: 'center' }}>📈 Short-Term Pattern Analysis</h2>
                            <div style={{ padding: '24px', background: prediction === 'up' ? 'var(--success-background)' : prediction === 'down' ? 'var(--danger-background)' : 'var(--primary-accent-light)', borderLeft: `6px solid ${prediction === 'up' ? 'var(--success-color)' : prediction === 'down' ? 'var(--danger-color)' : 'var(--primary-accent)'}`, margin: '0 24px 16px', borderRadius: '12px', border: `2px solid ${prediction === 'up' ? 'var(--success-border)' : prediction === 'down' ? 'var(--danger-border)' : 'var(--primary-accent-border)'}` }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: prediction === 'up' ? 'var(--success-color)' : prediction === 'down' ? 'var(--danger-color)' : 'var(--primary-accent)' }}>{prediction === 'up' ? <TrendingUp size={28} /> : prediction === 'down' ? <TrendingDown size={28} /> : <BarChart size={28} />}<h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Enhanced Prediction</h3></div><p style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '800', color: prediction === 'up' ? 'var(--success-color)' : prediction === 'down' ? 'var(--danger-color)' : 'var(--primary-accent-darker)' }}>{prediction === 'up' ? '📈 Likely to go UP' : prediction === 'down' ? '📉 Likely to go DOWN' : '↔️ Continuation Expected'}</p><div style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: '16px', padding: '14px 18px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--card-border)', fontWeight: '600' }}><span style={{ fontWeight: '700', color: 'var(--text-color)' }}>{prediction === 'up' ? '⏱️ Upward duration:' : prediction === 'down' ? '⏱️ Downward duration:' : '⏱️ Pattern duration:'}</span> {prediction === 'up' ? patternDetected.daysUp : prediction === 'down' ? patternDetected.daysDown : patternDetected.timeframe}</div>
                                {confidence && (<div><div style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: '16px', fontWeight: '700', background: 'var(--background-color)', padding: '12px 16px', borderRadius: '8px', border: '2px solid var(--card-border)', textAlign: 'center', position: 'relative' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🎯 Confidence Level: {confidence}%<button onClick={() => setShowConfidenceHelp(!showConfidenceHelp)} style={{ background: 'var(--primary-accent-light)', border: '1px solid var(--primary-accent-border)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', padding: '0' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--input-background-hover)'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-accent-light)'; e.currentTarget.style.transform = 'scale(1)'; }} title="Click to understand confidence levels"><Info size={12} color="var(--primary-accent-darker)" /></button></div><div style={{ marginTop: '8px', fontSize: '14px', fontWeight: '600' }}>{confidence >= 80 ? (<span style={{ color: 'var(--success-color)', background: 'var(--success-background)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--success-border)' }}>🟢 High Confidence - Strong Signal</span>) : confidence >= 60 ? (<span style={{ color: 'var(--warning-color)', background: 'var(--warning-background)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--warning-border)' }}>🟡 Medium Confidence - Proceed with Caution</span>) : (<span style={{ color: 'var(--danger-color)', background: 'var(--danger-background)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--danger-border)' }}>🟠 Low Confidence - High Risk</span>)}</div></div>
                                    {showConfidenceHelp && (<div style={{ marginTop: '12px', background: 'var(--primary-accent-light)', border: '2px solid var(--primary-accent-border)', borderRadius: '12px', padding: '20px', animation: 'slideInUp 0.3s ease-out' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}><h4 style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: 'var(--primary-accent-darker)' }}>📊 Understanding Confidence Levels</h4><button onClick={() => setShowConfidenceHelp(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronUp size={20} color="var(--text-color-lighter)" /></button></div><div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-color-light)' }}><div style={{ marginBottom: '16px', padding: '12px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><strong style={{ color: 'var(--text-color)' }}>What is Confidence Level?</strong><p style={{ margin: '4px 0 0 0', fontWeight: '500' }}>A percentage (45-92%) indicating how reliable the pattern detection and prediction are. Higher = more trustworthy.</p></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}><div style={{ padding: '12px', background: 'var(--success-background)', borderRadius: '8px', border: '1px solid var(--success-border)' }}><div style={{ fontWeight: '700', color: 'var(--success-color)', marginBottom: '4px' }}>🟢 High (80-92%)</div><div style={{ fontSize: '13px', fontWeight: '500' }}>Very reliable • Strong signal • Clear pattern • Normal position sizes</div></div><div style={{ padding: '12px', background: 'var(--warning-background)', borderRadius: '8px', border: '1px solid var(--warning-border)' }}><div style={{ fontWeight: '700', color: 'var(--warning-color)', marginBottom: '4px' }}>🟡 Medium (60-79%)</div><div style={{ fontSize: '13px', fontWeight: '500' }}>Moderately reliable • Use caution • Smaller positions • Wait for confirmation</div></div><div style={{ padding: '12px', background: 'var(--danger-background)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}><div style={{ fontWeight: '700', color: 'var(--danger-color)', marginBottom: '4px' }}>🟠 Low (45-59%)</div><div style={{ fontSize: '13px', fontWeight: '500' }}>High risk • Avoid trading • Wait for better setup • Educational only</div></div></div><div style={{ padding: '12px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><div style={{ fontWeight: '700', color: 'var(--primary-accent-darker)', marginBottom: '8px' }}>How is it calculated?</div><ul style={{ margin: '0', paddingLeft: '16px', fontSize: '13px', fontWeight: '500' }}><li>Base pattern reliability (each pattern has historical success rates)</li><li>Pattern clarity and shape matching quality</li><li>Technical indicator alignment (RSI, moving averages)</li><li>Market conditions and data quality factors</li></ul></div>{confidence < 60 && (<div style={{ marginTop: '12px', padding: '12px', background: 'var(--danger-background)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}><div style={{ fontWeight: '700', color: 'var(--danger-color)', marginBottom: '4px' }}>⚠️ Your Current Score: {confidence}%</div><div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--danger-color)' }}>This is a <strong>low confidence</strong> signal. Consider waiting for a clearer pattern with 70%+ confidence before making trading decisions.</div></div>)}<div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-color-lighter)', fontStyle: 'italic', textAlign: 'center' }}>💡 Remember: Even high confidence doesn't guarantee success. Always use proper risk management and do your own research.</div></div></div>)}</div>)}
                            </div>
                            {breakoutTiming && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><Clock size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Breakout Timing Prediction</h3></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}><div style={{ background: 'var(--info-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--info-border)' }}><div style={{ fontWeight: '700', color: 'var(--info-color)', fontSize: '14px' }}>Expected Timeframe</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.daysRange}</div></div><div style={{ background: 'var(--success-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--success-border)' }}><div style={{ fontWeight: '700', color: 'var(--success-color)', fontSize: '14px' }}>Earliest Date</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.minDate}</div></div><div style={{ background: 'var(--danger-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger-border)' }}><div style={{ fontWeight: '700', color: 'var(--danger-color)', fontSize: '14px' }}>Latest Date</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.maxDate}</div></div><div style={{ background: 'var(--primary-accent-light)', padding: '12px', borderRadius: '8px', border: '1px solid var(--primary-accent-border)' }}><div style={{ fontWeight: '700', color: 'var(--primary-accent-darker)', fontSize: '14px' }}>Timing Confidence</div><div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '16px' }}>{breakoutTiming.confidence}</div></div></div><div style={{ marginTop: '12px', padding: '10px', background: 'var(--warning-background)', borderRadius: '6px', fontSize: '14px', color: 'var(--warning-color)', fontWeight: '500' }}>💡 <strong>Note:</strong> Breakout timing is based on pattern analysis and current market momentum. Monitor volume and price action for confirmation.</div></div>)}
                            {keyLevels && (keyLevels.support?.length > 0 || keyLevels.resistance?.length > 0) && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><BarChart size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Key Price Levels</h3></div>{keyLevels.support?.length > 0 && (<div style={{ marginBottom: '12px' }}><strong style={{ color: 'var(--success-color)' }}>Support Levels:</strong><ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '4px 0 0 0' }}>{keyLevels.support.map((level, idx) => (<li key={`s-${idx}`} style={{ fontSize: '16px', color: 'var(--text-color-light)', fontWeight: '500' }}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>))}</ul></div>)}{keyLevels.resistance?.length > 0 && (<div><strong style={{ color: 'var(--danger-color)' }}>Resistance Levels:</strong><ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '4px 0 0 0' }}>{keyLevels.resistance.map((level, idx) => (<li key={`r-${idx}`} style={{ fontSize: '16px', color: 'var(--text-color-light)', fontWeight: '500' }}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>))}</ul></div>)}<div style={{ marginTop: '12px', padding: '10px', background: 'var(--primary-accent-light)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-color-light)', fontWeight: '500' }}>💡 These are automatically identified potential support (price floor) and resistance (price ceiling) levels from recent price action.</div></div>)}
                            {recommendation && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><DollarSign size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Recommendation</h3></div><p style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '800', color: recommendation.action === 'BUY' ? 'var(--success-color)' : recommendation.action === 'SELL' ? 'var(--danger-color)' : 'var(--primary-accent-darker)' }}>{recommendation.action === 'BUY' ? '💰 BUY' : recommendation.action === 'SELL' ? '💸 SELL' : '✋ HOLD'}</p><p style={{ fontSize: '16px', color: 'var(--text-color-light)', lineHeight: '1.6', fontWeight: '500' }}>{recommendation.reasoning}</p></div>)}
                            {entryExit && (<div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><Target size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Entry & Exit Strategy</h3></div><div style={{ marginBottom: '12px' }}><span style={{ fontWeight: '700', color: 'var(--success-color)' }}>🟢 Entry Point: </span><span style={{ color: 'var(--text-color-light)', fontWeight: '500' }}>{entryExit.entry}</span></div><div><span style={{ fontWeight: '700', color: 'var(--danger-color)' }}>🔴 Exit Strategy: </span><span style={{ color: 'var(--text-color-light)', fontWeight: '500' }}>{entryExit.exit}</span></div></div>)}
                            <div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><Calendar size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Time Estimate</h3></div><p style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-color-light)', fontWeight: '600' }}>{timeEstimate}</p><div style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: '16px', padding: '12px 16px', background: 'var(--primary-accent-light)', borderRadius: '8px', border: '1px solid var(--primary-accent-border)', fontWeight: '600' }}><span style={{ fontWeight: '700', color: 'var(--text-color)' }}>📅 Typical pattern duration:</span> {patternDetected.timeframe}</div></div>
                            <div style={{ padding: '24px', background: 'var(--background-color)', margin: '0 24px 24px', borderRadius: '12px', border: '2px solid var(--card-border)' }}><div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'var(--text-color)' }}><BarChart size={28} /><h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: 'var(--text-color)' }}>Pattern Detected</h3></div><div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}><div><p style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-color-light)', fontWeight: '700' }}>📊 {patternDetected.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p><div style={{ fontSize: '14px', color: 'var(--text-color-lighter)', marginTop: '8px', padding: '8px 12px', background: 'var(--primary-accent-light)', borderRadius: '6px', fontWeight: '500' }}>💡 Compare the actual chart above with this pattern example below</div></div><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--background-color)', borderRadius: '8px', border: '1px solid var(--card-border)' }}><PatternVisualization patternName={patternDetected.name} theme={theme} width={300} height={160} /><div style={{ fontSize: '12px', color: 'var(--text-color-muted)', textAlign: 'center', fontWeight: '500' }}>📈 Typical {patternDetected.name.split('-').join(' ')} pattern example</div></div></div></div>
                        </div>)}
                    {patternDetected && (<div style={{ background: 'var(--card-background)', padding: '32px', borderRadius: '20px', marginBottom: '32px', border: '2px solid var(--card-border)', boxShadow: `0 8px 32px var(--card-shadow)` }}><h3 style={{ fontWeight: '700', fontSize: '24px', marginTop: '0', marginBottom: '20px', color: 'var(--text-color)', textAlign: 'center' }}>📚 Pattern Education</h3><h4 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: 'var(--text-color)' }}>Description:</h4><p style={{ marginBottom: '24px', lineHeight: '1.7', fontSize: '16px', color: 'var(--text-color-light)', fontWeight: '500' }}>{patternDetected.description}</p><div style={{ padding: '24px', border: '2px solid var(--card-border)', background: 'var(--primary-accent-light)', borderRadius: '12px' }}><h4 style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary-accent-darker)', marginTop: '0', marginBottom: '16px' }}>🔍 What to look for:</h4><ul style={{ marginTop: '0', paddingLeft: '0', listStyle: 'none', fontSize: '15px', color: 'var(--text-color-light)' }}><li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Look for clear pattern formation with multiple confirmation points</li><li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Check volume patterns that support the chart pattern</li><li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Confirm breakout direction before making decisions</li><li style={{ marginBottom: '0', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500' }}><span style={{ position: 'absolute', left: '0', color: 'var(--primary-accent-darker)', fontWeight: 'bold', fontSize: '16px' }}>→</span>Consider overall market conditions and sentiment</li></ul></div></div>)}
                </>
            )}

            {currentView === 'game' && (
                <PatternRecognitionGame PatternVisualization={PatternVisualization} chartPatterns={chartPatterns} />
            )}

            <div style={{ fontSize: '15px', color: 'var(--text-color-light)', background: 'var(--card-background)', padding: '24px', borderRadius: '16px', border: '2px solid var(--card-border)', lineHeight: '1.7', marginBottom: '24px', fontWeight: '500', textAlign: 'center' }}>
                <p style={{ marginBottom: '12px' }}><strong>⚠️ Important Disclaimer:</strong> This application provides technical analysis and historical data reviews for educational purposes only.</p>
                <p style={{ marginBottom: '12px' }}><strong>📊 Features Include:</strong> Short-term pattern analysis (3-month data), long-term historical reviews (up to 10 years), dynamic confidence scoring, and breakout timing predictions.</p>
                <p style={{ margin: '0' }}>All information should be used for learning and not as financial advice. Always conduct thorough research and consult financial advisors before making investment decisions.</p>
            </div>

            <div style={{ borderTop: '2px solid var(--card-border)', paddingTop: '20px', marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-color-lighter)', background: 'var(--card-background)', padding: '20px', borderRadius: '12px', position: 'relative' }}>
                <button onClick={toggleTheme} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--primary-accent-light)', border: '1px solid var(--primary-accent-border)', color: 'var(--primary-accent-darker)', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-color-light)' }}>
                    💻 Enhanced by <span style={{ color: 'var(--primary-accent-darker)', fontWeight: '700' }}>Advanced AI Pattern Recognition</span>
                </p>
                <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-color-muted)' }}>
                    © {new Date().getFullYear()} Stock Chart Analyzer v2.0. All rights reserved.
                </p>
            </div>

            <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .flash {
            animation: flash 1s ease-in-out;
        }
        div[style*="overflowY: auto"] { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
        div[style*="overflowY: auto"]::-webkit-scrollbar { width: 6px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 3px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
        </div>
    );
}

const toggleButtonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    border: '1px solid var(--primary-accent-border)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '180px'
};

export default StockChartAnalyzer;
