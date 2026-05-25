export default interface UserProfileResponseImp {
  id: string | number;
  treatment: string;
  firstName: string;
  password: string;
  confirmPassword: string;
  lastName: string;
  email: string;
  taxData: TaxDataImp;
}

export interface TaxDataImp {
  country: string;
  zipcode: string;
  state: string;
  document: string;
  number: string;
  complement: string;
  phone1: string;
  phone2: string;
  city: string;
  street: string;
  name: string;
  neighborhood: string;
}

export interface ProfileImp {
  id: string | number;
  treatment: string;
  firstName: string;
  lastName: string;
  email: string;
}
