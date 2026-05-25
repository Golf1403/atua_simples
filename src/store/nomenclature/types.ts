import NomenclatureImp from '@interfaces/NomenclatureImp';
import ISelectOption from '@interfaces/SelectOptionImp';

export enum NomenclatureActionTypes {
  SET_NOMENCLATURES = '@@nomenclature/SET_NOMENCLATURES',
  SET_NOMENCLATURES_WITH_COST_CENTER = '@@nomenclature/SET_NOMENCLATURES_WITH_COST_CENTER',
  PRE_SET_NOMENCLATURES_WITH_COST_CENTER = '@@nomenclature/PRE_SET_NOMENCLATURES_WITH_COST_CENTER',
  SET_FEES_NOMENCLATURES = '@@nomenclature/SET_FEES_NOMENCLATURES',
  SET_COST_CENTER = '@@nomenclature/SET_COST_CENTER',
  SET_IS_LOADING = '@@nomenclature/SET_IS_LOADING',
}

export interface NomenclatureState {
  readonly nomenclatures: NomenclatureImp[];
  readonly isLoading: boolean;
  readonly feesNomenclaturesOptions: ISelectOption[];
  readonly nomenclaturesHasCostCenter: NomenclatureWithCostCenterState[];
}

export interface NomenclatureWithCostCenterState {
  readonly nomenclatures: NomenclatureImp[];
  readonly costCenterId: string;
}
