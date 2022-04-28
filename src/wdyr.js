import React from 'react';

if (process.env.NODE_ENV === 'development') {
  console.log('test');
  // eslint-disable-next-line
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
