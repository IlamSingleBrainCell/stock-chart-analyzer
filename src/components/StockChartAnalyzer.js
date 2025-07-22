import React from 'react';
import styled from 'styled-components';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import MainChart from './layout/MainChart';
import InsightRibbon from './layout/InsightRibbon';
import BottomNav from './layout/BottomNav';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HideOnMobile = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const StockChartAnalyzer = () => {
  return (
    <AppWrapper>
      <HideOnMobile>
        <Header />
      </HideOnMobile>
      <MainContent>
        <HideOnMobile>
          <Sidebar />
        </HideOnMobile>
        <MainChart />
      </MainContent>
      <HideOnMobile>
        <InsightRibbon />
      </HideOnMobile>
      <BottomNav />
    </AppWrapper>
  );
};

export default StockChartAnalyzer;
