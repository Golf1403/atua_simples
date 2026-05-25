import React, { Fragment, useState } from 'react';
import TabIndex from './TabIndex';
import TabMeasure from './TabMeasure';
import { useCore } from '@/hooks/core';
import Tabs from '@/components/Tabs';
import { labelsEnum } from '@/enums/labelsEnum';

const Converter = (): JSX.Element => {
  const { setSidebar } = useCore();

  React.useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.CONVERTER }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  return (
    <Fragment>
      <Tabs
        tabs={[
          {
            title: labelsEnum.CONVERTER_MEASURE,
            content: <TabMeasure />,
          },
          {
            title: labelsEnum.CONVERTER_INDEX,
            content: <TabIndex />,
          },
        ]}
      />
    </Fragment>
  );
};

export default Converter;
