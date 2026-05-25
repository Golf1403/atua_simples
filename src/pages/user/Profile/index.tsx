import React, { useState, useEffect } from 'react';
import Title from '@components/Title';
import TaxData from './TaxData';
import UserServices from '@services/UserServices';
import UserInformations from './UserInformations';
import UserProfileResponseImp from '@interfaces/serviceResponses/UserProfileResponseImp';

import profileSchema from '../../../validators/profileSchema';

import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';

import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { TitleContainer } from '@/styles/global';

export const emptyProfile: UserProfileResponseImp = {
  id: '',
  treatment: '',
  firstName: '',
  password: '',
  confirmPassword: '',
  lastName: '',
  email: '',
  taxData: {
    country: '',
    zipcode: '',
    state: '',
    document: '',
    number: '',
    complement: '',
    phone1: '',
    phone2: '',
    city: '',
    street: '',
    name: '',
    neighborhood: '',
  },
};

const Profile = (): JSX.Element => {
  const dispatch = useDispatch();
  const alertMessage = alertMessages();

  const userServices = new UserServices();
  const { closeLoading, openLoading, isLoading } = useLoading();

  const { handleChange, handleSubmit, setFieldValue, isSubmitting, setSubmitting, values, errors, touched, setValues } =
    useFormik({
      initialValues: emptyProfile,
      validationSchema: profileSchema,
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async values => {
        const data = {
          id: values.id,
          treatment: values.treatment,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        };

        setSubmitting(true);
        try {
          await userServices.updateCompleteProfile(data);
          alertMessage.successUpdated('As informações do seu perfil foram atualizadas com sucesso');
          setSubmitting(false);
        } catch (error) {
          alertMessage.warningError('Ocorreu algum problema no envio das informações, por favor tente novamente');
          setSubmitting(false);
        }
      },
    });

  useEffect(() => {
    if (isLoading) {
      const fetchProfileData = async () => {
        try {
          openLoading();
          const profileData = await userServices.getCompleteProfile();
          setValues(profileData);
          closeLoading();
        } catch (error) {
          closeLoading();
        }
      };

      fetchProfileData();
    }
  }, [isLoading, setValues]);

  return (
    <section>
      <TitleContainer>
        <Title title="Usuário - Editar perfil" />
      </TitleContainer>

      <div>
        <div>
          <UserInformations
            id={values.id}
            treatment={values.treatment}
            firstName={values.firstName}
            password={values.password}
            confirmPassword={values.confirmPassword}
            lastName={values.lastName}
            email={values.email}
          />

          <TaxData taxData={values.taxData} id={values.id} />
        </div>
      </div>
    </section>
  );
};

export default Profile;
