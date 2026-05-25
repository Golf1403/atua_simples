import { timeoutEnum } from '@/enums/TimeoutEnum';

import React from 'react';
import { AnimationContainer, Container, Content, Title } from './styles';

interface PropsImp {
  title: string;
  content: number | string | JSX.Element;
}

const Accountants = (props: PropsImp) => {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    if (typeof props.content != 'number') return;

    const increment = Number(props.content) / (1000 / timeoutEnum.INCREMENT_COUNTER);
    const intervalo = setInterval(() => {
      setCounter(lastCounter => lastCounter + increment);
    }, timeoutEnum.INCREMENT_COUNTER);

    return () => clearInterval(intervalo);
  }, [props.content]);

  React.useEffect(() => {
    if (typeof props.content != 'number') return;

    if (counter >= Number(props.content)) setCounter(Number(props.content));
  }, [counter, props.content]);

  return (
    <Container>
      <AnimationContainer>
        <Title>{props.title}</Title>
        <Content>{typeof props.content == 'number' ? Math.floor(counter) : props.content}</Content>
      </AnimationContainer>
    </Container>
  );
};

export default Accountants;
