import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Virtuoso } from 'react-virtuoso';

const VirtuosoTest = () => {
  const [data, setData] = useState([]);
  const [pageState, setPageState] = useState(0);

  const fetchData = useCallback(async (page) => {
    try {
      const res = await axios(
        `https://randomuser.me/api/?page=${page + 1}&results=50&seed=abc`
      );
      console.log(page);
      setData((prev) => [...prev, ...res.data.results]);
      setPageState((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(data, pageState);

  return (
    <div>
      <Virtuoso
        style={{ height: 500 }}
        data={data}
        endReached={() => fetchData(pageState)}
        increaseViewportBy={200}
        itemContent={(index, user) => (
          <div
            style={{
              /*  backgroundColor: user.bgColor, */
              padding: '1rem 0.5rem',
            }}
          >
            <h4 style={{ margin: 'auto auto auto auto' }}>
              {user.name.first} {user.name.last}
            </h4>
            <div style={{ marginTop: '0.5rem' }}>{user.email}</div>
          </div>
        )}
      />
    </div>
  );
};

export default VirtuosoTest;
