import { Reducer } from 'redux';
import { NomenclatureState, NomenclatureActionTypes } from './types';
import { CoreActionTypes } from '../core/types';

const initialState: NomenclatureState = {
  nomenclatures: [],
  isLoading: false,
  feesNomenclaturesOptions: [],
  nomenclaturesHasCostCenter: [],
};

const reducer: Reducer<NomenclatureState> = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case NomenclatureActionTypes.SET_NOMENCLATURES:
      return { ...state, nomenclatures: payload };
    case NomenclatureActionTypes.SET_FEES_NOMENCLATURES:
      return { ...state, feesNomenclaturesOptions: payload };
    case NomenclatureActionTypes.SET_IS_LOADING:
      return { ...state, isLoading: payload };
    case NomenclatureActionTypes.SET_NOMENCLATURES_WITH_COST_CENTER:
      const newNomenclatures = state.nomenclaturesHasCostCenter.filter(
        nomenclature => nomenclature.costCenterId !== payload.costCenterId
      );
      newNomenclatures.push(payload);
      return { ...state, nomenclaturesHasCostCenter: newNomenclatures, nomenclatures: payload.nomenclatures };
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }
    default:
      return state;
  }
};

export { reducer as nomenclatureReducer };
