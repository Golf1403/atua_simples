import { fileNamesCurrentAccountEnum } from '@/enums/fileNamesEnum';
import * as yup from 'yup';

export default yup.object().shape({
  views: yup.array().required(`${fileNamesCurrentAccountEnum.VIWES_LABEL} obrigatória!`),
  configuration: yup.object().required('Configuração obrigatória!'),
});
