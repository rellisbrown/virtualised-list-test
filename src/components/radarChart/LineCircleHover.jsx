import React, { useCallback } from 'react';
import styled from 'styled-components';

const StyledCircle = styled.circle`
  pointer-events: all;
  cursor: pointer;
`;

const LineCircleHover = ({
  radius,
  cx,
  cy,
  fill,
  fillOpacity,
  category,
  setHoveredCategory,
  handleTooltipShow,
  handleTooltipHide,
  field,
  value,
}) => {
  const handleMouseOver = useCallback(
    (cat) => {
      setHoveredCategory(cat);
    },
    [setHoveredCategory]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (handleTooltipShow) {
        handleTooltipShow(e, {
          fields: {
            name: field,
            value,
          },
          category,
          color: fill,
        });
      }
    },
    [handleTooltipShow, category, fill, field, value]
  );

  const handleMouseOut = useCallback(() => {
    setHoveredCategory(undefined);
    handleTooltipHide();
  }, [setHoveredCategory, handleTooltipHide]);
  return (
    <StyledCircle
      r={radius}
      cx={cx}
      cy={cy}
      fill="transparent"
      fillOpacity={fillOpacity}
      onMouseOver={() => handleMouseOver(category)}
      onMouseOut={() => handleMouseOut()}
      onMouseMove={handleMouseMove}
    />
  );
};
export default LineCircleHover;
