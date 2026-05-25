import { Reducer } from 'redux';
import { RegisterState, RegisterActionTypes } from './types';
import { CoreActionTypes } from '../core/types';

// Type-safe initialState!
const initialState: RegisterState = {
  stepsNav: [
    {
      text: '01 Cadastro de usuário',
      isValid: false,
    },
    {
      text: '02 Escolha de plano',
      isValid: false,
    },
    {
      text: '03 Finalizar compra',
      isValid: false,
    },
  ],
  activeStep: 0,
  billingFrequency: 'monthly',
  selectedPlan: null,
  subTotal: 0,
  registerData: {
    email: '',
    password: '',
    confirmPassword: '',

    frequencyId: '',
    planType: '',
    usersQuantity: 1,
    discountCode: '',

    honorific: '',
    firstName: '',
    lastName: '',
    billingEmail: '',

    personType: '',
    companyName: '',
    companyStateId: '',
    documentNumber: '',

    country: '',
    zipCode: '',
    street: '',
    number: '',
    streetLineTwo: '',
    state: '',
    city: '',
    phoneOne: '',
    phoneTwo: '',

    knownAs: '',

    paymentMethod: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',

    treatment: '',
  },
};

const reducer: Reducer<RegisterState> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case RegisterActionTypes.SET_REGISTER_STEP_ONE: {
      const { username, email, password, confirmPassword } = payload;
      const { registerData } = state;
      return {
        ...state,
        registerData: {
          ...registerData,
          username,
          email,
          password,
          confirmPassword,
        },
      };
    }
    case RegisterActionTypes.SET_REGISTER_STEP_TWO: {
      const { selectedPlan, paymentFrequency, planType, subTotal } = payload;
      const { registerData } = state;

      return {
        ...state,
        selectedPlan,
        subTotal,
        registerData: {
          ...registerData,
          paymentFrequency,
          planType,
        },
      };
    }
    case RegisterActionTypes.SET_REGISTER_STEP_THREE: {
      const { registerData } = state;

      return {
        ...state,
        registerData: {
          ...registerData,
          ...payload,
        },
      };
    }
    case RegisterActionTypes.SET_REGISTER_BILLING_FREQUENCY: {
      return { ...state, billingFrequency: payload };
    }
    case RegisterActionTypes.SET_REGISTER_SELECTED_PLAN: {
      return { ...state, selectedPlan: payload };
    }
    case RegisterActionTypes.SET_REGISTER_SUB_TOTAL: {
      return { ...state, subTotal: payload };
    }
    case RegisterActionTypes.SET_REGISTER_FOCUS_ON_STEP: {
      return { ...state, activeStep: payload };
    }
    case RegisterActionTypes.SET_REGISTER_INITIAL_STATE: {
      return initialState;
    }
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export { reducer as registerReducer };
