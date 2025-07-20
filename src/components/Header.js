import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../ThemeContext';
import Logo from '../logo';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Logo />
        </div>
        <div className="theme-switcher">
          <button onClick={toggleTheme} className="theme-switcher-button">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
