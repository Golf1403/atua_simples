import * as yup from 'yup';

export default yup.object().shape({
  type: yup.string(),
  date: yup.date(),
  percentage: yup.number(),
  value: yup.number(),
  newCpc: yup.boolean(),
  judgetStart: yup.date().required('Obrigatório'),
  judgetEnd: yup.date().required('Obrigatório'),
  judgetPercentage: yup.number().required('Obrigatório'),
  judgetValue: yup.number().required('Obrigatório'),
  monetaryCorretionSince: yup.date().required('Obrigatório'),
});
