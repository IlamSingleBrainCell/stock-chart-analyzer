import React, { useState } from 'react';
import './AccuracyTable.css';
import AccuracyDetailsModal from './AccuracyDetailsModal';
import { calculateAccuracy } from '../utils/analysis';

const AccuracyTable = () => {
  const [showModal, setShowModal] = useState(false);
  const accuracyData = calculateAccuracy();

  return (
    <div className="accuracy-table-container">
      <h2 className="accuracy-table-title">Pattern Recognition Accuracy</h2>
      <p className="accuracy-table-description">
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
                <button onClick={() => setShowModal(true)} className="details-link">
                  How is this calculated?
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && <AccuracyDetailsModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AccuracyTable;
