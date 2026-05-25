import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { ToastMessage } from '../../hooks/toast';
import { Container, StyledToast } from './styles';

const ToastContainer: React.FC<{ messages: ToastMessage[] }> = ({ messages }) => {
  const [visibleMessages, setVisibleMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    setVisibleMessages(messages);
  }, [messages]);

  return (
    <Container>
      {visibleMessages.map((message, index) => (
        <StyledToast key={message.id} $index={index}>
          <Toast message={message} />
        </StyledToast>
      ))}
    </Container>
  );
};

export default ToastContainer;
