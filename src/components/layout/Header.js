import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../../ThemeContext';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 245, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 245, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 245, 255, 0);
  }
`;

const HeaderWrapper = styled.header`
  height: 60px;
  background-color: var(--surface);
  border-bottom: 1px solid var(--surface-hover);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BrandGlyph = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--primary);
  animation: ${pulse} 2s infinite;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--bg);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px var(--primary);
  }
`;

const SearchInput = styled.div`
  color: var(--text-secondary);
  margin-left: 8px;
  font-size: 16px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SearchModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const SearchModalContent = styled.div`
  background: var(--surface);
  padding: 20px;
  border-radius: 8px;
`;

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        setShowSearch((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <HeaderWrapper>
        <BrandGlyph>S</BrandGlyph>
        <SearchWrapper onClick={() => setShowSearch(true)}>
          <Search size={20} color={theme === 'dark' ? 'white' : 'black'} />
          <SearchInput>Search...</SearchInput>
        </SearchWrapper>
        <ActionsWrapper>
          <Bell size={24} />
          {theme === 'dark' ? (
            <Sun size={24} onClick={toggleTheme} cursor="pointer" />
          ) : (
            <Moon size={24} onClick={toggleTheme} cursor="pointer" />
          )}
        </ActionsWrapper>
      </HeaderWrapper>
      {showSearch && (
        <SearchModal onClick={() => setShowSearch(false)}>
          <SearchModalContent onClick={(e) => e.stopPropagation()}>
            <p>Search Modal</p>
            <input type="text" placeholder="Search for a stock..." />
          </SearchModalContent>
        </SearchModal>
      )}
    </>
  );
};

export default Header;
