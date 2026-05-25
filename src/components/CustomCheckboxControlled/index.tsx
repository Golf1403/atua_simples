import React from 'react';

import FormCheckboxControlledImp from '@interfaces/form/FormCheckboxControlledImp';
import { useField } from 'formik';
import { ErrorContainer, Input, Label, Text } from './styles';
import DefaultTooltip from '../DefaultTooltip';

const CustomCheckboxControlled = (props: FormCheckboxControlledImp): JSX.Element => {
  const {
    disabled = false,
    readOnly = false,
    id,
    label,
    name = 'default_name',
    value,
    checked = false,
    error = '',
    helpText,
  } = props;
  const [field] = useField({ name: name, value });

  return (
    <Label key={id}>
      <Input {...field} type="checkbox" value={field.value} readOnly={readOnly} disabled={disabled} checked={checked} />
      <DefaultTooltip withoutHoverColor={true} text={helpText}>
        <Text>{label}</Text>
      </DefaultTooltip>
      {error ? <ErrorContainer>{error}</ErrorContainer> : ''}
    </Label>
  );
};

export default CustomCheckboxControlled;
