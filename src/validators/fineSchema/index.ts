import * as yup from 'yup';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export default yup.object().shape({
  percentage: yup.number().moreThan(0),
  dateStart: yup.string().test('date', 'Data inicial deve ser menor que a final', function (value) {
    const { dateEnd } = this.parent;
    return moment(value, dateFormatEnum.DEFAULT).isBefore(moment(dateEnd, dateFormatEnum.DEFAULT));
  }),
});
