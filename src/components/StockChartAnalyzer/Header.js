import React from 'react';

const Header = () => {
    return (
        <div className="app-header">
            <h1 className="app-title">Stock Chart Pattern Analyzer</h1>
            <p style={{ color: 'var(--text-color-lighter)', fontSize: '16px', margin: '0' }}>
                Get data-driven analysis from live stock charts (3-month data) or explore patterns with your own images.
                <br />
                <span style={{ fontSize: '14px', color: 'var(--text-color-muted)' }}>
                    📊 Supporting 1000+ stocks from US & Indian markets with Key Level detection.
                </span>
            </p>
        </div>
    );
};

export default Header;
