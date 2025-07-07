// src/components/FlagIcon.js

import React from 'react';

/**
 * Cross-platform flag component for displaying country flags
 * @param {string} country - Country name ('India' or 'US')
 * @param {number} size - Size of the flag icon (default: 16)
 */
const FlagIcon = ({ country, size = 16 }) => {
  const height = Math.round(size * 0.75); // 4:3 aspect ratio
  
  if (country === 'India') {
    return (
      <svg 
        width={size} 
        height={height} 
        viewBox="0 0 16 12" 
        style={{ marginRight: '4px', verticalAlign: 'middle' }}
      >
        <rect width="16" height="4" fill="#ff9933"/>
        <rect y="4" width="16" height="4" fill="white"/>
        <rect y="8" width="16" height="4" fill="#138808"/>
        <circle cx="8" cy="6" r="1.5" stroke="#000080" strokeWidth="0.3" fill="none"/>
        <g stroke="#000080" strokeWidth="0.2">
          <line x1="6.5" y1="6" x2="9.5" y2="6"/>
          <line x1="8" y1="4.5" x2="8" y2="7.5"/>
          <line x1="6.8" y1="5.2" x2="9.2" y2="6.8"/>
          <line x1="9.2" y1="5.2" x2="6.8" y2="6.8"/>
        </g>
      </svg>
    );
  } else {
    // Default to US flag for any non-India country
    return (
      <svg 
        width={size} 
        height={height} 
        viewBox="0 0 16 12" 
        style={{ marginRight: '4px', verticalAlign: 'middle' }}
      >
        <rect width="16" height="12" fill="#bf0a30"/>
        <rect y="1" width="16" height="1" fill="white"/>
        <rect y="3" width="16" height="1" fill="white"/>
        <rect y="5" width="16" height="1" fill="white"/>
        <rect y="7" width="16" height="1" fill="white"/>
        <rect y="9" width="16" height="1" fill="white"/>
        <rect y="11" width="16" height="1" fill="white"/>
        <rect width="6" height="6" fill="#002868"/>
      </svg>
    );
  }
};

export default FlagIcon;
