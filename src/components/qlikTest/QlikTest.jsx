import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import useResizeObserver from '../../utils/useResizeObserver';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import LoadingRow from './LoadingRow';
import useChartObjectList from '../../utils/qlik/useChartObjectList';
import useFieldObjects from '../../utils/qlik/useFieldObjects';

const StyledListContainer = styled.div`
  overflow-y: scroll;
  height: 500px;
  width: 80%;
  margin: 2rem auto;
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const StyledListInnerContainer = styled.div`
  position: relative;
  height: ${(props) => `${props.innerHeight}px`};
  padding-top: ${(props) =>
    `${props.heightBeforeStart + props.headerHeight}px`};
  padding-bottom: ${(props) =>
    `${props.innerHeight - props.heightBeforeEnd}px`};
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const QlikTest = () => {
  const listRef = useRef();
  const [data, setData] = useState([]);
  const [pageState, setPageState] = useState(-1);
  const [scrollTop, setScrollTop] = useState(0);
  const dimensions = useResizeObserver(listRef);

  const objectId = 'BSxpUN';

  const { chartObject, chartLayout, chartHCData, listData } =
    useChartObjectList({
      objectId,
      page: pageState,
      pageHeight: 50,
      setPageState,
    });

  let avgItemHeight = 50; // currently need to set this as a best guess for initial item heights
  let itemHeightSum = 0;
  let itemHeightCount = 0;
  for (const item of listData) {
    if (item.height) {
      itemHeightSum += item.height; // get the sum of all item heights (where a height has been set)
      itemHeightCount += 1; // count the number of items where height has been set
    } /*  else itemHeightSum += avgItemHeight; */
  }

  if (itemHeightSum !== 0) {
    avgItemHeight = itemHeightSum / itemHeightCount; // avg height of items where height has been set
  }

  let cumulativeHeight = 0;
  let currentIndex = 0;

  for (const item of listData) {
    if (cumulativeHeight <= scrollTop) {
      cumulativeHeight += item.height; // sum of item heights that are less than scroll distance
      currentIndex = item.index - 3; // sets the current index at the last item that was less than the scroll distance (with an overscan on the top)
    }
  }

  /*  const startIndex = Math.floor(scrollTop / avgItemHeight); */
  let endIndex = 0;
  if (listData.length >= 1) {
    endIndex = Math.min(
      listData.length - 1,
      Math.floor((scrollTop + dimensions.height) / avgItemHeight) // sets end index based on scroll distance + list 'window' height divided by the average height of an item (in practice leads to an overscan on the bottom if initial avg height is an underestimate)
    );
  }

  let heightBeforeStart = 0;
  for (let i = 0; i < currentIndex; i += 1) {
    if (listData[i]?.height) {
      heightBeforeStart += listData[i].height; // sums the height of all elements in the list prior to the first visible element (including overscan)
    }
  }

  let heightBeforeEnd = 0;
  for (let i = 0; i < endIndex; i += 1) {
    if (listData[i]?.height) {
      heightBeforeEnd += listData[i].height; // sums the height of all elements in the list prior to the last visible element (including overscan)
    }
  }

  /* const innerHeight = data.length * avgItemHeight; */
  let innerHeight = heightBeforeEnd; // set initial height of list

  for (let i = endIndex; i <= listData.length - 1; i += 1) {
    if (listData[i]) {
      innerHeight += avgItemHeight; // set height of list as sum of all list item heights
    }
  }

  const items = []; // items to be rendered

  for (let i = currentIndex; i <= endIndex; i += 1) {
    if (i >= 0) {
      // accounting for top overscan
      items.push({ ...listData[i], virtualIndex: i }); // render items between current and end index
    }
  }

  const offset = 400; // offset for fetching new data

  useEffect(() => {
    const onScroll = () => setScrollTop(listRef.current.scrollTop);

    const listRefNode = listRef?.current;

    listRefNode.removeEventListener('scroll', onScroll);
    listRefNode.addEventListener('scroll', onScroll, { passive: true });

    return () => listRefNode.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setPageState((prev) => prev + 1);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 300, { leading: false }),
    [fetchData]
  );

  useEffect(() => {
    if (dimensions && scrollTop + dimensions.height + offset >= innerHeight) {
      if (!loading) {
        if (
          chartLayout &&
          chartLayout.qHyperCube.qSize.qcy >= (pageState + 1) * 50
        ) {
          debouncedFetchData();
          setLoading(true);
        }
      }
    }
  }, [
    data,
    scrollTop,
    innerHeight,
    debouncedFetchData,
    dimensions,
    pageState,
    loading,
    chartLayout,
  ]);

  const loadingArray = new Array(30);
  for (let i = 0; i < loadingArray.length; i += 1) {
    loadingArray[i] = i;
  }

  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeight = (index, height) => {
    // callback for updating item heights
    if (listData[index]) {
      listData[index].height = height;
    }
  };

  let fieldNames = [];
  if (chartLayout) {
    fieldNames = chartLayout.qHyperCube.qDimensionInfo.map(
      (item) => item.qFallbackTitle
    );

    for (const item of chartLayout.qHyperCube.qMeasureInfo) {
      fieldNames.push(item.qFallbackTitle);
    }
  }

  /* console.log(loading, pageState, items); */
  const fieldObjects = useFieldObjects(fieldNames);

  return (
    <>
      <StyledListContainer ref={listRef}>
        {dimensions ? (
          <>
            <TableHeader
              width={dimensions.width}
              setHeaderHeight={setHeaderHeight}
              fieldNames={fieldNames}
            />
            <StyledListInnerContainer
              innerHeight={innerHeight}
              heightBeforeStart={heightBeforeStart}
              heightBeforeEnd={heightBeforeEnd}
              headerHeight={headerHeight}
            >
              {/*  <AnimatePresence> */}
              {items.map((item) => (
                <TableRow
                  key={item.index}
                  data={item}
                  avgItemHeight={avgItemHeight}
                  setData={setData}
                  updateHeight={updateHeight}
                  fieldObjects={fieldObjects}
                />
              ))}
              {/* </AnimatePresence> */}
              {loading ? (
                <div style={{ display: 'relative', marginTop: '0.5rem' }}>
                  {loadingArray.map((item) => (
                    <LoadingRow
                      key={`loading-${item}`}
                      index={data.length + item}
                      avgItemHeight={avgItemHeight}
                      fieldNames={fieldNames}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}
            </StyledListInnerContainer>
          </>
        ) : (
          <></>
        )}
      </StyledListContainer>
    </>
  );
};

export default QlikTest;
