import * as yup from 'yup';
import accountSchema from '../../../accountSchema';
import authorSchema from '../authorSchema';

export default yup.object().shape({
  account: accountSchema,
  authors: yup.array(authorSchema).required('Autor obrigatório!'),
  fees: yup.array(),
  expenses: yup.array(),
  positive: yup.boolean().default(false),
  art523: yup.object(),
  currency: yup.string(),
  calculationMemories: yup.array(),
  isCheckedArt523: yup.boolean(),
  installmentsTotal: yup.number().required('Total da parcela obrigatória!'),
  installmentsFinesTotal: yup.number().required('Total das multas da parcela obrigatória!'),
  installmentsInterestTotal: yup.number().required('Total dos juros da parcela obrigatória!'),
  paymentsTotal: yup.number().required('Total dos pagamentos obrigatório!'),
  expensesTotal: yup.number().required('Total das despesas obrigatória!'),
  feesTotal: yup.number().required('Total dos honorários obrigatório!'),
  total: yup.number().required('Total obrigatório!'),
});
