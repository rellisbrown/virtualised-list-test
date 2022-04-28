import styled from 'styled-components';

const StyledText = styled.text`
  font-size: 11px;
  text-anchor: middle;
`;

const AxisLabels = ({ x, y, label }) => (
  <StyledText x={x} y={y} dy="0.35em">
    {label}
  </StyledText>
);

export default AxisLabels;
