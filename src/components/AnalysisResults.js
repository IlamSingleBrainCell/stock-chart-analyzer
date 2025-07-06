import React from 'react';
import { TrendingUp, TrendingDown, BarChart, Clock, DollarSign, Target, Calendar } from 'lucide-react';
import PatternVisualization from './PatternVisualization'; // Import PatternVisualization

const AnalysisResults = ({
  prediction,
  patternDetected,
  confidence,
  breakoutTiming,
  recommendation,
  entryExit,
  timeEstimate,
}) => {
  if (!prediction || !patternDetected) {
    return null; // Don't render if there are no results yet
  }

  return (
    <>
      <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px', border: '2px solid rgba(0, 0, 0, 0.1)', marginBottom: '32px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#1a202c', padding: '24px 24px 0', textAlign: 'center' }}>
          📈 Enhanced Analysis Results
        </h2>

        {/* Prediction Section */}
        <div style={{ padding: '24px', background: prediction === 'up' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15))' : prediction === 'down' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.15))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))', borderLeft: `6px solid ${prediction === 'up' ? '#10b981' : prediction === 'down' ? '#ef4444' : '#6366f1'}`, margin: '0 24px 16px', borderRadius: '12px', border: `2px solid ${prediction === 'up' ? 'rgba(16, 185, 129, 0.3)' : prediction === 'down' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            {prediction === 'up' ? <TrendingUp size={28} /> : prediction === 'down' ? <TrendingDown size={28} /> : <BarChart size={28} />}
            <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: '#1a202c' }}>Enhanced Prediction</h3>
          </div>
          <p style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '800', color: prediction === 'up' ? '#059669' : prediction === 'down' ? '#dc2626' : '#4f46e5' }}>
            {prediction === 'up' ? '📈 Likely to go UP' : prediction === 'down' ? '📉 Likely to go DOWN' : '↔️ Continuation Expected'}
          </p>
          <div style={{ fontSize: '16px', color: '#1a202c', marginTop: '16px', padding: '14px 18px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.1)', fontWeight: '600' }}>
            <span style={{ fontWeight: '700', color: '#1a202c' }}>
              {prediction === 'up' ? '⏱️ Upward duration:' : prediction === 'down' ? '⏱️ Downward duration:' : '⏱️ Pattern duration:'}
            </span> {prediction === 'up' ? patternDetected.daysUp : prediction === 'down' ? patternDetected.daysDown : patternDetected.timeframe}
          </div>
          {confidence && (
            <div style={{ fontSize: '16px', color: '#1a202c', marginTop: '16px', fontWeight: '700', background: 'rgba(255, 255, 255, 0.8)', padding: '12px 16px', borderRadius: '8px', border: '2px solid rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
              🎯 Confidence Level: {confidence}%
            </div>
          )}
        </div>

        {/* Breakout Timing Section */}
        {breakoutTiming && (
          <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.5)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Clock size={28} />
              <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: '#1a202c' }}>Breakout Timing Prediction</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                <div style={{ fontWeight: '700', color: '#0891b2', fontSize: '14px' }}>Expected Timeframe</div>
                <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '16px' }}>{breakoutTiming.daysRange}</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontWeight: '700', color: '#059669', fontSize: '14px' }}>Earliest Date</div>
                <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '16px' }}>{breakoutTiming.minDate}</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ fontWeight: '700', color: '#dc2626', fontSize: '14px' }}>Latest Date</div>
                <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '16px' }}>{breakoutTiming.maxDate}</div>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <div style={{ fontWeight: '700', color: '#4f46e5', fontSize: '14px' }}>Timing Confidence</div>
                <div style={{ fontWeight: '600', color: '#1a202c', fontSize: '16px' }}>{breakoutTiming.confidence}</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255, 248, 230, 0.8)', borderRadius: '6px', fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              💡 <strong>Note:</strong> Breakout timing is based on pattern analysis and current market momentum. Monitor volume and price action for confirmation.
            </div>
          </div>
        )}

        {/* Other sections with enhanced styling */}
        {recommendation && (
          <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.5)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <DollarSign size={28} />
              <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: '#1a202c' }}>Recommendation</h3>
            </div>
            <p style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '800', color: recommendation.action === 'BUY' ? '#059669' : recommendation.action === 'SELL' ? '#dc2626' : '#4f46e5' }}>
              {recommendation.action === 'BUY' ? '💰 BUY' : recommendation.action === 'SELL' ? '💸 SELL' : '✋ HOLD'}
            </p>
            <p style={{ fontSize: '16px', color: '#2d3748', lineHeight: '1.6', fontWeight: '500' }}>
              {recommendation.reasoning}
            </p>
          </div>
        )}

        {entryExit && (
          <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.5)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Target size={28} />
              <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: '#1a202c' }}>Entry & Exit Strategy</h3>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', color: '#059669' }}>🟢 Entry Point: </span>
              <span style={{ color: '#2d3748', fontWeight: '500' }}>{entryExit.entry}</span>
            </div>
            <div>
              <span style={{ fontWeight: '700', color: '#dc2626' }}>🔴 Exit Strategy: </span>
              <span style={{ color: '#2d3748', fontWeight: '500' }}>{entryExit.exit}</span>
            </div>
          </div>
        )}

        <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.5)', margin: '0 24px 16px', borderRadius: '12px', border: '2px solid rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Calendar size={28} />
            <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: '#1a202c' }}>Time Estimate</h3>
          </div>
          <p style={{ fontSize: '18px', marginBottom: '12px', color: '#2d3748', fontWeight: '600' }}>{timeEstimate}</p>
          <div style={{ fontSize: '16px', color: '#1a202c', marginTop: '16px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.1)', fontWeight: '600' }}>
            <span style={{ fontWeight: '700', color: '#1a202c' }}>📅 Typical pattern duration:</span> {patternDetected.timeframe}
          </div>
        </div>

        <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.5)', margin: '0 24px 24px', borderRadius: '12px', border: '2px solid rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <BarChart size={28} />
            <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 0 16px', color: '#1a202c' }}>Pattern Detected</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '20px', marginBottom: '12px', color: '#2d3748', fontWeight: '700' }}>
                📊 {patternDetected.name.split('-').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </p>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', padding: '8px 12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px', fontWeight: '500' }}>
                💡 Compare the actual chart above with this pattern example below
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(248, 250, 252, 0.8)', borderRadius: '8px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
              <PatternVisualization patternName={patternDetected.name} width={300} height={160} />
              <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', fontWeight: '500' }}>
                📈 Typical {patternDetected.name.split('-').join(' ')} pattern example
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Education Section (included here) */}
      <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '32px', borderRadius: '20px', marginBottom: '32px', border: '2px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontWeight: '700', fontSize: '24px', marginTop: '0', marginBottom: '20px', color: '#1a202c', textAlign: 'center' }}>📚 Pattern Education</h3>
        <h4 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1a202c' }}>Description:</h4>
        <p style={{ marginBottom: '24px', lineHeight: '1.7', fontSize: '16px', color: '#2d3748', fontWeight: '500' }}>{patternDetected.description}</p>
        <div style={{ padding: '24px', border: '2px solid rgba(0, 0, 0, 0.1)', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px' }}>
          <h4 style={{ fontWeight: '700', fontSize: '18px', color: '#1a202c', marginTop: '0', marginBottom: '16px' }}>🔍 What to look for:</h4>
          <ul style={{ marginTop: '0', paddingLeft: '0', listStyle: 'none', fontSize: '15px', color: '#2d3748' }}>
            <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500', color: '#2d3748' }}>
              <span style={{ position: 'absolute', left: '0', color: '#4f46e5', fontWeight: 'bold', fontSize: '16px' }}>→</span>
              Look for clear pattern formation with multiple confirmation points
            </li>
            <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500', color: '#2d3748' }}>
              <span style={{ position: 'absolute', left: '0', color: '#4f46e5', fontWeight: 'bold', fontSize: '16px' }}>→</span>
              Check volume patterns that support the chart pattern
            </li>
            <li style={{ marginBottom: '12px', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500', color: '#2d3748' }}>
              <span style={{ position: 'absolute', left: '0', color: '#4f46e5', fontWeight: 'bold', fontSize: '16px' }}>→</span>
              Confirm breakout direction before making decisions
            </li>
            <li style={{ marginBottom: '0', paddingLeft: '24px', position: 'relative', lineHeight: '1.6', fontWeight: '500', color: '#2d3748' }}>
              <span style={{ position: 'absolute', left: '0', color: '#4f46e5', fontWeight: 'bold', fontSize: '16px' }}>→</span>
              Consider overall market conditions and sentiment
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AnalysisResults;
