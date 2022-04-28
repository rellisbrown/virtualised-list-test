import React, { useRef, useCallback, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import useChartObject from '../../utils/qlik/useChartObject';
import useResizeObserver from '../../utils/useResizeObserver';
import Bar from './Bar';
import Circle from './Circle';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Connector from './Connector';
import RWAChartSvgDefs from './RWAChartSvgDefs';
import Tooltip from './Tooltip';

const StyledChartContainer = styled.div`
  display: flex;
  width: 80%;
  height: 80vh;
  margin: 2rem auto auto auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  position: relative;
  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const RWAChart = ({ count, setCount }) => {
  const objectId = 'rpusdJy';
  const { chartLayout, chartHCData } = useChartObject({ objectId });
  const chartRef = useRef();
  const dimensions = useResizeObserver(chartRef);

  let fieldNames = [];
  if (chartLayout) {
    fieldNames = chartLayout.qHyperCube.qDimensionInfo.map(
      (item) => item.qFallbackTitle
    );

    for (const item of chartLayout.qHyperCube.qMeasureInfo) {
      fieldNames.push(item.qFallbackTitle);
    }
  }

  const data = [];

  for (let i = 0; i < chartHCData.length; i += 1) {
    for (let j = 0; j < chartHCData[i].qMatrix.length; j += 1) {
      if (!data[j]) {
        data[j] = {};
      }

      data[j][fieldNames[i]] = {
        ...chartHCData[i].qMatrix[j][0],
      };
    }
  }

  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 90,
  };

  const innerHeightChart = dimensions?.height - margin.top - margin.bottom;
  const innerWidthChart = dimensions?.width - margin.left - margin.right;

  const xValues = data.map((item) => item['Asset Category'].qText);
  const xScale = d3
    .scaleBand()
    .domain(xValues)
    .range([0, innerWidthChart])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  const yValuesDrawn = data.map((item) => item.Drawn.qNum);
  const yValuesUndrawn = data.map((item) => item.Undrawn.qNum);
  const yValuesRiskWeightedValue = data.map(
    (item) => item['Risk Weighted Value'].qNum
  );

  const yValuesTotal = data.map((item) => item.Drawn.qNum + item.Undrawn.qNum);

  const yScaleDrawn = d3
    .scaleLinear()
    .domain([0, d3.max(yValuesTotal)])
    .range([innerHeightChart, 0]);

  const yScaleUndrawn = d3
    .scaleLinear()
    .domain([0, d3.max(yValuesTotal)])
    .range([innerHeightChart, 0]);

  const yScaleRiskWeightedValue = d3
    .scaleLinear()
    .domain([0, d3.max(yValuesTotal)])
    .range([innerHeightChart, 0]);

  const barWidth = innerWidthChart / (data.length * 2);
  const bandWidth = xScale.bandwidth();

  const circleRadius = 6;

  const chartColors = {
    drawn: '#77d7e5',
    drawnStroke: '#448b95',
    drawnGradient: 'url(#drawn)',
    undrawn: '#33ae2d',
    undrawnStroke: '#22651f',
    undrawnGradient: 'url(#undrawn)',
    circle: 'red',
  };

  const tickFormatX = (d) => d;
  const tickFormatY = (d) =>
    d.toLocaleString('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumSignificantDigits: 4,
    });

  const connectorData = [];
  for (let i = 0; i < data.length; i += 1) {
    connectorData[i] = {};

    connectorData[i].startX =
      xScale(data[i]['Asset Category'].qText) + barWidth;
    if (i !== data.length - 1) {
      connectorData[i].endX = xScale(data[i + 1]['Asset Category'].qText);
    } else {
      connectorData[i].endX = 'end';
    }

    connectorData[i].startY = yScaleRiskWeightedValue(
      data[i]['Risk Weighted Value'].qNum
    );

    if (i !== data.length - 1) {
      connectorData[i].endY = yScaleRiskWeightedValue(
        data[i + 1]['Risk Weighted Value'].qNum
      );
    } else {
      connectorData[i].endY = 'end';
    }
  }

  const [tooltipData, setTooltipData] = useState({
    visible: false,
  });

  const handleTooltipShow = useCallback(
    (e, d) => {
      if (chartRef.current) {
        const bounding = chartRef.current.getBoundingClientRect();
        setTooltipData({
          visible: true,
          current: d.current,
          category: d.category,
          drawn: d.drawn,
          undrawn: d.undrawn,
          riskWeightedValue: d.riskWeightedValue,
          left: e.clientX - bounding.x,
          top: e.clientY - bounding.y,
        });
      }
    },
    [setTooltipData]
  );
  const handleTooltipHide = useCallback(
    () => setTooltipData({ ...tooltipData, visible: false }),
    [setTooltipData, tooltipData]
  );

  return (
    <StyledChartContainer ref={chartRef}>
      {dimensions ? (
        <>
          <svg style={{ width: '100%', height: '100%' }}>
            <RWAChartSvgDefs />
            <XAxis
              dimensions={dimensions}
              margin={margin}
              scale={xScale}
              tickFormat={tickFormatX}
              xValues={xValues}
              barWidth={barWidth}
              bandWidth={bandWidth}
            />
            <YAxis
              dimensions={dimensions}
              margin={margin}
              scale={yScaleDrawn}
              tickFormat={tickFormatY}
              yValues={xValues}
              barWidth={barWidth}
            />
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {data.map((item) => (
                <g key={item['Asset Category'].qText}>
                  <Bar
                    key={`${item['Asset Category'].qText}-drawn`}
                    width={barWidth}
                    height={innerHeightChart - yScaleDrawn(item.Drawn.qNum)}
                    x={xScale(item['Asset Category'].qText)}
                    y={yScaleDrawn(item.Drawn.qNum)}
                    color={chartColors.drawnGradient}
                    stroke={chartColors.drawnStroke}
                    bandWidth={bandWidth}
                    data={item}
                    handleTooltipShow={handleTooltipShow}
                    handleTooltipHide={handleTooltipHide}
                    type="drawn"
                  />
                  <Bar
                    key={`${item['Asset Category'].qText}-undrawn`}
                    width={barWidth}
                    height={innerHeightChart - yScaleUndrawn(item.Undrawn.qNum)}
                    x={xScale(item['Asset Category'].qText)}
                    y={
                      yScaleDrawn(item.Drawn.qNum) -
                      innerHeightChart +
                      yScaleUndrawn(item.Undrawn.qNum)
                    }
                    color={chartColors.undrawnGradient}
                    stroke={chartColors.undrawnStroke}
                    bandWidth={bandWidth}
                    data={item}
                    handleTooltipShow={handleTooltipShow}
                    handleTooltipHide={handleTooltipHide}
                    type="undrawn"
                  />
                  <Circle
                    cx={
                      xScale(item['Asset Category'].qText) +
                      barWidth / 2 +
                      bandWidth / 6
                    }
                    cy={yScaleRiskWeightedValue(
                      item['Risk Weighted Value'].qNum
                    )}
                    radius={circleRadius}
                    color={chartColors.circle}
                    data={item}
                    handleTooltipShow={handleTooltipShow}
                    handleTooltipHide={handleTooltipHide}
                    type="riskWeightedValue"
                  />
                </g>
              ))}
              {connectorData.map((item) => (
                <g key={item.startX}>
                  <Connector
                    startX={item.startX}
                    endX={item.endX}
                    startY={item.startY}
                    endY={item.endY}
                    stroke={chartColors.circle}
                    barWidth={barWidth}
                    circleRadius={circleRadius}
                    bandWidth={bandWidth}
                  />
                </g>
              ))}
            </g>
          </svg>
        </>
      ) : (
        <></>
      )}
      <Tooltip tooltipData={tooltipData} chartColors={chartColors} />
    </StyledChartContainer>
  );
};

/* RWAChart.whyDidYouRender = {
  logOnDifferentValues: true,
  trackAllPureComponents: true,
};
 */
export default RWAChart;
