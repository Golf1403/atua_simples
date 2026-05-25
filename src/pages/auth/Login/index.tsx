import React from 'react';
import { Formik } from 'formik';
import { AnimationContainer, Container, Content } from './styles';
import { useLoading } from '@/hooks/loading';
import { useWebSocket } from '@/hooks/websocket';
import { webSocketMessageRouteEnum } from '@/enums/webSocketRouteEnum';
import loginSchema from '@/validators/loginSchema';
import { alertMessages } from '@/hooks/alertMessages';
import login from '@/services/http/login';
import IDummyObject from '@/interfaces/IDummyObject';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import CustomForm from './LoginForm';

const Login: React.FC = () => {
  const { openLoading, closeLoading } = useLoading();
  const alertMessage = alertMessages();
  const socket = useWebSocket();

  const handleSubmit = async (values: IDummyObject) => {
    try {
      openLoading();
      const payload = await loginSchema.validate({ email: values.email, password: values.password });
      socket?.sendJsonMessage({ type: webSocketMessageRouteEnum.CREATE_SESSION, data: payload });
      const websocket = socket?.getWebSocket();
      if (websocket) {
        websocket.onmessage = async (ev: MessageEvent) => {
          const response = JSON.parse(ev.data);
          login(response);
          history.go(0);
          closeLoading();
        };

        websocket.onerror = () => {
          closeLoading();
        };

        setTimeout(() => {
          closeLoading();
        }, timeoutEnum.ONE_MINUTES);
      }
    } catch (error) {
      closeLoading();
      alertMessage.error(error.message);
    }
  };

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Formik
            initialValues={{
              password: '',
              email: '',
              showResetSessionModal: false,
              showPassword: false,
              isError: false,
              errorMessage: '',
            }}
            onSubmit={handleSubmit}>
            <CustomForm />
          </Formik>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Login;
