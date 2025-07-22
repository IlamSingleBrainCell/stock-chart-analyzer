import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface);
  padding: 20px;
  border-radius: 8px;
  animation: ${slideUp} 0.5s ease-out;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
`;

const PatternToast = ({ patternName }) => {
  return (
    <ToastWrapper>
      <span>New Pattern Detected:</span>
      <strong>{patternName}</strong>
    </ToastWrapper>
  );
};

export default PatternToast;
