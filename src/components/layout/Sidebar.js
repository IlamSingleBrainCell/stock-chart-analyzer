import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarWrapper = styled.aside`
  width: ${({ isOpen }) => (isOpen ? '250px' : '60px')};
  background-color: var(--surface);
  border-right: 1px solid var(--surface-hover);
  padding: 20px;
  transition: width 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${({ isOpen }) => (isOpen ? '50vh' : '60px')};
    border-right: none;
    border-top: 1px solid var(--surface-hover);
    z-index: 20;
    transition: height 0.3s ease;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: -15px;
  background: var(--primary);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;

  @media (max-width: 768px) {
    top: -15px;
    right: 20px;
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarWrapper isOpen={isOpen}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </ToggleButton>
      {isOpen && (
        <div>
          <h3>Watchlist</h3>
          <ul>
            <li>AAPL</li>
            <li>GOOGL</li>
            <li>TSLA</li>
          </ul>
          <h3>Heat-map</h3>
          <h3>Patterns</h3>
        </div>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;
