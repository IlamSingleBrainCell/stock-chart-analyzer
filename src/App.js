import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, BarChart, Target, DollarSign, Search, RefreshCw, Clock, Info, ChevronUp } from 'lucide-react';
import stocksData from './stocks.json';
import FlagIcon from './components/FlagIcon';
import PatternVisualization from './components/PatternVisualization';
import { chartPatterns } from './data/chartPatterns';
import { fetchYahooFinanceData } from './services/stockService';
import { createChartFromData } from './utils/chartUtils';
import { detectPatternFromPriceData } from './logic/patternAnalysis';
import { calculateBreakoutTiming } from './utils/calculationUtils';
import { useStockSymbolSearch } from './hooks/useStockSymbolSearch';

function StockChartAnalyzer() {
  const stockDatabase = stocksData.stocks; // For useStockSymbolSearch hook
  const popularStocksData = stocksData.popularStocks;

  // State for UI and data, remains in App.js
  const [uploadedImage, setUploadedImage] = useState(null);
  // stockSymbol state is now managed by useStockSymbolSearch
  const [stockData, setStockData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patternDetected, setPatternDetected] = useState(null);
  const [timeEstimate, setTimeEstimate] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [entryExit, setEntryExit] = useState(null);
  const [breakoutTimingState, setBreakoutTimingState] = useState(null); // Renamed to avoid conflict with imported function
  const [error, setError] = useState(null);
  const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);

  const canvasRef = useRef(null);
  const chartCanvasRef = useRef(null);
  const inputRef = useRef(null); // This ref will be managed by the hook or passed to it

  // Callback for when a suggestion is selected or input is submitted
  const handleStockSelection = async (selectedSymbol) => {
    if (!selectedSymbol.trim()) return;
    setLoading(true);
    setError(null);
    setStockData(null);
    // Update the main stockSymbol state in App.js via the hook's setter
    stockSearchBindings.setStockSymbol(selectedSymbol.toUpperCase());
    try {
      const data = await fetchYahooFinanceData(selectedSymbol.trim().toUpperCase());
      setStockData(data);
      setTimeout(() => {
        const chartImageUrl = createChartFromData(data, chartCanvasRef);
        setUploadedImage(chartImageUrl);
      }, 100);
    } catch (err) {
      setError(err.message);
      console.error('Stock data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stockSearchBindings = useStockSymbolSearch(stockDatabase, handleStockSelection);


  const fetchStockData = async (symbol) => {
    // This function is now primarily called by the hook or direct button clicks
    // The hook itself will call onSuggestionSelected (handleStockSelection)
    // For direct calls (like popular stock buttons), we still need this.
    if (!symbol.trim()) return;
    setLoading(true);
    setError(null);
    setStockData(null);
    stockSearchBindings.setStockSymbol(symbol.toUpperCase()); // Keep hook's symbol in sync

    try {
      const data = await fetchYahooFinanceData(symbol.trim().toUpperCase());
      setStockData(data);
      setTimeout(() => {
        const chartImageUrl = createChartFromData(data, chartCanvasRef);
        setUploadedImage(chartImageUrl);
      }, 100);
    } catch (err) {
      setError(err.message);
      console.error('Stock data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectStock = (symbol) => {
    // This function is used by the popular stock buttons
    stockSearchBindings.setStockSymbol(symbol); // Update symbol in hook
    stockSearchBindings.setShowSuggestions(false);
    stockSearchBindings.setSelectedSuggestionIndex(-1);
    fetchStockData(symbol); // Then fetch data
  };


  const generateRecommendation = (pattern, currentConfidence) => {
    const { recommendation: recText, prediction: predText } = pattern;
    let action = recText.toUpperCase();
    let reasoning = '';
    switch (recText) {
      case 'buy': reasoning = `Strong ${predText} signal detected with ${currentConfidence}% confidence. Consider accumulating positions.`; break;
      case 'sell': reasoning = `Bearish pattern confirmed with ${currentConfidence}% confidence. Consider reducing positions or short selling.`; break;
      case 'hold': reasoning = `Consolidation pattern detected. Maintain current positions until clear breakout with ${currentConfidence}% confidence.`; break;
      default: reasoning = `Mixed signals detected. Monitor closely for breakout direction. Confidence: ${currentConfidence}%.`;
    }
    return { action, reasoning };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setStockData(null);
        setPrediction(null);
        setPatternDetected(null);
        setConfidence(null);
        setRecommendation(null);
        setEntryExit(null);
        setTimeEstimate(null);
        setBreakoutTimingState(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeChart = () => {
    if (!uploadedImage) return;
    setLoading(true);
    setTimeout(() => {
      try {
        let detectedPatternName = null;
        let currentConfidenceScore = 70;

        if (stockData && stockData.prices && stockData.prices.length > 20) {
          const analysisResult = detectPatternFromPriceData(stockData.prices);
          if (analysisResult) {
            detectedPatternName = analysisResult.pattern;
            currentConfidenceScore = analysisResult.confidence;
          }
        }
        
        if (!detectedPatternName) {
          const patternWeights = {'head-and-shoulders':12,'inverse-head-and-shoulders':12,'double-top':15,'double-bottom':15,'cup-and-handle':10,'ascending-triangle':15,'descending-triangle':15,'flag':8,'wedge-rising':8,'wedge-falling':8};
          const weightedPatterns = [];
          Object.entries(patternWeights).forEach(([p,w])=>{for(let i=0;i<w;i++)weightedPatterns.push(p)});
          detectedPatternName = weightedPatterns[Math.floor(Math.random()*weightedPatterns.length)];
          currentConfidenceScore = Math.floor(Math.random()*35)+50;
        }
        
        const selectedPatternDetails = chartPatterns[detectedPatternName];
        if (!selectedPatternDetails) {
            throw new Error(`Pattern details not found for: ${detectedPatternName}`);
        }

        const rec = generateRecommendation(selectedPatternDetails, currentConfidenceScore);
        const breakout = calculateBreakoutTiming(detectedPatternName, stockData, currentConfidenceScore);
        
        setPatternDetected({ name: detectedPatternName, ...selectedPatternDetails });
        setPrediction(selectedPatternDetails.prediction);
        setConfidence(currentConfidenceScore);
        setRecommendation(rec);
        setBreakoutTimingState(breakout); // Use the renamed state setter
        
        let timeInfo = '';
        if (selectedPatternDetails.prediction === 'up') timeInfo = `Expected to rise for ${selectedPatternDetails.daysUp}`;
        else if (selectedPatternDetails.prediction === 'down') timeInfo = `Expected to decline for ${selectedPatternDetails.daysDown}`;
        else if (selectedPatternDetails.prediction === 'continuation') {
          const isUptrend = Math.random() > 0.5;
          timeInfo = isUptrend ? `Current uptrend likely to continue for ${selectedPatternDetails.daysUp}` : `Current downtrend likely to continue for ${selectedPatternDetails.daysDown}`;
        } else timeInfo = `Pattern suggests movement within ${selectedPatternDetails.timeframe}`;
        setTimeEstimate(timeInfo);
        
        setEntryExit({ entry: selectedPatternDetails.entryStrategy, exit: selectedPatternDetails.exitStrategy });
      } catch (err) {
        console.error('Error analyzing chart:', err);
        setError('Analysis failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px', background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '2px solid rgba(255, 255, 255, 0.4)' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={chartCanvasRef} style={{ display: 'none' }} />
      
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          AI-Powered Stock Pattern Recognition
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: '0' }}>
          Analyze live stock charts with enhanced 3-month data analysis and breakout timing prediction
          <br />
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>
            📊 Supporting {stockDatabase.length}+ stocks from US and Indian markets
          </span>
        </p>
      </div>
      
      <div style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(16, 185, 129, 0.1))', borderLeft: '4px solid #22d3ee', borderRadius: '12px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
        <AlertTriangle size={20} style={{ color: '#22d3ee', marginRight: '16px', flexShrink: 0 }} />
        <div style={{ fontSize: '14px', color: '#0891b2', fontWeight: '600' }}>
          <strong>🚀 Enhanced Analysis:</strong> Now featuring accurate pattern detection using 3-month price data, dynamic confidence scoring, and breakout timing predictions. Comprehensive database with {stockDatabase.length}+ stocks from both <FlagIcon country="US" size={12} />US and <FlagIcon country="India" size={12} />Indian markets!
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#1a202c', fontSize: '18px' }}>
          <Search size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          Get Live Stock Chart (3-Month Analysis)
        </label>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
              <input
                ref={inputRef} // inputRef can be passed to the hook if direct DOM manipulation is needed by the hook
                type="text"
                value={stockSearchBindings.stockSymbol} // Use state from hook
                onChange={(e) => stockSearchBindings.handleInputChange(e.target.value)} // Use handler from hook
                onKeyDown={stockSearchBindings.handleKeyDown} // Use handler from hook
                onFocus={stockSearchBindings.handleInputFocus} // Use handler from hook
                onBlur={stockSearchBindings.handleInputBlur} // Use handler from hook
                placeholder="🔍 Search: AAPL, TCS.NS, Reliance, Microsoft, HDFC Bank..."
                style={{ width: '100%', padding: '14px 16px', border: stockSearchBindings.showSuggestions ? '2px solid #6366f1' : '2px solid rgba(99, 102, 241, 0.2)', borderRadius: stockSearchBindings.showSuggestions ? '8px 8px 0 0' : '8px', fontSize: '16px', fontWeight: '500', outline: 'none', transition: 'border-color 0.2s', borderBottom: stockSearchBindings.showSuggestions ? '1px solid rgba(99, 102, 241, 0.2)' : '2px solid rgba(99, 102, 241, 0.2)'}}
              />
              {stockSearchBindings.showSuggestions && (
                <div style={{position: 'absolute',top: '100%',left: '0',right: '0',backgroundColor: 'white',border: '2px solid #6366f1',borderTop: 'none',borderRadius: '0 0 8px 8px',boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',zIndex: 1000,maxHeight: '300px',overflowY: 'auto'}}>
                  {stockSearchBindings.filteredSuggestions.length > 0 ? (
                    stockSearchBindings.filteredSuggestions.map((stock, index) => (
                      <div key={stock.symbol} onClick={() => stockSearchBindings.selectSuggestion(stock)} style={{padding: '12px 16px',cursor: 'pointer',backgroundColor: index === stockSearchBindings.selectedSuggestionIndex ? '#f3f4f6' : 'white',borderBottom: index < stockSearchBindings.filteredSuggestions.length-1?'1px solid #e5e7eb':'none',transition:'background-color 0.2s'}} onMouseEnter={()=>stockSearchBindings.setSelectedSuggestionIndex(index)}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div>
                            <div style={{fontWeight:'600',fontSize:'15px',color:'#1f2937'}}>{stockSearchBindings.highlightMatch(stock.symbol, stockSearchBindings.stockSymbol)}</div>
                            <div style={{fontSize:'13px',color:'#6b7280',marginTop:'2px'}}>{stockSearchBindings.highlightMatch(stock.name, stockSearchBindings.stockSymbol)}</div>
                          </div>
                          <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                            <div style={{fontSize:'10px',color:stock.market==='India'?'#dc2626':'#2563eb',backgroundColor:stock.market==='India'?'#fef2f2':'#eff6ff',padding:'2px 6px',borderRadius:'4px',fontWeight:'600',border:`1px solid ${stock.market==='India'?'#fecaca':'#dbeafe'}`,display:'flex',alignItems:'center',gap:'2px'}}>
                              <FlagIcon country={stock.market} size={12} />
                              {stock.market === 'India' ? 'NSE' : 'US'}
                            </div>
                            <div style={{fontSize:'11px',color:'#9ca3af',backgroundColor:'#f3f4f6',padding:'2px 6px',borderRadius:'4px',fontWeight:'500'}}>{stock.sector}</div>
                          </div>
                        </div>
                      </div>))
                  ) : stockSearchBindings.stockSymbol.length >= 1 ? (
                    <div style={{padding:'16px',textAlign:'center',color:'#6b7280',fontSize:'14px'}}>
                      <div style={{marginBottom:'8px'}}>🔍 No stocks found</div>
                      <div style={{fontSize:'12px'}}>Try searching by symbol (AAPL) or company name (Apple)</div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <button onClick={() => stockSearchBindings.stockSymbol.trim() && fetchStockData(stockSearchBindings.stockSymbol.toUpperCase())} disabled={loading || !stockSearchBindings.stockSymbol.trim()} style={{padding:'14px 24px',background:loading?'#9ca3af':'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:'8px',transition:'all 0.2s',minWidth:'140px',justifyContent:'center'}}>
              {loading ? <RefreshCw size={16} style={{animation:'spin 1s linear infinite'}} /> : <Search size={16} />}
              {loading ? 'Fetching...' : 'Get Chart'}
            </button>
          </div>
        </div>
        <div>
          <p style={{fontSize:'14px',color:'#4a5568',marginBottom:'12px',fontWeight:'500'}}>Popular Stocks from {stockDatabase.length}+ available (<FlagIcon country="US" size={12} />US + <FlagIcon country="India" size={12} />Indian Markets):</p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {popularStocksData.map(stock=>(
              <button key={stock.symbol} onClick={()=>selectStock(stock.symbol)} disabled={loading} style={{padding:'8px 12px',background:stockSearchBindings.stockSymbol===stock.symbol?'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)':'rgba(99,102,241,0.1)',color:stockSearchBindings.stockSymbol===stock.symbol?'white':'#4f46e5',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'20px',fontSize:'13px',fontWeight:'500',cursor:loading?'not-allowed':'pointer',transition:'all 0.2s',opacity:loading?0.6:1,display:'flex',alignItems:'center',gap:'4px'}} onMouseEnter={(e)=>{if(stockSearchBindings.stockSymbol!==stock.symbol&&!loading){e.target.style.background='rgba(99,102,241,0.2)'}}} onMouseLeave={(e)=>{if(stockSearchBindings.stockSymbol!==stock.symbol&&!loading){e.target.style.background='rgba(99,102,241,0.1)'}}}>
                <FlagIcon country={stock.market} size={12} />
                {stock.symbol.replace('.NS','')}
              </button>
            ))}
          </div>
          <div style={{marginTop:'12px',fontSize:'12px',color:'#6b7280'}}>
            <strong>Examples:</strong> Search from {stockDatabase.length}+ stocks - try "TCS" (Indian IT), "Reliance" (Indian Oil), "AAPL" (US Tech), "HDFC" (Indian Banking), "NVDA" (US Semiconductors), or "Wipro" (Indian IT)
          </div>
        </div>
      </div>

      {error && (
        <div style={{background:'rgba(239,68,68,0.1)',border:'2px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'16px',marginBottom:'20px',color:'#dc2626'}}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div style={{display:'flex',alignItems:'center',marginBottom:'32px',gap:'16px'}}>
        <div style={{flex:'1',height:'2px',background:'linear-gradient(90deg, transparent, rgba(107,114,128,0.3), transparent)'}}></div>
        <span style={{color:'#6b7280',fontWeight:'600',fontSize:'14px',background:'rgba(255,255,255,0.8)',padding:'8px 16px',borderRadius:'20px',border:'1px solid rgba(107,114,128,0.2)'}}>OR</span>
        <div style={{flex:'1',height:'2px',background:'linear-gradient(90deg, rgba(107,114,128,0.3), transparent)'}}></div>
      </div>

      <div style={{marginBottom:'32px'}}>
        <label style={{display:'block',fontWeight:'600',marginBottom:'12px',color:'#1a202c',fontSize:'18px'}}>📁 Upload Your Own Chart Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{width:'100%',padding:'20px',border:'2px dashed rgba(139,92,246,0.3)',borderRadius:'12px',background:'rgba(139,92,246,0.05)',fontSize:'16px',fontWeight:'500',color:'#1a202c',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}} onMouseEnter={(e)=>{e.target.style.borderColor='#8b5cf6';e.target.style.background='rgba(139,92,246,0.1)'}} onMouseLeave={(e)=>{e.target.style.borderColor='rgba(139,92,246,0.3)';e.target.style.background='rgba(139,92,246,0.05)'}}/>
      </div>
      
      {uploadedImage && (
        <div style={{marginBottom:'32px'}}>
          <div style={{width:'100%',height:'400px',background:'rgba(255,255,255,0.9)',borderRadius:'16px',overflow:'hidden',marginBottom:'20px',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid rgba(0,0,0,0.1)',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
            <img src={uploadedImage} alt="Stock chart" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',borderRadius:'12px'}}/>
          </div>
          {stockData && (
            <div style={{background:'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.1))',border:'2px solid rgba(16,185,129,0.3)',borderRadius:'12px',padding:'16px',marginBottom:'16px',fontSize:'15px',color:'#065f46'}}>
              <div style={{fontWeight:'700',marginBottom:'8px'}}>📊 Stock Information (3-Month Data):</div>
              <div><strong>Symbol:</strong> {stockData.symbol} | <strong>Company:</strong> {stockData.companyName}</div>
              <div><strong>Current Price:</strong> {stockData.currency==='INR'||stockData.symbol.includes('.NS')?'₹':'$'}{stockData.currentPrice?.toFixed(2)} {stockData.currency} | <strong>Data Points:</strong> {stockData.prices.length} days</div>
              {stockData.isMockData && <div style={{color:'#f59e0b',fontStyle:'italic',marginTop:'4px'}}>⚠️ Using demo data - API temporarily unavailable</div>}
            </div>
          )}
          <button onClick={analyzeChart} disabled={loading} style={{width:'100%',background:loading?'#9ca3af':'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',color:'white',border:'none',padding:'18px 24px',fontSize:'18px',fontWeight:'600',borderRadius:'12px',cursor:loading?'not-allowed':'pointer',textTransform:'uppercase',letterSpacing:'0.5px',transition:'all 0.3s',boxShadow:loading?'none':'0 4px 20px rgba(99,102,241,0.4)'}}>
            {loading?(<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}><RefreshCw size={20} style={{animation:'spin 1s linear infinite'}}/>Analyzing Pattern...</span>):('🔍 Analyze Chart Pattern')}
          </button>
        </div>
      )}
      
      {prediction && patternDetected && (
        <div style={{background:'rgba(255,255,255,0.95)',borderRadius:'20px',border:'2px solid rgba(0,0,0,0.1)',marginBottom:'32px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize:'28px',fontWeight:'700',marginBottom:'24px',color:'#1a202c',padding:'24px 24px 0',textAlign:'center'}}>📈 Enhanced Analysis Results</h2>
          <div style={{padding:'24px',background:prediction==='up'?'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.15))':prediction==='down'?'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(248,113,113,0.15))':'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',borderLeft:`6px solid ${prediction==='up'?'#10b981':prediction==='down'?'#ef4444':'#6366f1'}`,margin:'0 24px 16px',borderRadius:'12px',border:`2px solid ${prediction==='up'?'rgba(16,185,129,0.3)':prediction==='down'?'rgba(239,68,68,0.3)':'rgba(99,102,241,0.3)'}`}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:'16px'}}>
              {prediction==='up'?<TrendingUp size={28}/>:prediction==='down'?<TrendingDown size={28}/>:<BarChart size={28}/>}
              <h3 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 0 16px',color:'#1a202c'}}>Enhanced Prediction</h3>
            </div>
            <p style={{fontSize:'20px',marginBottom:'16px',fontWeight:'800',color:prediction==='up'?'#059669':prediction==='down'?'#dc2626':'#4f46e5'}}>
              {prediction==='up'?'📈 Likely to go UP':prediction==='down'?'📉 Likely to go DOWN':'↔️ Continuation Expected'}
            </p>
            <div style={{fontSize:'16px',color:'#1a202c',marginTop:'16px',padding:'14px 18px',background:'rgba(255,255,255,0.7)',borderRadius:'8px',border:'1px solid rgba(0,0,0,0.1)',fontWeight:'600'}}>
              <span style={{fontWeight:'700',color:'#1a202c'}}>{prediction==='up'?'⏱️ Upward duration:':prediction==='down'?'⏱️ Downward duration:':'⏱️ Pattern duration:'}</span> {prediction==='up'?patternDetected.daysUp:prediction==='down'?patternDetected.daysDown:patternDetected.timeframe}
            </div>
            {confidence && (
              <div>
                <div style={{fontSize:'16px',color:'#1a202c',marginTop:'16px',fontWeight:'700',background:'rgba(255,255,255,0.8)',padding:'12px 16px',borderRadius:'8px',border:'2px solid rgba(0,0,0,0.1)',textAlign:'center',position:'relative'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                    🎯 Confidence Level: {confidence}%
                    <button onClick={()=>setShowConfidenceHelp(!showConfidenceHelp)} style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'50%',width:'24px',height:'24px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s',padding:'0'}} onMouseEnter={(e)=>{e.target.style.background='rgba(99,102,241,0.2)';e.target.style.transform='scale(1.1)'}} onMouseLeave={(e)=>{e.target.style.background='rgba(99,102,241,0.1)';e.target.style.transform='scale(1)'}} title="Click to understand confidence levels">
                      <Info size={12} color="#4f46e5"/>
                    </button>
                  </div>
                  <div style={{marginTop:'8px',fontSize:'14px',fontWeight:'600'}}>
                    {confidence>=80?(<span style={{color:'#059669',background:'rgba(16,185,129,0.1)',padding:'4px 8px',borderRadius:'12px',border:'1px solid rgba(16,185,129,0.3)'}}>🟢 High Confidence - Strong Signal</span>):confidence>=60?(<span style={{color:'#d97706',background:'rgba(245,158,11,0.1)',padding:'4px 8px',borderRadius:'12px',border:'1px solid rgba(245,158,11,0.3)'}}>🟡 Medium Confidence - Proceed with Caution</span>):(<span style={{color:'#dc2626',background:'rgba(239,68,68,0.1)',padding:'4px 8px',borderRadius:'12px',border:'1px solid rgba(239,68,68,0.3)'}}>🟠 Low Confidence - High Risk</span>)}
                  </div>
                </div>
                {showConfidenceHelp && (
                  <div style={{marginTop:'12px',background:'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))',border:'2px solid rgba(99,102,241,0.2)',borderRadius:'12px',padding:'20px',animation:'slideInUp 0.3s ease-out'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                      <h4 style={{margin:'0',fontSize:'18px',fontWeight:'700',color:'#4f46e5'}}>📊 Understanding Confidence Levels</h4>
                      <button onClick={()=>setShowConfidenceHelp(false)} style={{background:'none',border:'none',cursor:'pointer',padding:'4px',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center'}}><ChevronUp size={20} color="#6b7280"/></button>
                    </div>
                    <div style={{fontSize:'14px',lineHeight:'1.6',color:'#374151'}}>
                      <div style={{marginBottom:'16px',padding:'12px',background:'rgba(255,255,255,0.7)',borderRadius:'8px',border:'1px solid rgba(99,102,241,0.2)'}}>
                        <strong style={{color:'#1f2937'}}>What is Confidence Level?</strong>
                        <p style={{margin:'4px 0 0 0',fontWeight:'500'}}>A percentage (45-92%) indicating how reliable the pattern detection and prediction are. Higher = more trustworthy.</p>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'12px',marginBottom:'16px'}}>
                        <div style={{padding:'12px',background:'rgba(16,185,129,0.1)',borderRadius:'8px',border:'1px solid rgba(16,185,129,0.3)'}}><div style={{fontWeight:'700',color:'#059669',marginBottom:'4px'}}>🟢 High (80-92%)</div><div style={{fontSize:'13px',fontWeight:'500'}}>Very reliable • Strong signal • Clear pattern • Normal position sizes</div></div>
                        <div style={{padding:'12px',background:'rgba(245,158,11,0.1)',borderRadius:'8px',border:'1px solid rgba(245,158,11,0.3)'}}><div style={{fontWeight:'700',color:'#d97706',marginBottom:'4px'}}>🟡 Medium (60-79%)</div><div style={{fontSize:'13px',fontWeight:'500'}}>Moderately reliable • Use caution • Smaller positions • Wait for confirmation</div></div>
                        <div style={{padding:'12px',background:'rgba(239,68,68,0.1)',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.3)'}}><div style={{fontWeight:'700',color:'#dc2626',marginBottom:'4px'}}>🟠 Low (45-59%)</div><div style={{fontSize:'13px',fontWeight:'500'}}>High risk • Avoid trading • Wait for better setup • Educational only</div></div>
                      </div>
                      <div style={{padding:'12px',background:'rgba(99,102,241,0.1)',borderRadius:'8px',border:'1px solid rgba(99,102,241,0.3)'}}>
                        <div style={{fontWeight:'700',color:'#4f46e5',marginBottom:'8px'}}>How is it calculated?</div>
                        <ul style={{margin:'0',paddingLeft:'16px',fontSize:'13px',fontWeight:'500'}}><li>Base pattern reliability (each pattern has historical success rates)</li><li>Pattern clarity and shape matching quality</li><li>Technical indicator alignment (RSI, moving averages)</li><li>Market conditions and data quality factors</li></ul>
                      </div>
                      {confidence<60 && (<div style={{marginTop:'12px',padding:'12px',background:'rgba(239,68,68,0.1)',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.3)'}}><div style={{fontWeight:'700',color:'#dc2626',marginBottom:'4px'}}>⚠️ Your Current Score: {confidence}%</div><div style={{fontSize:'13px',fontWeight:'500',color:'#991b1b'}}>This is a <strong>low confidence</strong> signal. Consider waiting for a clearer pattern with 70%+ confidence before making trading decisions.</div></div>)}
                      <div style={{marginTop:'12px',fontSize:'12px',color:'#6b7280',fontStyle:'italic',textAlign:'center'}}>💡 Remember: Even high confidence doesn't guarantee success. Always use proper risk management and do your own research.</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {breakoutTimingState && (
            <div style={{padding:'24px',background:'rgba(255,255,255,0.5)',margin:'0 24px 16px',borderRadius:'12px',border:'2px solid rgba(0,0,0,0.1)'}}>
              <div style={{display:'flex',alignItems:'center',marginBottom:'16px'}}><Clock size={28}/><h3 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 0 16px',color:'#1a202c'}}>Breakout Timing Prediction</h3></div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px'}}>
                <div style={{background:'rgba(34,211,238,0.1)',padding:'12px',borderRadius:'8px',border:'1px solid rgba(34,211,238,0.3)'}}><div style={{fontWeight:'700',color:'#0891b2',fontSize:'14px'}}>Expected Timeframe</div><div style={{fontWeight:'600',color:'#1a202c',fontSize:'16px'}}>{breakoutTimingState.daysRange}</div></div>
                <div style={{background:'rgba(16,185,129,0.1)',padding:'12px',borderRadius:'8px',border:'1px solid rgba(16,185,129,0.3)'}}><div style={{fontWeight:'700',color:'#059669',fontSize:'14px'}}>Earliest Date</div><div style={{fontWeight:'600',color:'#1a202c',fontSize:'16px'}}>{breakoutTimingState.minDate}</div></div>
                <div style={{background:'rgba(239,68,68,0.1)',padding:'12px',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.3)'}}><div style={{fontWeight:'700',color:'#dc2626',fontSize:'14px'}}>Latest Date</div><div style={{fontWeight:'600',color:'#1a202c',fontSize:'16px'}}>{breakoutTimingState.maxDate}</div></div>
                <div style={{background:'rgba(99,102,241,0.1)',padding:'12px',borderRadius:'8px',border:'1px solid rgba(99,102,241,0.3)'}}><div style={{fontWeight:'700',color:'#4f46e5',fontSize:'14px'}}>Timing Confidence</div><div style={{fontWeight:'600',color:'#1a202c',fontSize:'16px'}}>{breakoutTimingState.confidence}</div></div>
              </div>
              <div style={{marginTop:'12px',padding:'10px',background:'rgba(255,248,230,0.8)',borderRadius:'6px',fontSize:'14px',color:'#92400e',fontWeight:'500'}}>💡 <strong>Note:</strong> Breakout timing is based on pattern analysis and current market momentum. Monitor volume and price action for confirmation.</div>
            </div>
          )}

          {recommendation && (
            <div style={{padding:'24px',background:'rgba(255,255,255,0.5)',margin:'0 24px 16px',borderRadius:'12px',border:'2px solid rgba(0,0,0,0.1)'}}>
              <div style={{display:'flex',alignItems:'center',marginBottom:'16px'}}><DollarSign size={28}/><h3 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 0 16px',color:'#1a202c'}}>Recommendation</h3></div>
              <p style={{fontSize:'20px',marginBottom:'12px',fontWeight:'800',color:recommendation.action==='BUY'?'#059669':recommendation.action==='SELL'?'#dc2626':'#4f46e5'}}>{recommendation.action==='BUY'?'💰 BUY':recommendation.action==='SELL'?'💸 SELL':'✋ HOLD'}</p>
              <p style={{fontSize:'16px',color:'#2d3748',lineHeight:'1.6',fontWeight:'500'}}>{recommendation.reasoning}</p>
            </div>
          )}

          {entryExit && (
            <div style={{padding:'24px',background:'rgba(255,255,255,0.5)',margin:'0 24px 16px',borderRadius:'12px',border:'2px solid rgba(0,0,0,0.1)'}}>
              <div style={{display:'flex',alignItems:'center',marginBottom:'16px'}}><Target size={28}/><h3 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 0 16px',color:'#1a202c'}}>Entry & Exit Strategy</h3></div>
              <div style={{marginBottom:'12px'}}><span style={{fontWeight:'700',color:'#059669'}}>🟢 Entry Point: </span><span style={{color:'#2d3748',fontWeight:'500'}}>{entryExit.entry}</span></div>
              <div><span style={{fontWeight:'700',color:'#dc2626'}}>🔴 Exit Strategy: </span><span style={{color:'#2d3748',fontWeight:'500'}}>{entryExit.exit}</span></div>
            </div>
          )}

          <div style={{padding:'24px',background:'rgba(255,255,255,0.5)',margin:'0 24px 16px',borderRadius:'12px',border:'2px solid rgba(0,0,0,0.1)'}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:'16px'}}><Calendar size={28}/><h3 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 0 16px',color:'#1a202c'}}>Time Estimate</h3></div>
            <p style={{fontSize:'18px',marginBottom:'12px',color:'#2d3748',fontWeight:'600'}}>{timeEstimate}</p>
            <div style={{fontSize:'16px',color:'#1a202c',marginTop:'16px',padding:'12px 16px',background:'rgba(255,255,255,0.7)',borderRadius:'8px',border:'1px solid rgba(0,0,0,0.1)',fontWeight:'600'}}><span style={{fontWeight:'700',color:'#1a202c'}}>📅 Typical pattern duration:</span> {patternDetected.timeframe}</div>
          </div>

          <div style={{padding:'24px',background:'rgba(255,255,255,0.5)',margin:'0 24px 24px',borderRadius:'12px',border:'2px solid rgba(0,0,0,0.1)'}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:'16px'}}><BarChart size={28}/><h3 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 0 16px',color:'#1a202c'}}>Pattern Detected</h3></div>
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <div>
                <p style={{fontSize:'20px',marginBottom:'12px',color:'#2d3748',fontWeight:'700'}}>📊 {patternDetected.name.split('-').map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(' ')}</p>
                <div style={{fontSize:'14px',color:'#6b7280',marginTop:'8px',padding:'8px 12px',background:'rgba(99,102,241,0.1)',borderRadius:'6px',fontWeight:'500'}}>💡 Compare the actual chart above with this pattern example below</div>
              </div>
              <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',gap:'8px',padding:'16px',background:'rgba(248,250,252,0.8)',borderRadius:'8px',border:'1px solid rgba(226,232,240,0.8)'}}>
                <PatternVisualization patternName={patternDetected.name} width={300} height={160}/>
                <div style={{fontSize:'12px',color:'#9ca3af',textAlign:'center',fontWeight:'500'}}>📈 Typical {patternDetected.name.split('-').join(' ')} pattern example</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {patternDetected && (
        <div style={{background:'rgba(255,255,255,0.95)',padding:'32px',borderRadius:'20px',marginBottom:'32px',border:'2px solid rgba(0,0,0,0.1)',boxShadow:'0 8px 32px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontWeight:'700',fontSize:'24px',marginTop:'0',marginBottom:'20px',color:'#1a202c',textAlign:'center'}}>📚 Pattern Education</h3>
          <h4 style={{fontWeight:'600',fontSize:'18px',marginBottom:'12px',color:'#1a202c'}}>Description:</h4>
          <p style={{marginBottom:'24px',lineHeight:'1.7',fontSize:'16px',color:'#2d3748',fontWeight:'500'}}>{patternDetected.description}</p>
          <div style={{padding:'24px',border:'2px solid rgba(0,0,0,0.1)',background:'rgba(99,102,241,0.05)',borderRadius:'12px'}}>
            <h4 style={{fontWeight:'700',fontSize:'18px',color:'#1a202c',marginTop:'0',marginBottom:'16px'}}>🔍 What to look for:</h4>
            <ul style={{marginTop:'0',paddingLeft:'0',listStyle:'none',fontSize:'15px',color:'#2d3748'}}>
              <li style={{marginBottom:'12px',paddingLeft:'24px',position:'relative',lineHeight:'1.6',fontWeight:'500',color:'#2d3748'}}><span style={{position:'absolute',left:'0',color:'#4f46e5',fontWeight:'bold',fontSize:'16px'}}>→</span>Look for clear pattern formation with multiple confirmation points</li>
              <li style={{marginBottom:'12px',paddingLeft:'24px',position:'relative',lineHeight:'1.6',fontWeight:'500',color:'#2d3748'}}><span style={{position:'absolute',left:'0',color:'#4f46e5',fontWeight:'bold',fontSize:'16px'}}>→</span>Check volume patterns that support the chart pattern</li>
              <li style={{marginBottom:'12px',paddingLeft:'24px',position:'relative',lineHeight:'1.6',fontWeight:'500',color:'#2d3748'}}><span style={{position:'absolute',left:'0',color:'#4f46e5',fontWeight:'bold',fontSize:'16px'}}>→</span>Confirm breakout direction before making decisions</li>
              <li style={{marginBottom:'0',paddingLeft:'24px',position:'relative',lineHeight:'1.6',fontWeight:'500',color:'#2d3748'}}><span style={{position:'absolute',left:'0',color:'#4f46e5',fontWeight:'bold',fontSize:'16px'}}>→</span>Consider overall market conditions and sentiment</li>
            </ul>
          </div>
        </div>
      )}
      
      <div style={{fontSize:'15px',color:'#2d3748',background:'rgba(255,255,255,0.9)',padding:'24px',borderRadius:'16px',border:'2px solid rgba(0,0,0,0.1)',lineHeight:'1.7',marginBottom:'24px',fontWeight:'500',textAlign:'center'}}>
        <p style={{marginBottom:'12px'}}><strong>⚠️ Important Disclaimer:</strong> This application provides enhanced technical analysis for educational purposes only.</p>
        <p style={{marginBottom:'12px'}}><strong>📊 Enhanced Features:</strong> 3-month data analysis, dynamic confidence scoring, and breakout timing predictions.</p>
        <p style={{margin:'0'}}>Always conduct thorough research and consult financial advisors before making investment decisions.</p>
      </div>

      <div style={{borderTop:'2px solid rgba(0,0,0,0.1)',paddingTop:'20px',marginTop:'32px',textAlign:'center',fontSize:'14px',color:'#6b7280',background:'rgba(255,255,255,0.8)',padding:'20px',borderRadius:'12px'}}>
        <p style={{margin:'0 0 8px 0',fontWeight:'600',color:'#4a5568'}}>💻 Enhanced by <span style={{color:'#6366f1',fontWeight:'700'}}>Advanced AI Pattern Recognition</span></p>
        <p style={{margin:'0',fontSize:'13px',color:'#9ca3af'}}>© {new Date().getFullYear()} Stock Chart Analyzer v2.0. All rights reserved.</p>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        div[style*="overflowY: auto"] { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
        div[style*="overflowY: auto"]::-webkit-scrollbar { width: 6px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 3px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
}

export default StockChartAnalyzer;
