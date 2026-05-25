import ISelectOption from '@interfaces/SelectOptionImp';
import interestTypes from './interestTypes';

const interestTypeOptions: ISelectOption[] = interestTypes.map(interest => {
  const option: ISelectOption = {
    id: interest.id,
    value: interest.value,
    label: interest.name,
  };
  return option;
});

export default interestTypeOptions;
