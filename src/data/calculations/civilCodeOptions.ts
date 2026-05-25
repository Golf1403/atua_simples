import ISelectOption from '@interfaces/SelectOptionImp';
import civilCodeTypes from './civilCodeTypes';

const civilCodeOptions: ISelectOption[] = civilCodeTypes.map(type => {
  const typeOption: ISelectOption = {
    id: type.id,
    value: type.value,
    label: type.label,
  };

  return typeOption;
});

export default civilCodeOptions;
