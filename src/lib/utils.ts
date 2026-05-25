import IDummyObject from '@interfaces/IDummyObject';

export const isEmpty = (obj: object) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
};

export const onlyNumbers = (raw: string) => {
  return raw.replace(/\D/g, '');
};

export const formatZipCode = (zipCode: string) => {
  return zipCode.replace('-', '');
};

export const parseDate = (date: string) => {
  const [day, month, year] = date.split('/');
  return `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`;
};

export const formatPtBr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const replaceCurrencyString = (value: string) => {
  value = value.replace('R$ ', '');
  value = value.replace('%', '');
  value = value.replace(/\./g, '');
  return value.replace(/,/, '.');
};

export const removeTraceAndDot = (data: string) => {
  return data.replace(/\(|\)|\-|\_| /g, '');
};

export const reorderItemsByIndex = (items: any[], startIndex: number, endIndex: number) => {
  let result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result = result.map((item, order) => {
    item.order = order + 1;
    return item;
  });
  return result;
};

export const reorderItemsByDate = (items: any[], orderByDesc: boolean) => {
  const result = Array.from(items);
  result.sort(function (a, b) {
    const [a_day, a_month, a_year] = a.date.split('/');
    const [b_day, b_month, b_year] = b.date.split('/');

    if (orderByDesc) {
      return +new Date(+b_year, +b_month - 1, +b_day) - +new Date(+a_year, +a_month - 1, +a_day);
    } else {
      return +new Date(+a_year, +a_month - 1, +a_day) - +new Date(+b_year, +b_month - 1, +b_day);
    }
  });
  return result;
};

export const mapIndexList = (indexList: IDummyObject, flag: string): IDummyObject[] => {
  const results: IDummyObject[] = [];
  indexList.map((index: IDummyObject) => {
    const flagArray = flag.split('');
    const activeFlag = flagArray.indexOf('1');
    const indexFlagArray = index.disp.split('');

    if (indexFlagArray[activeFlag] === '1') {
      results.push({
        dateEnd: index.dateEnd,
        dateStart: index.dateStart,
        disp: index.disp,
        id: index.id,
        law: index.law,
        name: index.name,
      });
    }
  });
  return results;
};
