import ISelectOption from '@interfaces/SelectOptionImp';
import capitalizationTypes from './capitalizationTypes';

const capitalizationOptions: ISelectOption[] = capitalizationTypes.map(capitalization => {
  const option: ISelectOption = {
    id: capitalization.id,
    value: capitalization.value,
    label: capitalization.name,
  };

  return option;
});

export default capitalizationOptions;
