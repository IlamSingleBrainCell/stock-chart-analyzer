import React from 'react';
import { TrendingUp, TrendingDown, BarChart, Clock, Target, DollarSign, Calendar, Info } from 'lucide-react';

const Results = ({
    prediction,
    patternDetected,
    longTermAssessment,
    confidence,
    recommendation,
    entryExit,
    timeEstimate,
    breakoutTiming,
    keyLevels,
    stockData,
    selectedTimeRange,
    showConfidenceHelp,
    setShowConfidenceHelp
}) => {
    if (!prediction && !longTermAssessment) return null;

    return (
        <div className="results-container">
            {longTermAssessment && stockData && (
                <div className="long-term-assessment">
                    <h2 className="results-title">🗓️ Long-Term Review ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : '10 Years'})</h2>
                    <div className="assessment-item">
                        <p><strong>Overall Trend:</strong> {longTermAssessment.trend}</p>
                    </div>
                    <div className="assessment-item">
                        <p><strong>Total Return:</strong> {longTermAssessment.totalReturn}</p>
                    </div>
                    <div className="assessment-item">
                        <p><strong>Price Extremes:</strong> {longTermAssessment.highLow}</p>
                    </div>
                    <div className="assessment-item">
                        <p><strong>Volatility Insight:</strong> {longTermAssessment.volatility}</p>
                    </div>
                    <p className="disclaimer-text">{longTermAssessment.disclaimer}</p>
                </div>
            )}

            {prediction && patternDetected && !longTermAssessment && (
                <div className="short-term-analysis">
                    <h2 className="results-title">📈 Short-Term Pattern Analysis</h2>

                    <div className={`prediction-section ${prediction === 'up' ? 'bg-up' : prediction === 'down' ? 'bg-down' : 'bg-neutral'}`}>
                        <div className="summary-header">
                            {prediction === 'up' ? <TrendingUp size={28} className="icon-up" /> : prediction === 'down' ? <TrendingDown size={28} className="icon-down" /> : <BarChart size={28} className="icon-neutral" />}
                            <h3 className="summary-title">Enhanced Prediction</h3>
                        </div>
                        <p className={`summary-text ${prediction === 'up' ? 'text-up' : prediction === 'down' ? 'text-down' : 'text-neutral'}`}>
                            {prediction === 'up' ? '📈 Likely to go UP' : prediction === 'down' ? '📉 Likely to go DOWN' : '↔️ Continuation Expected'}
                        </p>
                        <div className="summary-detail">
                            <span>{prediction === 'up' ? '⏱️ Upward duration:' : prediction === 'down' ? '⏱️ Downward duration:' : '⏱️ Pattern duration:'}</span>
                            {prediction === 'up' ? patternDetected.daysUp : prediction === 'down' ? patternDetected.daysDown : patternDetected.timeframe}
                        </div>
                        {confidence && (
                            <div className="confidence-section">
                                <div className="confidence-score">
                                    🎯 Confidence Level: {confidence}%
                                    <button onClick={() => setShowConfidenceHelp(!showConfidenceHelp)} className="confidence-help-button">
                                        <Info size={12} />
                                    </button>
                                </div>
                                {showConfidenceHelp && (
                                    <div className="confidence-help">
                                        <h4>📊 Understanding Confidence Levels</h4>
                                        <p>A percentage (45-92%) indicating how reliable the pattern detection and prediction are. Higher = more trustworthy.</p>
                                        <div>
                                            <div>🟢 High (80-92%): Very reliable, strong signal.</div>
                                            <div>🟡 Medium (60-79%): Moderately reliable, use caution.</div>
                                            <div>🟠 Low (45-59%): High risk, avoid trading.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {breakoutTiming && (
                        <div className="summary-section">
                            <div className="summary-header">
                                <Clock size={28} className="icon-time" />
                                <h3 className="summary-title">Breakout Timing Prediction</h3>
                            </div>
                            <div className="summary-detail">
                                <div><strong>Expected Timeframe:</strong> {breakoutTiming.daysRange}</div>
                                <div><strong>Earliest Date:</strong> {breakoutTiming.minDate}</div>
                                <div><strong>Latest Date:</strong> {breakoutTiming.maxDate}</div>
                                <div><strong>Timing Confidence:</strong> {breakoutTiming.confidence}</div>
                            </div>
                        </div>
                    )}

                    {keyLevels && (keyLevels.support?.length > 0 || keyLevels.resistance?.length > 0) && (
                        <div className="summary-section">
                            <div className="summary-header">
                                <BarChart size={28} className="icon-pattern" />
                                <h3 className="summary-title">Key Price Levels</h3>
                            </div>
                            <div className="summary-detail">
                                {keyLevels.support?.length > 0 && (
                                    <div>
                                        <strong>Support Levels:</strong>
                                        <ul>
                                            {keyLevels.support.map((level, idx) => (
                                                <li key={`s-${idx}`}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {keyLevels.resistance?.length > 0 && (
                                    <div>
                                        <strong>Resistance Levels:</strong>
                                        <ul>
                                            {keyLevels.resistance.map((level, idx) => (
                                                <li key={`r-${idx}`}>{stockData?.currency === 'INR' || stockData?.symbol?.includes('.NS') ? '₹' : '$'}{level.toFixed(2)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {recommendation && (
                        <div className="summary-section">
                            <div className="summary-header">
                                <DollarSign size={28} className="icon-neutral" />
                                <h3 className="summary-title">Recommendation</h3>
                            </div>
                            <p className={`summary-text ${recommendation.action === 'BUY' ? 'text-up' : recommendation.action === 'SELL' ? 'text-down' : 'text-neutral'}`}>
                                {recommendation.action === 'BUY' ? '💰 BUY' : recommendation.action === 'SELL' ? '💸 SELL' : '✋ HOLD'}
                            </p>
                            <p>{recommendation.reasoning}</p>
                        </div>
                    )}

                    {entryExit && (
                        <div className="summary-section">
                            <div className="summary-header">
                                <Target size={28} className="icon-neutral" />
                                <h3 className="summary-title">Entry & Exit Strategy</h3>
                            </div>
                            <div className="summary-detail">
                                <div><strong>🟢 Entry Point:</strong> {entryExit.entry}</div>
                                <div><strong>🔴 Exit Strategy:</strong> {entryExit.exit}</div>
                            </div>
                        </div>
                    )}

                    <div className="summary-section">
                        <div className="summary-header">
                            <Calendar size={28} className="icon-time" />
                            <h3 className="summary-title">Time Estimate</h3>
                        </div>
                        <p className="summary-text">{timeEstimate}</p>
                        <div className="summary-detail">
                            📅 Typical pattern duration: {patternDetected.timeframe}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
