import { FMP_API_KEY, FMP_BASE_URL } from '../constants';
import { calculateCAGR } from '../utils/helpers';

export const fetchFinancialDataForProsCons = async (symbol) => {
    if (!symbol || FMP_API_KEY === "YOUR_FMP_API_KEY") {
      console.warn("FMP API key not configured or symbol missing. Financial data fetch skipped.");
      return { error: "API key not configured or symbol missing." };
    }

    let fetchedProsConsData = {
      currentDebt: 'N/A',
      nextQuarterExpectation: 'N/A',
      profitCAGR5Y: null, // Will be number or null
      salesHistory10Y: [],
      error: null
    };

    try {
      // 1. Fetch Balance Sheet (latest annual for current debt)
      const balanceSheetUrl = `${FMP_BASE_URL}/balance-sheet-statement/${symbol}?period=annual&limit=1&apikey=${FMP_API_KEY}`;
      const bsResponse = await fetch(balanceSheetUrl);
      if (!bsResponse.ok) {
        console.warn(`Pros/Cons: Failed to fetch balance sheet for ${symbol}. Status: ${bsResponse.status}`);
         fetchedProsConsData.currentDebt = 'Error fetching';
      } else {
        const bsData = await bsResponse.json();
        if (bsData && bsData.length > 0) {
          const latestBs = bsData[0];
          fetchedProsConsData.currentDebt = latestBs.totalDebt !== undefined ? latestBs.totalDebt : (parseFloat(latestBs.shortTermDebt || 0) + parseFloat(latestBs.longTermDebt || 0));
        } else {
          fetchedProsConsData.currentDebt = 'Not Available';
        }
      }

      // 2. Fetch Analyst Estimates (for next quarter expectation)
      const estimatesUrl = `${FMP_BASE_URL}/analyst-estimates/${symbol}?apikey=${FMP_API_KEY}`;
      const estResponse = await fetch(estimatesUrl);
      if (!estResponse.ok) {
        console.warn(`Pros/Cons: Failed to fetch analyst estimates for ${symbol}. Status: ${estResponse.status}`);
        fetchedProsConsData.nextQuarterExpectation = 'Error fetching';
      } else {
        const estData = await estResponse.json();
        if (estData && estData.length > 0) {
          // Find the most recent estimate that has a future date for earnings release
          const futureEstimates = estData.filter(e => e.date && new Date(e.date) > new Date() && e.estimatedEpsAvg !== null);
          let targetEstimate = null;
          if (futureEstimates.length > 0) {
            // Sort by date to get the soonest future estimate
            futureEstimates.sort((a,b) => new Date(a.date) - new Date(b.date));
            targetEstimate = futureEstimates[0];
          } else {
            // Fallback: find the most recent estimate overall if no future ones
            estData.sort((a,b) => new Date(b.date) - new Date(a.date)); // most recent first
            targetEstimate = estData[0];
          }

          if (targetEstimate) {
            fetchedProsConsData.nextQuarterExpectation = `Est. EPS: ${targetEstimate.estimatedEpsAvg || 'N/A'} (for period ending ${targetEstimate.date || 'N/A'})`;
          } else {
            fetchedProsConsData.nextQuarterExpectation = 'Not Available';
          }
        } else {
          fetchedProsConsData.nextQuarterExpectation = 'Not Available';
        }
      }

      // 3. Fetch Annual Income Statements (for Sales and Profit CAGR)
      const incomeStatementUrl = `${FMP_BASE_URL}/income-statement/${symbol}?period=annual&limit=10&apikey=${FMP_API_KEY}`;
      const isResponse = await fetch(incomeStatementUrl);
      if (!isResponse.ok) {
         console.warn(`Pros/Cons: Failed to fetch income statements for ${symbol}. Status: ${isResponse.status}`);
         fetchedProsConsData.salesHistory10Y = [{ year: 'Error', revenue: 'Error fetching'}];
         fetchedProsConsData.profitCAGR5Y = null; // Error state
      } else {
        const isData = await isResponse.json();
        if (isData && isData.length > 0) {
          fetchedProsConsData.salesHistory10Y = isData.slice(0, 10).map(report => ({
            year: new Date(report.date).getFullYear(),
            revenue: report.revenue
          })).reverse();

          if (isData.length >= 2) {
              const relevantNetIncomes = isData.slice(0, 6).map(report => parseFloat(report.netIncome)).filter(ni => !isNaN(ni) && ni !== null);
              if (relevantNetIncomes.length >= 2) {
                  const reversedIncomes = [...relevantNetIncomes].reverse();
                  const startValue = reversedIncomes[0];
                  const endValue = reversedIncomes[reversedIncomes.length - 1];
                  const years = reversedIncomes.length - 1;
                  if (years > 0 && startValue !== null && endValue !== null && startValue !== 0) {
                      fetchedProsConsData.profitCAGR5Y = calculateCAGR(endValue, startValue, years);
                  } else {
                    fetchedProsConsData.profitCAGR5Y = null; // Or 'N/A' if prefer string
                  }
              } else {
                fetchedProsConsData.profitCAGR5Y = null;
              }
          } else {
             fetchedProsConsData.profitCAGR5Y = null;
          }
        } else {
            fetchedProsConsData.salesHistory10Y = [{year: 'N/A', revenue: 'Not Available'}];
            fetchedProsConsData.profitCAGR5Y = null;
        }
      }
    } catch (e) {
      console.error("Error in fetchFinancialDataForProsCons:", e);
      fetchedProsConsData.error = e.message;
    }
    return fetchedProsConsData;
  };

export const fetchStockSuggestions = async (query, region = 'US') => {
    if (!query) return [];
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const yahooUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v1/finance/search?q=${query}&lang=en-US&region=${region}&quotesCount=6&newsCount=0`);
        const response = await fetch(proxyUrl + yahooUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.quotes) {
            return data.quotes.map(quote => ({
                symbol: quote.symbol,
                name: quote.longname || quote.shortname,
                market: quote.exhange || 'US',
                sector: quote.sector || 'N/A'
            }));
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch stock suggestions:', error);
        return [];
    }
};
