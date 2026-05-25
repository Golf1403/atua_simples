import React, { Fragment } from 'react';

import { FormGroupRadioImp } from '@interfaces/FormGroupRadioImp';
import CustomRadio from '../CutomRadio';

import { typeProportional } from '@/data/calculations/currentTypes';
import { useField } from 'formik';

const FormGroupRadio = (props: FormGroupRadioImp): JSX.Element => {
  const { onChange, onBlur, name = 'default_name' } = props;
  const [field] = useField({ name });

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange) onChange(e);
  };

  const _onBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onBlur) onBlur(e);
  };

  const renderRadioOptions = (): JSX.Element[] => {
    return props.options.map(option => {
      return (
        <CustomRadio
          {...props}
          {...field}
          id={option.id}
          name={option.name}
          onChange={_onChange}
          onBlur={_onBlur}
          value={option.value}
          label={option.label}
          key={option.id}
          checked={option.checked}
          tooltipText={option.tooltipText}
        />
      );
    });
  };

  return <Fragment>{renderRadioOptions()}</Fragment>;
};

export default FormGroupRadio;
