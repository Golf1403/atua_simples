import * as yup from 'yup';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export default yup.object().shape({
  accountTypeId: yup.number(),
  updateTo: yup.string().test('date', 'Por favor, colocar uma data válida!', function (value) {
    return moment(value, dateFormatEnum.DEFAULT).isValid();
  }),
  costCenterId: yup.string().test('date', 'Centro de custo obrigatório!', function (value) {
    return value && value.length === 36;
  }),
  proRataDay: yup.boolean().required('Pro rata dia é obrigatório!'),
  proRataOtn: yup.boolean().required('Pro rata otn é obrigatório!'),
  data: yup.string().notRequired(),
  recordId: yup.string(),
  observation: yup.string(),
  courtId: yup.string(),
  indexId: yup.number().test('indexId', 'Por favor, selecionar um índice!', function (value) {
    return !!value;
  }),
  name: yup.string().required('Nome do cálculo obrigatório!'),
  purges: yup.array().notRequired(),
  positive: yup.boolean().notRequired(),
  id: yup.string().notRequired(),
});
