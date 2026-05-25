import moment from 'moment';
import * as yup from 'yup';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { validateDate } from '../../../../utils/validateDate';
import { typeFineArt } from '@/hooks/interfaces/CurrentAccountHookImp';

export default yup.object().shape({
  dateStart: yup
    .string()
    .test('date', `'Data Final' deve ser maior que 'Data inicial'`, function (value) {
      const { dateEnd, type } = this.parent;
      if (type == typeFineArt.id) return true;
      if (dateEnd == null) return true;
      if (!validateDate(value)) return false;
      if (!validateDate(dateEnd)) return false;
      return moment(value, dateFormatEnum.DEFAULT).isSameOrBefore(moment(dateEnd, dateFormatEnum.DEFAULT));
    })
    .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
  dateEnd: yup
    .string()
    .test('date', `'Data inicial' deve ser menor que 'Data Final'`, function (value) {
      const { dateStart, type } = this.parent;
      if (type == typeFineArt.id) return true;
      if (value == null) return true;
      if (!validateDate(value)) return false;
      if (!validateDate(dateStart)) return false;
      return moment(value, dateFormatEnum.DEFAULT).isSameOrAfter(moment(dateStart, dateFormatEnum.DEFAULT));
    })
    .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
  type: yup.string(),
  tax: yup.string().nullable(),
  value: yup.number(),
  description: yup.string(),
  afterTotal: yup.boolean(),
});
