import React, { useCallback, useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { useMemo } from 'react';

import { useAuth } from '@/hooks/auth';
import DefaultModal from '../DefaultModal';
import { Container, Text, Title } from './styles';
import { useUser } from '@/hooks/user';

interface PropsImp {
  visible: boolean;
  closeModal: Function;
  onLimit: Function;
  onStayConnected: Function;
}

const InactivityModal = ({ visible, closeModal, onLimit, onStayConnected }: PropsImp): JSX.Element => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    user: { firstName, lastName },
  } = useUser();
  const { isAuth } = useAuth();
  const [timer, setTimer] = useState(0);
  const limitInSeconds = 300;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const formatTimer = (num: number) => {
    return moment('05:00', 'mm:ss').subtract(Math.min(num, limitInSeconds), 's').format('mm:ss');
  };

  const timerString = useMemo(() => formatTimer(timer), [timer]);

  useEffect(() => {
    if (visible) {
      setTimer(0);
      clearTimer();
      intervalRef.current = setInterval(() => {
        setTimer(count => count + 1);
      }, 1000);
    }

    return clearTimer;
  }, [visible, clearTimer]);

  useEffect(() => {
    if (timer >= limitInSeconds && intervalRef.current) {
      clearTimer();
      onLimit();
      setTimer(0);
    }
  }, [timer, clearTimer, onLimit]);

  useEffect(() => {
    if (visible && !isAuth) {
      console.info('clear_interval');
      clearTimer();
    }
  }, [isAuth, visible, clearTimer]);

  const handleClose = () => {
    clearTimer();
    closeModal();
  };

  const handleStayConnected = () => {
    clearTimer();
    onStayConnected();
    closeModal();
  };

  return (
    <DefaultModal
      isOpen={visible}
      onCancel={handleClose}
      onClose={handleClose}
      onConfirm={handleStayConnected}
      title="Voltar a acessar o Sei Cálculos?">
      <Container>
        <Title>
          <b>Deslogando em {timerString}</b>
        </Title>

        <Text>
          Prezado {firstName} {lastName},
        </Text>
        <Text>Sua sessão vai ser encerrada devido à inatividade.</Text>
        <Text>
          Atenciosamente, <b>Sei Cálculos</b>
        </Text>
      </Container>
    </DefaultModal>
  );
};

export default InactivityModal;
