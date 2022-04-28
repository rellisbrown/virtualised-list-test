import React, { useCallback } from 'react';
import styled from 'styled-components';

const StyledCircle = styled.circle`
  stroke: ${(props) => props.color};
  stroke-width: 2;
  fill: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  :hover {
    fill: red;
  }
`;

const Circle = ({
  cx,
  cy,
  color,
  radius,
  data,
  handleTooltipShow,
  handleTooltipHide,
  type,
}) => {
  const handleOnHover = useCallback(
    (e) => {
      if (handleTooltipShow) {
        handleTooltipShow(e, {
          current: type,
          category: data['Asset Category'].qText,
          drawn: data.Drawn.qNum,
          undrawn: data.Undrawn.qNum,
          riskWeightedValue: data['Risk Weighted Value'].qNum,
        });
      }
    },
    [data, handleTooltipShow, type]
  );

  return (
    <StyledCircle
      cx={cx}
      cy={cy}
      r={radius}
      color={color}
      onMouseMove={handleOnHover}
      onMouseOut={handleTooltipHide}
    />
  );
};

export default Circle;
