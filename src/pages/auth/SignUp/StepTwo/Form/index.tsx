import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import PlansTable from '@components/PlansTable';
import PlansServices from '@services/PlansServices';
import { setFrequencies, setSelectedFrequency } from '@store/plans/actions';
import { useFormikContext } from 'formik';
import { BackContainer, Footer, FooterContainer, Form, FormContainer, NextContainer } from './styles';
import { ButtonActionDefault } from '@/styles/global';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { labelsEnum } from '@/enums/labelsEnum';
import PlanTypeImp from '@/interfaces/plans/PlanTypeImp';

interface IProps {
  nextStep: Function;
  prevStep: Function;
}

interface ValueImp {
  usersQuantity: number;
  frequencyId: string;
  plan: null | PlanTypeImp;
}

const StepTwoForm = ({ prevStep }: IProps): JSX.Element => {
  const { handleSubmit, errors, initialErrors, values, setErrors } = useFormikContext<ValueImp>();
  const { closeLoading, openLoading } = useLoading();
  const dispatch = useDispatch();

  const fetchData = async () => {
    const plansServices = new PlansServices();
    const frequencies = await plansServices.plansFrequencies();
    dispatch(setFrequencies(frequencies));
  };

  useEffect(() => {
    fetchData();
    return () => {
      dispatch(
        setFrequencies({
          currentPage: 1,
          pages: 1,
          totalPages: 1,
          frequenciesList: [],
        })
      );
    };
  }, []);

  const getFrequencyPlans = async () => {
    try {
      if (!values.frequencyId?.length) return;
      openLoading();
      const frequencyResponse = await new PlansServices().frequencyDetail(values.frequencyId);
      dispatch(setSelectedFrequency(frequencyResponse));
      closeLoading();
    } catch (error) {
      closeLoading();
    }
  };

  useEffect(() => {
    getFrequencyPlans();
  }, [values.frequencyId]);

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
        <h2>Selecione seu plano</h2>

        <PlansTable />

        <FooterContainer>
          <Footer>
            <BackContainer>
              <ButtonActionDefault type="button" onClick={() => prevStep()}>
                {labelsEnum.BACK}
              </ButtonActionDefault>
            </BackContainer>
            <NextContainer>
              <ButtonActionDefault type="submit">{labelsEnum.FINISH}</ButtonActionDefault>
            </NextContainer>
          </Footer>
        </FooterContainer>
      </Form>
    </FormContainer>
  );
};
export default StepTwoForm;
