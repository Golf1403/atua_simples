import moment from 'moment';
import * as yup from 'yup';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { validateDate } from '../../../../utils/validateDate';

export default yup.object().shape({
  date: yup
    .string()
    .test('date', `'Data Final' deve ser maior que 'Data inicial'`, function (value) {
      const { dateEnd } = this.parent;
      if (dateEnd == null) return true;
      if (!validateDate(value)) return false;
      if (!validateDate(dateEnd)) return false;
      return moment(value, dateFormatEnum.DEFAULT).isSameOrBefore(moment(dateEnd, dateFormatEnum.DEFAULT));
    })
    .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
  dateEnd: yup
    .string()
    .test('date', `'Data inicial' deve ser menor que 'Data Final'`, function (value) {
      const { date } = this.parent;
      if (value == null) return true;
      if (!validateDate(value)) return false;
      if (!validateDate(date)) return false;
      return moment(value, dateFormatEnum.DEFAULT).isSameOrAfter(moment(date, dateFormatEnum.DEFAULT));
    })
    .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
  balance: yup.number(),
  interestBalance: yup.string(),
  type: yup.string(),
  occurrenceTotal: yup.number(),
  isCorrection: yup.boolean(),
  currency: yup.string(),
  defaultTotal: yup.number().default(0).notRequired(),
  compensatoryTotal: yup.number().default(0).notRequired(),
  compoundTotal: yup.number().default(0).notRequired(),
  value: yup.number().default(0).required(),
  priority: yup.number().default(0).required(),
  extraDescription: yup.string().notRequired(),
  correctedFrom: yup.string().notRequired(),
});
