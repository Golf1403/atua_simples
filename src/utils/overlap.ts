import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';

export const isOverlap = (period1: { start: string; end: string }, period2: { start: string; end: string }) => {
  const start1 = moment(period1.start, dateFormatEnum.DEFAULT);
  const end1 = moment(period1.end, dateFormatEnum.DEFAULT);
  const start2 = moment(period2.start, dateFormatEnum.DEFAULT);
  const end2 = moment(period2.end, dateFormatEnum.DEFAULT);

  return start1.isSameOrBefore(end2) && end1.isSameOrAfter(start2);
};
