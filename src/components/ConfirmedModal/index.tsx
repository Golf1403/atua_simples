import React from 'react';
import AuthServices from '@/services/AuthServices';

import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import DefaultModal from '../DefaultModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { Text } from './styles';
import { UserImp, useUser } from '@/hooks/user';

const ConfirmedModal = (): JSX.Element => {
  const { openLoading, closeLoading } = useLoading();
  const alertMessage = alertMessages();
  const { user } = useUser();

  const authService = new AuthServices();
  const sendMail = async () => {
    try {
      openLoading();
      await authService.emailConfirmation(user);
      alertMessage.success('E-mail enviado com sucesso!');
      closeLoading();
    } catch (error) {
      closeLoading();
      alertMessage.error('Não foi possível enviar a confirmação de e-mail!');
    }
  };

  return (
    <DefaultModal
      onClose={() => {}}
      onCancel={() => {}}
      onConfirm={async () => await sendMail()}
      type="button"
      isOpen={false}
      title={`Confirmar ${labelsEnum.EMAIL}`}>
      <Text>{'Você deve confirmar seu e-mail para acessar o sistema!'}</Text>
    </DefaultModal>
  );
};

export default ConfirmedModal;
