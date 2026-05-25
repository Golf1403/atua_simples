import React, { Fragment, useEffect, useState } from 'react';
import { Formik } from 'formik';
import PaymentForm from './PaymentForm';
import http from '@/services/http';
import { onlyNumbers } from '@/lib/utils';
import { useUser } from '@/hooks/user';
import DefaultModal from '../DefaultModal';
import logout from '@/services/http/logout';

interface CardImp {
  number: string;
  holderName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface LicensePagarmeImp {
  payment_method: string;
  interval: string;
  interval_count: number;
  billing_type: string;
  customer: {
    name: string;
    email: string;
    type: string;
    documents: {
      type: string;
      number: string;
    }[];
  };
  license: {
    additionalValue: string;
    frequencyId: string;
    id: string;
    planHasFrequencyId: string;
    planId: string;
    usersQuantity: number;
    value: string;
  };
  card: CardImp;
  items: {
    description: string;
    quantity: number;
    pricing_scheme: {
      price: number;
    };
  }[];
  metadata: {
    item_assinado: string;
  };
}
export interface TaxData {
  country: string;
  zipcode: string;
  state: string;
  document: string;
  number: number;
  complement: string;
  ieRg: string;
  phone1: string;
  phone2: string;
  city: string;
  street: string;
  name: string;
  neighborhood: string;
}

type SubmitImp = LicensePagarmeImp & {
  taxdata: TaxData;
};

const LicenseForm = (param: LicensePagarmeImp) => {
  const { user } = useUser();
  const [openModal, setOpenModal] = useState({ open: false, url: '', type: '' });
  const [loadingTaxData, setLoadingTaxData] = useState(true);
  const [taxData, setTaxData] = useState<TaxData>({
    country: 'BR',
    zipcode: '',
    state: '',
    document: '',
    number: 1,
    complement: '',
    phone1: '',
    phone2: '',
    city: '',
    street: '',
    ieRg: '',
    name: '',
    neighborhood: '',
  });

  const saveTaxData = async (values: SubmitImp) => {
    const taxdata = values.taxdata;

    const payload = {
      ...taxdata,
      name: `${user.firstName} ${user.lastName}`,
      zipcode: onlyNumbers(taxdata.zipcode),
      phone1: onlyNumbers(taxdata.phone1),
      document: onlyNumbers(taxdata.document),
      ieRg: onlyNumbers(taxdata.ieRg),
      phone2: onlyNumbers(taxdata.phone2),
    };

    await http().post('/users/taxdata', payload, { params: { userId: user.id } });
  };

  const createSignature = async (values: SubmitImp) => {
    const signature: {
      planHasFrequencyId: string;
      paymentMethod: string;
      quantity: number;
      card?: CardImp;
    } = {
      planHasFrequencyId: param.license.planHasFrequencyId,
      paymentMethod: values.payment_method,
      quantity: param.license.usersQuantity,
    };

    if (values.payment_method.includes('credit_card'))
      signature.card = {
        cvv: onlyNumbers(values.card.cvv),
        expYear: onlyNumbers(values.card.expYear),
        expMonth: onlyNumbers(values.card.expMonth),
        holderName: values.card.holderName,
        number: onlyNumbers(values.card.number),
      };

    const response = await http().post('/licenses/signature/new', signature);
    const url = response?.data?.url || '';

    if (values.payment_method.includes('pix'))
      setOpenModal({
        open: true,
        url,
        type: 'pix',
      });

    if (values.payment_method.includes('boleto'))
      setOpenModal({
        open: true,
        url,
        type: 'pdf',
      });
  };

  const handleSubmit = async (values: SubmitImp) => {
    try {
      await saveTaxData(values);
      await createSignature(values);
    } catch (error) {
      console.log('erro ao atualizar endereço', error);
    }
  };

  const getTaxData = async () => {
    try {
      const { data } = await http().get('users/taxdata');

      setTaxData({
        name: data.name,
        document: data.document,
        country: 'BR',
        zipcode: data.zipcode,
        street: data.street,
        neighborhood: data.neighborhood,
        state: data.state,
        city: data.city,
        phone1: data.phone1,
        phone2: data.phone2,
        ieRg: data.ieRg || '',
        number: data.number,
        complement: data.complement || '',
      });

      setLoadingTaxData(false);
    } catch (error) {
      setLoadingTaxData(false);
    }
  };

  useEffect(() => {
    getTaxData();
  }, []);

  if (loadingTaxData) return <Fragment />;

  return (
    <Formik
      initialValues={{
        ...param,
        taxdata: taxData,
      }}
      onSubmit={handleSubmit}>
      <>
        <PaymentForm />
        <DefaultModal
          isOpen={openModal.open}
          onClose={() => {
            // setOpenModal({ url: openModal.url, open: false, type: openModal.url });
          }}
          onCancel={() => {
            // setOpenModal({ url: openModal.url, open: false, type: openModal.url });
          }}
          onConfirm={() => {
            logout();
          }}
          title="Efetuar Pagamento">
          <div style={{ width: openModal.type.includes('pdf') ? '100vw' : '100%', height: '100%' }}>
            {openModal.type.includes('pdf') ? (
              <iframe src={openModal.url} width="100%" height="600px"></iframe>
            ) : (
              <img src={openModal.url} alt="Qr Code" />
            )}
          </div>
        </DefaultModal>
      </>
    </Formik>
  );
};

export default LicenseForm;
