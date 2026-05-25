import React from 'react';
const { Link } = require('react-router-dom');
import { useFormikContext } from 'formik';
import { Footer } from '../styles';

const FooterLabels = () => {
  const { values } = useFormikContext<{
    password: string;
    email: string;
    showResetSessionModal: boolean;
    showPassword: boolean;
    isError: boolean;
    errorMessage: string;
  }>();

  return (
    <Footer>
      <Link to="/forgot-password" title="Esqueceu sua senha?">
        Esqueceu sua senha?
      </Link>
      {values.showResetSessionModal && (
        <Link to="/forgot-session" title="conecte-se aqui">
          Não consegue entrar <b>CLIQUE AQUI</b>
        </Link>
      )}
    </Footer>
  );
};
export default FooterLabels;
