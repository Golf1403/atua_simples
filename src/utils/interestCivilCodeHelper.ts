import { typeCompensatory, typeCompound, typeDefault, typePeriod } from '@data/calculations/interestTypes';
import { poupancaNovaType, poupancaNovaWithSelicType, poupancaType } from '@data/calculations/poupancaTypes';
import CivilCodeInterest from '../enums/CivilCodeInterest';
import ViewOccorrenceImp from '@interfaces/calculations/ViewOccorrenceImp';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import IDummyObject from '@/interfaces/IDummyObject';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import {
  typeAdministrativeNature,
  typeOnePercent,
  typePublicEmployees,
  typeSavings,
} from '@/data/calculations/civilCodeTypes';
import { getFieldName } from '@/lib/nomenclature';
import INomenclature from '@/interfaces/NomenclatureImp';

export const getCivilCodeType = (interest: IDummyObject, isComplete: boolean = false) => {
  switch (interest.civilCode) {
    case CivilCodeInterest.ONE_PERCENT:
      return ` ${typeOnePercent.label.split('de')[0]} de ${interest.civilCodeDate}`;
    case CivilCodeInterest.ADMINISTRATIVE_NATURE:
      return ` ${typeAdministrativeNature.label} a partir de ${interest.administrativeNatureFirstDate}`;
    case CivilCodeInterest.PUBLIC_EMPLOYEES:
      return ` ${typePublicEmployees.label}`;
    case CivilCodeInterest.SAVINGS:
      return ` ${typeSavings.label} ${isComplete ? '- 70% Selic <= 8,5% aa (05/2012)' : 'nova'}`;
    case CivilCodeInterest.SELECT_INDEX:
      return ` Juros pelo índice`;
    default:
      return '';
  }
};

export const getMarkedInterest = (interest: MonetaryInterestImp) => {
  const markedInterests: string[] = [];
  if (interest.onInstallmentsValue) markedInterests.push('Principal');

  if (interest.onCompoundInterest) markedInterests.push('Juros Compostos');

  if (interest.onDefaultInterest) markedInterests.push('Juros Moratórios');

  if (interest.onCompensatoryInterest) markedInterests.push('Juros Compensatórios');

  if (interest.onInterestPeriod) markedInterests.push('Juros no Período');

  return markedInterests;
};

export const translateInterest = (view: ViewOccorrenceImp, nomenclatures: INomenclature[]) => {
  switch (view.selectType) {
    case typeDefault.id:
      return getFieldName(typeDefault.name, nomenclatures);
    case typeCompensatory.id:
      return getFieldName(typeCompensatory.name, nomenclatures);
    case typeCompound.id:
      return getFieldName(typeCompound.name, nomenclatures);
    case typePeriod.id:
      return getFieldName(typePeriod.name, nomenclatures);
    default:
      return '';
  }
};
export const translateNomenclatureInterest = (savingsType?: string) => {
  switch (savingsType) {
    case poupancaType.value:
      return capitalizeFirstLetter(poupancaType.label);
    case poupancaNovaType.value:
      return capitalizeFirstLetter(poupancaNovaType.label);
    case poupancaNovaWithSelicType.value:
      return capitalizeFirstLetter(poupancaNovaWithSelicType.label);
    default:
      return '';
  }
};
