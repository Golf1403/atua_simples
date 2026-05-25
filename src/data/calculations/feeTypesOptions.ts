import ISelectOption from '@interfaces/SelectOptionImp';
import feeTypes from './feeTypes';

const feeTypesOptions: ISelectOption[] = feeTypes.map(feeType => {
  const option: ISelectOption = {
    id: feeType.id,
    value: feeType.id,
    label: feeType.name,
  };
  return option;
});

export default feeTypesOptions;
