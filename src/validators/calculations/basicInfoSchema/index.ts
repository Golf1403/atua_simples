import * as yup from 'yup';

export default yup.object().shape({
  costCenterId: yup.string().notRequired(),
  name: yup.string().required('Nome obrigatório!'),
  updateTo: yup.string().required('Atualizar até obrigatório!'),
  proRataOtn: yup.boolean(),
  proRataDay: yup.boolean(),
  observation: yup.string(),
});
