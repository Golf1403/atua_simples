import React, { SelectHTMLAttributes } from 'react';
import ISelectOption from '@interfaces/SelectOptionImp';
import { Container, InputContainer, Label, LabelContainer } from './styles';
import { useFormikContext } from 'formik';
import IDummyObject from '@/interfaces/IDummyObject';
import { IconType } from 'react-icons';
import { rem } from '@/styles/global';
import { IoMdHelp } from 'react-icons/io';
import DefaultTooltip from '../DefaultTooltip';

interface IProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'defaultValue' | 'name'> {
  name: string;
  isValid?: boolean;
  defaultValue?: ISelectOption;
  value?: string | number | string[] | undefined;
  options: ISelectOption[];
  needplaceholder?: boolean;
  placeholder?: string;
  label?: string;
  icon?: IconType;
  iconPosition?: 'right' | 'left';
  disableSelectOption?: boolean;
  helpMinWidth?: string;
  helpLink?: string;
  helpText?: string;
}

const CustomSelect = ({
  disabled,
  onChange,
  onKeyDown,
  onBlur,
  id,
  label,
  name,
  placeholder,
  className,
  defaultValue,
  options,
  icon: Icon,
  disableSelectOption = false,
  iconPosition = 'right',
  helpMinWidth,
  helpLink,
  helpText,
  ...props
}: IProps): JSX.Element => {
  const { values, setFieldValue } = useFormikContext<IDummyObject>();
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const _onBlur = (e: React.FocusEvent<HTMLSelectElement>): void => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const _onFocus = (event: any) => {
    setIsFocused(true);
  };

  const _onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    if (onChange) onChange(event);
    setFieldValue(name, value);
  };

  return (
    <Container className={className} $fill={isFocused} $focus={isFocused}>
      {label && (
        <LabelContainer>
          <Label htmlFor={name}>{label.toLocaleUpperCase()}</Label>
          {helpText?.length && (
            <DefaultTooltip isClick minWidth={helpMinWidth} link={helpLink} text={helpText}>
              <IoMdHelp size={rem(16)} />
            </DefaultTooltip>
          )}
        </LabelContainer>
      )}
      <InputContainer $iconPosition={iconPosition}>
        {iconPosition == 'left' && Icon && <Icon className="icon" size={rem(24)} />}
        <select
          {...props}
          id={id}
          name={name}
          ref={selectRef}
          onKeyDown={onKeyDown}
          disabled={disabled}
          onBlur={_onBlur}
          onFocus={_onFocus}
          value={values[name]}
          defaultValue={(defaultValue && defaultValue.value) || undefined}
          onChange={_onChange}>
          {!defaultValue && !disableSelectOption && (
            <option value="" disabled>
              {placeholder || 'Selecione...'}
            </option>
          )}
          {options.map((option: ISelectOption) => {
            return (
              <option key={option.id} value={option.value} selected={option.selected}>
                {option.label}
              </option>
            );
          })}
        </select>
        {iconPosition == 'right' && Icon && <Icon className="icon" size={rem(24)} />}
      </InputContainer>
    </Container>
  );
};

export default CustomSelect;
