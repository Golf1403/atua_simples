import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
import useQuery from '@/hooks/query';

const LogoutInfoModal = (): JSX.Element => {
  const history = useHistory();

  const query = useQuery();
  const type = query.get('type') as 'inactive' | 'active' | 'term_recused';

  const descriptions = {
    inactive: `Gostaríamos de informar que sua sessão foi encerrada devido à inatividade prolongada. Para proteger a
  segurança de sua conta e dados, implementamos um recurso de encerramento automático após um período de
  inatividade. Se desejar continuar utilizando nossos serviços, por favor, faça o login novamente. Caso tenha
  alguma dúvida ou precise de assistência, não hesite em entrar em contato com nossa equipe de suporte.
  Agradecemos pela compreensão e por escolher nossos serviços.`,
    active: `Gostaríamos de informar que sua sessão foi encerrada porque uma nova sessão foi iniciada em outro dispositivo ou navegador. 
    Para garantir a segurança da sua conta e dos seus dados, permitimos apenas uma sessão ativa por vez. 
    Se desejar continuar utilizando nossos serviços, por favor, faça o login novamente. 
    Caso tenha alguma dúvida ou precise de assistência, não hesite em entrar em contato com nossa equipe de suporte. 
    Agradecemos pela compreensão e por escolher nossos serviços.`,
    term_recused:
      'Infelizmente, não podemos prosseguir com o seu login, pois é necessário aceitar os Termos de Uso para acessar o sistema.\nCaso tenha dúvidas sobre os Termos de Uso, por favor, entre em contato conosco.',
  };

  const titles = {
    inactive: `Usuário desconectado!`,
    active: `Usuário desconectado!`,
    term_recused: 'Recusa ao Termo de Uso',
  };

  return (
    <Container>
      <LimitContainer>
        <Header>
          <Title>{titles[type || 'inactive']}</Title>
        </Header>

        <Content>
          <Text>Prezado usuário,</Text>
          {descriptions[type || 'inactive'].split('\n').map((description, key) => (
            <Text key={key}>{description}</Text>
          ))}
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

export default LogoutInfoModal;
