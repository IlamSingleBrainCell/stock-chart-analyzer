import React from 'react';
import './AccuracyTable.css';

import { calculateAccuracy } from '../utils/analysis';

const AccuracyTable = ({ onClose }) => {
  const accuracyData = calculateAccuracy();
  return (
    <div className="accuracy-modal-overlay">
      <div className="accuracy-modal-content">
        <h2 className="accuracy-modal-title">Pattern Recognition Accuracy</h2>
        <p className="accuracy-modal-description">
          The following table shows the historical accuracy of our pattern recognition algorithms based on backtesting against historical data.
        </p>
        <table className="accuracy-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Accuracy</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(accuracyData).map(([feature, accuracy]) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td>{accuracy.toFixed(2)}%</td>
                <td>
                  <a href="/accuracy_calculation.html" target="_blank" rel="noopener noreferrer">
                    How is this calculated?
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="accuracy-modal-close-btn">Close</button>
      </div>
    </div>
  );
};

export default AccuracyTable;
