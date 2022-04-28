import { useEffect, useCallback, useContext, useState } from 'react';
import { QlikContext } from './qlikContext';

const useFieldObject = (selectionFieldName) => {
  const [fieldObject, setFieldObject] = useState();
  const { doc } = useContext(QlikContext);
  const getFieldObject = useCallback(async () => {
    const field = await doc.getField({
      qFieldName: selectionFieldName,
      qStateName: '$',
    });
    setFieldObject(field);
  }, [doc, selectionFieldName, setFieldObject]);

  useEffect(() => {
    if (doc) {
      getFieldObject();
    }
  }, [doc, getFieldObject]);
  return fieldObject;
};

export default useFieldObject;
