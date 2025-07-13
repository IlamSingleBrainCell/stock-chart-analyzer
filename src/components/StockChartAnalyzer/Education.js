import React from 'react';
import { PatternVisualization } from '../StockChartAnalyzer';

const Education = ({ patternDetected, theme }) => {
    if (!patternDetected) return null;

    return (
        <div className="education-section">
            <h3 className="education-title">📚 Pattern Education</h3>
            <div className="pattern-description">
                <h4>Description:</h4>
                <p>{patternDetected.description}</p>
            </div>
            <div className="pattern-visualization">
                <h4>Pattern Visualization:</h4>
                <PatternVisualization patternName={patternDetected.name} theme={theme} width={300} height={160} />
                <div className="visualization-caption">
                    📈 Typical {patternDetected.name.split('-').join(' ')} pattern example
                </div>
            </div>
            <div className="what-to-look-for">
                <h4>🔍 What to look for:</h4>
                <ul>
                    <li>Look for clear pattern formation with multiple confirmation points</li>
                    <li>Check volume patterns that support the chart pattern</li>
                    <li>Confirm breakout direction before making decisions</li>
                    <li>Consider overall market conditions and sentiment</li>
                </ul>
            </div>
        </div>
    );
};

export default Education;
