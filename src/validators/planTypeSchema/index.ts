import * as yup from 'yup';

export default yup.object().shape({
  frequencyId: yup.string().required(`Campo 'FREQUÊNCIA' é obrigatório`),
  usersQuantity: yup
    .number()
    .moreThan(0, 'É obrigatorio ao menos uma licença')
    .required(`Campo 'QUANtIDADE DE USUÁRIOS' é obrigatório`),
});
