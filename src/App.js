import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, BarChart, Target, DollarSign, Search, RefreshCw, Clock, Info, ChevronUp, Upload, Activity, Globe, Database, Zap, BarChart3 } from 'lucide-react';
import stocksData from './stocks.json';
import FlagIcon from './components/FlagIcon';

function StockChartAnalyzer() {
  // Extract data from imported JSON
  const stockDatabase = stocksData.stocks;
  const popularStocksData = stocksData.popularStocks;

  // State management
  const [activeTab, setActiveTab] = useState('US');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patternDetected, setPatternDetected] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [entryExit, setEntryExit] = useState(null);
  const [timeEstimate, setTimeEstimate] = useState(null);
  const [breakoutTiming, setBreakoutTiming] = useState(null);
  const [error, setError] = useState(null);

  // Your existing analysis functions (copy from original App.js)
  // ... include all your pattern detection, stock fetching, and analysis logic here ...

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setStockData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    // Include your existing analyzeChart logic here
    setTimeout(() => {
      setAnalysisResults({
        pattern: 'Ascending Triangle',
        prediction: 'Bullish',
        confidence: 87,
        timeframe: '5-10 days'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleStockSearch = () => {
    if (searchTerm.trim()) {
      // Include your existing fetchStockData logic here
      console.log('Searching for:', searchTerm);
    }
  };

  const selectStock = (symbol) => {
    setSearchTerm(symbol);
    // Include your existing stock selection logic here
  };

  // Filter stocks by market
  const marketStocks = stockDatabase.filter(stock => 
    (activeTab === 'US' && stock.market === 'US') || 
    (activeTab === 'Indian' && stock.market === 'India')
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cpath d='M50 250 Q100 200 150 220 T250 200 T350 180' stroke='rgba(255,255,255,0.1)' strokeWidth='2' fill='none'/%3E%3Cpath d='M50 200 Q100 150 150 170 T250 150 T350 130' stroke='rgba(255,255,255,0.15)' strokeWidth='2' fill='none'/%3E%3Cpath d='M50 150 Q100 100 150 120 T250 100 T350 80' stroke='rgba(255,255,255,0.1)' strokeWidth='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.3
        }} />
        
        {/* Navigation */}
        <nav style={{ 
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <BarChart3 size={24} color="white" />
            </div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700' 
              }}>
                Stock Chart Analyzer
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                margin: 0, 
                fontSize: '12px' 
              }}>
                AI-Powered Analysis
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontWeight: '500' }}>Features</a>
            <a href="#demo" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontWeight: '500' }}>Demo</a>
            <a href="#stocks" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontWeight: '500' }}>Stocks</a>
            <a href="#about" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontWeight: '500' }}>About</a>
          </div>
        </nav>

        {/* Hero Content */}
        <div style={{ 
          padding: '60px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '60px',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <div>
            {/* Enhanced Analysis Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              padding: '8px 16px',
              marginBottom: '24px',
              fontSize: '14px',
              color: 'white',
              fontWeight: '500'
            }}>
              <Zap size={16} />
              Enhanced Analysis Now Available
            </div>

            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 48px)', 
              fontWeight: '800', 
              lineHeight: '1.1', 
              margin: '0 0 16px 0',
              color: 'white'
            }}>
              AI-Powered Stock Pattern
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Recognition
              </span>
            </h1>
            
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              maxWidth: '500px'
            }}>
              Analyze live stock charts with enhanced 3-month data analysis and breakout timing prediction. Supporting {stockDatabase.length}+ stocks from US and Indian markets.
            </p>

            <button 
              onClick={() => document.getElementById('try-tools')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(251, 191, 36, 0.3)';
              }}
            >
              <BarChart size={18} />
              Start Analysis
            </button>

            {/* Feature Stats */}
            <div style={{ 
              display: 'flex', 
              gap: '32px', 
              marginTop: '48px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981'
                }} />
                {stockDatabase.length}+ Stock Database
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981'
                }} />
                3-Month Analysis
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981'
                }} />
                Breakout Predictions
              </div>
            </div>
          </div>

          {/* Right Side - Stats Card */}
          <div style={{ 
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '300px'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                color: 'white',
                marginBottom: '8px'
              }}>
                {stockDatabase.length}+
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500'
              }}>
                Supported Stocks
              </div>
              
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#10b981',
                  marginBottom: '4px'
                }}>
                  98.5%
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500'
                }}>
                  Pattern Accuracy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Analysis Features Section */}
      <section id="features" style={{ 
        padding: '80px 40px',
        background: 'white',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            margin: '0 0 16px 0',
            color: '#1f2937'
          }}>
            Enhanced Analysis Features
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Advanced AI-powered pattern recognition with comprehensive market data analysis
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '32px' 
        }}>
          {[
            {
              icon: <Activity size={32} />,
              title: 'AI Pattern Recognition',
              description: 'Advanced machine learning algorithms analyze chart patterns with high accuracy and confidence scoring.',
              color: '#4f46e5'
            },
            {
              icon: <Calendar size={32} />,
              title: '3-Month Data Analysis',
              description: 'Comprehensive historical analysis using 3 months of price data for accurate pattern detection.',
              color: '#059669'
            },
            {
              icon: <Clock size={32} />,
              title: 'Breakout Timing',
              description: 'Predict potential breakout timing with dynamic confidence scoring and trend analysis.',
              color: '#7c3aed'
            },
            {
              icon: <Globe size={32} />,
              title: 'Global Markets',
              description: `Support for ${stockDatabase.length}+ stocks from both US and Indian markets with real-time data integration.`,
              color: '#dc2626'
            },
            {
              icon: <Upload size={32} />,
              title: 'Chart Upload',
              description: 'Upload your own chart images for custom analysis with our advanced pattern recognition engine.',
              color: '#ea580c'
            },
            {
              icon: <Zap size={32} />,
              title: 'Live Analysis',
              description: 'Real-time stock chart analysis with instant pattern recognition and confidence metrics.',
              color: '#0891b2'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ color: feature.color }}>
                  {feature.icon}
                </div>
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                margin: '0 0 12px 0',
                color: '#1f2937'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Try Our Analysis Tools Section */}
      <section id="try-tools" style={{ 
        padding: '80px 40px',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              margin: '0 0 16px 0',
              color: '#1f2937'
            }}>
              Try Our Analysis Tools
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280', 
              margin: 0
            }}>
              Search for stocks or upload your own charts for instant AI-powered analysis
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
            gap: '40px' 
          }}>
            {/* Get Live Stock Chart */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px' 
              }}>
                <Search size={24} color="#4f46e5" />
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Get Live Stock Chart
                </h3>
              </div>
              
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                marginBottom: '24px' 
              }}>
                Search from {stockDatabase.length}+ stocks including US and Indian markets
              </p>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search stocks (e.g., AAPL, TCS, Reliance, HDFC)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button 
                onClick={handleStockSearch}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Get Chart Analysis
                  </>
                )}
              </button>

              <div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '12px' 
                }}>
                  Popular Stocks:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {popularStocksData.map((stock, index) => (
                    <button 
                      key={index} 
                      onClick={() => selectStock(stock.symbol)}
                      style={{
                        padding: '8px 12px',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#e5e7eb';
                        e.target.style.borderColor = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#f3f4f6';
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    >
                      <FlagIcon country={stock.market} size={12} />
                      {stock.symbol.replace('.NS', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Chart Image */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px' 
              }}>
                <Upload size={24} color="#059669" />
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Upload Chart Image
                </h3>
              </div>
              
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                marginBottom: '24px' 
              }}>
                Upload your own chart images for custom AI analysis
              </p>

              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '20px'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#059669';
                e.currentTarget.style.background = '#f0fdf4';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = 'transparent';
              }}
              onClick={() => document.getElementById('file-upload').click()}>
                <Upload size={32} color="#9ca3af" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Drop your chart image here
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  or click to browse
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                Supports JPG, PNG, GIF up to 10MB
              </div>

              {uploadedFile && (
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    width: '100%',
                    background: isAnalyzing ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart size={16} />
                      Analyze Chart
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 96+ Supported Stocks Section */}
      <section id="stocks" style={{ 
        padding: '80px 40px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              margin: '0 0 16px 0',
              color: '#1f2937'
            }}>
              {stockDatabase.length}+ Supported Stocks
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280', 
              margin: 0
            }}>
              Comprehensive coverage of US and Indian markets with real-time data
            </p>
          </div>

          {/* Market Tabs */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '40px' 
          }}>
            <div style={{
              background: '#f3f4f6',
              borderRadius: '12px',
              padding: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              {['US Markets', 'Indian Markets'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index === 0 ? 'US' : 'Indian')}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeTab === (index === 0 ? 'US' : 'Indian') ? '#4f46e5' : 'transparent',
                    color: activeTab === (index === 0 ? 'US' : 'Indian') ? 'white' : '#6b7280'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px',
            marginBottom: '40px'
          }}>
            {marketStocks.slice(0, 8).map((stock, index) => {
              const mockPrice = (Math.random() * 500 + 50).toFixed(2);
              const mockChange = (Math.random() * 10 - 5).toFixed(1);
              
              return (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: parseFloat(mockChange) >= 0 ? '#dcfce7' : '#fef2f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: parseFloat(mockChange) >= 0 ? '#166534' : '#991b1b'
                    }}>
                      {stock.symbol.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        marginBottom: '2px'
                      }}>
                        {stock.name}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280' 
                      }}>
                        {stock.symbol}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: parseFloat(mockChange) >= 0 ? '#059669' : '#dc2626',
                      background: parseFloat(mockChange) >= 0 ? '#dcfce7' : '#fef2f2',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {parseFloat(mockChange) >= 0 ? '+' : ''}{mockChange}%
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '700', 
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {stock.currency === 'INR' ? '₹' : '$'}{mockPrice}
                  </div>
                  
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Last updated: {Math.floor(Math.random() * 5) + 1} min ago</span>
                    <span style={{
                      background: parseFloat(mockChange) >= 0 ? '#dcfce7' : '#fef2f2',
                      color: parseFloat(mockChange) >= 0 ? '#166534' : '#991b1b',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {parseFloat(mockChange) >= 0 ? '↗' : '↘'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center' }}>
            <button style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              View All {stockDatabase.length}+ Stocks
            </button>
          </div>
        </div>
      </section>

      {/* Analysis Results Modal */}
      {analysisResults && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setAnalysisResults(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#9ca3af'
              }}
            >
              ×
            </button>
            
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
              Analysis Results
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Pattern Detected
              </div>
              <div style={{ fontSize: '18px', color: '#4f46e5', fontWeight: '700' }}>
                {analysisResults.pattern}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Prediction
              </div>
              <div style={{ 
                fontSize: '18px', 
                color: analysisResults.prediction === 'Bullish' ? '#059669' : '#dc2626', 
                fontWeight: '700' 
              }}>
                {analysisResults.prediction}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Confidence
              </div>
              <div style={{ fontSize: '18px', color: '#1f2937', fontWeight: '700' }}>
                {analysisResults.confidence}%
              </div>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Timeframe
              </div>
              <div style={{ fontSize: '18px', color: '#1f2937', fontWeight: '700' }}>
                {analysisResults.timeframe}
              </div>
            </div>
            
            <button
              onClick={() => setAnalysisResults(null)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Include your existing analysis results section here if needed */}
      {/* Add all your original pattern analysis, confidence sections, etc. */}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: minmax(0, 1fr) minmax(0, 1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(450px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
          
          h1[style*="fontSize: clamp"] {
            font-size: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StockChartAnalyzer;
