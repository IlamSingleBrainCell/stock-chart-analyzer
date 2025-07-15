import React from 'react';
import { TrendingUp, TrendingDown, BarChart, Calendar, Target, DollarSign, Clock } from 'lucide-react';
import Card from './ui/Card';
import { PatternVisualization } from './StockChartAnalyzer';

const AnalysisOutput = ({ analysis, stockData, theme }) => {
  if (!analysis) return null;

  const {
    prediction,
    patternDetected,
    confidence,
    recommendation,
    entryExit,
    timeEstimate,
    breakoutTiming,
    keyLevels,
    longTermAssessment,
  } = analysis;

  if (longTermAssessment) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-4">Long-Term Assessment</h2>
        <p>
          <strong>Trend:</strong> {longTermAssessment.trend}
        </p>
        <p>
          <strong>Total Return:</strong> {longTermAssessment.totalReturn}
        </p>
        <p>
          <strong>Price Extremes:</strong> {longTermAssessment.highLow}
        </p>
        <p>
          <strong>Volatility:</strong> {longTermAssessment.volatility}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {prediction && patternDetected && (
        <Card>
          <div className="flex items-center mb-2">
            {prediction === 'up' ? <TrendingUp size={24} className="text-green-500" /> : <TrendingDown size={24} className="text-red-500" />}
            <h3 className="ml-2 text-lg font-semibold">
              Prediction: {prediction === 'up' ? 'Likely to go UP' : 'Likely to go DOWN'}
            </h3>
          </div>
          <p>
            <strong>Confidence:</strong> {confidence}%
          </p>
        </Card>
      )}

      {patternDetected && (
        <Card>
          <h3 className="text-lg font-semibold mb-2">Pattern Detected: {patternDetected.name}</h3>
          <PatternVisualization patternName={patternDetected.name} theme={theme} />
          <p className="text-sm text-gray-600 dark:text-gray-400">{patternDetected.description}</p>
        </Card>
      )}

      {recommendation && (
        <Card>
          <div className="flex items-center mb-2">
            <DollarSign size={24} />
            <h3 className="ml-2 text-lg font-semibold">Recommendation: {recommendation.action}</h3>
          </div>
          <p>{recommendation.reasoning}</p>
        </Card>
      )}

      {entryExit && (
        <Card>
          <div className="flex items-center mb-2">
            <Target size={24} />
            <h3 className="ml-2 text-lg font-semibold">Entry & Exit Strategy</h3>
          </div>
          <p>
            <strong>Entry:</strong> {entryExit.entry}
          </p>
          <p>
            <strong>Exit:</strong> {entryExit.exit}
          </p>
        </Card>
      )}

      {timeEstimate && (
        <Card>
          <div className="flex items-center mb-2">
            <Calendar size={24} />
            <h3 className="ml-2 text-lg font-semibold">Time Estimate</h3>
          </div>
          <p>{timeEstimate}</p>
        </Card>
      )}

      {breakoutTiming && (
        <Card>
          <div className="flex items-center mb-2">
            <Clock size={24} />
            <h3 className="ml-2 text-lg font-semibold">Breakout Timing</h3>
          </div>
          <p>
            <strong>Timeframe:</strong> {breakoutTiming.daysRange}
          </p>
          <p>
            <strong>Confidence:</strong> {breakoutTiming.confidence}
          </p>
        </Card>
      )}

      {keyLevels && (
        <Card>
          <div className="flex items-center mb-2">
            <BarChart size={24} />
            <h3 className="ml-2 text-lg font-semibold">Key Levels</h3>
          </div>
          {keyLevels.support.length > 0 && (
            <p>
              <strong>Support:</strong> {keyLevels.support.join(', ')}
            </p>
          )}
          {keyLevels.resistance.length > 0 && (
            <p>
              <strong>Resistance:</strong> {keyLevels.resistance.join(', ')}
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default AnalysisOutput;
