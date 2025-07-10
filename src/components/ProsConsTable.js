import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const ProsConsTable = ({ financialData }) => {
  const { theme } = useContext(ThemeContext);

  if (!financialData) {
    return null; // Or a loading indicator if financialDataLoading is also passed
  }

  if (financialData.error) {
    return (
      <div style={{
        padding: '15px',
        margin: '20px 0',
        border: `1px solid ${theme === 'dark' ? '#7f1d1d' : '#fecaca'}`,
        backgroundColor: theme === 'dark' ? '#450a0a' : '#fee2e2',
        color: theme === 'dark' ? '#fca5a5' : '#b91c1c',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>Could not load fundamental data: {financialData.error}</p>
      </div>
    );
  }

  const formatNumber = (num, isCurrency = false, isPercent = false) => {
    if (num === null || num === undefined || num === 'N/A' || num === 'Error fetching') return num;
    if (typeof num === 'string' && !isPercent) return num; // Already formatted or textual like 'N/A'

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

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '14px',
    backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff', // card-background
    color: theme === 'dark' ? '#e2e8f0' : '#2d3748', // text-color
    borderRadius: '8px',
    overflow: 'hidden', // To make border-radius work on table
    boxShadow: `0 4px 12px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
  };

  const thStyle = {
    borderBottom: `2px solid ${theme === 'dark' ? '#4a5568' : '#e2e8f0'}`, // separator-color
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: theme === 'dark' ? '#374151' : '#f8fafc', // Slightly different header
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const tdStyle = {
    borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}`, // separator-color
    padding: '10px 15px',
  };

  const metricNameStyle = {
    fontWeight: '500',
    color: theme === 'dark' ? '#a0aec0' : '#4a5568', // text-color-light
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
    <div style={{ marginTop: '25px', marginBottom: '25px' }}>
      <h3 style={{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '700',
        color: theme === 'dark' ? '#cbd5e1' : '#334155',
        marginBottom: '15px'
      }}>
        Key Financial Metrics
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Metric</th>
            <th style={thStyle}>Value</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? (theme === 'dark' ? '#2d3748' : '#f9fafb') : (theme === 'dark' ? '#374151' : '#ffffff') }}>
              <td style={{...tdStyle, ...metricNameStyle}}>{row.metric}</td>
              <td style={tdStyle}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{fontSize: '12px', color: theme === 'dark' ? '#a0aec0' : '#64748b', textAlign: 'center', marginTop: '10px'}}>
        Note: Financial data is for informational purposes. "Current Debt" typically refers to total debt from the latest available report. CAGR is based on available annual net income.
      </p>
    </div>
  );
};

export default ProsConsTable;
