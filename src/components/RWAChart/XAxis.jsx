import styled from 'styled-components';

const StyledXAxisText = styled.text`
  font-size: 10px;
  text-anchor: start;
  transform: translateY(12px) rotate(60deg);
`;

const XAxis = ({
  dimensions,
  margin,
  scale,
  tickFormat,
  xValues,
  barWidth,
  bandWidth,
}) => {
  const ticks = xValues.map((value) => ({
    value,
    offset: scale(value) + barWidth / 2 + bandWidth / 6,
  }));

  return (
    <g
      transform={`translate(${margin.left}, ${
        dimensions.height - margin.bottom
      })`}
    >
      <path
        d={[
          'M',
          0,
          6,
          'v',
          -6,
          'h',
          dimensions.width - margin.right - margin.left,
          'v',
          6,
        ].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, offset }) => (
        <g key={value} transform={`translate(${offset}, 0)`}>
          {/*  <line
            y2="0"
            y1={-dimensions.height + margin.top + margin.bottom}
            strokeDasharray="4"
            strokeOpacity="0.3"
            stroke="currentColor"
          /> */}
          <line y2="6" stroke="currentColor" />
          <StyledXAxisText key={value} dy="0.3rem">
            {tickFormat(value)}
          </StyledXAxisText>
        </g>
      ))}
    </g>
  );
};

export default XAxis;
