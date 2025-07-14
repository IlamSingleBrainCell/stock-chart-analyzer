import React from 'react';
import './AccuracyDetailsModal.css';

const AccuracyDetailsModal = ({ onClose }) => {
  return (
    <div className="accuracy-details-modal-overlay">
      <div className="accuracy-details-modal-content">
        <h2 className="accuracy-details-modal-title">How We Calculate Accuracy</h2>
        <p>The accuracy of our pattern recognition algorithms is determined through a rigorous backtesting process. We use historical stock data to test our algorithms and verify their predictions.</p>
        <h2>Backtesting Process</h2>
        <ol>
            <li>We feed the algorithm historical price data for a given stock.</li>
            <li>The algorithm identifies a pattern and makes a prediction (e.g., "price will go up").</li>
            <li>We then look at what actually happened to the stock's price in the days following the prediction.</li>
            <li>If the actual price movement matches the prediction, we count it as a "correct" prediction.</li>
        </ol>
        <h2>Accuracy Score</h2>
        <p>The accuracy score for each pattern is the percentage of correct predictions out of the total number of predictions made for that pattern.</p>
        <p>For example, if the "Head and Shoulders" pattern was identified 100 times, and the subsequent price movement matched the prediction 85 times, the accuracy score would be 85%.</p>
        <h2>Continuous Improvement</h2>
        <p>We are constantly working to improve the accuracy of our algorithms. This involves refining the pattern detection logic, incorporating new data sources, and using machine learning to optimize our models.</p>
        <button onClick={onClose} className="accuracy-details-modal-close-btn">Close</button>
      </div>
    </div>
  );
};

export default AccuracyDetailsModal;
