import * as yup from 'yup';
import accountSchema from '../../../accountSchema';
import authorSchema from '../authorSchema';
import feeFinesSchema from '../feeFinesSchema';

export default yup.object().shape({
  account: accountSchema,
  authors: yup.array(authorSchema),
  feeFines: yup.object().shape({ list: yup.array(feeFinesSchema), total: yup.number() }),
});
