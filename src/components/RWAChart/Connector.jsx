import styled from 'styled-components';

const StyledPath = styled.path`
  fill: none;
  stroke: ${(props) => props.strokeColor};
  stroke-dasharray: 4;
  pointer-events: none;
`;

const Connector = ({
  startX,
  endX,
  startY,
  endY,
  circleRadius,
  barWidth,
  bandWidth,
  stroke,
}) => {
  const horizontalSegment =
    (endX - startX) / 2 + barWidth / 2 - circleRadius - 4;
  const verticalSegment = endY - startY;
  return (
    <StyledPath
      d={[
        'M',
        startX - barWidth / 2 + bandWidth / 6 + circleRadius + 4,
        startY,
        'h',
        horizontalSegment,
        'v',
        verticalSegment,
        'h',
        horizontalSegment,
      ].join(' ')}
      strokeColor={stroke}
    />
  );
};

export default Connector;
