import React, { useState, useRef, useEffect, useContext } from 'react';
import { RefreshCw, Zap, Award } from 'lucide-react';
import { ThemeContext } from '../ThemeContext';
import PatternRecognitionGame from './PatternRecognitionGame';
import PatternDetectionModal from './PatternDetectionModal';
import { chartPatterns } from '../constants';
import { drawPatternOnCanvas, createChartFromData } from '../utils/chart';
import { detectPatternFromPriceData, calculateKeyLevels, calculateBreakoutTiming, generateLongTermAssessment, generateRecommendation } from '../utils/analysis';
import { useStockData } from '../hooks/useStockData';
import Header from './Header';
import StockSearch from './StockSearch';
import AnalysisOutput from './AnalysisOutput';
import Card from './ui/Card';
import Button from './ui/Button';

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
    const [uploadedImage, setUploadedImage] = useState(null);
    const {
        stockData,
        loading,
        error,
        fetchAllData,
    } = useStockData();

    const [analysis, setAnalysis] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState('3mo');
    const [currentView, setCurrentView] = useState('analyzer');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chartCanvasRef = useRef(null);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        fetch('/stockDatabase.json')
            .then(response => response.json())
            .then(data => setStockDatabase(data))
            .catch(error => console.error('Error fetching stock database:', error));
    }, []);

    const handleStockSelect = (stock) => {
        setAnalysis(null);
        fetchAllData(stock.symbol, selectedTimeRange);
    };

    const handleTimeRangeChange = (range) => {
        setSelectedTimeRange(range);
        if (stockData) {
            setAnalysis(null);
            fetchAllData(stockData.symbol, range);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
                setAnalysis(null);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (stockData) {
            const chartImageUrl = createChartFromData(stockData, analysis?.keyLevels, theme, chartCanvasRef);
            setUploadedImage(chartImageUrl);

            try {
                let calculatedKeyLevels = null;
                let currentLongTermAssessment = null;
                if (stockData && stockData.prices && stockD
ata.prices.length > 0) {
                    calculatedKeyLevels = calculateKeyLevels(stockData.prices);
                    if (selectedTimeRange === '1y' || selectedTimeRange === '5y' || selectedTimeRange === '10y') {
                        currentLongTermAssessment = generateLongTermAssessment(stockData, selectedTimeRange);
                        if (currentLongTermAssessment) {
                            setAnalysis({ longTermAssessment: currentLongTermAssessment });
                        }
                    } else {
                        const patternAnalysis = detectPatternFromPriceData(stockData.prices);
                        if (patternAnalysis) {
                            const { pattern: detectedPatternName, confidence: confidenceScore, accuracy, detectedPoints } = patternAnalysis;
                            if (detectedPatternName && chartPatterns[detectedPatternName]) {
                                const selectedPatternDetails = chartPatterns[detectedPatternName];
                                const rec = generateRecommendation(selectedPatternDetails, confidenceScore);
                                const breakout = calculateBreakoutTiming(detectedPatternName, stockData, confidenceScore);
                                setAnalysis({
                                    patternDetected: {
                                        name: detectedPatternName,
                                        ...selectedPatternDetails,
                                        accuracy: accuracy,
                                        detectedPoints: detectedPoints,
                                    },
                                    prediction: selectedPatternDetails.prediction,
                                    confidence: confidenceScore,
                                    recommendation: rec,
                                    breakoutTiming: breakout,
                                    keyLevels: calculatedKeyLevels,
                                    timeEstimate: `Expected to move within ${selectedPatternDetails.timeframe}`,
                                    entryExit: {
                                        entry: selectedPatternDetails.entryStrategy,
                                        exit: selectedPatternDetails.exitStrategy
                                    },
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error analyzing chart:', error);
            }
        }
    }, [stockData, theme, analysis?.keyLevels, selectedTimeRange]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <main className="p-4">
                <div className="flex justify-center mb-4">
                    <Button onClick={() => setCurrentView('analyzer')} variant={currentView === 'analyzer' ? 'primary' : 'secondary'}>
                        <Zap size={18} className="mr-2" /> Chart Analyzer
                    </Button>
                    <Button onClick={() => setCurrentView('game')} variant={currentView === 'game' ? 'primary' : 'secondary'}>
                        <Award size={18} className="mr-2" /> Pattern Game
                    </Button>
                </div>

                {currentView === 'analyzer' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 space-y-4">
                            <Card>
                                <StockSearch onSelect={handleStockSelect} stockDatabase={stockDatabase} />
                            </Card>
                            <Card>
                                <h3 className="font-semibold mb-2">Time Range</h3>
                                <div className="flex space-x-2">
                                    {['3mo', '1y', '5y', '10y'].map(range => (
                                        <Button
                                            key={range}
                                            onClick={() => handleTimeRangeChange(range)}
                                            variant={selectedTimeRange === range ? 'primary' : 'secondary'}
                                        >
                                            {range}
                                        </Button>
                                    ))}
                                </div>
                            </Card>
                            <Card>
                                <h3 className="font-semibold mb-2">Upload Chart</h3>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            {loading && (
                                <Card className="flex items-center justify-center">
                                    <RefreshCw size={24} className="animate-spin mr-2" />
                                    <span>Loading...</span>
                                </Card>
                            )}
                            {error && <Card className="text-red-500">{error}</Card>}
                            {uploadedImage && (
                                <Card>
                                    <img src={uploadedImage} alt="Stock chart" className="w-full h-auto rounded-md" />
                                </Card>
                            )}
                            <AnalysisOutput analysis={analysis} stockData={stockData} theme={theme} />
                        </div>
                    </div>
                )}

                {currentView === 'game' && (
                    <PatternRecognitionGame PatternVisualization={PatternVisualization} chartPatterns={chartPatterns} />
                )}
            </main>

            <PatternDetectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pattern={analysis?.patternDetected}
                stockData={stockData}
                theme={theme}
            />
        </div>
    );
}

export default StockChartAnalyzer;
