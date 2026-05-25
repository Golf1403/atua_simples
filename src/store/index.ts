import { combineReducers } from 'redux';

import { authReducer } from './auth/reducer';
import { AuthState } from './auth/types';

import { registerReducer } from './register/reducer';
import { RegisterState } from './register/types';

import { plansReducer } from './plans/reducer';
import { PlansState } from './plans/types';

import { simpleReducer } from './simple/reducer';
import { SimpleState } from './simple/types';

import { nomenclatureReducer } from './nomenclature/reducer';
import { NomenclatureState } from './nomenclature/types';

import { coreReducer } from './core/reducer';
import { CoreState } from './core/types';

import { licenseReducer } from './license/reducer';
import { LicenseState } from './license/types';

import { layoutReducer } from './layout/reducer';
import { LayoutState } from './layout/types';

export interface ApplicationState {
  auth: AuthState;
  license: LicenseState;
  register: RegisterState;
  layout: LayoutState;
  plans: PlansState;
  simple: SimpleState;
  nomenclature: NomenclatureState;
  core: CoreState;
}

export const createRootReducer = () =>
  combineReducers({
    auth: authReducer,
    register: registerReducer,
    layout: layoutReducer,
    license: licenseReducer,
    plans: plansReducer,
    simple: simpleReducer,
    nomenclature: nomenclatureReducer,
    core: coreReducer,
  });
