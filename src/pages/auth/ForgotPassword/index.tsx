import React, { SyntheticEvent, useEffect, useCallback } from 'react';
import AuthServices from '@services/AuthServices';

import { useHistory } from 'react-router-dom';
const { Link } = require('react-router-dom');

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import forgotPasswordDataSchema from '../../../validators/forgotPasswordDataSchema';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { useAuth } from '@/hooks/auth';
import { labelsEnum } from '@/enums/labelsEnum';
import { Button, Container, Form, FormContainer, Input, InputContainer, LinkContainer } from './styles';
import { useFormikContext } from 'formik';
import { AiFillLock } from 'react-icons/ai';
const ForgotSessionForm: React.FC = () => {
  const authServices = new AuthServices();
  const alertMessage = alertMessages();
  const { openLoading, closeLoading } = useLoading();
  const { values } = useFormikContext<{
    email: string;
  }>();

  const handleSubmit = async (event: SyntheticEvent) => {
    try {
      event.preventDefault();
      openLoading();
      const response = await authServices.forgotPassword(values.email);

      if (response?.success) alertMessage.primarySuccess(response.message);
      closeLoading();
    } catch (error) {
      closeLoading();
      alertMessage.dangerError(labelsEnum.SEND_EMAIL_ERROR);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Input id="email" name="email" type="email" placeholder={labelsEnum.EMAIL_PLACEHOLDER} label={labelsEnum.EMAIL} />

      <Button type="submit">{labelsEnum.SEND}</Button>
      <LinkContainer>
        <Link to="/login" title={labelsEnum.BACK}>
          {labelsEnum.BACK}
        </Link>
      </LinkContainer>
    </Form>
  );
};
const ResetPasswordForm: React.FC = () => {
  const history = useHistory();
  const alertMessage = alertMessages();
  const authServices = new AuthServices();
  const { openLoading, closeLoading } = useLoading();
  const { values, setFieldValue } = useFormikContext<{
    confirmPassword: string;
    showConfirmPassword: boolean;
    showPassword: boolean;
    newPassword: string;
    token: string;
  }>();

  const handleSubmit = useCallback(async () => {
    try {
      openLoading();

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || '';
      const email = urlParams.get('email') || '';

      const payload = { ...values, token, email };
      await forgotPasswordDataSchema.validate(payload);
      await authServices.resetPassword(payload);

      alertMessage.primarySuccess('Senha atualizada com sucesso');
      // history.push('/login');
    } catch (error) {
      alertMessage.dangerError(error?.message || 'Ocorreu um erro ao enviar o e-mail!');
    } finally {
      closeLoading();
    }
  }, [history, alertMessage, openLoading, closeLoading, values]);

  return (
    <Form>
      <InputContainer>
        <Input
          id="newPassword"
          name="newPassword"
          type={values.showPassword ? 'text' : 'password'}
          placeholder="Digite a nova senha"
          label="Nova senha"
          iconPosition="left"
          icon={AiFillLock}
          iconPass={!values.showPassword ? FaEyeSlash : FaEye}
          onIconPassClick={() => setFieldValue('showPassword', !values.showPassword)}
        />
      </InputContainer>
      <InputContainer>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={values.showConfirmPassword ? 'text' : 'password'}
          placeholder="Digite a confirmação da senha"
          label="Confirmar nova senha"
          iconPosition="left"
          icon={AiFillLock}
          iconPass={!values.showConfirmPassword ? FaEyeSlash : FaEye}
          onIconPassClick={() => setFieldValue('showConfirmPassword', !values.showConfirmPassword)}
        />
      </InputContainer>

      <Button onClick={handleSubmit}>{`${labelsEnum.UPDATE} ${labelsEnum.PASSWORD}`}</Button>
      <LinkContainer>
        <Link to="/login" title={labelsEnum.BACK}>
          {labelsEnum.BACK}
        </Link>
      </LinkContainer>
    </Form>
  );
};
const ForgotSession: React.FC = () => {
  const history = useHistory();
  const { isAuth } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  useEffect(() => {
    if (isAuth) history.push('/');
  }, []);

  return (
    <Container initialValues={{ email: '', newPassword: '', confirmPassword: '', token }} onSubmit={() => {}}>
      <FormContainer>{!token ? <ForgotSessionForm /> : <ResetPasswordForm />}</FormContainer>
    </Container>
  );
};

export default ForgotSession;
