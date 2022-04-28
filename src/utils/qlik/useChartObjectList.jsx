import { useEffect, useCallback, useContext, useState } from 'react';
import { QlikContext } from './qlikContext';

const useChartObject = ({ objectId, page, pageHeight, setPageState }) => {
  const { doc } = useContext(QlikContext);
  const [chartObject, setChartObject] = useState();
  const [chartLayout, setChartLayout] = useState();
  const [chartHCData, setChartHCData] = useState([]);
  const [listData, setListData] = useState([]);

  const getChartObject = useCallback(async () => {
    const object = await doc.getObject(objectId);

    let layout = null;
    if (object) {
      layout = await object.getLayout({});
    }

    const columnNum = layout.qHyperCube.qSize.qcx;
    /* const height = layout.qHyperCube.qSize.qcy; */

    const qPagesArray = [];
    for (let i = 0; i < columnNum; i += 1) {
      qPagesArray.push({
        qLeft: i,
        qTop: page * pageHeight,
        qWidth: 1,
        qHeight: pageHeight,
      });
    }

    let hyperCubeData = null;
    if (object) {
      hyperCubeData = await object.getHyperCubeData({
        qPath: '/qHyperCubeDef',
        qPages: qPagesArray,
      });
    }

    setChartObject(object);

    if (layout) {
      setChartLayout(layout);
    }

    if (hyperCubeData) {
      setChartHCData(hyperCubeData);
    }
    const tempListData = [];
    let tempFieldNames = [];
    if (hyperCubeData) {
      tempFieldNames = layout.qHyperCube.qDimensionInfo.map(
        (item) => item.qFallbackTitle
      );
      for (const item of layout.qHyperCube.qMeasureInfo) {
        tempFieldNames.push(item.qFallbackTitle);
      }
      for (let i = 0; i < hyperCubeData.length; i += 1) {
        for (let j = 0; j < hyperCubeData[i].qMatrix.length; j += 1) {
          if (!tempListData[j]) {
            tempListData[j] = {};
          }

          tempListData[j][tempFieldNames[i]] = {
            ...hyperCubeData[i].qMatrix[j][0],
          };
          tempListData[j].index = page * pageHeight + j;
        }
      }

      setListData((prev) => {
        if (
          tempListData.length !== 0 &&
          prev.length !== 0 &&
          prev[prev.length - 1]['Row ID']?.qNum !==
            tempListData[tempListData.length - 1]['Row ID']?.qNum // accounts for initial load and prevents duplicates
        ) {
          return [...prev, ...tempListData];
        }
        return [...tempListData];
      });
    }
  }, [doc, objectId, page, pageHeight]);

  const updateCallback = useCallback(async () => {
    let tempLayout = null;
    if (chartObject) {
      tempLayout = await chartObject.getLayout();
    }

    const columnNum = tempLayout.qHyperCube.qSize.qcx;
    const height = tempLayout.qHyperCube.qSize.qcy;

    const qPagesArray = [];
    for (let i = 0; i < columnNum; i += 1) {
      qPagesArray.push({ qLeft: i, qTop: 0, qWidth: 1, qHeight: pageHeight });
    }

    let tempHyperCubeData = null;
    if (chartObject) {
      tempHyperCubeData = await chartObject.getHyperCubeData({
        qPath: '/qHyperCubeDef',
        qPages: qPagesArray,
      });
    }

    if (chartObject) {
      setChartLayout(tempLayout);
    }

    if (chartObject) {
      setChartHCData(tempHyperCubeData);
    }

    const tempListData = [];
    let tempFieldNames = [];
    if (tempHyperCubeData) {
      tempFieldNames = tempLayout.qHyperCube.qDimensionInfo.map(
        (item) => item.qFallbackTitle
      );
      for (const item of tempLayout.qHyperCube.qMeasureInfo) {
        tempFieldNames.push(item.qFallbackTitle);
      }
      for (let i = 0; i < tempHyperCubeData.length; i += 1) {
        for (let j = 0; j < tempHyperCubeData[i].qMatrix.length; j += 1) {
          if (!tempListData[j]) {
            tempListData[j] = {};
          }

          tempListData[j][tempFieldNames[i]] = {
            ...tempHyperCubeData[i].qMatrix[j][0],
          };
          tempListData[j].index = page * pageHeight + j;
        }
      }
      setPageState(0);
      setListData(tempListData);
    }
  }, [chartObject, setPageState, page, pageHeight]);

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
    listData,
  };
};

export default useChartObject;
