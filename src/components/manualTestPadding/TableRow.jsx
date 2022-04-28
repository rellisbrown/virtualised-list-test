import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledRow = styled.div`
  width: 100%;
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
    [cellphone] minmax(100px, 200px);
  gap: 10px;
  background-color: ${(props) => (props.index % 2 ? '#8080801f' : 'white')};
  transition: background-color 0.2s ease;
  :hover {
    background-color: #5555d638;
  }
`;

const StyledCell = styled.div`
  /* width: 100px; */
  height: fit-content;
  padding: 0.3rem;
  text-align: start;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledEmailCell = styled(StyledCell)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const TableRow = ({ data, index, setData }) => {
  const heightRef = useRef();

  useLayoutEffect(() => {
    if (heightRef.current && index !== undefined) {
      setData((prev) => {
        const prevData = prev;
        prevData[index].height =
          heightRef.current.getBoundingClientRect().height;
        return [...prevData];
      });
    }
  }, [index, setData]);

  return (
    <StyledRow
      ref={heightRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      index={index}
    >
      <StyledCell>{data.name?.first}</StyledCell>
      <StyledCell>{data.name?.last}</StyledCell>
      <StyledCell>{data.nat}</StyledCell>
      <StyledCell>{data.gender}</StyledCell>
      <StyledCell>{data.location?.city}</StyledCell>
      <StyledCell>{data.location?.state}</StyledCell>
      <StyledEmailCell>{data.email}</StyledEmailCell>
      <StyledCell>{data.phone}</StyledCell>
      <StyledCell>{data.cell}</StyledCell>
    </StyledRow>
  );
};

export default TableRow;
