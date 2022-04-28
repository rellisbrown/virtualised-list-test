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
import useResizeObserver from '../utils/useResizeObserver';
import usePrevious from '../utils/usePrevious';

const StyledListContainer = styled.div`
  overflow-y: scroll;
  height: 500px;
`;

const StyledListInnerContainer = styled.div`
  position: relative;
  height: ${(props) => `${props.innerHeight}px`};
`;

const StyledRow = styled.div`
  position: absolute;
  top: ${(props) => `${props.index * props.itemHeight}px`};
  width: 100%;
`;

const ManualTest = () => {
  const listRef = useRef();
  const [data, setData] = useState([]);
  const [pageState, setPageState] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const dimensions = useResizeObserver(listRef);

  const itemHeight = 30;

  const innerHeight = data.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  let endIndex = 0;
  if (data.length >= 1) {
    endIndex = Math.min(
      data.length - 1,
      Math.floor((scrollTop + dimensions.height) / itemHeight)
    );
  }

  const items = [];

  for (let i = startIndex; i <= endIndex; i += 1) {
    items.push({ ...data[i], index: i });
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
  console.log(loading);

  const fetchData = async (page) => {
    try {
      const res = await axios(
        `https://randomuser.me/api/?page=${page + 1}&results=100&seed=abc`
      );

      setData((prev) => [...prev, ...res.data.results]);
      setPageState((prev) => prev + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), []);

  useEffect(() => {
    if (dimensions && scrollTop + dimensions.height + offset >= innerHeight) {
      console.log(data.length, innerHeight);
      setLoading(true);
      debouncedFetchData(pageState);
    }
  }, [data, scrollTop, innerHeight, debouncedFetchData, dimensions, pageState]);

  /*  const throttledFetchData = useMemo(() => throttle(fetchDataBasic, 2000), []); */

  const loadingArray = new Array(100);
  for (let i = 0; i < loadingArray.length; i += 1) {
    loadingArray[i] = i;
  }
  console.log(loadingArray);

  console.log(data.length);

  return (
    <>
      <StyledListContainer ref={listRef}>
        {dimensions ? (
          <StyledListInnerContainer innerHeight={innerHeight}>
            {items.map((item) => (
              <StyledRow
                key={item.name?.first + item.name?.last}
                index={item.index}
                itemHeight={itemHeight}
              >
                {item.name?.first}
              </StyledRow>
            ))}
            {loading ? (
              <div style={{ display: 'relative' }}>
                {loadingArray.map((item) => (
                  <StyledRow
                    key={`loading-${item}`}
                    index={data.length + item}
                    itemHeight={itemHeight}
                  >
                    ...loading
                  </StyledRow>
                ))}
              </div>
            ) : (
              <></>
            )}
          </StyledListInnerContainer>
        ) : (
          <></>
        )}
      </StyledListContainer>
    </>
  );
};

export default ManualTest;
