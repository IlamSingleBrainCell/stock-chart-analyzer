import { useState } from 'react';
import { fetchFinancialDataForProsCons } from '../services/financialService';
import { fetchStockNews } from '../services/newsService';

export const useProsCons = () => {
    const [pros, setPros] = useState([]);
    const [cons, setCons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeData = async (symbol) => {
        if (!symbol) return;

        setLoading(true);
        setError(null);
        setPros([]);
        setCons([]);

        try {
            const [financials, news] = await Promise.all([
                fetchFinancialDataForProsCons(symbol),
                fetchStockNews(symbol),
            ]);

            let currentPros = [];
            let currentCons = [];

            if (financials.error) {
                currentCons.push(`Could not retrieve complete financial data: ${financials.error}`);
            } else {
                // Pro: Profitability
                if (financials.profitCAGR5Y && financials.profitCAGR5Y > 10) {
                    currentPros.push(`Strong Profit Growth: 5-year average profit growth is ${financials.profitCAGR5Y.toFixed(2)}%.`);
                } else if (financials.profitCAGR5Y && financials.profitCAGR5Y > 0) {
                    currentPros.push(`Positive Profit Growth: Company has been profitable over the last 5 years.`);
                }

                // Con: High Debt
                if (financials.currentDebt && financials.currentDebt > 1e9) { // Example threshold: $1 billion
                    currentCons.push(`Significant Debt Load: Total debt is over $${(financials.currentDebt / 1e9).toFixed(2)} billion.`);
                }

                // Pro: Revenue Growth
                if (financials.salesHistory10Y && financials.salesHistory10Y.length > 1) {
                    const recentRevenue = financials.salesHistory10Y[financials.salesHistory10Y.length - 1].revenue;
                    const olderRevenue = financials.salesHistory10Y[0].revenue;
                    if (recentRevenue > olderRevenue) {
                        currentPros.push(`Consistent Revenue Growth over the last decade.`);
                    }
                }
            }

            if (news && news.length > 0) {
                const positiveKeywords = ['upgrades', 'beats estimates', 'new product', 'expansion'];
                const negativeKeywords = ['downgrades', 'misses estimates', 'investigation', 'lawsuit'];

                news.forEach(article => {
                    const title = article.title.toLowerCase();
                    if (positiveKeywords.some(kw => title.includes(kw))) {
                        currentPros.push(`Positive News Sentiment: Recent headlines suggest positive developments.`);
                    }
                    if (negativeKeywords.some(kw => title.includes(kw))) {
                        currentCons.push(`Negative News Sentiment: Recent headlines raise concerns.`);
                    }
                });
            }

            setPros(currentPros);
            setCons(currentCons);
        } catch (e) {
            setError(e.message);
            console.error("Pros/Cons analysis error:", e);
        } finally {
            setLoading(false);
        }
    };

    return { pros, cons, loading, error, analyzeData };
};
