import CivilCodeInterest from '@/enums/CivilCodeInterest';

export interface CodeCivilOptionImp {
  id: CivilCodeInterest;
  value: CivilCodeInterest;
  label: string;
}

export const typeOnePercent: CodeCivilOptionImp = {
  id: CivilCodeInterest.ONE_PERCENT,
  value: CivilCodeInterest.ONE_PERCENT,
  label: '1% a partir de uma data',
};
export const typeNotApply: CodeCivilOptionImp = {
  id: CivilCodeInterest.NOT_APPLY,
  value: CivilCodeInterest.NOT_APPLY,
  label: 'Não aplicar',
};
export const typeMonthlyBeforeLaw: CodeCivilOptionImp = {
  id: CivilCodeInterest.MONTHLY_BEFORE_LAW,
  value: CivilCodeInterest.MONTHLY_BEFORE_LAW,
  label: 'Lei 14.905 (com juros mensal anterior a LEI)',
};
export const typeProRataDayBeforeLaw: CodeCivilOptionImp = {
  id: CivilCodeInterest.PRO_RATA_DAY_BEFORE_LAW,
  value: CivilCodeInterest.PRO_RATA_DAY_BEFORE_LAW,
  label: 'Lei 14.905 (com juros pro rata dia anterior a LEI)',
};

export const typeAdministrativeNature: CodeCivilOptionImp = {
  id: CivilCodeInterest.ADMINISTRATIVE_NATURE,
  value: CivilCodeInterest.ADMINISTRATIVE_NATURE,
  label: 'Natureza Administrativa',
};
export const typePublicEmployees: CodeCivilOptionImp = {
  id: CivilCodeInterest.PUBLIC_EMPLOYEES,
  value: CivilCodeInterest.PUBLIC_EMPLOYEES,
  label: 'Servidores e Empregados Públicos',
};
export const typeSavings: CodeCivilOptionImp = {
  id: CivilCodeInterest.SAVINGS,
  value: CivilCodeInterest.SAVINGS,
  label: 'Juros poupança - 70% Selic <= 8.5% aa (05/2012)',
};

export const typeSelectIndex: CodeCivilOptionImp = {
  id: CivilCodeInterest.SELECT_INDEX,
  value: CivilCodeInterest.SELECT_INDEX,
  label: 'Selecionar Índice',
};

export const interstIndexDependency = [typeAdministrativeNature.id, typePublicEmployees.id, typeSavings.id];
export const transitiveInterestTypes = [
  typeOnePercent.id,
  typeAdministrativeNature.id,
  typePublicEmployees.id,
  typeSavings.id,
  typeSelectIndex.id,
  typeMonthlyBeforeLaw.id,
  typeProRataDayBeforeLaw.id,
];

const civilCodeTypes = [
  typeNotApply,
  typeSelectIndex,
  typeOnePercent,
  typeAdministrativeNature,
  typePublicEmployees,
  typeSavings,
  typeMonthlyBeforeLaw,
  typeProRataDayBeforeLaw,
];

export default civilCodeTypes;
