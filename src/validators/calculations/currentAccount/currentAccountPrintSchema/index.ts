import accountSchema from '@/validators/accountSchema';
import * as yup from 'yup';

export default yup.object().shape({
  views: yup.array().required('Nenhuma ocorrência encontrada, favor adicionar ocorrência!'),
  configuration: yup.object().required('Configuração obrigatória!'),
  account: accountSchema,
});
