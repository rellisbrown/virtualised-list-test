import React, { useLayoutEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const shimmer = keyframes`
   0% {
    background-position: top left;
  }
  100% {
    background-position: top right;
  }
`;

const StyledLoadingRow = styled(motion.div)`
  width: 100%;
  height: ${(props) => `${props.avgItemHeight}px`};
  display: grid;
  grid-template-columns:
    [name-first] minmax(100px, 150px) [name-last] minmax(100px, 150px)
    [nat] minmax(75px, 125px) [gender] minmax(75px, 125px) [location-city] minmax(
      100px,
      150px
    )
    [location-state] minmax(100px, 150px) [email] minmax(200px, 300px) [phone] minmax(
      100px,
      200px
    )
    [cell] minmax(100px, 200px);
  column-gap: 10px;

  margin-bottom: 10px;
`;

const StyledLoadingCell = styled.div`
  /* width: 100px; */
  display: flex;
  /* height: 80%; */
  justify-content: space-around;
  padding: 0.3rem;
  text-align: start;
  animation: ${shimmer} 2s infinite;
  background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
  background-size: 500px 100%;
`;

const LoadingRow = ({ avgItemHeight }) => (
  <StyledLoadingRow
    avgItemHeight={avgItemHeight}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
    <StyledLoadingCell />
  </StyledLoadingRow>
);
export default LoadingRow;
