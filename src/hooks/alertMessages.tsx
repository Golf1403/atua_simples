import React, { createContext, useContext } from 'react';
import { useToast } from '@/hooks/toast';

type MessageType = string | Error;

type AlertMessageType = {
  dangerError: Function;
  primarySuccess: Function;
  successLoaded: Function;
  successRestored: Function;
  successSaved: Function;
  successWaiting: Function;
  successUpdated: Function;
  sucessDeleted: Function;
  warningWaiting: Function;
  warning: Function;
  atentionError: Function;
  warningError: Function;
  success: Function;
  errorDangerOrPrimary: Function;
  error: Function;
};

const AlertMessageContext = createContext<AlertMessageType>({
  dangerError: () => null,
  primarySuccess: () => null,
  successLoaded: () => null,
  successRestored: () => null,
  successSaved: () => null,
  successWaiting: () => null,
  successUpdated: () => null,
  sucessDeleted: () => null,
  warningWaiting: () => null,
  warning: () => null,
  atentionError: () => null,
  warningError: () => null,
  success: () => null,
  errorDangerOrPrimary: () => null,
  error: () => null,
});

interface IProps {
  children: React.ReactChild;
}

export const AlertMessageProvider: React.FC<IProps> = ({ children }) => {
  const toast = useToast();

  function transform(message?: MessageType) {
    return typeof message == 'string' ? message : 'Houve um Erro!';
  }
  function error(message?: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'error',
      title: 'Erro',
    });
  }
  function errorDangerOrPrimary(message: MessageType, type: string) {
    return toast.addToast({
      description: transform(message),
      type: type == 'error' ? 'error' : 'success',
      title: 'Erro',
    });
  }
  function success(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Sucesso',
    });
  }
  function warningError(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'info',
      title: 'Erro',
    });
  }
  function atentionError(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'error',
      title: 'Atenção',
    });
  }
  function warning(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'info',
      title: 'Atenção',
    });
  }
  function warningWaiting(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'info',
      title: 'Aguarde...',
    });
  }
  function sucessDeleted(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Deletado(a)',
    });
  }
  function successUpdated(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Atualizado',
    });
  }
  function successSaved(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Salvo',
    });
  }
  function successRestored(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Restaurada',
    });
  }
  function successLoaded(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Carregado(s)',
    });
  }
  function successWaiting(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Aguarde...',
    });
  }
  function primarySuccess(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'success',
      title: 'Sucesso',
    });
  }
  function dangerError(message: MessageType) {
    return toast.addToast({
      description: transform(message),
      type: 'error',
      title: 'Erro',
    });
  }

  return (
    <AlertMessageContext.Provider
      value={{
        dangerError,
        primarySuccess,
        successLoaded,
        successRestored,
        successSaved,
        successWaiting,
        successUpdated,
        sucessDeleted,
        warningWaiting,
        warning,
        atentionError,
        warningError,
        success,
        errorDangerOrPrimary,
        error,
      }}>
      {children}
    </AlertMessageContext.Provider>
  );
};

export function alertMessages(): AlertMessageType {
  const context = useContext(AlertMessageContext);

  if (!context) {
    throw new Error('useToast must be user within a ToastProvider');
  }

  return context;
}
