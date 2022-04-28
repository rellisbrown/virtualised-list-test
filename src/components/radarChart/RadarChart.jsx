import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { curveCardinalClosed } from 'd3';
import useResizeObserver from '../../utils/useResizeObserver';
import carData1 from './data/CarData1.json';
import carData2 from './data/CarData2.json';
import AxisCircle from './AxisCircle';
import AxisLine from './AxisLine';
import AxisLabels from './AxisLabels';
import LineArea from './LineArea';
import LineCircle from './LineCircle';
import LineCircleHover from './LineCircleHover';
import TooltipCategory from './TooltipCategory';
import RadarChartSvgDefs from './RadarChartSvgDefs';

const StyledChartContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const StyledTitleDiv = styled.div`
  margin: auto;
  display: block;
  position: absolute;
  top: ${(props) => `${props.top}px`};

  font-size: 1.3rem;
  font-weight: 600;
  width: 100%;
  text-align: center;
`;

const RadarChart = () => {
  const chartRef = useRef();
  const dimensions = useResizeObserver(chartRef);
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const innerHeightChart = dimensions?.height - margin.top - margin.bottom;
  const innerWidthChart = dimensions?.width - margin.left - margin.right;

  const outerCircleWidth = innerWidthChart * 0.8;
  const outerCircleHeight = innerHeightChart * 0.8;
  const outerCircleRadius = Math.min(
    outerCircleWidth / 2,
    outerCircleHeight / 2
  );

  const [dataSelection, setDataSelection] = useState('carData1');
  let data = [];
  if (dataSelection === 'carData1') {
    data = carData1;
  } else if (dataSelection === 'carData2') {
    data = carData2;
  }

  const properties = Object.keys(data[0]);
  const axisNames = properties.filter((item) => item !== 'category');

  const axisCount = axisNames.length;

  const outerCircleSliceAngle = (Math.PI * 2) / axisCount;

  const maxValues = {};
  for (let i = 0; i < data.length; i += 1) {
    for (const item in data[i]) {
      if (item !== 'category') {
        if (maxValues[item] < data[i][item] || !maxValues[item]) {
          maxValues[item] = data[i][item];
        }
      }
    }
  }

  const rScales = {};
  for (const item in maxValues) {
    rScales[item] = d3
      .scaleLinear()
      .domain([0, maxValues[item]])
      .range([0, outerCircleRadius]);
  }

  const circleLevels = 5;
  const circleLevelsArray = d3.range(1, circleLevels + 1).reverse();

  const chartParameters = {
    glow: 'url(#glow)',
    circleFill: '#CDCDCD',
    circleStroke: '#CDCDCD',
    circleOpacity: 0.1,
    axisLineStroke: 'white',
    axisLineWidth: '2px',
    axisLineFactor: 1.1,
    axisLabelFactor: 1.2,
    lineWidth: '1px',
    lineAreaFillOpacity: 0.15,
    lineAreaFillOpacityHovered: 0.3,
    lineAreaFillOpacityBackground: 0.05,
    lineCircleRadius: 4,
    lineCircleFillOpacity: 0.8,
  };

  const lineData = data.map((item) => {
    const tempData = [];
    let tempCategory = '';
    let i = 0;
    for (const [key, value] of Object.entries(item)) {
      if (key !== 'category') {
        tempData[i] = { field: key, value, rScale: rScales[key] };
        i += 1;
      } else tempCategory = value;
    }
    return { category: tempCategory, data: tempData };
  });

  const lineGenerator = d3
    .lineRadial()
    .radius((d) => d.rScale(d.value))
    .angle((d, i) => i * outerCircleSliceAngle)
    .curve(curveCardinalClosed);

  const lineColors = d3.scaleOrdinal(d3.schemeCategory10);

  const [hoveredCategory, setHoveredCategory] = useState();

  const [tooltipData, setTooltipData] = useState({
    visible: false,
  });

  const handleTooltipShow = useCallback(
    (e, d) => {
      if (chartRef.current) {
        const bounding = chartRef.current.getBoundingClientRect();
        setTooltipData({
          visible: true,
          category: d.category,
          fields: d.fields,
          color: d.color,
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
      <select
        style={{ display: 'flex', height: 'fit-content', position: 'absolute' }}
        onChange={(e) => setDataSelection(e.target.value)}
      >
        <option value="carData1">Car Data 1</option>
        <option value="carData2">Car Data 2</option>
      </select>
      {dimensions ? (
        <>
          <StyledTitleDiv top={margin.top / 4}>Car Performance:</StyledTitleDiv>
          <svg style={{ width: '100%', height: '100%' }}>
            <RadarChartSvgDefs />
            {circleLevelsArray.map((item) => (
              <g
                key={`${item}-circle`}
                transform={`translate(${dimensions.width / 2}, ${
                  dimensions.height / 2
                })`}
              >
                <AxisCircle
                  radius={(outerCircleRadius / circleLevels) * item}
                  filter={chartParameters.glow}
                  fill={chartParameters.circleFill}
                  stroke={chartParameters.circleStroke}
                  fillOpacity={chartParameters.circleOpacity}
                />
                {axisNames.map((axisLine, index) => (
                  <g key={`${axisLine}-axisLine`}>
                    <AxisLine
                      stroke={chartParameters.axisLineStroke}
                      strokeWidth={chartParameters.axisLineWidth}
                      x1="0"
                      y1="0"
                      x2={
                        outerCircleRadius *
                        chartParameters.axisLineFactor *
                        Math.cos(outerCircleSliceAngle * index - Math.PI / 2)
                      }
                      y2={
                        outerCircleRadius *
                        chartParameters.axisLineFactor *
                        Math.sin(outerCircleSliceAngle * index - Math.PI / 2)
                      }
                    />
                    <AxisLabels
                      x={
                        outerCircleRadius *
                        chartParameters.axisLabelFactor *
                        Math.cos(outerCircleSliceAngle * index - Math.PI / 2)
                      }
                      y={
                        outerCircleRadius *
                        chartParameters.axisLabelFactor *
                        Math.sin(outerCircleSliceAngle * index - Math.PI / 2)
                      }
                      label={axisLine}
                    />
                  </g>
                ))}
              </g>
            ))}
            <g
              transform={`translate(${dimensions.width / 2}, ${
                dimensions.height / 2
              })`}
            >
              {lineData.map((line, index) => (
                <g key={line.category}>
                  <path
                    fill="none"
                    stroke={lineColors(index)}
                    strokeWidth={chartParameters.lineWidth}
                    filter={chartParameters.glow}
                    d={lineGenerator(line.data)}
                  />
                  <LineArea
                    d={lineGenerator(line.data)}
                    fill={lineColors(index)}
                    fillOpacity={chartParameters.lineAreaFillOpacity}
                    fillOpacityHovered={
                      chartParameters.lineAreaFillOpacityHovered
                    }
                    fillOpacityBackground={
                      chartParameters.lineAreaFillOpacityBackground
                    }
                    category={line.category}
                    hoveredCategory={hoveredCategory}
                    setHoveredCategory={setHoveredCategory}
                    handleTooltipShow={handleTooltipShow}
                    handleTooltipHide={handleTooltipHide}
                  />
                  {line.data.map((circleData, circleIndex) => (
                    <LineCircle
                      // eslint-disable-next-line
                      key={`circle-${circleIndex}`}
                      radius={chartParameters.lineCircleRadius}
                      fill={lineColors(index)}
                      fillOpacity={chartParameters.lineCircleFillOpacity}
                      cx={
                        circleData.rScale(circleData.value) *
                        Math.cos(
                          outerCircleSliceAngle * circleIndex - Math.PI / 2
                        )
                      }
                      cy={
                        circleData.rScale(circleData.value) *
                        Math.sin(
                          outerCircleSliceAngle * circleIndex - Math.PI / 2
                        )
                      }
                    />
                  ))}
                </g>
              ))}
              {lineData.map((lineHover, indexHover) => (
                <g key={`${lineHover.category}-hover`}>
                  {lineHover.data.map((circleDataHover, circleIndexHover) => (
                    <LineCircleHover
                      // eslint-disable-next-line
                      key={`hover-circle-${circleIndexHover}`}
                      radius={chartParameters.lineCircleRadius * 1.1}
                      fill={lineColors(indexHover)}
                      fillOpacity={chartParameters.lineCircleFillOpacity}
                      category={lineHover.category}
                      field={circleDataHover.field}
                      value={circleDataHover.value}
                      setHoveredCategory={setHoveredCategory}
                      cx={
                        circleDataHover.rScale(circleDataHover.value) *
                        Math.cos(
                          outerCircleSliceAngle * circleIndexHover - Math.PI / 2
                        )
                      }
                      cy={
                        circleDataHover.rScale(circleDataHover.value) *
                        Math.sin(
                          outerCircleSliceAngle * circleIndexHover - Math.PI / 2
                        )
                      }
                      handleTooltipShow={handleTooltipShow}
                      handleTooltipHide={handleTooltipHide}
                    />
                  ))}
                </g>
              ))}
            </g>
          </svg>
          <TooltipCategory tooltipData={tooltipData} />
        </>
      ) : (
        <></>
      )}
    </StyledChartContainer>
  );
};

export default RadarChart;
