import React, { useEffect, useState } from 'react';
import FormGroup from '@components/FormGroup';
import UserServices from '@services/UserServices';
import CustomSelect from '@components/CustomSelect';
import ButtonDefault from '@components/ButtonDefault';
import taxDataSchema from '../../../../validators/taxDataSchema';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import AddressServices from '@services/AddressServices';

import { TaxDataImp } from '@interfaces/serviceResponses/UserProfileResponseImp';

import stateOptions from '@lib/stateOptions';

import { useFormik } from 'formik';
import { onlyNumbers } from '@lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { cepMask, cnpjMask, cpfMask, phoneFixMask, phoneMask } from '@lib/masks';

import { ApplicationState } from '@store/index';
import CustomCheckboxControlled from '@components/CustomCheckboxControlled';
import { alertMessages } from '@/hooks/alertMessages';
import { useUser } from '@/hooks/user';

interface IProps {
  taxData: TaxDataImp;
  id: string | number;
}

const countryOptions: SelectOptionImp[] = [
  {
    id: 0,
    value: 'brasil',
    label: 'Brasil',
  },
  {
    id: 1,
    value: 'outros',
    label: 'Outros',
  },
];

const Profile = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const userServices = new UserServices();

  const alertMessage = alertMessages();

  const { taxData, id } = props;
  const {
    user: { firstName, lastName, group },
  } = useUser();
  const fullName = `${firstName} ${lastName}`;

  const [isPhisycalPerson, setIsPhisycalPerson] = useState<boolean>(false);
  const { handleChange, handleSubmit, setFieldValue, isSubmitting, setSubmitting, values, errors, touched, setValues } =
    useFormik({
      initialValues: taxData,
      validationSchema: taxDataSchema,
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async values => {
        setSubmitting(true);
        try {
          values.name = fullName;
          await userServices.updateTaxData(id, values);
          setSubmitting(false);

          alertMessage.successUpdated('As informações de pagamento foram atualizadas com sucesso');
        } catch (error) {
          setSubmitting(false);

          alertMessage.error(String(error) || 'Erro ao enviar dados');
        }
      },
    });

  const verifyZipCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let zipCode = e.target.value;

    zipCode = zipCode.replace(/\D/g, '');

    if (zipCode.length < 8) return;

    try {
      const response = await new AddressServices().getZipcode(zipCode);
      const { street, neighborhood, city, state } = response;

      setFieldValue('street', street);
      setFieldValue('neighborhood', neighborhood);
      setFieldValue('city', city);
      setFieldValue('state', state.toUpperCase());
    } catch (error) {
      console.error('CEP não encontrado');
      return false;
    }
  };

  const cpfOrCnpj = (document: string) => {
    const documentLength = onlyNumbers(document || '').length;

    if (!document) return -1;
    if (documentLength <= 11) setIsPhisycalPerson(true);
    else if (documentLength <= 14) setIsPhisycalPerson(false);
  };

  useEffect(() => {
    const { document } = taxData;
    cpfOrCnpj(document.replaceAll('_', ''));
  }, [taxData.document]);

  useEffect(() => {
    setValues(taxData);
  }, [taxData]);

  return (
    <form onSubmit={handleSubmit}>
      {group === 'owner' && (
        <>
          <div>
            <h3>Informações de cobrança</h3>
            <div>
              <div>
                <div>?</div>
                <p>As informações de cobrança são obrigatórias apenas nos planos pagos.</p>
              </div>
            </div>
          </div>

          <div>
            <CustomSelect
              id="registerCountry"
              name="country"
              value={values.country}
              // error={errors?.country && touched?.country ? errors?.country : ''}
              onChange={handleChange}
              label="País"
              isValid={!errors?.country}
              placeholder="Selecione o país *"
              options={countryOptions}
            />

            <FormGroup
              id="registerZipcode"
              name="zipcode"
              value={values.zipcode}
              onChange={handleChange}
              type="text"
              error={errors?.zipcode && touched?.zipcode ? errors?.zipcode : ''}
              label="CEP *"
              mask={cepMask}
              isValid={!errors?.zipcode}
            />

            <CustomSelect
              id="registerState"
              name="state"
              value={values.state}
              // error={errors?.state && touched?.state ? errors?.state : ''}
              onChange={handleChange}
              label="Estado *"
              isValid={!errors?.state}
              placeholder="Selecione o Estado"
              options={stateOptions}
            />

            <FormGroup
              id="registerCity"
              name="city"
              value={values.city}
              onChange={handleChange}
              type="text"
              error={errors?.city && touched?.city ? errors?.city : ''}
              label="Cidade *"
              isValid={!errors?.city}
            />
          </div>

          <div>
            <FormGroup
              id="registerStreet"
              name="street"
              value={values.street}
              onChange={handleChange}
              type="text"
              error={errors?.street && touched?.street ? errors?.street : ''}
              label="Logradouro *"
              isValid={!errors?.street}
            />

            <FormGroup
              id="registerAddressNumber"
              name="number"
              value={values.number}
              onChange={handleChange}
              type="text"
              error={errors?.number && touched?.number ? errors?.number : ''}
              label="Número *"
              isValid={!errors?.number}
            />

            <FormGroup
              id="registerStreetLineTwo"
              name="complement"
              value={values.complement}
              onChange={handleChange}
              type="text"
              error={errors?.complement && touched?.complement ? errors?.complement : ''}
              label="Complemento"
              isValid={!errors?.complement}
            />
          </div>

          <div>
            <FormGroup
              id="registerNeighborhood"
              name="neighborhood"
              value={values.neighborhood}
              onChange={handleChange}
              type="text"
              error={errors?.neighborhood && touched?.neighborhood ? errors?.neighborhood : ''}
              label="Bairro *"
              isValid={!errors?.neighborhood}
            />

            <FormGroup
              id="registerDocument"
              name="document"
              value={values.document}
              onChange={(event: React.ChangeEvent<any>) => {
                setFieldValue('document', event.target.value);
                cpfOrCnpj(event.target.value);
              }}
              type="text"
              error={errors?.document && touched?.document ? errors?.document : ''}
              label="Documento *"
              mask={isPhisycalPerson ? cpfMask : cnpjMask}
              isValid={!errors?.document}
            />
            <CustomCheckboxControlled
              id="onPhisycalPerson"
              name="onPhisycalPerson"
              checked={isPhisycalPerson}
              label="CPF"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsPhisycalPerson(e.target.checked)}
            />
          </div>

          <div>
            <FormGroup
              id="registerPhoneOne"
              name="phone1"
              value={values.phone1}
              onChange={handleChange}
              type="text"
              error={errors?.phone1 && touched?.phone1 ? errors?.phone1 : ''}
              label="Telefone celular *"
              mask={phoneMask}
              isValid={!errors?.phone1}
            />

            <FormGroup
              id="registerPhoneTwo"
              name="phone2"
              value={values.phone2}
              onChange={handleChange}
              type="text"
              error={errors?.phone2 && touched?.phone2 ? errors?.phone2 : ''}
              label="Telefone fixo"
              mask={phoneFixMask}
              isValid={!errors?.phone2}
            />

            <ButtonDefault type={'submit'} label="Salvar" />
          </div>
        </>
      )}
    </form>
  );
};

export default Profile;
