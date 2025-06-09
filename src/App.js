import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, BarChart } from 'lucide-react';
import './App.css'; // Make sure you have this import

// TODO: Replace with your actual backend API endpoint for chart analysis.
const API_ENDPOINT = '/api/analyze-chart'; // Define API_ENDPOINT

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patternDetected, setPatternDetected] = useState(null);
  const [timeEstimate, setTimeEstimate] = useState(null);

  // Common chart patterns with descriptions
  const chartPatterns = {
    'head-and-shoulders': {
      description: 'A bearish reversal pattern with three peaks, the middle being the highest',
      prediction: 'down',
      timeframe: '7-21 days',
      daysDown: '10-25 days',
      daysUp: '0 days',
    },
    'inverse-head-and-shoulders': {
      description: 'A bullish reversal pattern with three troughs, the middle being the lowest',
      prediction: 'up',
      timeframe: '7-21 days',
      daysDown: '0 days',
      daysUp: '14-30 days',
    },
    'double-top': {
      description: 'A bearish reversal pattern showing two distinct peaks at similar price levels',
      prediction: 'down',
      timeframe: '14-28 days',
      daysDown: '14-35 days',
      daysUp: '0 days',
    },
    'double-bottom': {
      description: 'A bullish reversal pattern showing two distinct troughs at similar price levels',
      prediction: 'up',
      timeframe: '14-28 days',
      daysDown: '0 days',
      daysUp: '21-42 days',
    },
    'cup-and-handle': {
      description: 'A bullish continuation pattern resembling a cup followed by a short downward trend',
      prediction: 'up',
      timeframe: '30-60 days',
      daysDown: '0 days',
      daysUp: '30-90 days',
    },
    'ascending-triangle': {
      description: 'A bullish continuation pattern with a flat upper resistance and rising lower support',
      prediction: 'up',
      timeframe: '21-35 days',
      daysDown: '0 days',
      daysUp: '14-45 days',
    },
    'descending-triangle': {
      description: 'A bearish continuation pattern with a flat lower support and falling upper resistance',
      prediction: 'down',
      timeframe: '21-35 days',
      daysDown: '21-42 days',
      daysUp: '0 days',
    },
    'flag': {
      description: 'A short-term consolidation pattern that typically continues the prior trend',
      prediction: 'continuation',
      timeframe: '7-14 days',
      daysDown: '5-10 days',
      daysUp: '5-14 days',
    },
    'wedge': {
      description: 'A pattern formed by converging trendlines, can be bullish or bearish depending on direction',
      prediction: 'varies',
      timeframe: '14-28 days',
      daysDown: '7-21 days',
      daysUp: '7-21 days',
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeChart = () => {
    setLoading(true);

    // In a real application, you would prepare the image data here.
    // For example, if uploadedImage is a File object:
    // const formData = new FormData();
    // formData.append('chartImage', uploadedImage); // 'uploadedImage' should be the File object itself
    //
    // Then, you would use this formData in the fetch call:
    // fetch(API_ENDPOINT, {
    //   method: 'POST',
    //   body: formData,
    // })
    // .then(response => response.json())
    // .then(data => { ... })
    // .catch(error => { ... })
    // .finally(() => { setLoading(false); });

    // MOCKED API CALL FOR DEMONSTRATION:
    // This simulates a network request to the API_ENDPOINT.
    // It randomly selects a chart pattern after a short delay.
    // Replace this with a real fetch call to your backend service.
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const patternKeys = Object.keys(chartPatterns);
          const randomPatternKey = patternKeys[Math.floor(Math.random() * patternKeys.length)];
          const selectedPattern = chartPatterns[randomPatternKey];

          resolve({
            name: randomPatternKey,
            ...selectedPattern
          });
        } catch (error) {
          reject(error);
        }
      }, 1000 + Math.random() * 1000); // Simulate 1-2 second delay
    })
    .then(selectedPatternData => {
      setPatternDetected(selectedPatternData);
      setPrediction(selectedPatternData.prediction);

      let timeInfo = '';
      if (selectedPatternData.prediction === 'up') {
        timeInfo = `Expected to rise for ${selectedPatternData.daysUp}`;
      } else if (selectedPatternData.prediction === 'down') {
        timeInfo = `Expected to decline for ${selectedPatternData.daysDown}`;
      } else if (selectedPatternData.prediction === 'continuation') {
        if (Math.random() > 0.5) {
          timeInfo = `Current uptrend likely to continue for ${selectedPatternData.daysUp}`;
        } else {
          timeInfo = `Current downtrend likely to continue for ${selectedPatternData.daysDown}`;
        }
      } else { // 'varies'
        if (Math.random() > 0.5) {
          timeInfo = `Likely to rise for ${selectedPatternData.daysUp} after breaking out`;
        } else {
          timeInfo = `Likely to fall for ${selectedPatternData.daysDown} after breaking down`;
        }
      }
      setTimeEstimate(timeInfo);
    })
    .catch(error => {
      console.error('Error analyzing chart:', error);
      // Optionally, set an error state here to display to the user
      // For example: setError('Failed to analyze chart. Please try again.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="analyzer-container">
      {/* Top Banner Ad */}
      <div className="ad-banner">
        <p>Advertisement Placeholder (728x90)</p>
      </div>
      
      <h1 className="app-title">Stock Chart Pattern Analyzer</h1>
      
      <div className="disclaimer">
        <div className="disclaimer-icon">
          <AlertTriangle size={20} />
        </div>
        <div className="disclaimer-text">
          <p><strong>Disclaimer:</strong> This tool is for educational purposes only. Stock predictions are not guaranteed and should not be used as investment advice.</p>
        </div>
      </div>
      
      <div className="upload-section">
        <label className="upload-label">
          Upload Stock Chart Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
      </div>
      
      {uploadedImage && (
        <div className="image-preview-section">
          <div className="image-container">
            <img 
              src={uploadedImage} 
              alt="Uploaded stock chart" 
              className="preview-image" 
            />
          </div>
          <button
            onClick={analyzeChart}
            disabled={loading}
            className="analyze-button"
          >
            {loading ? 'Analyzing...' : 'Analyze Chart Pattern'}
          </button>
        </div>
      )}
      
      {prediction && (
        <div className="results-container">
          <h2 className="results-title">Analysis Results</h2>
          
          <div className="analysis-summary-card">
            {/* Prediction Section */}
            <div className={`summary-section prediction-section ${
              prediction === 'up' ? 'bg-up' :
              prediction === 'down' ? 'bg-down' :
              'bg-neutral-varies'
            }`}>
              <div className="summary-header">
                {prediction === 'up' ? (
                  <TrendingUp size={24} className="icon-up" />
                ) : prediction === 'down' ? (
                  <TrendingDown size={24} className="icon-down" />
                ) : (
                  <BarChart size={24} className="icon-neutral" />
                )}
                <h3 className="summary-title">Prediction</h3>
              </div>
              <p className={`summary-text prediction-text ${
                prediction === 'up' ? 'text-up' : 
                prediction === 'down' ? 'text-down' : 
                'text-neutral'
              }`}>
                {prediction === 'up' ? 'Likely to go UP' : 
                prediction === 'down' ? 'Likely to go DOWN' : 
                'Continuation of current trend'}
              </p>
              {patternDetected && prediction === 'up' && (
                <div className="summary-detail duration-info">
                  <span className="duration-label">Upward duration:</span> {patternDetected.daysUp}
                </div>
              )}
              {patternDetected && prediction === 'down' && (
                <div className="summary-detail duration-info">
                  <span className="duration-label">Downward duration:</span> {patternDetected.daysDown}
                </div>
              )}
              <p className="summary-detail confidence-score">Confidence: N/A</p>
            </div>

            {/* Time Estimate Section */}
            <div className="summary-section time-estimate-section">
              <div className="summary-header">
                <Calendar size={24} className="icon-time" />
                <h3 className="summary-title">Time Estimate</h3>
              </div>
              <p className="summary-text time-text">{timeEstimate}</p>
              {patternDetected && (
                <div className="summary-detail duration-info">
                  <span className="duration-label">Typical pattern duration:</span> {patternDetected.timeframe}
                </div>
              )}
            </div>

            {/* Detected Pattern Section */}
            <div className="summary-section pattern-section">
              <div className="summary-header">
                <BarChart size={24} className="icon-pattern" />
                <h3 className="summary-title">Pattern Detected</h3>
              </div>
              <p className="summary-text pattern-text">
                {patternDetected?.name.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </p>
            </div>
          </div>
          
          {patternDetected && (
            <div className="pattern-description">
              <h3>Pattern Description:</h3>
              <p>{patternDetected.description}</p>
              <div className="pattern-details pattern-specifics-box">
                <h4>What to look for:</h4>
                <ul className="pattern-list">
                  {patternDetected.name === 'head-and-shoulders' && (
                    <>
                      <li>Three peaks with the middle peak higher than the others</li>
                      <li>A "neckline" connecting the lowest points between the peaks</li>
                      <li>Volume typically decreases with each peak</li>
                    </>
                  )}
                  {patternDetected.name === 'double-bottom' && (
                    <>
                      <li>Two distinct lows at approximately the same price level</li>
                      <li>A moderate peak between the two lows</li>
                      <li>Volume is usually higher on the second low</li>
                    </>
                  )}
                  {patternDetected.name === 'cup-and-handle' && (
                    <>
                      <li>A rounded "cup" formation followed by a smaller "handle" pullback</li>
                      <li>The cup forms a "U" shape rather than a sharp "V"</li>
                      <li>The handle should retrace less than 1/3 of the cup's advance</li>
                    </>
                  )}
                  {patternDetected.name === 'ascending-triangle' && (
                    <>
                      <li>A flat upper resistance line with at least two touches</li>
                      <li>An upward sloping lower support line</li>
                      <li>Volume typically decreases as the pattern forms</li>
                    </>
                  )}
                  {patternDetected.name !== 'head-and-shoulders' && 
                   patternDetected.name !== 'double-bottom' && 
                   patternDetected.name !== 'cup-and-handle' && 
                   patternDetected.name !== 'ascending-triangle' && (
                    <>
                      <li>Look for clear pattern formation with multiple confirmation points</li>
                      <li>Check volume patterns that support the chart pattern</li>
                      <li>Confirm breakout direction before making decisions</li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* In-content ad */}
              <div className="ad-content">
                <p>Advertisement Placeholder (468x60)</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Side Ad - Square */}
      <div className="bottom-section">
        <div className="note-section">
          <p><strong>Important Note:</strong> This application does not provide financial advice. Chart pattern recognition is subjective and past patterns do not guarantee future results. Always conduct your own research before making investment decisions.</p>
        </div>
        <div className="ad-square">
          <p>Advertisement Placeholder (300x250)</p>
        </div>
      </div>
      
      {/* Bottom Banner Ad */}
      <div className="ad-banner">
        <p>Advertisement Placeholder (728x90)</p>
      </div>
      
      {/* Footer with Attribution */}
      <div className="footer">
        <p>Developed by <span className="developer">Ilam</span> &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

export default App;