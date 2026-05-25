import moment from 'moment';

const minimumDate = moment('1964-01-01');
const maximumDate = moment('2100-01-01');

export const minimumValidDate = (date: string, format: string) => {
  const dateToCompare = moment(date, format);
  return dateToCompare.isBefore(minimumDate);
};

export const maximumValidDate = (date: string, format: string) => {
  const dateToCompare = moment(date, format);
  return dateToCompare.isAfter(maximumDate);
};
