import { currencyDate, currencyValue } from '@/enums/CurrencyValue';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';

export const doConversion = (value: number, currentDate: string, nextDate: string) => {
  let newValue = value;

  const newCurrentdate = moment(currentDate, dateFormatEnum.DEFAULT);
  const newNextDate = moment(nextDate, dateFormatEnum.DEFAULT);

  let conversionList = getConversionList();

  const converteds = conversionList.filter(conversion => {
    const date = moment(
      moment(conversion.date, dateFormatEnum.AMERICAN_DATE).format(dateFormatEnum.DEFAULT),
      dateFormatEnum.DEFAULT
    );

    const isAfter = date.isSameOrAfter(newCurrentdate) && date.isSameOrBefore(newNextDate);
    return isAfter;
  });

  conversionList = conversionList.filter(el => !converteds.includes(el));

  if (converteds)
    converteds.forEach(converted => {
      newValue /= converted.value;
    });

  newValue = Number(newValue.toFixed(2));

  return newValue;
};
export const getConversionList = () => [
  { date: currencyDate._1993_08_01_, value: currencyValue.DEFAULT },
  { date: currencyDate._1994_07_01_, value: currencyValue.CRUZEIRO_REAL },
  { date: currencyDate._1989_01_01_, value: currencyValue.DEFAULT },
  { date: currencyDate._1986_03_01_, value: currencyValue.DEFAULT },
  { date: currencyDate._1967_02_01_, value: currencyValue.DEFAULT },
  { date: currencyDate._1942_11_01_, value: currencyValue.DEFAULT },
];
