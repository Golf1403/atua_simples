import NomenclatureImp from '@interfaces/NomenclatureImp';

import { action } from 'typesafe-actions';
import { NomenclatureActionTypes } from './types';
import { NomenclatureWithCostCenterState } from '../nomenclature/types';

export const setNomenclatures = (nomenclatures: NomenclatureImp[]) =>
  action(NomenclatureActionTypes.SET_NOMENCLATURES, nomenclatures);

export const setNomenclaturesWithCostCenter = (nomenclaturesHasCostCenter: NomenclatureWithCostCenterState) =>
  action(NomenclatureActionTypes.SET_NOMENCLATURES_WITH_COST_CENTER, nomenclaturesHasCostCenter);

export const setIsLoading = (loading: boolean) => action(NomenclatureActionTypes.SET_IS_LOADING, loading);
