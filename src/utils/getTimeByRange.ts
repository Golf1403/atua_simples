import moment from 'moment';
import {
  FrequencyType,
  frequencyDayBimonthly,
  frequencyDayDaily,
  frequencyDayMonthly,
  frequencyDayPeriod,
  frequencyDayQuarterly,
  frequencyDaySemiannual,
  frequencyDayYearly,
} from '@data/calculations/frequencyDaysTypes';

import { dateFormatEnum } from '@/enums/DateFormatEnum';
import {
  capitalizationBimonthlyType,
  capitalizationFourmonthsType,
  capitalizationMonthlyType,
  capitalizationNoneType,
  capitalizationQuarterlyType,
  capitalizationSemianualType,
  capitalizationYearlyType,
} from '@/data/calculations/capitalizationTypes';

export function getTimeByRange({ start, end, periodicity = 'month' }: any) {
  let dateStart = moment(moment(start, dateFormatEnum.DEFAULT), dateFormatEnum.ONE_DAY);
  let dateEnd = moment(moment(end, dateFormatEnum.DEFAULT), dateFormatEnum.ONE_DAY);
  let unit = 1;
  switch (periodicity) {
    case frequencyDayMonthly.value: {
      periodicity = frequencyDayMonthly.value;
      unit = 1;
      break;
    }
    case frequencyDaySemiannual.value: {
      periodicity = frequencyDayMonthly.value;
      unit = 6;
      break;
    }
    case frequencyDayQuarterly.value: {
      periodicity = frequencyDayMonthly.value;
      unit = 3;
      break;
    }
    case frequencyDayBimonthly.value: {
      periodicity = frequencyDayMonthly.value;
      unit = 2;
      break;
    }
    case frequencyDayDaily.value: {
      dateStart = moment(start, dateFormatEnum.DEFAULT).utc();
      dateEnd = moment(end, dateFormatEnum.DEFAULT).utc();
      periodicity = frequencyDayDaily.value;
      break;
    }
  }

  const diffRangeDate = dateEnd.diff(dateStart, periodicity);
  return periodicity !== 'period' ? diffRangeDate / unit : 0;
}

export function getPeriodicity(periodicity: FrequencyType) {
  switch (periodicity) {
    case frequencyDayMonthly.value:
      return frequencyDayMonthly.name.toLowerCase();
    case frequencyDayMonthly.id:
      return frequencyDayMonthly.name.toLowerCase();
    case frequencyDaySemiannual.value:
      return frequencyDaySemiannual.name.toLowerCase();
    case frequencyDaySemiannual.id:
      return frequencyDaySemiannual.name.toLowerCase();
    case frequencyDayQuarterly.value:
      return frequencyDayQuarterly.name.toLowerCase();
    case frequencyDayQuarterly.id:
      return frequencyDayQuarterly.name.toLowerCase();
    case frequencyDayBimonthly.value:
      return frequencyDayBimonthly.name.toLowerCase();
    case frequencyDayBimonthly.id:
      return frequencyDayBimonthly.name.toLowerCase();
    case frequencyDayDaily.value:
      return frequencyDayDaily.name.toLowerCase();
    case frequencyDayDaily.id:
      return frequencyDayDaily.name.toLowerCase();
    case frequencyDayPeriod.value:
      return frequencyDayPeriod.name.toLowerCase();
    case frequencyDayPeriod.id:
      return frequencyDayPeriod.name.toLowerCase();
    case frequencyDayYearly.value:
      return frequencyDayYearly.name.toLowerCase();
    case frequencyDayYearly.id:
      return frequencyDayYearly.name.toLowerCase();
  }
}

export function getCapitalization(periodicity: string) {
  const TEXT = 'capitalizado ';
  switch (periodicity) {
    case capitalizationMonthlyType.id:
      return TEXT + capitalizationMonthlyType.name.toLowerCase();
    case capitalizationBimonthlyType.id:
      return TEXT + capitalizationBimonthlyType.name.toLowerCase();
    case capitalizationFourmonthsType.id:
      return TEXT + capitalizationFourmonthsType.name.toLowerCase();
    case capitalizationNoneType.id:
      return '';
    case capitalizationQuarterlyType.id:
      return TEXT + capitalizationQuarterlyType.name.toLowerCase();
    case capitalizationSemianualType.id:
      return TEXT + capitalizationSemianualType.name.toLowerCase();
    case capitalizationYearlyType.id:
      return TEXT + capitalizationYearlyType.name.toLowerCase();
    case capitalizationMonthlyType.value:
      return TEXT + capitalizationMonthlyType.name.toLowerCase();
    case capitalizationBimonthlyType.value:
      return TEXT + capitalizationBimonthlyType.name.toLowerCase();
    case capitalizationFourmonthsType.value:
      return TEXT + capitalizationFourmonthsType.name.toLowerCase();
    case capitalizationNoneType.value:
      return '';
    case capitalizationQuarterlyType.value:
      return TEXT + capitalizationQuarterlyType.name.toLowerCase();
    case capitalizationSemianualType.value:
      return TEXT + capitalizationSemianualType.name.toLowerCase();
    case capitalizationYearlyType.value:
      return TEXT + capitalizationYearlyType.name.toLowerCase();
  }
}
