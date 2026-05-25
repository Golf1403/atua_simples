import FormCheckboxImp from './FormCheckboxImp';

export default interface FormCheckboxControlledImp extends FormCheckboxImp {
  checked: boolean | undefined;
  helpText?: string;
}
