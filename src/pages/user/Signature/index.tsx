import LicenseForm, { LicensePagarmeImp } from '@/components/LicenseForm';
import SEILoading from '@/components/SEILoading';
import { useUser } from '@/hooks/user';
import http from '@/services/http';
import React, { useEffect, useState } from 'react';

const Signature: React.FC = () => {
  const [payload, setPayload] = useState<LicensePagarmeImp | null>(null);
  const { user } = useUser();
  const values = {
    payment_method: 'credit_card',
    interval: 'month',
    interval_count: 1,
    billing_type: 'prepaid',
    customer: {
      name: '',
      email: '',
      type: 'individual',
      documents: [{ type: 'cpf', number: '' }],
    },
    card: {
      number: '',
      holderName: '',
      expMonth: '',
      expYear: '',
      cvv: '',
    },
    items: [
      {
        description: 'Plano Pagarme',
        quantity: 1,
        pricing_scheme: {
          price: 19900,
        },
      },
    ],
    metadata: {
      item_assinado: 'Plano Pagarme',
    },
  };

  const getInitialValues = async () => {
    const { data: license } = await http().get('licenses/');
    const { data: plan } = await http().get(`plans/${license.planId}`);

    const items = [];
    items.push({
      description: 'Licença Master',
      quantity: 1,
      pricing_scheme: {
        price: Number(license.value),
      },
    });

    if (license.usersQuantity > 1)
      items.push({
        description: 'Licença adicional',
        quantity: license.usersQuantity - 1,
        pricing_scheme: {
          price: Number(license.additionalValue),
        },
      });

    setPayload({
      ...values,
      license,
      items,
      metadata: { item_assinado: plan.description },
      customer: { ...values.customer, email: user.email },
    });
  };

  useEffect(() => {
    if (!user.email.length) return;
    getInitialValues();
  }, [user]);

  if (!payload) return <SEILoading />;

  return (
    <LicenseForm
      license={payload.license}
      billing_type={payload.billing_type}
      card={payload.card}
      customer={payload.customer}
      interval={payload.interval}
      interval_count={payload.interval_count}
      items={payload.items}
      metadata={payload.metadata}
      payment_method={payload.payment_method}
    />
  );
};

export default Signature;
