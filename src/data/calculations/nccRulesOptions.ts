import ISelectOption from '@interfaces/SelectOptionImp';

export const typeSummed = { id: 'S', value: 'S', label: 'Somado' };
export const typeCapitalized = { id: 'C', value: 'C', label: 'Capitalizado' };

const nccRulesOptions: ISelectOption[] = [typeSummed, typeCapitalized];

export default nccRulesOptions;
