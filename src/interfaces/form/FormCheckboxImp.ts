export default interface FormCheckboxImp {
  className?: string;
  indicatorClass?: string;
  onChange?: Function;
  onBlur?: Function;
  disabled?: boolean;
  checkboxSize?: string;
  readOnly?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  id?: string;
  label?: string;
  name: string;
  value?: string | number;
  error?: string;
  isValid?: boolean;
  checked?: boolean;
  children?: React.ReactChild;
}
