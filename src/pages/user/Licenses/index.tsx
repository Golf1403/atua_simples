import React, { useState, useEffect } from 'react';

import PlansServices from '@services/PlansServices';
import LicenseServices from '@services/LicenseServices';
import { useDispatch } from 'react-redux';
import { setFrequencies, setSelectedFrequency } from '@store/plans/actions';
import PlansTable from '@components/PlansTable';
import ModalSuccess from './ModalSuccess';

import { useLoading } from '@/hooks/loading';
import { BackContainer, Footer, FooterContainer, Form, FormContainer, NextContainer } from './styles';
import { useFormikContext } from 'formik';
import { labelsEnum } from '@/enums/labelsEnum';
import { ButtonActionDefault } from '@/styles/global';

const CustomForm = () => {
  const dispatch = useDispatch();
  const { values } = useFormikContext<any>();
  const { closeLoading, openLoading, isLoading } = useLoading();

  const licenseServices = new LicenseServices();
  const plansServices = new PlansServices();

  const [currentLicense, setCurrentLicense] = useState({ planId: '', frequencyId: '', usersQuantity: 0 });

  const [modalSuccessOpen, setSuccessOpen] = useState(false);

  const closeSuccess = () => {
    setSuccessOpen(false);
  };

  const fetchFrequencies = async () => {
    const frequencies = await plansServices.plansFrequencies();
    dispatch(setFrequencies(frequencies));
  };

  const getFrequency = async () => {
    try {
      if (!values.frequencyId.length) return;
      openLoading();
      const frequencyResponse = await new PlansServices().frequencyDetail(values.frequencyId);
      dispatch(setSelectedFrequency(frequencyResponse));
      closeLoading();
    } catch (error) {
      closeLoading();
    }
  };

  useEffect(() => {
    fetchFrequencies();
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

  useEffect(() => {
    getFrequency();
  }, [values.frequencyId]);

  const handleSubmit = () => {
    console.log('submit');
  };

  const fetchPlanInfo = async () => {
    try {
      const licenseInfo = await licenseServices.getUserLicense();
      const { planId, frequencyId, usersQuantity } = licenseInfo;

      setCurrentLicense({ planId, frequencyId, usersQuantity });

      closeLoading();
    } catch (error) {
      closeLoading();
    }
  };

  useEffect(() => {
    fetchPlanInfo();
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <div>
          <h2>Meus Planos</h2>
          <p>Selecione uma das opções abaixo</p>
        </div>
      </div>

      <PlansTable />

      <FooterContainer>
        <Footer>
          <BackContainer>
            <ButtonActionDefault type="submit">{labelsEnum.CANCEL} Plano</ButtonActionDefault>
          </BackContainer>

          <NextContainer>
            <ButtonActionDefault type="submit">Fazer Pagamento</ButtonActionDefault>
          </NextContainer>
        </Footer>
      </FooterContainer>

      <ModalSuccess modalIsOpen={modalSuccessOpen} closeModal={closeSuccess} />
    </Form>
  );
};

const Licenses = (): JSX.Element => {
  return (
    <FormContainer initialValues={{ usersQuantity: 1, frequencyId: '', planType: null }} onSubmit={() => {}}>
      <CustomForm />
    </FormContainer>
  );
};

export default Licenses;
