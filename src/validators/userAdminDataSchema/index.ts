import * as yup from 'yup';

export default yup.object().shape({
  firstName: yup.string().required('Obrigatório'),
  lastName: yup.string().required('Obrigatório'),
  email: yup.string().required('Obrigatório'),
  password: yup.string().min(6, 'Mínimo de 6 dígitos').required('Obrigatório'),
  costCenters: yup.array().min(1, 'Obrigatório').required('Obrigatório'),
  confirmPassword: yup
    .string()
    .min(6, 'Mínimo de 6 caracteres')
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Senha obrigatória'),
});
