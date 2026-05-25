import PurgeItemImp from '@interfaces/calculations/PurgeItemImp';

import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export const emptyPurge: PurgeItemImp = {
  id: '',
  name: '',
  diff: 0,
  date: '',
  value: 0,
};

export const noPurges: PurgeItemImp = {
  id: 'noPurgeSelected',
  name: 'Nenhum expurgo',
  date: moment(new Date()).format(dateFormatEnum.DEFAULT),
  value: 0,
  diff: 0,
};

export default { emptyPurge, noPurges };
