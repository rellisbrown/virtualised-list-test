import { useEffect, useCallback, useContext, useState } from 'react';
import { QlikContext } from './qlikContext';

const useChartObject = ({ objectId }) => {
  const { doc } = useContext(QlikContext);
  const [chartObject, setChartObject] = useState();
  const [chartLayout, setChartLayout] = useState();
  const [chartHCData, setChartHCData] = useState([]);

  const getChartObject = useCallback(async () => {
    const object = await doc.getObject(objectId);

    let layout = null;
    if (object) {
      layout = await object.getLayout({});
    }

    const columnNum = layout.qHyperCube.qSize.qcx;
    const height = layout.qHyperCube.qSize.qcy;

    const qPagesArray = [];
    for (let i = 0; i < columnNum; i += 1) {
      qPagesArray.push({ qLeft: i, qTop: 0, qWidth: 1, qHeight: 50 });
    }

    let hyperCubeData = null;
    if (setChartHCData) {
      hyperCubeData = await object.getHyperCubeData({
        qPath: '/qHyperCubeDef',
        qPages: qPagesArray,
      });
    }

    setChartObject(object);

    if (setChartLayout) {
      setChartLayout(layout);
    }

    if (setChartHCData) {
      setChartHCData(hyperCubeData);
    }
  }, [doc, objectId, setChartObject, setChartLayout, setChartHCData]);

  const updateCallback = useCallback(async () => {
    let tempLayout = null;
    if (setChartLayout) {
      tempLayout = await chartObject.getLayout();
    }

    const columnNum = tempLayout.qHyperCube.qSize.qcx;
    const height = tempLayout.qHyperCube.qSize.qcy;

    const qPagesArray = [];
    for (let i = 0; i < columnNum; i += 1) {
      qPagesArray.push({ qLeft: i, qTop: 0, qWidth: 1, qHeight: 50 });
    }

    let tempHyperCubeData = null;
    if (setChartHCData) {
      tempHyperCubeData = await chartObject.getHyperCubeData({
        qPath: '/qHyperCubeDef',
        qPages: qPagesArray,
      });
    }
    if (setChartLayout) {
      setChartLayout(tempLayout);
    }

    if (setChartHCData) {
      setChartHCData(tempHyperCubeData);
    }
  }, [chartObject, setChartLayout, setChartHCData]);

  useEffect(() => {
    if (doc) {
      getChartObject();
    }

    if (chartObject) {
      chartObject.on('changed', updateCallback);
    }
    return () => {
      if (chartObject) {
        chartObject.removeListener('changed', updateCallback);
      }
    };
  }, [
    doc,
    getChartObject,
    chartObject,
    setChartLayout,
    setChartHCData,
    updateCallback,
  ]);

  return {
    chartObject,
    chartLayout,
    chartHCData,
  };
};

export default useChartObject;
