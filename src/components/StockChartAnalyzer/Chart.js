import React from 'react';

const Chart = ({ uploadedImage, stockData, selectedTimeRange }) => {
    return (
        <div className="chart-section">
            {uploadedImage && (
                <div className="image-preview-section">
                    <div className="image-container">
                        <img src={uploadedImage} alt="Stock chart" className="preview-image" />
                    </div>
                    {stockData && (
                        <div className="stock-info">
                            <div className="stock-info-header">
                                📊 Stock Information ({selectedTimeRange === '1y' ? '1 Year' : selectedTimeRange === '5y' ? '5 Years' : selectedTimeRange === '10y' ? '10 Years' : '3 Months'} Data):
                            </div>
                            <div><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div>
                            <div>
                                <strong>Current Price:</strong> {stockData.currency === 'INR' || stockData.symbol.includes('.NS') ? '₹' : '$'}
                                {stockData.currentPrice?.toFixed(2)} {stockData.currency} |
                                <strong> Data Points:</strong> {stockData.prices.length} {selectedTimeRange === '1y' ? 'weeks' : (selectedTimeRange === '5y' || selectedTimeRange === '10y') ? 'months' : 'days'}
                            </div>
                            {stockData.isMockData && <div className="mock-data-warning">⚠️ Using demo data - API temporarily unavailable</div>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chart;
