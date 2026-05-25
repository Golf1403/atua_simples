import React, { useRef } from 'react';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import { AnimationContainer, Container, Content } from './styles';
import CurrencyInput from 'react-currency-input';

interface PropsImp {
  payload: number;
  currency?: string;
}

function FInterval(fn: Function, time: number) {
  let timer: number = 0;
  const start = function () {
    if (!isRunning()) timer = setInterval(fn, time);
  };
  const stop = function () {
    clearInterval(timer);
    timer = 0;
  };
  const isRunning = function () {
    return timer !== 0;
  };
  return { start, stop, isRunning };
}

const NumberCounter = ({ currency, payload }: PropsImp) => {
  const formattedPayload = payload.toFixed(2);
  return (
    <Container>
      <AnimationContainer>
        <Content>
          {currency ? (
            <label>
              {payload < 0 ? '-' : ''}
              {currency}
              {new Intl.NumberFormat('id').format(Math.floor(Math.abs(payload)))},{formattedPayload.split('.')[1]}
            </label>
          ) : (
            Math.floor(payload)
          )}
        </Content>
      </AnimationContainer>
    </Container>
  );
};

export default NumberCounter;
