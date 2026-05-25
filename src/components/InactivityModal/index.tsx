import React, { useEffect, useRef, useState } from 'react';

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
  const formatTimer = (num: number) => {
    return moment('05:00', 'mm:ss').subtract(num, 's').format('mm:ss');
  };

  const timerString = useMemo(() => formatTimer(timer), [timer]);

  useEffect(() => {
    if (visible) {
      setTimer(0);
      intervalRef.current = setInterval(() => {
        setTimer(count => (count < 300 ? count + 1 : 0));
      }, 1000);
    }
  }, [visible]);

  useEffect(() => {
    if (timer == 300 && intervalRef.current) {
      clearInterval(intervalRef.current);
      closeModal();
      onLimit();
      setTimer(0);
    }
  }, [timer]);

  useEffect(() => {
    if (visible && !isAuth && intervalRef.current) {
      console.info('clear_interval');
      clearInterval(intervalRef.current);
    }
  }, [isAuth, visible]);

  return (
    <DefaultModal
      isOpen={visible}
      onCancel={() => closeModal()}
      onClose={() => closeModal()}
      onConfirm={() => {
        onStayConnected();
        closeModal();
        if (intervalRef.current) clearInterval(intervalRef.current);
      }}
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
