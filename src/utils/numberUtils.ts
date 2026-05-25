import { currencySymbol } from '@/enums/CurrencyValue';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';

export const toNumber = (value: any) => {
  return Number(value) || value;
};

export const removeDotSymbol = (value: string | number) => {
  return String(value).split('.').join('');
};

export const limitFraction = (value: number, limit = 2) => {
  return Number(value.toFixed(limit));
};

export const currencyFormat = (value: number, precision?: number) => {
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: precision || 2,
    maximumFractionDigits: precision || 2,
  });
};

export const getCoin = (date: string, index: number) => {
  const coins = [
    { date: moment('1942-10-01').utc(), symbol: currencySymbol._1942_10_01_ },
    { date: moment('1967-02-01').utc(), symbol: currencySymbol._1967_02_01_ },
    { date: moment('1970-05-01').utc(), symbol: currencySymbol._1970_05_01_ },
    { date: moment('1986-02-01').utc(), symbol: currencySymbol._1986_02_01_ },
    { date: moment('1989-01-01').utc(), symbol: currencySymbol._1989_01_01_ },
    { date: moment('1990-03-01').utc(), symbol: currencySymbol._1990_03_01_ },
    { date: moment('1993-08-01').utc(), symbol: currencySymbol._1993_08_01_ },
    { date: moment('1994-07-01').utc(), symbol: currencySymbol._1994_07_01_ },
  ];

  let options = currencySymbol._1994_08_01_;

  const foundCoin = coins.find(coin => {
    if (moment(date, dateFormatEnum.DEFAULT).utc().isBefore(coin.date)) {
      return coin;
    }
  });

  if (foundCoin) {
    options = foundCoin.symbol;
  }

  const result = index > -1 && index < 3 ? options.split(',')[index] : options;

  return result;
};
export const roundNumber = (numero: number, digitos?: number) => {
  const decimal = numero % 1;
  const segundoDigito = Number(`${Math.floor(decimal * 100)}`.split('').pop());
  const terceiroDigito = Number(`${Math.floor(decimal * 1000)}`.split('').pop());
  const quartoDigito = Number(`${Math.floor(decimal * 10000)}`.split('').pop());

  return digitos
    ? Number(numero.toFixed(digitos))
    : segundoDigito <= 5
    ? Number(numero.toFixed(2))
    : terceiroDigito <= 5 && quartoDigito <= 5
    ? Number(numero.toFixed(2))
    : Number(numero.toFixed(4));
};
