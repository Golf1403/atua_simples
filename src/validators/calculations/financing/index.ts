import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().required('Obrigatório'),
  type: yup.string().required('Obrigatório'),
  value: yup.number().moreThan(0, 'Informe o valor'),
  deadline: yup.number().moreThan(0, 'Obrigatório'),
});
