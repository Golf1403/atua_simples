import * as yup from 'yup';

export default yup.object().shape({
  sessionId: yup.string().required('Obrigatório'),
});
