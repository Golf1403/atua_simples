import React, { createContext, useContext, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ToastContainer from '../components/ToastContainer';
import Dictionary from '@/services/DictionaryServices';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

interface IProps {
  children: React.ReactChild;
}

export const ToastProvider: React.FC<IProps> = ({ children }) => {
  const dictionary = new Dictionary('pt-br');
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
    const id = uuidv4();

    const toast = {
      id,
      type,
      title,
      description: description ? dictionary.translate(description) : description,
    };

    setMessages(state => [...state, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be user within a ToastProvider');
  }

  return context;
}
