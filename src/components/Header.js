import React from 'react';
import Logo from '../logo';
import { Sun, Moon } from 'lucide-react';
import Button from './ui/Button';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center">
        <Logo />
        <h1 className="ml-4 text-2xl font-bold text-gray-800 dark:text-white">
          Stock Chart Analyzer
        </h1>
      </div>
      <Button onClick={toggleTheme} variant="secondary">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </Button>
    </header>
  );
};

export default Header;
