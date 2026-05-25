import * as yup from 'yup';
import moment from 'moment';
import interestSchema from '../interestSchema';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

const installmentSchema = yup.object().shape({
  id: yup.string(),
  interests: yup.array(interestSchema).default([]),
  fines: yup.array().default([]),
  order: yup.number().required('order do pagamento é obrigatório!'),
  detailed: yup.boolean().required('Detalhamento da parcela obrigatória!'),
  correction: yup.object().notRequired(),
  value: yup.number().required('value do pagamento é obrigatório!'),
  correctedValue: yup.number().required('Valor da correção do pagamento é obrigatória!'),
  indicadorDado: yup.array().notRequired(),
  factors: yup.array().notRequired(),
  purges: yup.array().notRequired(),
  positive: yup.boolean().notRequired(),
  date: yup
    .string()
    .test('date', 'Data ínvalida!', function (value) {
      return moment(value, dateFormatEnum.DEFAULT).isValid();
    })
    .required('Data é obrigatória!'),
});

export default installmentSchema;
