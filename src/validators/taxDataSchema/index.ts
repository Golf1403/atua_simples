import { cnpj, cpf } from 'cpf-cnpj-validator';
import * as yup from 'yup';
import { onlyNumbers } from '@lib/utils';

function validateCpfCnpj(document: string) {
  return cpf.isValid(document, true) || cnpj.isValid(document, true);
}

export default yup.object().shape({
  country: yup.string().required('Obrigatório'),
  zipcode: yup.string().required('Obrigatório'),
  street: yup.string().required('Obrigatório'),
  number: yup.string().required('Obrigatório'),
  complement: yup.string(),
  state: yup.string().required('Obrigatório'),
  city: yup.string().required('Obrigatório'),
  name: yup.string().required('Obrigatório'),
  document: yup
    .string()
    .test('len', 'Documento inválido', val => {
      if (!val) return false;
      const document = onlyNumbers(val);
      const valid = validateCpfCnpj(document);

      return !!valid;
    })
    .required(`Documento obrigatório`),
  phone2: yup
    .string()
    .test('len', 'Mínimo de 13 caractéres', val => {
      if (!val) return false;

      let isCompletNumber = val.length === 13;
      if (isCompletNumber) return isCompletNumber;

      const [dddSplit, ...[numberSplit]] = val.split(' ');

      const ddd = dddSplit.substring(1, 3);
      const [number1, number2, number3] = numberSplit.split('-');
      const number = number1 + number2 + number3;

      const completNumber = (ddd + number).replace('_', '');
      isCompletNumber = completNumber.length === 13;

      return isCompletNumber;
    })
    .required(),
  phone1: yup
    .string()
    .test('len', 'Mínimo de 11 caractéres', val => {
      let isCompletNumber = val.length === 11;

      if (isCompletNumber) return isCompletNumber;

      const [dddSplit, ...numberSplit] = val.split(' ');

      const ddd = dddSplit.substring(1, 3);
      const [firtNumber, secoundNumber] = numberSplit;
      const number = firtNumber + secoundNumber.replaceAll('-', '');

      const completNumber = (ddd + number).replaceAll('_', '');
      isCompletNumber = completNumber.length === 11;

      return isCompletNumber;
    })
    .required(),
});
