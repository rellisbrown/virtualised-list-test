import { useEffect, useCallback, useContext, useState } from 'react';
import { QlikContext } from './qlikContext';

const useFieldObjects = (fieldNames) => {
  const [fieldObjects, setFieldObjects] = useState({});
  const { doc } = useContext(QlikContext);

  const getFieldObject = useCallback(
    async (fieldName) => {
      const field = await doc.getField({
        qFieldName: fieldName,
        qStateName: '$',
      });
      setFieldObjects((prev) => {
        const temp = prev;
        temp[fieldName] = field;
        return temp;
      });
    },
    [doc, setFieldObjects]
  );

  useEffect(() => {
    if (doc) {
      for (const item of fieldNames) {
        getFieldObject(item);
      }
    }
    // eslint-disable-next-line
  }, [doc, fieldNames, getFieldObject]);
  return fieldObjects;
};

export default useFieldObjects;
