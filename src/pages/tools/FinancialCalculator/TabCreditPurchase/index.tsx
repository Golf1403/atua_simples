import React, { useEffect } from 'react';

import { Container } from './TabCreditForm/styles';
import TabCreditForm from './TabCreditForm';
import { useCore } from '@/hooks/core';

const TabCredit = (): JSX.Element => {
  const { setResults } = useCore();

  useEffect(() => {
    setResults([]);
    return () => {
      setResults([]);
    };
  }, []);

  return (
    <Container
      initialValues={{
        capital: 0,
        installmentsValue: 0,
        installments: 0,
        incomingPayment: 0,
      }}
      onSubmit={() => {}}>
      <TabCreditForm />
    </Container>
  );
};

export default TabCredit;
