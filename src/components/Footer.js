import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {new Date().getFullYear()} Stock Chart Analyzer. All rights
          reserved.
        </p>
        <p>
          Created with ❤️ by{' '}
          <a
            href="https://github.com/IlamSingleBrainCell"
            target="_blank"
            rel="noopener noreferrer"
          >
            IlamSingleBrainCell
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
