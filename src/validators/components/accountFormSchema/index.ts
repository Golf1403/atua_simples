import * as yup from 'yup';
import accountSchema from '../../accountSchema';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export default yup.object().shape({
  modal: yup.object().shape({
    visible: yup.boolean(),
    message: yup.string(),
  }),
  account: yup.object().shape({
    current: accountSchema,
  }),
  infos: yup.object().shape({
    visible: yup.boolean(),
    index: yup.object().shape({
      current: yup.object(),
      list: yup.array(),
    }),
  }),
  print: yup.boolean(),
});

export const formRow2Schema = yup.object().shape({
  infos: yup.object().shape({
    visible: yup.boolean(),
    index: yup.object().shape({
      current: yup.object(),
      list: yup.array(),
    }),
    positive: yup.object().shape({
      current: yup.boolean(),
      list: yup.array(),
    }),
  }),
  account: yup.object().shape({
    current: yup.object().shape({
      positive: yup.boolean(),
      indexId: yup.number(),
      proRataDay: yup.boolean(),
      proRataOtn: yup.boolean(),
    }),
  }),
});

export const formRow1Schema = yup.object().shape({
  account: yup.object().shape({
    current: yup.object().shape({
      name: yup.string(),
      updateTo: yup.string().test('date', 'Por favor, colocar uma data válida!', function (value) {
        return moment(value, dateFormatEnum.DEFAULT).isValid();
      }),
      costCenterId: yup.string().test('date', 'Centro de custo obrigatório!', function (value) {
        return value && value.length === 36;
      }),
    }),
  }),
});
export const formRow3Schema = yup.object().shape({
  account: yup.object().shape({
    current: yup.object().shape({
      recordId: yup.string(),
      courtId: yup.string(),
    }),
  }),
});
export const formRow4Schema = yup.object().shape({
  account: yup.object().shape({
    current: yup.object().shape({
      defendantId: yup.string(),
      observation: yup.string(),
    }),
  }),
});
