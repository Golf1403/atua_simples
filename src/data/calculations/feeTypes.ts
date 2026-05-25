import { FeeTypes } from '@interfaces/calculations/CurrentOccurrenceImp';

export interface FeeImp {
  id: FeeTypes;
  name: string;
}

export const typeAttorneysInstallment: FeeImp = {
  id: 'attorneys-installment',
  name: 'Honorários Advocatícios',
};
export const typeAttorneys: FeeImp = {
  id: 'attorneys',
  name: 'Advocatícios',
};
export const typeExpert: FeeImp = {
  id: 'expert',
  name: 'Perito',
};
export const typeAssistant: FeeImp = {
  id: 'assistant',
  name: 'Assistente',
};
export const typeSuccumbence: FeeImp = {
  id: 'succumbence',
  name: 'Sucumbência',
};
export const typeNewCpc: FeeImp = {
  id: 'newCpc',
  name: 'Novo CPC',
};

const feeTypes = [typeAttorneysInstallment, typeAttorneys, typeExpert, typeAssistant, typeSuccumbence];

export default feeTypes;
