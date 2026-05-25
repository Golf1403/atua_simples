import * as yup from 'yup';

import basicInfo from '../basicInfoSchema';

export default yup.object().shape({}).concat(basicInfo);
