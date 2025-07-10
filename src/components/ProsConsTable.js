import React from 'react';
// import { ThemeContext } from '../ThemeContext'; // No longer needed
// import { useContext } from 'react'; // No longer needed

const ProsConsTable = ({ financialData }) => {
  // const { theme } = useContext(ThemeContext); // Theme context is not used as styles are class-based

  if (!financialData) {
    return null;
  }

  if (financialData.error) {
    // Use a consistent error display, perhaps a new .error-card class
    return (
      <div className="data-card" style={{ background: 'var(--danger-background)', color: 'var(--danger-color)', textAlign: 'center' }}>
        <p>Could not load fundamental data: {financialData.error}</p>
      </div>
    );
  }

  const formatNumber = (num, isCurrency = false, isPercent = false) => {
    if (num === null || num === undefined || num === 'N/A' || num === 'Error fetching') return num;
    if (typeof num === 'string' && !isPercent) return num;

    let number = parseFloat(num);
    if (isNaN(number)) return 'N/A';

    if (isCurrency) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number);
    }
    if (isPercent) {
      return `${number.toFixed(2)}%`;
    }
    return new Intl.NumberFormat('en-US').format(number);
  };

  // Prepare sales history display
  let salesDisplay = 'N/A';
  if (financialData.salesHistory10Y && financialData.salesHistory10Y.length > 0 && financialData.salesHistory10Y[0].revenue !== 'Error fetching') {
    const latestSale = financialData.salesHistory10Y[financialData.salesHistory10Y.length - 1];
    const oldestSale = financialData.salesHistory10Y[0];
    if (latestSale && oldestSale) {
        salesDisplay = `Latest (${latestSale.year}): ${formatNumber(latestSale.revenue, true)} | Oldest (${oldestSale.year}): ${formatNumber(oldestSale.revenue, true)}`;
    } else if (latestSale) {
        salesDisplay = `Latest (${latestSale.year}): ${formatNumber(latestSale.revenue, true)}`;
    }
  } else if (financialData.salesHistory10Y && financialData.salesHistory10Y.length > 0 && financialData.salesHistory10Y[0].revenue === 'Error fetching') {
    salesDisplay = 'Error fetching';
  }


  const dataRows = [
    { metric: 'Current Debt', value: formatNumber(financialData.currentDebt, true) },
    { metric: 'Next Quarter Expectation', value: financialData.nextQuarterExpectation || 'N/A' },
    { metric: 'Profit Growth (5Y CAGR)', value: financialData.profitCAGR5Y !== null ? formatNumber(financialData.profitCAGR5Y, false, true) : 'N/A' },
    { metric: 'Company Sales (10Y Snapshot)', value: salesDisplay },
  ];

  return (
    <div className="data-card semrush-table-container"> {/* Wrap in data-card for consistency */}
      <h3 className="financial-metrics-title data-card-title"> {/* Use consistent title class */}
        Key Financial Metrics
      </h3>
      <table className="semrush-table">
        <thead>
          <tr>
            <th>Metric</th> {/* th styles will be applied from App.css */}
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, index) => (
            // Alternating row colors can be done with :nth-child(even) in CSS if desired,
            // or keep inline style if complex logic based on theme is still needed.
            // For now, removing inline background style to rely on CSS.
            <tr key={index}>
              <td className="table-metric-name">{row.metric}</td> {/* td styles from App.css */}
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="financial-metrics-note">
        Note: Financial data is for informational purposes. "Current Debt" typically refers to total debt from the latest available report. CAGR is based on available annual net income.
      </p>
    </div>
  );
};

export default ProsConsTable;
