import React from 'react';
const MaskedInput = require('react-text-mask');

interface PropsImp {
  className?: string;
  inputClass?: string;
  onChange?: Function;
  onBlur?: Function;
  onKeyDown?: Function;
  disabled?: boolean;
  readOnly?: boolean;
  id: string;
  label?: string;
  name: string;
  value?: string | number;
  mask?: (string | RegExp)[];
  placeholder?: string;
  type: string;
  error?: string;
  isValid?: boolean;
  resetStyles?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  disableAutoComplete?: string;
}

const FormGroup = (props: PropsImp): JSX.Element => {
  const {
    className,
    inputClass,
    disabled,
    readOnly,
    onChange,
    onBlur,
    onKeyDown,
    id,
    label,
    name,
    value,
    mask,
    placeholder,
    type,
    error,
    isValid = true,
    maxLength,
    minLength,
    min,
    max,
    disableAutoComplete,
    resetStyles = false,
  } = props;

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange) onChange(e);
  };

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (onBlur) onBlur(e);
  };

  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <div id={id} className={`${resetStyles ? '' : 'form-group'} ${className ? className : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      {mask ? (
        <MaskedInput
          autoComplete={disableAutoComplete}
          mask={mask}
          type={type}
          style={{ textDecoration: 'none' }}
          className={`form-control${isValid ? ' ' : ' error '}${inputClass}`}
          name={name}
          id={id}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => _onChange(e)}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => _onBlur(e)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => _onKeyDown(e)}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          readOnly={readOnly}
          onFocus={(event: any) => event?.target?.select()}
        />
      ) : (
        <input
          autoComplete={disableAutoComplete}
          type={type}
          className={`form-control ${isValid ? '' : 'error'} ${inputClass}`}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => _onChange(e)}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => _onBlur(e)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => _onKeyDown(e)}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={(event: any) => event?.target?.select()}
        />
      )}
      {error && <span>{error}</span>}
    </div>
  );
};

export default FormGroup;
