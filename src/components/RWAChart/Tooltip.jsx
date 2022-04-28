import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div.attrs((props) => ({
  style: {
    top: `${props.top + 20}px`,
    left: `${props.left + 20}px`,
    display: props.visible ? 'flex' : 'none',
  },
}))`
  position: absolute;
  /* top: ${(props) => `${props.top + 20}px`}; */
  /* left: ${(props) => `${props.left + 20}px`}; */
  /* display: ${(props) => (props.visible ? 'flex' : 'none')}; */
  flex-direction: row;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
`;

const StyledColorCircle = styled.div`
  border-radius: 100%;
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.fill};
  margin: auto 1rem auto 1rem;
`;

const StyledTooltipTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
`;

const StyledTooltipHeading = styled.p`
  display: flex;
  margin: 0px auto 0.5rem auto;
`;

const StyledTooltipTextLine = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledTooltipLabel = styled.p`
  font-size: 0.9rem;
  width: 100px;
  margin: auto auto auto 0px;
  padding: 0.2rem;
  padding-top: 0;
  padding-left: 1rem;
  font-weight: 600;
  display: flex;
  color: ${(props) => props.color};
  transition: color 0.2s ease;
`;

const StyledTooltipText = styled.p`
  font-size: 0.9rem;
  margin: auto auto auto 0.5rem;
  padding: 0.2rem;
  padding-top: 0;
  padding-right: 1rem;
  font-weight: 600;
  color: ${(props) => props.color};
  transition: color 0.2s ease;
`;

const Tooltip = ({ tooltipData, chartColors }) => {
  const getColor = (type) => {
    switch (tooltipData.current) {
      case 'drawn':
        if (type === 'drawn') {
          return chartColors.drawn;
        }
        return 'black';
      case 'undrawn':
        if (type === 'undrawn') {
          return chartColors.undrawn;
        }
        return 'black';
      case 'riskWeightedValue':
        if (type === 'riskWeightedValue') {
          return chartColors.circle;
        }
        return 'black';

      default:
        return 'black';
    }
  };
  return (
    <StyledCard
      visible={tooltipData.visible}
      top={tooltipData.top}
      left={tooltipData.left}
    >
      {/*  <StyledColorCircle fill={tooltipData.fill} /> */}
      <StyledTooltipTextDiv>
        <StyledTooltipHeading>{tooltipData.category}</StyledTooltipHeading>
        <StyledTooltipTextLine>
          <StyledTooltipLabel color={getColor('drawn')}>
            Drawn:
          </StyledTooltipLabel>
          <StyledTooltipText color={getColor('drawn')}>
            £
            {tooltipData.drawn?.toLocaleString('en-UK', {
              maximumSignificantDigits: 4,
            })}
          </StyledTooltipText>
        </StyledTooltipTextLine>
        <StyledTooltipTextLine>
          <StyledTooltipLabel color={getColor('undrawn')}>
            Undrawn:
          </StyledTooltipLabel>
          <StyledTooltipText color={getColor('undrawn')}>
            £
            {tooltipData.undrawn?.toLocaleString('en-UK', {
              maximumSignificantDigits: 4,
            })}
          </StyledTooltipText>
        </StyledTooltipTextLine>
        <StyledTooltipTextLine>
          <StyledTooltipLabel color={getColor('riskWeightedValue')}>
            Risk Weighted:
          </StyledTooltipLabel>
          <StyledTooltipText color={getColor('riskWeightedValue')}>
            £
            {tooltipData.riskWeightedValue?.toLocaleString('en-UK', {
              maximumSignificantDigits: 4,
            })}
          </StyledTooltipText>
        </StyledTooltipTextLine>
      </StyledTooltipTextDiv>
    </StyledCard>
  );
};

export default Tooltip;
