import * as yup from 'yup';

export default yup.object().shape({
  date: yup.date().min('1994-08-01').required(),
  deadline: yup.number().min(1).max(420).required(),
  index: yup.number(),
  interest: yup.number().required(),
  name: yup.string(),
  positive: yup.boolean(),
  shortage: yup.number().min(1),
  type: yup.string().test('date', 'Centro de custo obrigatório!', function (value: string) {
    const foundIndex = ['price', 'sac', 'sacre', 'linear'].findIndex(_type => value.includes(_type));
    return foundIndex != -1;
  }),
  value: yup.number().required(),
});
