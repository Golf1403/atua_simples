import React from 'react';
const DatePicker = require('react-datepicker');
const MaskedInput = require('react-text-mask');

import { FaRegCalendarAlt } from 'react-icons/fa';

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
  value?: Date;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
  resetStyle?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const FormGroupDate = (props: IProps): JSX.Element => {
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
    placeholder,
    error,
    isValid = true,
    minDate,
    maxDate,
    resetStyle = false,
  } = props;

  const _onChange = (date: Date | null) => onChange && onChange(date, name);

  const _onBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onBlur) onBlur(e);
  };
  const names = ['dateStart', 'initial-date', 'dateEnd', 'end-date'];

  const _onFocus = (event: any) => {
    event?.target?.select();
  };

  const _onClick = () => {
    const element = document.getElementsByClassName('react-datepicker__tab-loop');
    if (name === names[0] || name === names[1]) {
      if (element.length > 1) {
        if (element && element[1]) {
          const calendar = element[1];
          calendar.classList.add('hidden');
        }
        if (element && element[0]) {
          const calendar = element[0];
          calendar.classList.remove('hidden');
        }
      } else if (element && element[0]) {
        const calendar = element[0];
        calendar.classList.remove('hidden');
      }
    }

    if (name === names[2] || name === names[3]) {
      if (element.length > 1) {
        if (element && element[0]) {
          const calendar = element[0];
          calendar.classList.add('hidden');
        }
        if (element && element[1]) {
          const calendar = element[1];
          calendar.classList.remove('hidden');
        }
      } else if (element && element[0]) {
        const calendar = element[0];
        calendar.classList.remove('hidden');
      }
    }
  };

  const _onKeyDown = (e: React.KeyboardEvent): void => {
    if (name === names[0] || name === names[1]) {
      const element = document.getElementsByClassName('react-datepicker__tab-loop');

      if (element && element[0]) {
        const calendar = element[0];
        calendar.classList.add('hidden');
      }
    }

    if (name === names[2] || name === names[3]) {
      const element = document.getElementsByClassName('react-datepicker__tab-loop');
      if (element && element[1]) {
        const calendar = element[1];
        calendar.classList.add('hidden');
      }
    }

    if (!names.includes(name)) {
      const element = document.getElementsByClassName('react-datepicker__tab-loop');
      if (element && element.length) element[0].classList.add('hidden');
    }

    if (onKeyDown) onKeyDown(e);
  };

  return (
    <div id={id} className={`${resetStyle ? '' : 'form-group'}  ${className ? className : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <div>
        <DatePicker
          className={`form-control ${isValid ? '' : 'error'} ${inputClass}`}
          name={name}
          id={id}
          autoComplete="off"
          placeholderText={placeholder}
          selected={value}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          onInputClick={_onClick}
          onChange={_onChange}
          onBlur={_onBlur}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={_onFocus}
          minDate={minDate}
          maxDate={maxDate}
          onKeyDown={_onKeyDown}
          customInput={
            <MaskedInput
              autoComplete="off"
              mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
              placeholder="mm/dd/yyyy"
            />
          }
        />
        <div>
          <FaRegCalendarAlt />
        </div>
      </div>

      {error && <span>{error}</span>}
    </div>
  );
};

export default FormGroupDate;
