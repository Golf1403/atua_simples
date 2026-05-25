import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Form, Image, Input, InputContainer } from '../styles';
import { AiFillLock, AiFillMail } from 'react-icons/ai';
import Logo from '@/images/SEI-logo.png';
import { labelsEnum } from '@/enums/labelsEnum';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import FooterLabels from '../FooterLabels';

const LoginForm = () => {
  const { values, setFieldValue } = useFormikContext<{
    password: string;
    email: string;
    showResetSessionModal: boolean;
    showPassword: boolean;
    isError: boolean;
    errorMessage: string;
  }>();

  return (
    <Form>
      <Image loading="eager" src={Logo} alt="Logo SEI Cálculos" />
      <InputContainer>
        <Input iconPosition="left" name="email" icon={AiFillMail} label={labelsEnum.EMAIL} />
      </InputContainer>
      <InputContainer>
        <Input
          iconPosition="left"
          name="password"
          icon={AiFillLock}
          iconPass={!values.showPassword ? FaEyeSlash : FaEye}
          onIconPassClick={() => {
            setFieldValue('showPassword', values.showPassword ? false : true);
          }}
          type={values.showPassword ? 'text' : 'password'}
          label={labelsEnum.PASSWORD}
        />
      </InputContainer>
      <Button type="submit">{labelsEnum.TO_ENTER}</Button>

      <FooterLabels />
    </Form>
  );
};

export default LoginForm;
