import React, { useEffect, useState } from 'react';
import FormGroup from '@components/FormGroup';
import CustomSelect from '@components/CustomSelect';
import UserServices from '@services/UserServices';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import ButtonDefault from '@components/ButtonDefault';
import profileSchema from '../../../../validators/profileSchema';
import { useFormik } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { alertMessages } from '@/hooks/alertMessages';
import { UserImp, useUser } from '@/hooks/user';

interface IProps {
  id: string | number;
  treatment: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
}

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

const Profile = (props: IProps): JSX.Element => {
  const alertMessage = alertMessages();

  const userServices = new UserServices();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleChange, handleSubmit, isSubmitting, setSubmitting, values, errors, touched, setValues } = useFormik({
    initialValues: props,
    validationSchema: profileSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        setSubmitting(true);

        const userUpdated: UserImp = await userServices.updateCompleteProfile(values);
        setUser(userUpdated);
        setSubmitting(false);

        alertMessage.successUpdated('As informações do seu perfil foram atualizadas com sucesso');
      } catch (error) {
        setSubmitting(false);

        alertMessage.warningError(String(error) || 'Erro ao enviar dados');
      }
    },
  });

  useEffect(() => {
    setValues(props);
  }, [props]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <CustomSelect
          id="registertreatment"
          label="Forma de tratamento"
          name="treatment"
          placeholder="Selecione como prefere ser tratado"
          value={values.treatment}
          // error={errors.treatment && touched.treatment ? errors.treatment : ''}
          isValid={!errors.treatment}
          onChange={handleChange}
          options={treatmentOptions}
        />

        <FormGroup
          id="registeremail"
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
          error={errors.email && touched.email ? errors.email : ''}
          label="E-mail *"
          isValid={!errors.email}
        />
      </div>
      <div>
        <div>
          <FormGroup
            id="password"
            name="password"
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            label="Senha *"
            error={errors.password}
          />
          <a href="#loginPassword" onClick={event => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye color={'black'} /> : <FaEyeSlash color={'black'} />}
          </a>
        </div>
        <div>
          <FormGroup
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
            type={showConfirmPassword ? 'text' : 'password'}
            error={errors.confirmPassword}
            label="Confirmar Senha *"
          />
          <a href="#loginConfirmPassword" onClick={event => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEye color={'black'} /> : <FaEyeSlash color={'black'} />}
          </a>
        </div>
      </div>
      <div>
        <FormGroup
          id="registerName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          type="text"
          error={errors.firstName && touched.firstName ? errors.firstName : ''}
          label="Nome *"
          isValid={!errors.firstName}
        />

        <FormGroup
          id="registerLastName"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          type="text"
          error={errors.lastName && touched.lastName ? errors.lastName : ''}
          label="Sobrenome *"
          isValid={!errors.lastName}
        />

        <ButtonDefault type={'submit'} label="Salvar" />
      </div>
    </form>
  );
};

export default Profile;
