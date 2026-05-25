import React from 'react';

import { rem } from '@/styles/global';
import { AiOutlineLoading } from 'react-icons/ai';
import { Spinner } from './styles';
import { Container } from './styles';

export const LoadingImage = () => {
  return (
    <Container>
      <Spinner>
        <AiOutlineLoading size={rem(60)} />
      </Spinner>
    </Container>
  );
};
