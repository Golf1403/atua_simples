import * as yup from 'yup';

export default yup.object().shape(
  {
    costCenterId: yup.string().min(3).required('Obrigatório'),
    profileId: yup.string().min(3).required('Obrigatório'),
  },
  [['costCenterId', 'profileId']]
);
