import React from 'react';
import Helmet from 'react-helmet';

export const onRenderBody = ({ setHeadComponents }) => {
  const helmet = Helmet.renderStatic()
  setHeadComponents([
    helmet.title.toComponent(),
    helmet.link.toComponent(),
    helmet.meta.toComponent()
  ]);
};
