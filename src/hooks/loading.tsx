import { messagesEnum } from '@/enums/messagesEnum';
import React, { createContext, useContext, useState } from 'react';

type LoadingHookType = {
  openLoading: () => void;
  closeLoading: () => void;
  openLoadingAuth: () => void;
  closeLoadingAuth: () => void;
  openLoadingCurrentAccount: () => void;
  closeLoadingCurrentAccount: () => void;
  isLoadingMessage: messagesEnum;
  isLoading: boolean;
  isLoadingAuth: boolean;
  isLoadingCurrentAccount: boolean;
};

const LoadingHookContext = createContext<LoadingHookType | null>(null);

const INITIAL_IS_LOADING = false;

export const LoadingHookProvider = ({ children }: { children: React.ReactElement }) => {
  const [isLoading, setIsLoading] = useState(INITIAL_IS_LOADING);
  const [isLoadingAuth, setIsLoadingAuth] = useState(INITIAL_IS_LOADING);
  const [isLoadingMessage, setIsLoadingMessage] = useState(messagesEnum.LOADING);
  const [isLoadingCurrentAccount, setIsLoadingCurrentAccount] = useState(INITIAL_IS_LOADING);

  const openLoading = (message?: messagesEnum) => {
    message && setIsLoadingMessage(message);
    setIsLoading(true);
  };
  const closeLoading = () => setIsLoading(INITIAL_IS_LOADING);

  const openLoadingAuth = (message?: messagesEnum) => {
    message && setIsLoadingMessage(message);
    setIsLoadingAuth(true);
  };
  const closeLoadingAuth = () => setIsLoadingAuth(INITIAL_IS_LOADING);

  const openLoadingCurrentAccount = (message?: messagesEnum) => {
    message && setIsLoadingMessage(message);
    setIsLoadingCurrentAccount(true);
  };

  const closeLoadingCurrentAccount = () => setIsLoadingCurrentAccount(INITIAL_IS_LOADING);

  return (
    <LoadingHookContext.Provider
      value={{
        isLoading,
        isLoadingAuth,
        isLoadingMessage,
        isLoadingCurrentAccount,
        openLoadingCurrentAccount,
        closeLoadingCurrentAccount,
        openLoadingAuth,
        closeLoadingAuth,
        closeLoading,
        openLoading,
      }}>
      {children}
    </LoadingHookContext.Provider>
  );
};

export const useLoading = (): LoadingHookType => {
  const socket = useContext(LoadingHookContext);

  if (!socket) {
    throw new Error('useLoading deve ser usado dentro de um LoadingHookProvider');
  }

  return socket;
};
