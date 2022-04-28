import React, { useCallback } from 'react';
import styled from 'styled-components';

const StyledRect = styled.rect`
  fill: ${(props) => props.color};
  stroke: ${(props) => props.strokeColor};
  cursor: pointer;
  transition: all 0.2s ease;
  :hover {
    stroke-width: 2;
  }
`;

const Bar = ({
  width,
  height,
  x,
  y,
  color,
  stroke,
  bandWidth,
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
    <StyledRect
      width={width}
      height={height}
      x={x + bandWidth / 6}
      y={y}
      color={color}
      strokeColor={stroke}
      onMouseMove={handleOnHover}
      onMouseOut={handleTooltipHide}
    />
  );
};

export default Bar;
