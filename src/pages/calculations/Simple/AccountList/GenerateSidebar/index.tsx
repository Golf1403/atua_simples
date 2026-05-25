import React, { Fragment, useEffect } from 'react';
import _ from 'lodash';

import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';

const GenerateSidebar = ({ title }: { title: labelsEnum }): JSX.Element => {
  const { setSidebar } = useCore();

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, [title]);

  return <Fragment />;
};

export default GenerateSidebar;
