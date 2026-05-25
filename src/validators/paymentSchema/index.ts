import * as yup from 'yup';
import moment from 'moment';
import { interstIndexDependency } from '@data/calculations/civilCodeTypes';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

const paymentSchema = yup.object().shape({
  interestIndexes: yup
    .object()
    .test('interestIndexes', 'Índices dos juros transitivos do pagamento é obrigatório!', function (value) {
      const found = this.parent.interests.find((interest: any) => interstIndexDependency.includes(interest.civilCode));
      if (found) return value !== null;
      return true;
    })
    .nullable(),
  interests: yup.array().notRequired(),
  order: yup.number().required('order do pagamento é obrigatório!'),
  value: yup.number().required('value do pagamento é obrigatório!'),
  correctedValue: yup.number().required('Valor da correção do pagamento é obrigatória!'),
  date: yup
    .string()
    .test('date', 'Data ínvalida!', function (value) {
      return moment(value, dateFormatEnum.DEFAULT).isValid();
    })
    .required('Data é obrigatória!'),
  purges: yup.array().notRequired(),
  positive: yup.boolean().notRequired(),
  id: yup.string().notRequired(),
});

export default paymentSchema;
