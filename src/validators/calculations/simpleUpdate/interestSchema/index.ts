import * as yup from 'yup';
import moment from 'moment';
import { typeNotApply } from '@data/calculations/civilCodeTypes';
import { poupancaNovaType } from '@data/calculations/poupancaTypes';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export default yup.object().shape({
  id: yup.string(),
  type: yup.string().required(),
  percentage: yup.number().moreThan(0),
  dateStart: yup
    .string()
    .test('date', 'Data inicial deve ser menor que a final', function (value) {
      const { dateEnd } = this.parent;
      return moment(value, dateFormatEnum.DEFAULT).isBefore(moment(dateEnd, dateFormatEnum.DEFAULT));
    })
    .default(moment(new Date()).format(dateFormatEnum.DEFAULT)),
  dateEnd: yup
    .string()
    .test('date', 'Data final deve ser maior a inicial', function (value) {
      const { dateStart } = this.parent;
      return moment(value, dateFormatEnum.DEFAULT).isAfter(moment(dateStart, dateFormatEnum.DEFAULT));
    })
    .default(moment(new Date()).add(-1, 'M').format(dateFormatEnum.DEFAULT)),
  periodicity: yup.string().required(),
  index: yup.string().required(),
  formula: yup.string().required().default('C'),
  capitalization: yup.string().required(),
  onInstallmentsValue: yup.boolean().required(),
  onDefaultInterest: yup.boolean().required(),
  onCompensatoryInterest: yup.boolean().required(),
  onCompoundInterest: yup.boolean().required(),
  onInterestPeriod: yup.boolean().required(),
  onInterestWithoutCorrection: yup.boolean().required(),
  onTransitiveInterest: yup.boolean().required(),
  calculated: yup.number().required().default(0),
  poupancaType: yup.string().required().default(poupancaNovaType.id),
  civilCode: yup.string().required().default(typeNotApply.id),
  calculatedInfo: yup.object().shape({
    withoutTaxCorrection: yup.boolean().default(false),
    installmentDetails: yup.array().default([]),
    periods: yup.array().default([]),
    result: yup.number().required(),
    value: yup.number().required(),
    totalPercentage: yup.number().required(),
  }),
  civilCodeDate: yup.string().test('date', 'Data do código civíl ínvalida!', function (value) {
    return moment(value, dateFormatEnum.DEFAULT).isValid();
  }),
  administrativeNatureFirstDate: yup
    .string()
    .test('date', `A primeira data ( juros transitivos ) deve ser menor que a segunda!`, function (value) {
      const { administrativeNatureSecondDate } = this.parent;
      return moment(value, dateFormatEnum.DEFAULT).isBefore(
        moment(administrativeNatureSecondDate, dateFormatEnum.DEFAULT)
      );
    }),
  administrativeNatureSecondDate: yup
    .string()
    .test('date', `A segunda data ( juros transitivos ) deve ser menor que a terceira!`, function (value) {
      const { administrativeNatureThirdDate } = this.parent;
      return moment(value, dateFormatEnum.DEFAULT).isBefore(
        moment(administrativeNatureThirdDate, dateFormatEnum.DEFAULT)
      );
    }),
  administrativeNatureThirdDate: yup
    .string()
    .test('date', `A terceira data ( juros transitivos ) ínvalida!`, function (value) {
      return moment(value, dateFormatEnum.DEFAULT).isValid();
    }),
});
