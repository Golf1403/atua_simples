import ISelectOption from '@interfaces/SelectOptionImp';
import frequencyDaysTypes from './frequencyDaysTypes';

const frequencyDaysOptions: ISelectOption[] = frequencyDaysTypes.map(frequency => {
  const option: ISelectOption = {
    id: frequency.id,
    value: frequency.value,
    label: frequency.name,
  };
  return option;
});

export default frequencyDaysOptions;
