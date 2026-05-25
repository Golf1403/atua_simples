import NomenclatureImp from '@interfaces/NomenclatureImp';

export const getFieldName = (value: string, nomenclatures: NomenclatureImp[], isSelectInput = false) => {
  if (!nomenclatures.length) {
    return value;
  }
  if (isSelectInput) {
    value = `${value}`;
  }
  const foundNomenclature = nomenclatures.find(nomenclature => {
    return nomenclature.default_value === value;
  });
  return foundNomenclature && foundNomenclature.value ? foundNomenclature.value : value;
};
