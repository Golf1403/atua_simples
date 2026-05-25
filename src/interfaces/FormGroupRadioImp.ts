export interface FormRadioImp {
  onChange?: Function;
  onBlur?: Function;
  disabled?: boolean;
  readOnly?: boolean;
  id: string;
  label?: string;
  name: string;
  value: string;
  tooltipText?: string;
  checked?: boolean;
}

export interface FormGroupRadioImp {
  onChange?: Function;
  tooltipText?: string;
  onBlur?: Function;
  label?: string;
  name: string;
  error?: string;
  isValid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  options: FormRadioImp[];
}
