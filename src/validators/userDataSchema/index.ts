import * as yup from 'yup';

export default yup.object().shape({
  treatment: yup.string().required(`Campo 'FORMA DE TRATAMENTO' é obrigatório`),
  firstName: yup.string().required(`Campo 'NOME' é obrigatório`),
  lastName: yup.string().required(`Campo 'SOBRENOME' é obrigatório`),
  email: yup.string().email('E-mail inválido').required(`Campo 'E-MAIL' é obrigatório`),
  password: yup.string().required(`Campo 'SENHA' é obrigatório`),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .required(`Campo 'CONFIRME A SENHA' é obrigatório`),
});
