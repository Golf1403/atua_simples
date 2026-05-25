import React, { useEffect, Fragment } from 'react';

import TabCreditPurchase from './TabCreditPurchase';
import TabAmortization from './TabAmortization';
import TabCapitalization from './TabCapitalization';
import { useCore } from '@/hooks/core';
import Tabs from '@/components/Tabs';
import { labelsEnum } from '@/enums/labelsEnum';

const Converter = (): JSX.Element => {
  const { setSidebar } = useCore();

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.FINANCIAL }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  return (
    <Fragment>
      <Tabs
        tabs={[
          { title: labelsEnum.FINANCING_CREDIT_PURCHASE, content: <TabCreditPurchase /> },
          { title: labelsEnum.FINANCING_AMORTIZATION, content: <TabAmortization /> },
          { title: labelsEnum.FINANCING_CAPITALIZATION, content: <TabCapitalization /> },
        ]}
      />
    </Fragment>
  );
};

export default Converter;
