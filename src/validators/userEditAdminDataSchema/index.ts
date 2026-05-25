import { labelsEnum } from '@/enums/labelsEnum';
import * as yup from 'yup';

export default yup.object().shape({
  firstName: yup.string().required(`${labelsEnum.NAME} Obrigatório`),
  lastName: yup.string().required(`${labelsEnum.LAST_NAME} Obrigatório`),
  email: yup.string().required(`${labelsEnum.EMAIL} Obrigatório`),
  costCenters: yup.array().required(`${labelsEnum.COST_CENTER} Obrigatório`),
});
