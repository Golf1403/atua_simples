import moment from 'moment';
import * as yup from 'yup';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { validateDate } from '../../../../utils/validateDate';
import viewsSchema from '../viewsSchema';

export default yup.object().shape({
  name: yup.string().default(''),
  occurrences: yup.array().default(
    yup.object().shape({
      date: yup
        .string()
        .test('date', `'Até' ser maior que 'Atualizar desde'`, function (value) {
          const { updateSince } = this.parent;
          if (!validateDate(value)) return false;
          if (!validateDate(updateSince)) return false;
          return moment(value, dateFormatEnum.DEFAULT).isSameOrAfter(moment(updateSince, dateFormatEnum.DEFAULT));
        })
        .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
      updateSince: yup
        .string()
        .test('date', `'Atualizar deve' ser menor que 'Até'`, function (value) {
          const { date } = this.parent;
          if (date == null) return true;
          if (!validateDate(value)) return false;
          if (!validateDate(date)) return false;
          return moment(value, dateFormatEnum.DEFAULT).isSameOrBefore(moment(date, dateFormatEnum.DEFAULT));
        })
        .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
      tax: yup.string().nullable(),
      value: yup.number(),
      description: yup.string(),
      type: yup.string(),
      priority: yup.number(),
    })
  ),
  interestFines: yup.array().default(
    yup.object().shape({
      dateStart: yup
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
          const { dateStart } = this.parent;
          if (value == null) return true;
          if (!validateDate(value)) return false;
          if (!validateDate(dateStart)) return false;
          return moment(value, dateFormatEnum.DEFAULT).isSameOrAfter(moment(dateStart, dateFormatEnum.DEFAULT));
        })
        .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
      tax: yup.string().nullable(),
      value: yup.number(),
      percentage: yup.number(),
      description: yup.string(),
      periodicity: yup.string(),
      selectType: yup.string(),
      isCorrection: yup.boolean(),
    })
  ),
  views: viewsSchema,
});
