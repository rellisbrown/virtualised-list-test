import React, { useRef } from 'react';
import styled from 'styled-components';

const StyledTooltipContainer = styled.div.attrs((props) => ({
  style: {
    top: `${props.top + 30}px`,
    left: `${props.left - props.width / 2}px`,
    display: props.visible ? 'flex' : 'none',
  },
}))`
  position: absolute;
  flex-direction: column;
  opacity: ${(props) => (props.width ? 1 : 0)};
  transition: opacity 0.1s ease;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: ${(props) => `${props.color}`};
  width: fit-content;
  height: fit-content;
  margin: auto;
`;

const StyledTooltipHeading = styled.p`
  display: flex;
  padding: 0.4rem 0.7rem 0.4rem 0.7rem;
  margin: auto;
  color: white;
  transform: translateY(-1px);
`;

const StyledTooltipFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto auto auto auto;
  border: ${(props) => `1px solid ${props.borderColor}`};
  height: fit-content;
`;
const StyledTooltipFieldName = styled.p`
  display: flex;
  padding: 0.4rem 0.7rem 0.4rem 0.7rem;
  margin: 0 0px auto auto;
  color: white;
  width: fit-content;
`;
const StyledTooltipFieldValue = styled.p`
  display: flex;
  padding: 0.4rem 0.7rem 0.4rem 0.7rem;
  margin: 0 0 auto auto;
  color: white;
  width: fit-content;
`;

const TooltipCategory = ({ tooltipData }) => {
  const tooltipRef = useRef();

  let tooltipWidth = 0;
  if (tooltipRef.current) {
    tooltipWidth = tooltipRef.current.getBoundingClientRect().width;
  }

  return (
    <StyledTooltipContainer
      width={tooltipWidth}
      ref={tooltipRef}
      top={tooltipData.top}
      left={tooltipData.left}
      visible={tooltipData.visible}
    >
      <StyledCard color={tooltipData.color}>
        <StyledTooltipHeading>{tooltipData.category}</StyledTooltipHeading>
      </StyledCard>
      {tooltipData.fields ? (
        <StyledCard
          style={{ marginTop: '1rem' }}
          color={`${tooltipData.color}80`}
        >
          <StyledTooltipFieldContainer borderColor={tooltipData.color}>
            <StyledTooltipFieldName>
              {tooltipData.fields?.name}:
            </StyledTooltipFieldName>
            <StyledTooltipFieldValue>
              {tooltipData.fields?.value}
            </StyledTooltipFieldValue>
          </StyledTooltipFieldContainer>
        </StyledCard>
      ) : (
        <></>
      )}
    </StyledTooltipContainer>
  );
};

export default TooltipCategory;
