import React, { useState } from 'react';
import styled from 'styled-components';
import { Share2, Bell, Download } from 'lucide-react';
import PatternToast from './PatternToast';

const InsightRibbonWrapper = styled.div`
  height: 120px;
  background-color: var(--surface);
  border-top: 1px solid var(--surface-hover);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AIPatternCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px 20px;
  backdrop-filter: blur(10px);
`;

const ConfidenceRing = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(var(--primary) 75%, var(--bg) 0);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BreakoutTimer = styled.div`
  font-size: 24px;
  font-family: 'JetBrains Mono', monospace;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 20px;
`;

const InsightRibbon = () => {
  const [showToast, setShowToast] = useState(false);

  const handleDetectPattern = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      <InsightRibbonWrapper>
        <AIPatternCard>
          <h3>Head and Shoulders</h3>
          <p>75% confidence</p>
        </AIPatternCard>
        <ConfidenceRing>
          <span>75%</span>
        </ConfidenceRing>
        <BreakoutTimer>
          <span>12:34:56</span>
        </BreakoutTimer>
        <QuickActions>
          <Download size={24} />
          <Bell size={24} />
          <Share2 size={24} />
        </QuickActions>
        <button onClick={handleDetectPattern}>Detect Pattern</button>
      </InsightRibbonWrapper>
      {showToast && <PatternToast patternName="Double Top" />}
    </>
  );
};

export default InsightRibbon;
