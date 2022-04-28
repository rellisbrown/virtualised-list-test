const RWAChartSvgDefs = () => (
  <defs>
    <radialGradient id="undrawn" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stopColor="rgb(23,255,0)" stopOpacity="0.6" />
      <stop offset="50%" stopColor="rgb(50,242,31)" stopOpacity="0.4" />
      <stop offset="75%" stopColor="rgb(83,242,67)" stopOpacity="0.3" />
      <stop offset="100%" stopColor="rgb(255,255,255)" stopOpacity="1.00" />
    </radialGradient>
    <radialGradient id="drawn" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stopColor="rgb(119,215,229)" stopOpacity="0.6" />
      <stop offset="50%" stopColor="rgb(161,238,249)" stopOpacity="0.4" />
      <stop offset="75%" stopColor="rgb(177,243,252)" stopOpacity="0.3" />
      <stop offset="100%" stopColor="rgb(255,255,255)" stopOpacity="1.00" />
    </radialGradient>
  </defs>
);

export default RWAChartSvgDefs;
