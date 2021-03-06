const RadarChartSvgDefs = () => (
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export default RadarChartSvgDefs;
