import { newSavingsType, newSavingsWithSelicType, savingsType } from '@/enums/SavingsType';

export type PoupancaTypeIDS = savingsType.id | newSavingsType.id | newSavingsWithSelicType.id;
export interface PoupancaOption {
  id: PoupancaTypeIDS;
  value: PoupancaTypeIDS;
  label: savingsType.label | newSavingsType.label | newSavingsWithSelicType.label;
}

export const poupancaType: PoupancaOption = {
  id: savingsType.id,
  value: savingsType.id,
  label: savingsType.label,
};

export const poupancaNovaType: PoupancaOption = {
  id: newSavingsType.id,
  value: newSavingsType.id,
  label: newSavingsType.label,
};

export const poupancaNovaWithSelicType: PoupancaOption = {
  id: newSavingsWithSelicType.id,
  value: newSavingsWithSelicType.id,
  label: newSavingsWithSelicType.label,
};

export const poupancaOptions = [poupancaType, poupancaNovaType, poupancaNovaWithSelicType];
