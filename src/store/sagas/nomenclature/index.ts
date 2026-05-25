import NomenclatureImp from '@interfaces/NomenclatureImp';
import AccountServices from '@services/AccountServices';

import feeTypesOptions from '@data/calculations/feeTypesOptions';

import { getFieldName } from '@lib/nomenclature';
import { put, select } from 'redux-saga/effects';

import SelectOptionImp from '@interfaces/SelectOptionImp';
import { setError } from '../../core/action';
import { CoreActionTypes, IError } from '../../core/types';
import { NomenclatureActionTypes, NomenclatureState } from '../../nomenclature/types';

interface UpdateNomenclaturesImp {
  type: CoreActionTypes.SET_SELECTED_COST_CENTER;
  payload: { costCenterId: string };
}

export function* getNomenclature(costCenterId: string) {
  try {
    const accountServices = new AccountServices();

    const nomenclatures: NomenclatureImp[] = yield Promise.resolve(accountServices.listNomenclatures(costCenterId));

    yield put({
      type: NomenclatureActionTypes.SET_NOMENCLATURES_WITH_COST_CENTER,
      payload: { nomenclatures, costCenterId },
    });

    return nomenclatures;
  } catch {
    yield put({ type: NomenclatureActionTypes.SET_IS_LOADING, payload: false });
    // alertMessage.error('Houve um erro Nomenclature!');
  }
}

export function* updateNomenclatures(action: UpdateNomenclaturesImp) {
  try {
    yield put({ type: NomenclatureActionTypes.SET_IS_LOADING, payload: true });

    const { nomenclaturesHasCostCenter }: NomenclatureState = yield select(state => state.nomenclature);

    const { costCenterId } = action.payload;
    let nomenclatures: NomenclatureImp[] = [];

    const [nomenclaturesFiltered] = nomenclaturesHasCostCenter.filter(
      nomenclature => nomenclature.costCenterId === costCenterId
    );

    if (nomenclaturesFiltered?.nomenclatures.length > 0) nomenclatures = nomenclaturesFiltered.nomenclatures;
    else {
      nomenclatures = yield getNomenclature(costCenterId);
      if (!nomenclatures) return;
      nomenclatures = nomenclatures.sort((a, b) => (b.default_value > a.default_value ? -1 : 1));
    }

    const newFeeOptions = feeTypesOptions.map(feeType => {
      const name = getFieldName(feeType.label, nomenclatures);

      const option: SelectOptionImp = {
        id: feeType.id,
        value: feeType.id,
        label: name || feeType.label,
      };

      return option;
    });

    yield put({ type: NomenclatureActionTypes.SET_FEES_NOMENCLATURES, payload: newFeeOptions });

    yield put({ type: NomenclatureActionTypes.SET_NOMENCLATURES, payload: nomenclatures });
    yield put({ type: NomenclatureActionTypes.SET_IS_LOADING, payload: false });
  } catch (error) {
    console.log(error);
    yield put({ type: NomenclatureActionTypes.SET_IS_LOADING, payload: false });
    // alertMessage.error('Houve um erro Nomenclature!');
    yield put(setError(error as IError));
  }
}
