import React from 'react';

// Removed ThemeContext as styles will use CSS variables

const ProsConsTable = ({ financialData }) => {
  // No need for theme context here anymore

  if (!financialData) {
    return null;
  }

  if (financialData.error) {
    return (
      <div style={{
        padding: 'var(--element-gap, 15px)', // Use CSS var with fallback
        margin: 'var(--section-gap, 20px) 0',
        border: '1px solid var(--danger-border)',
        backgroundColor: 'var(--danger-background)',
        color: 'var(--danger-color)',
        borderRadius: 'var(--app-border-radius-small, 8px)',
        textAlign: 'center'
      }}>
        <p style={{margin: 0}}>Could not load fundamental data: {financialData.error}</p>
      </div>
    );
  }

  const formatNumber = (num, isCurrency = false, isPercent = false) => {
    if (num === null || num === undefined || num === 'N/A' || num === 'Error fetching') return num;
    if (typeof num === 'string' && !isPercent) return num;

    let number = parseFloat(num);
    if (isNaN(number)) return 'N/A';

    if (isCurrency) {
      // Assuming USD for now, could be made dynamic if stockData.currency is available
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number);
    }
    if (isPercent) {
      return `${number.toFixed(2)}%`;
    }
    return new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2}).format(number);
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 'var(--element-gap, 15px)',
    fontSize: 'clamp(0.875rem, 2vw, 0.95rem)', // Responsive font size
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    borderRadius: 'var(--app-border-radius-small, 8px)',
    overflow: 'hidden',
    boxShadow: 'var(--card-shadow)'
  };

  const thStyle = {
    borderBottom: '2px solid var(--separator-color)',
    padding: '10px 12px', // Slightly reduced padding
    textAlign: 'left',
    backgroundColor: 'var(--background-color)', // Use a subtle bg for header
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: 'clamp(0.8rem, 1.8vw, 0.875rem)',
  };

  const tdStyle = {
    borderBottom: '1px solid var(--separator-color)',
    padding: '10px 12px',
  };

  const metricNameStyle = {
    fontWeight: '500',
    color: 'var(--text-color-light)',
  };

  const evenRowBg = 'var(--background-color)'; // Or a specific --table-row-even-bg if defined
  const oddRowBg = 'var(--card-background)';   // Or a specific --table-row-odd-bg if defined


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
    <div style={{ marginTop: 'var(--section-gap, 25px)', marginBottom: 'var(--section-gap, 25px)', overflowX: 'auto' }}>
      <h3 style={{
        textAlign: 'center',
        fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', // Responsive title
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
