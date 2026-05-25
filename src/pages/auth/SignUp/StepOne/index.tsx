import React from 'react';
import { Formik } from 'formik';
import userDataSchema from '../../../../validators/userDataSchema';
import StepOneForm from './Form';

interface ValuesImp {
  treatment: string;
  lastName: string;
  email: string;
  password: string;
  firstName: string;
  confirmPassword: string;
}

interface IProps {
  nextStep: (values: ValuesImp) => void;
  prevStep: () => void;
  triggerValidation: boolean;
}

export interface StepOneImp {
  treatment: string;
  lastName: string;
  email: string;
  password: string;
  firstName: string;
  confirmPassword: string;
}

const StepOne = ({ nextStep, prevStep, triggerValidation }: IProps): JSX.Element => {
  const initialValues: ValuesImp = {
    treatment: '',
    lastName: '',
    email: '',
    password: '',
    firstName: '',
    confirmPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userDataSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={nextStep}>
      <StepOneForm prevStep={prevStep} triggerValidation={triggerValidation} />
    </Formik>
  );
};

export default StepOne;
