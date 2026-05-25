import * as yup from 'yup';

export default yup.object().shape({
  treatment: yup.string().required('Obrigatório'),
  firstName: yup.string().required('Obrigatório'),
  lastName: yup.string().required('Obrigatório'),
  email: yup.string().email('E-mail inválido').required('Obrigatório'),
  password: yup.string().required('Obrigatório'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Obrigatório'),
});
