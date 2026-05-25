import React from 'react';
import { Container, Message, OverlayContainer, Spinner } from './styles';
import { AiOutlineLoading } from 'react-icons/ai';
import { rem } from '@/styles/global';

const SEILoading = ({ message }: { message?: string }): JSX.Element => {
  return (
    <OverlayContainer>
      <Container>
        <Spinner>
          <AiOutlineLoading size={rem(60)} />
        </Spinner>
        <Message>{message}</Message>
      </Container>
    </OverlayContainer>
  );
};

export default SEILoading;
