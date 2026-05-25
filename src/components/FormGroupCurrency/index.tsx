import React from 'react';
import CurrencyInput from 'react-currency-input';

interface IProps {
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
  value: string | number;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
  resetStyle?: boolean;
  prefix?: string;
  suffix?: string;
  precision?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  maxLength?: number;
  tabIndex?: number | string;
}

const FormGroupCurrency = (props: IProps): JSX.Element => {
  const {
    className,
    inputClass,
    disabled,
    readOnly,
    onChange,
    onBlur,
    id,
    label,
    name,
    value,
    placeholder,
    error,
    isValid = true,
    prefix = '',
    suffix = '',
    precision = 2,
    decimalSeparator = ',',
    thousandSeparator = '.',
    onKeyDown,
    maxLength = 18,
    tabIndex,
    resetStyle = false,
  } = props;

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>, maskedValue: string, float: number): void => {
    if (onChange) onChange(maskedValue, float, name, e);
  };

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (onBlur) onBlur(e);
  };

  return (
    <div id={id} className={`${resetStyle ? '' : 'form-group'} ${className ? className : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <CurrencyInput
        className={`form-control ${isValid ? '' : 'error'} ${inputClass}`}
        name={name}
        id={id}
        required
        placeholder={placeholder}
        value={value}
        onChangeEvent={_onChange}
        onBlur={_onBlur}
        allowNegative={true}
        disabled={disabled}
        readOnly={readOnly}
        prefix={prefix}
        suffix={suffix}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        precision={precision}
        decimalSeparator={decimalSeparator}
        thousandSeparator={thousandSeparator}
        tabIndex={tabIndex}
        onFocus={(event: any) => event?.target?.select()}
      />
      {error && <span>{error}</span>}
    </div>
  );
};

export default FormGroupCurrency;
