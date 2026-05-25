import moment from 'moment';

import { maximumValidDate, minimumValidDate } from './systemDateRange';

export const validateDate = (date: string) => {
  const reg = /^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/g;
  return reg.test(date);
};

export const validDateIndexes = (
  date: string,
  format = 'YYYY-MM-DD'
): { type: any; msg: string; date: null | Date; title: string } => {
  const formatDate = moment(date, format);

  if (formatDate.isValid() && !date.match(/[_]/)) {
    if (maximumValidDate(date, format)) {
      return {
        type: 'warning',
        msg: 'A data máxima permitida é 01/01/2100.',
        date: null,
        title: 'Aguarde...',
      };
    }

    if (minimumValidDate(date, format)) {
      return {
        type: 'warning',
        msg: 'A data mínima permitida é 01/01/1964.',
        date: null,
        title: 'Aguarde...',
      };
    }

    return { type: 'success', msg: 'Data válida', date: formatDate.toDate(), title: 'Sucesso' };
  }

  return { type: 'error', msg: 'A data não é válida.', date: null, title: 'Erro' };
};
