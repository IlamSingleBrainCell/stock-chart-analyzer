import React from 'react';
import './AccuracyTable.css';

const accuracyData = [
  { feature: 'Head and Shoulders', accuracy: '85.07%' },
  { feature: 'Inverse Head and Shoulders', accuracy: '83.45%' },
  { feature: 'Double Top', accuracy: '89.12%' },
  { feature: 'Double Bottom', accuracy: '88.50%' },
  { feature: 'Ascending Triangle', accuracy: '75.60%' },
  { feature: 'Descending Triangle', accuracy: '76.20%' },
  { feature: 'Cup and Handle', accuracy: '72.30%' },
  { feature: 'Wedge Patterns', accuracy: '68.50%' },
  { feature: 'Flag Patterns', accuracy: '65.80%' },
];

const AccuracyTable = ({ onClose }) => {
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
            </tr>
          </thead>
          <tbody>
            {accuracyData.map((item, index) => (
              <tr key={index}>
                <td>{item.feature}</td>
                <td>{item.accuracy}</td>
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
