import React, { useEffect } from 'react';

import FormCheckboxImp from '@interfaces/form/FormCheckboxImp';
import { Container, Input, Label } from './styles';
import { useField } from 'formik';

const CustomCheckbox = (props: FormCheckboxImp): JSX.Element => {
  const { disabled = false, children, checkboxSize = '15px', value, onChange, checked, id, label, name } = props;
  const [field] = useField({ name, value, checked });
  return (
    <Container className="checkbox-container" key={id}>
      <Input
        $size={checkboxSize}
        {...props}
        {...field}
        checked={checked}
        type="checkbox"
        onChange={e => (onChange ? onChange(e) : field.onChange(e))}
        disabled={disabled}
      />
      {children}
      <Label>{label}</Label>
    </Container>
  );
};

export default CustomCheckbox;
