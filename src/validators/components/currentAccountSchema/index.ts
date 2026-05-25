import * as yup from 'yup';

export default yup.object().shape({
  modal: yup.object().shape({
    visible: yup.boolean(),
    message: yup.string(),
  }),
  reload: yup.boolean(),
  pagination: yup.object().shape({
    current: yup.number(),
    pages: yup.number(),
    total: yup.number(),
    order: yup.string(),
    orderBy: yup.string(),
  }),
  data: yup.array(),
});
