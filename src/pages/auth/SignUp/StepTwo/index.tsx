import React from 'react';

import PlanTypeImp from '@interfaces/plans/PlanTypeImp';
import { Formik } from 'formik';
import planTypeSchema from '@/validators/planTypeSchema';
import StepTwoForm from './Form';

interface IProps {
  nextStep: Function;
  prevStep: Function;
}

const StepTwo = ({ prevStep, nextStep }: IProps): JSX.Element => {
  return (
    <Formik
      initialValues={{
        usersQuantity: 1,
        frequencyId: '',
        plan: null,
      }}
      validationSchema={planTypeSchema}
      validateOnMount={false}
      onSubmit={async values => {
        await nextStep(values);
      }}>
      <StepTwoForm nextStep={nextStep} prevStep={prevStep} />
    </Formik>
  );
};
export default StepTwo;
