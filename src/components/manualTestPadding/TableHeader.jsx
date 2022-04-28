import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

const StyledHeaderRow = styled.div`
  width: ${(props) => `calc(${props.width}px - 2rem)`};
  padding-left: 1rem;
  padding-right: 1rem;
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
  position: fixed;
  background-color: #0f135f;
  color: #f0e8bf;
  z-index: 100;
  column-gap: 10px;
`;

const StyledHeaderCell = styled.div`
  /* width: 100px; */
  height: fit-content;
  padding: 0.3rem;
  text-align: start;
`;

const TableHeader = ({ width, setHeaderHeight }) => {
  const heightRef = useRef();
  useLayoutEffect(() => {
    if (heightRef.current) {
      setHeaderHeight(heightRef.current.getBoundingClientRect().height);
    }
  }, [setHeaderHeight]);

  return (
    <StyledHeaderRow ref={heightRef} width={width}>
      <StyledHeaderCell>First Name</StyledHeaderCell>
      <StyledHeaderCell>Last Name</StyledHeaderCell>
      <StyledHeaderCell>Nationality</StyledHeaderCell>
      <StyledHeaderCell>Gender</StyledHeaderCell>
      <StyledHeaderCell>City</StyledHeaderCell>
      <StyledHeaderCell>State</StyledHeaderCell>
      <StyledHeaderCell>Email</StyledHeaderCell>
      <StyledHeaderCell>Phone</StyledHeaderCell>
      <StyledHeaderCell>Cellphone</StyledHeaderCell>
    </StyledHeaderRow>
  );
};
export default TableHeader;
