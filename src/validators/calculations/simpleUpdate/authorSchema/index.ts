import * as yup from 'yup';

export default yup.object().shape({
  id: yup.string(),
  fine523: yup.object(),
  name: yup.string().default(''),
  installments: yup.array().default([]),
  payments: yup.array().default([]),
  total: yup.number().required('Total obrigatório!'),
  installmentsTotal: yup.number().required('Total das parcelas obrigatória!'),
  installmentsInterestTotal: yup.number().required('Total dos juros das parcelas obrigatória!'),
  installmentsFinesTotal: yup.number().required('Total das multas das parcelas obrigatória!'),
  paymentsTotal: yup.number().required('Total dos pagamentos obrigatório!'),
  interestTotal: yup.number().required('Total dos juros obrigatório!'),
  finesTotal: yup.number().required('Total das multas obrigatória!'),
});
