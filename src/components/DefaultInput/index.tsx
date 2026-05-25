import React, { Fragment, InputHTMLAttributes, useCallback, useRef, useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { Container, Input as InputStyled, InputContainer, LabelContainer, Label, Row } from './styles';
import { IconType } from 'react-icons';
import { rem } from '@/styles/global';
import CurrencyInput from 'react-currency-input';
import { IoMdHelp } from 'react-icons/io';
import DefaultTooltip from '../DefaultTooltip';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  name?: string;
  type?: string;
  icon?: IconType;
  iconPass?: IconType;
  onIconPassClick?: Function;
  onIconClick?: Function;
  iconPosition?: 'left' | 'right';
  suffix?: string;
  precision?: number;
  reset?: boolean;
  decimalSeparator?: string;
  thousandSeparator?: string;
  helpMinWidth?: string;
  helpLink?: string;
  helpText?: string;
  maskFn?: Function;
}

const DefaultInput: React.FC<InputProps> = ({
  label = '',
  name = 'default_name',
  icon: Icon,
  iconPass: IconPass,
  reset,
  onIconPassClick,
  precision = 2,
  decimalSeparator = ',',
  thousandSeparator = '.',
  iconPosition = 'right',
  disabled = false,
  onIconClick,
  helpMinWidth,
  helpLink,
  helpText,
  onChange,
  onBlur,
  maskFn,
  ...props
}) => {
  const [field, meta] = useField({ ...props, name });

  const { setFieldValue, values } = useFormikContext<{ [key: string]: {} }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if ((window as any)?.safari === undefined) setIsFocused(true);
      if (event?.target?.select) event.target.select();
    },
    [setIsFocused]
  );

  const handleInputClick = useCallback((event: React.ChangeEvent<EventTarget>) => {
    (event?.target as any)?.focus();
  }, []);

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(event);
    },
    [setIsFocused]
  );

  const handleIconPassClick = useCallback(() => {
    onIconPassClick && onIconPassClick();
  }, [values]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const float = event.target.value;
      setFieldValue(name, float);
      if (!maskFn) return;
      const value = maskFn(float);
      setFieldValue(name, value);
    },
    [values]
  );

  const _onChange = (event: React.ChangeEvent<HTMLInputElement>, __: string, float: number): void => {
    setFieldValue(name, float);

    if (onChange) onChange(event);
  };

  return (
    <Container $error={!!meta.error} $fill={isFocused} $focus={isFocused}>
      {!reset && label && (
        <LabelContainer className={props.className} $error={!!meta.error} $fill={isFocused} $focus={isFocused}>
          <Label htmlFor={name}>{label.toLocaleUpperCase()}</Label>
          {helpText?.length && (
            <DefaultTooltip isClick minWidth={helpMinWidth} link={helpLink} text={helpText || 'Ajuda'}>
              <IoMdHelp
                style={{ visibility: helpLink?.length || helpText?.length ? 'visible' : 'hidden' }}
                size={rem(16)}
              />
            </DefaultTooltip>
          )}
        </LabelContainer>
      )}
      <InputContainer $iconPosition={iconPosition}>
        {!reset && (
          <Fragment>
            {iconPosition == 'left' && (
              <Row $iconPosition="left" onClick={() => onIconClick && onIconClick()}>
                {Icon && <Icon className="icon" />}
              </Row>
            )}
            {props.prefix || props.suffix ? (
              <CurrencyInput
                {...props}
                {...field}
                required
                ref={inputRef}
                name={name}
                id={props.id}
                onChange={field.onChange}
                onChangeEvent={_onChange}
                placeholder={props.placeholder}
                value={props.value || field.value}
                allowNegative={true}
                disabled={disabled}
                readOnly={props.readOnly}
                prefix={props.prefix}
                suffix={props.suffix}
                maxLength={props.maxLength}
                onKeyDown={props.onKeyDown}
                precision={precision}
                decimalSeparator={decimalSeparator}
                thousandSeparator={thousandSeparator}
                tabIndex={props.tabIndex}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onBlur={handleInputBlur}
              />
            ) : (
              <InputStyled
                {...props}
                {...field}
                ref={inputRef}
                disabled={disabled}
                max={props.maxLength || 50}
                maxLength={props.maxLength || 50}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
            )}
            {iconPosition == 'right' && (
              <Row $iconPosition="right" onClick={() => onIconClick && onIconClick()}>
                {Icon && <Icon className="icon" />}
              </Row>
            )}
            <div onClick={handleIconPassClick} className="icon-pass">
              {IconPass && <IconPass />}
            </div>
          </Fragment>
        )}
      </InputContainer>
    </Container>
  );
};

export default DefaultInput;
