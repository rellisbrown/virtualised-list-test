import React, { useCallback } from 'react';
import styled from 'styled-components';

const StyledPath = styled.path`
  transition: all 0.2s ease;
  cursor: pointer;
`;

const LineArea = ({
  d,
  fill,
  fillOpacity,
  fillOpacityHovered,
  fillOpacityBackground,
  category,
  hoveredCategory,
  setHoveredCategory,
  handleTooltipShow,
  handleTooltipHide,
}) => {
  const getFillOpacity = useCallback(() => {
    if (category === hoveredCategory) {
      return fillOpacityHovered;
    }
    if (!hoveredCategory) {
      return fillOpacity;
    }
    return fillOpacityBackground;
  }, [
    category,
    hoveredCategory,
    fillOpacity,
    fillOpacityHovered,
    fillOpacityBackground,
  ]);

  const handleMouseOver = useCallback(() => {
    setHoveredCategory(category);
  }, [setHoveredCategory, category]);

  const handleMouseMove = useCallback(
    (e) => {
      if (handleTooltipShow) {
        handleTooltipShow(e, {
          category,
          color: fill,
        });
      }
    },
    [handleTooltipShow, category, fill]
  );

  const handleMouseOut = useCallback(() => {
    setHoveredCategory(undefined);
    handleTooltipHide();
  }, [setHoveredCategory, handleTooltipHide]);

  return (
    <StyledPath
      d={d}
      fill={fill}
      fillOpacity={getFillOpacity()}
      onMouseOver={handleMouseOver}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    />
  );
};

export default LineArea;
