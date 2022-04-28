import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

const StyledHeaderRow = styled.div`
  /* width: ${(props) => `calc(${props.width}px - 2rem)`}; */
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  flex-direction: row;
  background-color: #0f135f;
  color: #f0e8bf;
  position: sticky;
  top: 0;
  transition: top 0.1s ease;
  z-index: 100;
  width: fit-content;
`;

const StyledHeaderCell = styled.div`
  width: 100px;
  height: fit-content;
  /*  padding: 0.3rem; */
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
`;

const StyledRowIDHeaderCell = styled(StyledHeaderCell)`
  width: 50px;
  text-align: center;
`;

const StyledProductNameHeaderCell = styled(StyledHeaderCell)`
  width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledSalesProfitHeaderCell = styled(StyledHeaderCell)`
  width: 75px;
  text-align: center;
`;
const StyledQuantityDiscountHeaderCell = styled(StyledHeaderCell)`
  width: 75px;
  text-align: center;
`;

const TableHeader = ({ width, setHeaderHeight, fieldNames }) => {
  const heightRef = useRef();
  useLayoutEffect(() => {
    if (heightRef.current) {
      setHeaderHeight(heightRef.current.getBoundingClientRect().height);
    }
  }, [setHeaderHeight]);

  const getCell = (type) => {
    switch (type) {
      case 'Row ID':
        return (
          <StyledRowIDHeaderCell key={`header-${type}`}>
            {type}
          </StyledRowIDHeaderCell>
        );
      case 'Product Name':
        return (
          <StyledProductNameHeaderCell key={`header-${type}`}>
            {type}
          </StyledProductNameHeaderCell>
        );
      case ['Sales', 'Profit'].find((measure) => measure === type):
        return (
          <StyledSalesProfitHeaderCell key={`header-${type}`}>
            {type}
          </StyledSalesProfitHeaderCell>
        );
      case ['Quantity', 'Discount'].find((measure) => measure === type):
        return (
          <StyledQuantityDiscountHeaderCell key={`header-${type}`}>
            {type}
          </StyledQuantityDiscountHeaderCell>
        );

      default:
        return (
          <StyledHeaderCell key={`header-${type}`}>{type}</StyledHeaderCell>
        );
    }
  };

  return (
    /* <div style={{ position: 'fixed' }}> */
    <StyledHeaderRow ref={heightRef} width={width}>
      {fieldNames.map((item) => getCell(item))}
    </StyledHeaderRow>
    /* </div> */
  );
};
export default TableHeader;
