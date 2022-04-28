import { useEffect, useCallback, createContext, useMemo, useState } from 'react';
import QlikConnector from './qlikConnector';
import qlikConfig from './qlikConfig';

const QlikContext = createContext({});

const QlikContextProvider = ({ children }) => {
  const [global, setGlobal] = useState(undefined);
  const [doc, setDoc] = useState(undefined);
  // eslint-disable-next-line
  const [error, setError] = useState(undefined); // could be used for error handling when setting up the intial qlik connection

  const getQlik = useCallback(async () => {
    let qGlobal;
    let qDoc;

    try {
      const res = await QlikConnector(qlikConfig);
      qGlobal = res.qGlobal;
      qDoc = res.qDoc;
    } catch (e) {
      setError(e);
    }
    setGlobal(qGlobal);
    setDoc(qDoc);
  }, [setDoc, setError, setGlobal]);

  useEffect(() => {
    if (global === undefined) {
      getQlik();
    }
  }, [global, getQlik]);

  const contextValue = useMemo(
    () => ({
      global,
      doc,
      error,
    }),
    [global, doc, error]
  );

  return (
    <QlikContext.Provider value={contextValue}>{children}</QlikContext.Provider>
  );
};

export { QlikContext, QlikContextProvider };
