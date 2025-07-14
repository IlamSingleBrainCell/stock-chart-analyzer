import React from 'react';
import { X } from 'lucide-react';
import PatternVisualizationChart from './PatternVisualizationChart';

const PatternDetectionModal = ({ isOpen, onClose, pattern, stockData, theme }) => {
    if (!isOpen || !pattern) return null;

    const getPatternCalculationExplanation = (patternName) => {
        switch (patternName) {
            case 'ascending-triangle':
                return (
                    <>
                        <p>The Ascending Triangle is identified using a deterministic, rule-based algorithm:</p>
                        <ol>
                            <li><strong>Extremum Detection:</strong> A zigzag or extremum detection algorithm is used to extract significant swing highs and lows from the price data.</li>
                            <li><strong>Higher Lows:</strong> A series of higher lows is identified, forming a rising support trendline.</li>
                            <li><strong>Flat Resistance:</strong> A flat or nearly flat resistance level is detected at the top, connecting the swing highs.</li>
                            <li><strong>Confirmation:</strong> The pattern is confirmed by ensuring at least two touchpoints on both the support (rising) and resistance (flat) lines.</li>
                            <li><strong>Validation:</strong> The pattern is validated using strict geometric rules, with no AI or subjective logic.</li>
                        </ol>
                    </>
                );
            // Add explanations for other patterns here
            default:
                return <p>The detection logic for this pattern is based on a set of predefined geometric rules and price-action analysis.</p>;
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={{ ...styles.modal, backgroundColor: 'var(--card-background)', color: 'var(--text-color)' }}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{pattern.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
                    <button onClick={onClose} style={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>
                <div style={styles.content}>
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>How This Pattern Is Calculated</h3>
                        <div style={styles.sectionContent}>
                            {getPatternCalculationExplanation(pattern.name)}
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Detected Pattern Visualization</h3>
                        <div style={styles.sectionContent}>
                            <PatternVisualizationChart
                                stockData={stockData}
                                detectedPoints={pattern.detectedPoints}
                                theme={theme}
                            />
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Pattern Detection Accuracy</h3>
                        <div style={styles.sectionContent}>
                            <div style={styles.accuracyBadge}>
                                Pattern Match Accuracy: {pattern.accuracy ? pattern.accuracy.toFixed(0) : 'N/A'}%
                            </div>
                            <p>This score is computed based on the similarity of the detected points to the ideal pattern, the strictness of rule matching, and backtest validation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--card-border)',
        paddingBottom: '16px',
        marginBottom: '16px',
    },
    title: {
        margin: 0,
        fontSize: '24px',
        fontWeight: '700',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-color)',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    section: {
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: 'var(--background-color)',
        border: '1px solid var(--card-border)',
    },
    sectionTitle: {
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600',
    },
    sectionContent: {
        fontSize: '14px',
        lineHeight: '1.6',
    },
    accuracyBadge: {
        display: 'inline-block',
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: 'var(--primary-accent)',
        color: 'var(--button-primary-text)',
        fontWeight: '600',
        marginBottom: '12px',
    },
};

export default PatternDetectionModal;
