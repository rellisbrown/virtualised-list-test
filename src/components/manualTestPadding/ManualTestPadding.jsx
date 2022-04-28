import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { AnimatePresence } from 'framer-motion';
import useResizeObserver from '../../utils/useResizeObserver';
import usePrevious from '../../utils/usePrevious';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import LoadingRow from './LoadingRow';

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
`;

const ManualTestPadding = () => {
  const listRef = useRef();
  const [data, setData] = useState([]);
  const [pageState, setPageState] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const dimensions = useResizeObserver(listRef);

  let avgItemHeight = 30;
  let itemHeightSum = 0;
  for (const item of data) {
    if (item.height) {
      itemHeightSum += item.height;
    } else itemHeightSum += avgItemHeight;
  }

  if (itemHeightSum !== 0) {
    avgItemHeight = itemHeightSum / data.length;
  }

  let cumulativeHeight = 0;
  let currentIndex = 0;

  for (const item of data) {
    if (cumulativeHeight <= scrollTop) {
      cumulativeHeight += item.height;
      currentIndex = item.index - 3; // overscan on the top
    }
  }

  /*  const startIndex = Math.floor(scrollTop / avgItemHeight); */
  let endIndex = 0;
  if (data.length >= 1) {
    endIndex = Math.min(
      data.length - 1,
      Math.floor((scrollTop + dimensions.height) / avgItemHeight)
    );
  }

  let heightBeforeStart = 0;
  for (let i = 0; i < currentIndex; i += 1) {
    if (data[i]) {
      heightBeforeStart += data[i].height;
    }
  }

  let heightBeforeEnd = 0;
  for (let i = 0; i < endIndex; i += 1) {
    if (data[i]) {
      heightBeforeEnd += data[i].height;
    }
  }

  /* const innerHeight = data.length * avgItemHeight; */
  let innerHeight = heightBeforeEnd;

  for (let i = endIndex; i <= data.length - 1; i += 1) {
    if (data[i]) {
      innerHeight += avgItemHeight;
    }
  }

  const items = [];

  for (let i = currentIndex; i <= endIndex; i += 1) {
    if (i >= 0) {
      // accounting for top overscan
      items.push({ ...data[i], virtualIndex: i });
    }
  }

  const offset = 400;

  useEffect(() => {
    const onScroll = () => setScrollTop(listRef.current.scrollTop);

    const listRefNode = listRef?.current;

    listRefNode.removeEventListener('scroll', onScroll);
    listRefNode.addEventListener('scroll', onScroll, { passive: true });

    return () => listRefNode.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (page) => {
      try {
        const res = await axios(
          `https://randomuser.me/api/?page=${page + 1}&results=100&seed=abc`
        );
        let priorLength = data.length;
        const newData = res.data.results.map((item) => {
          priorLength += 1;
          return {
            ...item,
            index: priorLength - 1,
            /* height: avgItemHeight, */
          };
        });

        setData((prev) => [...prev, ...newData]);
        setPageState((prev) => prev + 1);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },
    [data]
  );

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 300, { leading: false }),
    [fetchData]
  );

  useEffect(() => {
    if (dimensions && scrollTop + dimensions.height + offset >= innerHeight) {
      setLoading(true);
      if (!loading) {
        debouncedFetchData(pageState);
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
  ]);

  const loadingArray = new Array(100);
  for (let i = 0; i < loadingArray.length; i += 1) {
    loadingArray[i] = i;
  }

  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <>
      <StyledListContainer ref={listRef}>
        {dimensions ? (
          <>
            <TableHeader
              width={dimensions.width}
              setHeaderHeight={setHeaderHeight}
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
                  key={item.name?.first + item.name?.last}
                  data={item}
                  avgItemHeight={avgItemHeight}
                  index={item.index}
                  setData={setData}
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

export default ManualTestPadding;
