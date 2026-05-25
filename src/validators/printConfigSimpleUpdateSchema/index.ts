import * as yup from 'yup';

export default yup.object().shape({
  costCenterId: yup.string().required('Por favor selecionar o centro de custo!'),
});
