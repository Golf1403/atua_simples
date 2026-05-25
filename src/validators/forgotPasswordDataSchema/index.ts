import * as yup from 'yup';

export default yup.object().shape({
  newPassword: yup.string().min(6, 'Mínimo de 6 dígitos').required('Nova senha obrigatória!'),
  confirmPassword: yup
    .string()
    .min(6, 'Mínimo de 6 caracteres')
    .oneOf([yup.ref('newPassword'), null], 'As senhas devem ser iguais')
    .required('Senhas obrigatória'),
});
