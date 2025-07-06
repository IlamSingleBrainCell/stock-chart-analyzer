import React from 'react';
import { RefreshCw } from 'lucide-react';
import FlagIcon from './FlagIcon'; // Import FlagIcon directly

const ChartPreview = ({
  uploadedImage,
  stockData,
  analyzeChart,
  loading
}) => {
  if (!uploadedImage) {
    return null; // Don't render anything if there's no image
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ width: '100%', height: '400px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <img
          src={uploadedImage}
          alt="Stock chart"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }}
        />
      </div>

      {stockData && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px', marginBottom: '16px', fontSize: '15px', color: '#065f46' }}>
          <div style={{ fontWeight: '700', marginBottom: '8px' }}>📊 Stock Information (3-Month Data):</div>
          <div><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div>
          <div>
            <strong>Current Price:</strong> {stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}
            {stockData.currentPrice?.toFixed(2)} {stockData.currency} | <strong>Data Points:</strong> {stockData.prices.length} days
          </div>
          {stockData.isMockData && <div style={{ color: '#f59e0b', fontStyle: 'italic', marginTop: '4px' }}>⚠️ Using demo data - API temporarily unavailable</div>}
        </div>
      )}

      <button
        onClick={analyzeChart}
        disabled={loading} // Disabled if any loading is happening (either fetching new stock or analyzing)
        style={{
          width: '100%',
          background: loading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          border: 'none',
          padding: '18px 24px',
          fontSize: '18px',
          fontWeight: '600',
          borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          transition: 'all 0.3s',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(99, 102, 241, 0.4)'
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Analyzing Pattern...
          </span>
        ) : (
          '🔍 Analyze Chart Pattern'
        )}
      </button>
    </div>
  );
};

export default ChartPreview;
