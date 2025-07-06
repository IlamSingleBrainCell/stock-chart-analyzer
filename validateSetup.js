/**
 * Validation Script for Stock Chart Analyzer Setup
 * Run this script to validate your setup before building
 * 
 * Usage: node validateSetup.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Validation functions
function validateStocksJson() {
  logInfo('Validating stocks.json file...');
  
  const stocksPath = path.join(__dirname, 'src', 'stocks.json');
  
  // Check if file exists
  if (!fs.existsSync(stocksPath)) {
    logError('stocks.json not found in src/ directory');
    return false;
  }
  
  logSuccess('stocks.json file found');
  
  try {
    // Check if valid JSON
    const data = JSON.parse(fs.readFileSync(stocksPath, 'utf8'));
    logSuccess('stocks.json is valid JSON');
    
    // Check structure
    if (!data.stocks || !Array.isArray(data.stocks)) {
      logError('stocks.json missing "stocks" array');
      return false;
    }
    
    if (!data.popularStocks || !Array.isArray(data.popularStocks)) {
      logError('stocks.json missing "popularStocks" array');
      return false;
    }
    
    logSuccess(`Found ${data.stocks.length} stocks in database`);
    logSuccess(`Found ${data.popularStocks.length} popular stocks`);
    
    // Validate stock structure
    const requiredFields = ['symbol', 'name', 'sector', 'market', 'exchange', 'currency'];
    const sampleStock = data.stocks[0];
    
    for (const field of requiredFields) {
      if (!sampleStock[field]) {
        logError(`Stock objects missing required field: ${field}`);
        return false;
      }
    }
    
    logSuccess('Stock objects have all required fields');
    
    // Check for duplicate symbols
    const symbols = data.stocks.map(stock => stock.symbol);
    const uniqueSymbols = new Set(symbols);
    
    if (symbols.length !== uniqueSymbols.size) {
      logWarning('Duplicate symbols found in stocks array');
    } else {
      logSuccess('No duplicate symbols found');
    }
    
    // Market distribution
    const usStocks = data.stocks.filter(stock => stock.market === 'US').length;
    const indianStocks = data.stocks.filter(stock => stock.market === 'India').length;
    
    logInfo(`US Stocks: ${usStocks}`);
    logInfo(`Indian Stocks: ${indianStocks}`);
    
    return true;
    
  } catch (error) {
    logError(`Invalid JSON in stocks.json: ${error.message}`);
    return false;
  }
}

function validateAppJs() {
  logInfo('Validating App.js file...');
  
  const appPath = path.join(__dirname, 'src', 'App.js');
  
  if (!fs.existsSync(appPath)) {
    logError('App.js not found in src/ directory');
    return false;
  }
  
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Check for correct import
  if (appContent.includes("import stocksData from './stocks.json'")) {
    logSuccess('Correct stocks.json import found in App.js');
  } else {
    logError('stocks.json import not found or incorrect in App.js');
    return false;
  }
  
  // Check for removed hardcoded data
  if (appContent.includes('const stockDatabase = [') && 
      appContent.includes("{ symbol: 'AAPL', name: 'Apple Inc.'")) {
    logWarning('Hardcoded stock database still present in App.js - should be removed');
  } else {
    logSuccess('Hardcoded stock database removed from App.js');
  }
  
  // Check for correct usage
  if (appContent.includes('const stockDatabase = stocksData.stocks')) {
    logSuccess('Correct usage of imported stocks data');
  } else {
    logError('Incorrect usage of imported stocks data');
    return false;
  }
  
  if (appContent.includes('const popularStocksData = stocksData.popularStocks')) {
    logSuccess('Correct usage of imported popular stocks data');
  } else {
    logError('Incorrect usage of imported popular stocks data');
    return false;
  }
  
  return true;
}

function validatePackageJson() {
  logInfo('Validating package.json...');
  
  const packagePath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    logError('package.json not found');
    return false;
  }
  
  try {
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check for React
    if (packageData.dependencies && packageData.dependencies.react) {
      logSuccess(`React ${packageData.dependencies.react} found`);
    } else {
      logError('React not found in dependencies');
      return false;
    }
    
    // Check for required dependencies
    const requiredDeps = ['react', 'react-dom', 'lucide-react'];
    const missing = requiredDeps.filter(dep => 
      !packageData.dependencies[dep] && !packageData.devDependencies?.[dep]
    );
    
    if (missing.length > 0) {
      logError(`Missing dependencies: ${missing.join(', ')}`);
      return false;
    } else {
      logSuccess('All required dependencies found');
    }
    
    return true;
    
  } catch (error) {
    logError(`Invalid package.json: ${error.message}`);
    return false;
  }
}

function validateFileStructure() {
  logInfo('Validating file structure...');
  
  const requiredFiles = [
    'src/App.js',
    'src/App.css',
    'src/stocks.json',
    'src/index.js',
    'src/index.css',
    'package.json'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      logSuccess(`${file} found`);
    } else {
      logError(`${file} not found`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

function checkBuildReadiness() {
  logInfo('Checking build readiness...');
  
  // Check if node_modules exists
  if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    logSuccess('node_modules directory found');
  } else {
    logWarning('node_modules not found - run "npm install" first');
    return false;
  }
  
  // Check build script
  const packagePath = path.join(__dirname, 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (packageData.scripts && packageData.scripts.build) {
    logSuccess('Build script found in package.json');
  } else {
    logError('Build script not found in package.json');
    return false;
  }
  
  return true;
}

function generateSummary(results) {
  console.log('\n' + '='.repeat(50));
  log('VALIDATION SUMMARY', colors.bold);
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    if (result.passed) {
      logSuccess(`${result.name}: PASSED`);
    } else {
      logError(`${result.name}: FAILED`);
    }
  });
  
  console.log('\n' + '-'.repeat(50));
  
  if (passed === total) {
    logSuccess(`All ${total} validations passed! 🎉`);
    logInfo('Your setup is ready for building!');
    logInfo('Run "npm start" to start development server');
    logInfo('Run "npm run build" to create production build');
  } else {
    logError(`${total - passed} validation(s) failed`);
    logWarning('Please fix the issues above before building');
  }
  
  console.log('\n');
}

// Main validation function
function runValidation() {
  log('🔍 Starting Stock Chart Analyzer Setup Validation\n', colors.bold);
  
  const validations = [
    { name: 'File Structure', test: validateFileStructure },
    { name: 'stocks.json', test: validateStocksJson },
    { name: 'App.js Integration', test: validateAppJs },
    { name: 'package.json', test: validatePackageJson },
    { name: 'Build Readiness', test: checkBuildReadiness }
  ];
  
  const results = validations.map(validation => {
    console.log(`\n📋 ${validation.name}`);
    console.log('-'.repeat(30));
    
    const passed = validation.test();
    
    return {
      name: validation.name,
      passed
    };
  });
  
  generateSummary(results);
  
  // Exit with appropriate code
  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}

// Run validation if called directly
if (require.main === module) {
  runValidation();
}

module.exports = {
  validateStocksJson,
  validateAppJs,
  validatePackageJson,
  validateFileStructure,
  checkBuildReadiness,
  runValidation
};
