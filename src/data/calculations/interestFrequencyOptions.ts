import ISelectOption from '@interfaces/SelectOptionImp';
import frequencyDaysTypes, { frequencyDaysTypesWithOutPeriod } from './frequencyDaysTypes';

const frequencyDaysOptions: ISelectOption[] = frequencyDaysTypes.map(frequency => {
  const option: ISelectOption = {
    id: frequency.id,
    value: frequency.value,
    label: frequency.name,
  };
  return option;
});
export const frequencyDaysOptionsWithOutPeriod: ISelectOption[] = frequencyDaysTypesWithOutPeriod.map(frequency => {
  const option: ISelectOption = {
    id: frequency.id,
    value: frequency.value,
    label: frequency.name,
  };
  return option;
});

export default frequencyDaysOptions;
