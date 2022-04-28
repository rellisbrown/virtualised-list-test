import React from 'react';
import styled from 'styled-components';

const StyledYAxisText = styled.text`
  font-size: 10px;
  text-anchor: end;
  alignment-baseline: central;
  transform: translate(-17px, 0px);
`;

const YAxis = ({ dimensions, margin, scale, tickFormat, yValues }) => {
  const ticks = scale.ticks().map((value) => ({
    value,
    offset: scale(value),
  }));

  return (
    <g transform={`translate(${margin.left}, 0)`}>
      <path
        d={[
          'M',
          -6,
          dimensions.height - margin.bottom,
          'H',
          0,
          'V',
          margin.top,
          'H',
          -6,
        ].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, offset }) => (
        <g key={value} transform={`translate(0, ${offset + margin.top})`}>
          {/* <line
            x1="0"
            x2={dimensions.width - margin.left - margin.right}
            strokeDasharray="4"
            strokeOpacity="0.3"
            stroke="currentColor"
          /> */}
          <line x2="-6" stroke="currentColor" />
          <StyledYAxisText key={value}>{tickFormat(value)}</StyledYAxisText>
        </g>
      ))}
    </g>
  );
};

export default YAxis;
