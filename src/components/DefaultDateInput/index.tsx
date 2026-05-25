import React, { Fragment, InputHTMLAttributes, useState } from 'react';
import DatePickerReact from 'react-datepicker';
import MaskedInputReact from 'react-text-mask';
import { Container, Label } from './styles';
import { InputContainer, LabelContainer } from './styles';
import { useFormikContext } from 'formik';
import { IconBaseProps } from 'react-icons';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';
import { useCore } from '@/hooks/core';
import { alertMessages } from '@/hooks/alertMessages';
import { IoMdHelp } from 'react-icons/io';
import { rem } from '@/styles/global';
import DefaultTooltip from '../DefaultTooltip';

interface IProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  name: string;
  label?: string;
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
  reset?: boolean;
  minDate?: Date;
  maxDate?: Date;
  iconPosition?: 'left' | 'right';
  helpMinWidth?: string;
  helpLink?: string;
  helpText?: string;
  onChange?: Function;
  shouldValidate?: boolean;
  indexToValidate?: number;
}

const DatePicker: any = DatePickerReact;
const MaskedInput: any = MaskedInputReact;
const DefaultDateInput = ({
  icon: Icon,
  disabled,
  readOnly,
  onKeyDown,
  onBlur,
  id,
  label,
  name,
  iconPosition = 'right',
  placeholder,
  shouldValidate = true,
  indexToValidate,
  minDate,
  maxDate,
  reset = false,
  helpLink,
  helpMinWidth,
  helpText,
  onChange,
  ...props
}: IProps): JSX.Element => {
  const { values, setFieldValue, errors } = useFormikContext<{ [key: string]: string }>();
  const [isFocused, setIsFocused] = useState(false);
  const { validateCalculationPeriod } = useCore();
  const alertMessage = alertMessages();

  const _onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur && onBlur(event);
  };

  const _onFocus = (event: any) => {
    event?.target?.select();
    setIsFocused(true);
  };

  const _onChange = async (date: Date) => {
    try {
      if (!date.toLocaleString().length) return;
      const newFormated = moment(date).format(dateFormatEnum.DEFAULT);
      shouldValidate && validateCalculationPeriod(newFormated, indexToValidate);
      name.length && (await setFieldValue(name, newFormated));
      onChange && onChange(newFormated);
    } catch (error) {
      if (error?.length) alertMessage.warning(error);
    }
  };

  return (
    <Container {...props} id={id} $showCalendar={false} $error={!!errors} $fill={isFocused} $focus={isFocused}>
      {label && (
        <LabelContainer>
          <Label htmlFor={name}>{label.toLocaleUpperCase() || ''}</Label>
          {helpText?.length && (
            <DefaultTooltip isClick minWidth={helpMinWidth} link={helpLink} text={helpText || 'Ajuda'}>
              <IoMdHelp size={rem(16)} />
            </DefaultTooltip>
          )}
        </LabelContainer>
      )}
      <InputContainer $iconPosition={iconPosition}>
        {!reset && (
          <Fragment>
            {iconPosition == 'left' && Icon && <Icon className="icon" />}
            <DatePicker
              name={name}
              id={id}
              autoComplete="off"
              placeholderText={placeholder}
              portalId="root"
              popperClassName="sei-datepicker-popper"
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              disabled={disabled}
              value={values[name]}
              readOnly={readOnly}
              onFocus={_onFocus}
              selected={values[name] ? moment(values[name], dateFormatEnum.DEFAULT).toDate() : undefined}
              minDate={minDate}
              maxDate={maxDate}
              onChange={_onChange}
              onBlur={_onBlur}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (onKeyDown) onKeyDown(event);
                if (event.keyCode === 9 || event.keyCode === 13) setIsFocused(false);
              }}
              customInput={
                <MaskedInput
                  autoComplete="off"
                  mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                  placeholder="mm/dd/yyyy"
                />
              }
            />

            {iconPosition == 'right' && Icon && <Icon className="icon" />}
          </Fragment>
        )}
      </InputContainer>
    </Container>
  );
};

export default DefaultDateInput;
