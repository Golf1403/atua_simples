import _ from 'lodash';
import CostCenterImp from '@interfaces/costCenters/CostCenterImp';
import AccountServices from '@services/AccountServices';
import SelectOptionImp, { OptionImp } from '@interfaces/SelectOptionImp';

import { select, put, call } from 'redux-saga/effects';

import { CoreState, CoreActionTypes, IError } from '../../core/types';
import { SimpleState } from '../../simple/types';
import { setAccount as setSimpleAccount } from '../../simple/actions';

interface OnSelectCostCenterOptionsImp {
  type: CoreActionTypes.PRE_SET_COST_CENTER_SELECT_OPTIONS;
  payload: OptionImp[];
}

interface OnSelectCostCenterImp {
  type: CoreActionTypes.SET_COST_CENTERS;
  payload: { costCenterId: string };
}

export function* onSelectCostCenterOptions(action: OnSelectCostCenterOptionsImp) {
  const costCenters = action.payload;
  const costCenterSelectOptions: SelectOptionImp[] = mountSelectOptions(costCenters);
  yield put({ type: CoreActionTypes.SET_COST_CENTER_SELECT_OPTIONS, payload: costCenterSelectOptions });
}

export function* onSelectCostCenter(action: OnSelectCostCenterImp) {
  console.info('on_select_cost_center');

  const { costCenterId } = action.payload;

  const { account: simpleAccount }: SimpleState = yield select(state => state.simple);
  const { costCenters }: CoreState = yield select(state => state.core);
  const selectedCostCenter = costCenters?.find(costCenter => costCenter.id === costCenterId);

  let calculationFieldsDisabled = true;

  if (selectedCostCenter && selectedCostCenter.profile)
    calculationFieldsDisabled = selectedCostCenter.profile.canWrite ? false : true;

  yield put({ type: CoreActionTypes.SET_CALCULATION_FIELDS_DISABLED, payload: calculationFieldsDisabled });
  yield put(
    setSimpleAccount({
      ...simpleAccount,
      costCenterId: costCenterId,
      costCenterName: selectedCostCenter?.name,
    })
  );
}

export function mountSelectOptions<T extends OptionImp>(items: T[]) {
  const costCenterOptions: SelectOptionImp[] = items.map((item, key) => {
    const option: SelectOptionImp = {
      id: key,
      label: item.name,
      value: item.id,
    };
    return item.disp ? { ...option, disp: item.disp } : option;
  });

  return costCenterOptions;
}
