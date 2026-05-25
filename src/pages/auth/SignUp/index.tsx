import React, { useState, Fragment } from 'react';
import StepOne, { StepOneImp } from './StepOne';
import StepTwo from './StepTwo';
import PlanTypeImp from '@interfaces/plans/PlanTypeImp';
import { useHistory } from 'react-router-dom';
import { ApplicationState } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
import { setFocusOnStep, resetRegister } from '@store/register/actions';
import { alertMessages } from '@/hooks/alertMessages';

import { loginPage } from '@/Routes/pages/auth';
import { useLoading } from '@/hooks/loading';
import { Container, FormContainer, NavTab } from './styles';
import http, { getErrorMessage } from '@/services/http';

interface ValueImp {
  name: string;
  lastName: string;
  email: string;
  password: string;
  firstName: string;
  confirmPassword: string;
  treatment: string;
  userId: string;
  usersQuantity: 1;
  frequencyId: string;
  plan: PlanTypeImp | null;
}

const SignUp: React.FC = () => {
  const alertMessage = alertMessages();
  const history = useHistory();
  const dispatch = useDispatch();

  const { activeStep } = useSelector((state: ApplicationState) => state.register);
  const [validateStepOne, setValidateStepOne] = useState(false);
  const { openLoading, closeLoading } = useLoading();
  const [values, setValues] = useState<ValueImp>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    firstName: '',
    confirmPassword: '',
    treatment: '',
    userId: '',
    usersQuantity: 1,
    frequencyId: '',
    plan: null,
  });

  const nextStep = async (newValues: any) => {
    if (activeStep == 0) {
      setValues(values => ({ ...values, ...newValues }));
      goToStep(1);
      submitStepOne();
      return;
    }

    if (activeStep == 1) return await completeRegister({ ...values, ...newValues });
  };

  const prevStep = () => {
    dispatch(setFocusOnStep(Math.max(activeStep - 1, 0)));
  };

  const goToStep = (stepNumber: number) => {
    dispatch(setFocusOnStep(stepNumber));
  };

  const goToLoginPage = () => {
    dispatch(resetRegister());
    history.push(loginPage.path);
  };

  const submitStepOne = () => {
    setValidateStepOne(false);
  };

  const completeRegister = async (values: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    firstName: string;
    confirmPassword: string;
    treatment: string;
    userId: string;
    usersQuantity: 1;
    frequencyId: string;
    plan: PlanTypeImp | null;
  }) => {
    try {
      openLoading();
      goToStep(0);

      const user: StepOneImp = {
        confirmPassword: values.confirmPassword,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        treatment: values.treatment,
      };
      if (!values.plan) throw new Error('Selectione o Plano!');

      const license = {
        quantity: values.usersQuantity,
        planType: values.plan.planHasFrequencyId,
      };

      await handleSubmitStepOne(user, license);
      closeLoading();
      history.push(loginPage.path);
    } catch (error) {
      closeLoading();
      alertMessage.error(getErrorMessage(error));
    }
  };

  const handleSubmitStepOne = async (
    user: StepOneImp,
    license: {
      quantity: number;
      planType: string;
    }
  ) =>
    http().post('users/create', {
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      treatment: user.treatment,
      license,
    });

  const stepsComponents = [
    <StepOne key={0} prevStep={goToLoginPage} nextStep={nextStep} triggerValidation={validateStepOne} />,
    <StepTwo key={1} prevStep={prevStep} nextStep={nextStep} />,
  ];

  return (
    <Fragment>
      <Container>
        {stepsComponents.map((stepComponent, key) => {
          return (
            <NavTab isActive={activeStep === key} key={key}>
              <FormContainer>{stepComponent}</FormContainer>
            </NavTab>
          );
        })}
      </Container>
    </Fragment>
  );
};

export default SignUp;
