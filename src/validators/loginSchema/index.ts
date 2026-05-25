import * as yup from 'yup';

export default yup.object().shape({
  password: yup.string().min(6).required('Senha obrigatória!'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório!'),
});
