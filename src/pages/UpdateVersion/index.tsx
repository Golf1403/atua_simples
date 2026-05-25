import React from 'react';
import { Container, Text, Title } from './styles';

const InConstruction = (): JSX.Element => {
  return (
    <Container>
      <Title>Sistema Indisponível</Title>
      <Text>Lamentamos, mas o sistema não está disponível no momento.</Text>
      <Text>Tente novamente mais tarde.</Text>
    </Container>
  );
};

export default InConstruction;
