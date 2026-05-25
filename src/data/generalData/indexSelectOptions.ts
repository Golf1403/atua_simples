import ISelectOption from '@interfaces/SelectOptionImp';
import indexTypes, { minimumWage } from '../calculations/indexTypes';

const indexList = Array.from(indexTypes);
indexList.push(minimumWage);

const indexSelectOptions: ISelectOption[] = indexList.map(index => {
  const option: ISelectOption = {
    id: index.id,
    value: index.id,
    label: index.name,
  };
  return option;
});

export default indexSelectOptions;
