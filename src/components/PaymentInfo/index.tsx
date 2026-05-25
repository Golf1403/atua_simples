import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  Text,
  Button,
  Bold,
  LimitContainer,
  ButtonContainer,
} from './styles';
import { loginPage } from '@/Routes/pages/auth';

const PaymentInfo = (): JSX.Element => {
  const history = useHistory();

  return (
    <Container>
      <LimitContainer>
        <Header>
          <Title>Pagamento em processamento</Title>
        </Header>

        <Content>
          <Text>Prezado usuário,</Text>
          <Text>Seu pagamento está sendo processado.</Text>
          <Text>Você receberá um e-mail de confirmação assim que o pagamento for confirmado.</Text>
          <Text>Por favor, verifique sua caixa de entrada nas próximas horas.</Text>
        </Content>

        <Footer>
          <Text>
            Atenciosamente,
            <Bold>Sei Cálculos</Bold>
          </Text>

          <ButtonContainer>
            <Button
              type="button"
              onClick={() => {
                history.push(loginPage.path);
              }}>
              Clique para voltar
            </Button>
          </ButtonContainer>
        </Footer>
      </LimitContainer>
    </Container>
  );
};

export default PaymentInfo;
