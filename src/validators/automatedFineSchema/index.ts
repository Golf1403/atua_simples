import * as yup from 'yup';

export default yup.object().shape({
  value: yup.number().moreThan(0),
});
