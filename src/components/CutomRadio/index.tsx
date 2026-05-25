import React, { Fragment } from 'react';
import { FormRadioImp } from '@interfaces/FormGroupRadioImp';
import { Container } from './style';
import DefaultTooltip from '../DefaultTooltip';

const CustomRadio = (props: FormRadioImp): JSX.Element => {
  const {
    label = '',
    disabled = false,
    readOnly = false,
    onChange,
    onBlur,
    id,
    name,
    value,
    tooltipText,
    checked,
  } = props;
  const [isFocused, setIsFocused] = React.useState(false);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    if (onChange) onChange(e);
  };

  const _onBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const _onFocus = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsFocused(true);
  };

  return (
    <Container $fill={isFocused} $focus={isFocused} key={id}>
      <DefaultTooltip text={tooltipText}>
        <Fragment>
          <input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => _onChange(e)}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => _onBlur(e)}
            onFocus={(e: React.ChangeEvent<HTMLInputElement>) => _onFocus(e)}
            readOnly={readOnly}
            disabled={disabled}
          />
          <label>{label}</label>
        </Fragment>
      </DefaultTooltip>
    </Container>
  );
};

export default CustomRadio;
