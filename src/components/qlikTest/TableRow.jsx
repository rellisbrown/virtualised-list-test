import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledRow = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${(props) =>
    props.indexValue % 2 ? '#8080801f' : 'white'};
  transition: background-color 0.2s ease;
  :hover {
    background-color: #5555d638;
  }
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const StyledCell = styled.div`
  width: 100px;
  height: 100%;
  /* padding: 0.3rem; */
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${(props) => props.backroundColor};
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => props.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.isHover ? 'pointer' : 'unset')};
  :hover {
    border-color: ${(props) => (props.isHover ? '#0f135f' : 'transparent')};
  }
  /* padding-top: 5px;
  padding-bottom: 5px; */
`;

const StyledRowIDCell = styled(StyledCell)`
  width: 50px;
  text-align: center;
`;

const StyledProductNameCell = styled(StyledCell)`
  width: 150px;
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
`;

const StyledProductNameInnerCell = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledSalesProfitCell = styled(StyledCell)`
  width: 75px;
  text-align: center;
`;
const StyledQuantityDiscountCell = styled(StyledCell)`
  width: 75px;
  text-align: center;
`;

const TableRow = ({ data, updateHeight, fieldObjects }) => {
  const heightRef = useRef();

  useLayoutEffect(() => {
    if (heightRef.current && data.index !== undefined && data) {
      updateHeight(
        data.index,
        heightRef.current.getBoundingClientRect().height
      );
    }
  }, [data, updateHeight]);

  const dataKeys = Object.keys(data).filter(
    (item) => item !== 'index' && item !== 'height' && item !== 'virtualIndex'
  );

  const handleSelect = async (value, type) => {
    await fieldObjects[type].toggleSelect({
      qMatch: value,
      qSoftLock: true,
      qExcludedValuesMode: 1,
    });
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'S':
        return '#009845';
      case 'O':
        return '#0000ff00';

      default:
        return '#0000ff00';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'S':
        return '#0aaf54';
      case 'O':
        return '#0000ff00';

      default:
        return '#0000ff00';
    }
  };

  const getHover = (type) => {
    if (
      ['Sales', 'Profit', 'Quantity', 'Discount'].find(
        (measure) => measure === type
      )
    ) {
      return false;
    }
    return true;
  };

  const getCell = (type) => {
    switch (type) {
      case 'Row ID':
        return (
          <StyledRowIDCell
            onClick={() => handleSelect(data[type]?.qText, type)}
            key={`${data[type]?.qText}-${type}`}
            backroundColor={() => getBackgroundColor(data[type]?.qState)}
            borderColor={() => getBorderColor(data[type]?.qState)}
            isHover={getHover(type)}
          >
            {data[type]?.qText}
          </StyledRowIDCell>
        );
      case 'Product Name':
        return (
          <StyledProductNameCell
            onClick={() => handleSelect(data[type]?.qText, type)}
            key={`${data[type]?.qText}-${type}`}
            backroundColor={() => getBackgroundColor(data[type]?.qState)}
            borderColor={() => getBorderColor(data[type]?.qState)}
            isHover={getHover(type)}
          >
            <StyledProductNameInnerCell>
              {data[type]?.qText}
            </StyledProductNameInnerCell>
          </StyledProductNameCell>
        );
      case ['Sales', 'Profit'].find((measure) => measure === type):
        return (
          <StyledSalesProfitCell
            key={`${data[type]?.qText}-${type}`}
            borderColor={() => getBorderColor(data[type]?.qState)}
            isHover={getHover(type)}
          >
            {data[type]?.qNum.toFixed(2)}
          </StyledSalesProfitCell>
        );
      case ['Quantity', 'Discount'].find((measure) => measure === type):
        return (
          <StyledQuantityDiscountCell
            key={`${data[type]?.qText}-${type}`}
            borderColor={() => getBorderColor(data[type]?.qState)}
            isHover={getHover(type)}
          >
            {data[type]?.qNum}
          </StyledQuantityDiscountCell>
        );

      default:
        return (
          <StyledCell
            onClick={() => handleSelect(data[type]?.qText, type)}
            key={`${data[type]?.qText}-${type}`}
            backroundColor={() => getBackgroundColor(data[type]?.qState)}
            borderColor={() => getBorderColor(data[type]?.qState)}
            isHover={getHover(type)}
          >
            {data[type]?.qText}
          </StyledCell>
        );
    }
  };

  return (
    <StyledRow
      ref={heightRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      indexValue={data.index}
    >
      {dataKeys.map((item) => getCell(item))}
    </StyledRow>
  );
};

export default TableRow;
