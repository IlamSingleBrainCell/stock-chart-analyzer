import React from 'react';

const Header = () => {
  const headerStyle = {
    backgroundColor: 'var(--card-background)', // Using a variable that will adapt to light/dark mode
    color: 'var(--text-color)',
    padding: '15px 20px',
    borderBottom: '1px solid var(--card-border)',
    textAlign: 'center', // Center title for now, Semrush has logo left, nav right
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '20px', // Space below header
  };

  const titleStyle = {
    margin: 0,
    fontSize: '24px', // Semrush titles are often large and clean
    fontWeight: '600', // Semrush uses semi-bold or bold
    color: 'var(--primary-accent-darker)', // Use a prominent color
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Stock Chart Analyzer</h1>
    </header>
  );
};

export default Header;
