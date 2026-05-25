export interface IStepOneData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IStepTwoData {
  frequencyId: string;
  planType: string;
  usersQuantity: number;
}

export interface IStepThreeData {
  honorific: string;
  firstName: string;
  lastName: string;
  billingEmail: string;

  personType: string;
  companyName: string;
  companyStateId: string;
  documentNumber: string;

  country: string;
  zipCode: string;
  street: string;
  number: string;
  streetLineTwo: string;
  state: string;
  city: string;
  phoneOne: string;
  phoneTwo: string;

  knownAs: string;

  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;

  treatment: string;
}

export interface RegisterDataImp extends IStepOneData, IStepTwoData, IStepThreeData {
  discountCode: string;
}

export interface RegisterFreeDataImp extends IStepOneData, IStepTwoData {}
