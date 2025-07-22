import React from 'react';
import styled from 'styled-components';
import { Search, BarChart2, Bell, Settings } from 'lucide-react';

const BottomNavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: var(--surface);
  border-top: 1px solid var(--surface-hover);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 20;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
  cursor: pointer;

  &.active {
    color: var(--primary);
  }
`;

const BottomNav = () => {
  return (
    <BottomNavWrapper>
      <NavItem className="active">
        <BarChart2 size={24} />
        <span>Chart</span>
      </NavItem>
      <NavItem>
        <Search size={24} />
        <span>Search</span>
      </NavItem>
      <NavItem>
        <Bell size={24} />
        <span>Alerts</span>
      </NavItem>
      <NavItem>
        <Settings size={24} />
        <span>Settings</span>
      </NavItem>
    </BottomNavWrapper>
  );
};

export default BottomNav;
