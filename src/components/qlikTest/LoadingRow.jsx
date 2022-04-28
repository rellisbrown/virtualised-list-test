import React from 'react';
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
  width: fit-content;
  height: ${(props) => `${props.avgItemHeight}px`};
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const StyledLoadingCell = styled.div`
  width: 100px;
  height: 100%;
  padding: 0.3rem;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledLoadingInnerCell = styled.div`
  width: 90%;
  height: 80%;
  animation: ${shimmer} 2s infinite;
  background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
  background-size: 500px 100%;
  display: flex;
  margin: auto;
`;

const StyledRowIDLoadingCell = styled(StyledLoadingCell)`
  width: 50px;
  text-align: center;
`;

const StyledProductNameLoadingCell = styled(StyledLoadingCell)`
  width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledSalesProfitLoadingCell = styled(StyledLoadingCell)`
  width: 75px;
  text-align: center;
`;
const StyledQuantityDiscountLoadingCell = styled(StyledLoadingCell)`
  width: 75px;
  text-align: center;
`;

const LoadingRow = ({ avgItemHeight, fieldNames }) => {
  const getCell = (type) => {
    switch (type) {
      case 'Row ID':
        return (
          <StyledRowIDLoadingCell key={`loading-${type}`}>
            <StyledLoadingInnerCell />
          </StyledRowIDLoadingCell>
        );
      case 'Product Name':
        return (
          <StyledProductNameLoadingCell key={`loading-${type}`}>
            <StyledLoadingInnerCell />
          </StyledProductNameLoadingCell>
        );
      case ['Sales', 'Profit'].find((measure) => measure === type):
        return (
          <StyledSalesProfitLoadingCell key={`loading-${type}`}>
            <StyledLoadingInnerCell />
          </StyledSalesProfitLoadingCell>
        );
      case ['Quantity', 'Discount'].find((measure) => measure === type):
        return (
          <StyledQuantityDiscountLoadingCell key={`loading-${type}`}>
            <StyledLoadingInnerCell />
          </StyledQuantityDiscountLoadingCell>
        );

      default:
        return (
          <StyledLoadingCell key={`loading-${type}`}>
            <StyledLoadingInnerCell />
          </StyledLoadingCell>
        );
    }
  };

  return (
    <StyledLoadingRow
      avgItemHeight={avgItemHeight}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {fieldNames.map((item) => getCell(item))}
    </StyledLoadingRow>
  );
};
export default LoadingRow;
