import React, { useState, useMemo } from 'react';
import { X, Zap } from 'lucide-react';

const StockFilterModal = ({ isOpen, onClose, stockDatabase, onApplyFilter }) => {
    const [market, setMarket] = useState('All');
    const [potential, setPotential] = useState(false);

    const handleApply = () => {
        onApplyFilter({ market, potential });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button onClick={onClose} style={styles.closeButton}><X size={24} /></button>
                <h2 style={styles.title}>Stock Filter</h2>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Market</label>
                    <select value={market} onChange={(e) => setMarket(e.target.value)} style={styles.select}>
                        <option value="All">All</option>
                        <option value="US">US</option>
                        <option value="India">India</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        <input
                            type="checkbox"
                            checked={potential}
                            onChange={(e) => setPotential(e.target.checked)}
                            style={styles.checkbox}
                        />
                        Potential to go up (1-3 months)
                    </label>
                </div>
                <button onClick={handleApply} style={styles.applyButton}>
                    <Zap size={18} style={{ marginRight: '8px' }} />
                    Apply Filter
                </button>
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
        background: 'var(--card-background)',
        padding: '24px',
        borderRadius: '12px',
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        border: '1px solid var(--card-border)',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-color-lighter)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '24px',
        color: 'var(--text-color)',
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: 'var(--text-color-light)',
        fontSize: '16px',
        fontWeight: '500',
    },
    select: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid var(--input-border)',
        background: 'var(--background-color)',
        color: 'var(--text-color)',
        fontSize: '16px',
    },
    checkbox: {
        marginRight: '12px',
    },
    applyButton: {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)',
        color: 'var(--button-primary-text)',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
};

export default StockFilterModal;
