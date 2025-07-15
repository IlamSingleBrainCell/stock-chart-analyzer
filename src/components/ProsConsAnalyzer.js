import React, { useEffect } from 'react';
import { useProsConsContext } from '../ProsConsContext';

const ProsConsAnalyzer = ({ stockSymbol }) => {
    const { pros, cons, loading, error, analyzeData } = useProsConsContext();

    useEffect(() => {
        if (stockSymbol) {
            analyzeData(stockSymbol);
        }
    }, [stockSymbol]);

    if (loading) {
        return <div>Loading Pros & Cons...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Pros & Cons for {stockSymbol}</h2>
            <div>
                <h3>Pros</h3>
                <ul>
                    {pros.map((pro, index) => (
                        <li key={`pro-${index}`}>{pro}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Cons</h3>
                <ul>
                    {cons.map((con, index) => (
                        <li key={`con-${index}`}>{con}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProsConsAnalyzer;
