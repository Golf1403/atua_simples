import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

import DefaultInput from '@/components/DefaultInput';
import {
  ColumnContainer,
  InputContainer,
  RowContainer,
  BackContainer,
  Footer,
  FooterContainer,
  Form,
  FormContainer,
  NextContainer,
} from './styles';
import { ButtonActionDefault } from '@/styles/global';
import CustomSelect from '@/components/CustomSelect';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import { alertMessages } from '@/hooks/alertMessages';
import { labelsEnum } from '@/enums/labelsEnum';

interface IProps {
  prevStep: Function;
  triggerValidation: boolean;
}

interface ValuesImp {
  treatment: string;
  lastName: string;
  email: string;
  password: string;
  firstName: string;
  confirmPassword: string;
}

const StepOneForm = ({ triggerValidation, prevStep }: IProps): JSX.Element => {
  const { errors, handleSubmit, validateForm, initialErrors, setErrors } = useFormikContext<ValuesImp>();

  const treatmentOptions: SelectOptionImp[] = [
    {
      id: 0,
      value: 'sr',
      label: 'Sr(a).',
    },
    {
      id: 1,
      value: 'dr',
      label: 'Dr(a).',
    },
  ];

  useEffect(() => {
    if (triggerValidation) {
      validateForm();
    }
  }, [triggerValidation, validateForm]);

  const alertMessage = alertMessages();

  useEffect(() => {
    for (const prop in errors) {
      const msg = (errors as any)[prop];
      alertMessage.error(msg);
      setErrors(initialErrors);
    }
  }, [errors]);

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h2>Dados pessoais</h2>
        <RowContainer>
          <ColumnContainer>
            <InputContainer>
              <CustomSelect
                id="registerTreatment"
                label="Forma de tratamento *"
                name="treatment"
                placeholder="Selecione como prefere ser tratado"
                options={treatmentOptions}
              />
            </InputContainer>
            <InputContainer>
              <DefaultInput id="registerFirstName" name="firstName" type="text" label="Nome *" />
            </InputContainer>
            <InputContainer>
              <DefaultInput id="registerPassword" name="password" type="password" label="Senha *" />
            </InputContainer>
          </ColumnContainer>
          <ColumnContainer>
            <InputContainer>
              <DefaultInput id="registerEmail" name="email" type="email" label="E-mail *" />
            </InputContainer>
            <InputContainer>
              <DefaultInput id="registerLastName" name="lastName" type="text" label="Sobrenome *" />
            </InputContainer>
            <InputContainer>
              <DefaultInput
                id="registerConfirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirme a Senha *"
              />
            </InputContainer>
          </ColumnContainer>
        </RowContainer>
        <FooterContainer>
          <Footer>
            <BackContainer>
              <ButtonActionDefault type="button" onClick={() => prevStep()}>
                {labelsEnum.BACK}
              </ButtonActionDefault>
            </BackContainer>
            <NextContainer>
              <ButtonActionDefault type="submit">{labelsEnum.NEXT}</ButtonActionDefault>
            </NextContainer>
          </Footer>
        </FooterContainer>
      </Form>
    </FormContainer>
  );
};

export default StepOneForm;
