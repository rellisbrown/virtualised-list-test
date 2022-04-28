import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import VirtuosoTest from './components/VirtuosoTest';
import ManualTest from './components/ManualTest';
import ManualTestPadding from './components/manualTestPadding/ManualTestPadding';
import QlikTest from './components/qlikTest/QlikTest';
import { QlikContextProvider } from './utils/qlik/qlikContext';
import RWAChart from './components/RWAChart/RWAChart';
import RadarChart from './components/radarChart/RadarChart';

function App() {
  const [count, setCount] = useState(0);
  return (
    <QlikContextProvider>
      <div className="App">
        {/* <VirtuosoTest /> */}
        {/*  <ManualTest /> */}
        {/* <ManualTestPadding /> */}
        {/*  <QlikTest /> */}
        {/* <RWAChart count={count} setCount={setCount} /> */}
        <RadarChart />
      </div>
    </QlikContextProvider>
  );
}

App.whyDidYouRender = true;

export default App;
