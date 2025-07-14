import React from 'react';

const Logo = () => (
  <div>
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgb(0, 123, 255)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(0, 255, 123)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        d="M10 90 L30 70 L50 80 L70 50 L90 60 L90 90 Z"
      />
      <path
        fill="none"
        stroke="white"
        strokeWidth="3"
        d="M10 40 L30 20 L50 30 L70 10 L90 20"
      />
    </svg>
    <p className="flash" style={{ margin: 0, fontSize: '12px', color: 'white' }}>developed by Ilam</p>
  </div>
);

export default Logo;
