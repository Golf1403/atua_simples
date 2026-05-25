import ISelectOption from '@interfaces/SelectOptionImp';
import indexTypes from './indexTypes';

const nccIndexOptions: ISelectOption[] = indexTypes.map(index => {
  const option: ISelectOption = {
    id: index.id,
    value: index.id,
    label: index.name,
  };
  return option;
});

export default nccIndexOptions;
