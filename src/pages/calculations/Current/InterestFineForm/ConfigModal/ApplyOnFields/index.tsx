import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import { ApplyOn, Title } from '../styles';
import CustomCheckboxControlled from '@/components/CustomCheckboxControlled';
import { labelsEnum } from '@/enums/labelsEnum';

const ApplyOnFields = (): JSX.Element => {
  const { values } = useFormikContext<CurrentInterestFineImp>();

  return (
    <ApplyOn>
      <Title>Aplicar</Title>

      <CustomCheckboxControlled
        id="isCorrection"
        name="isCorrection"
        checked={values.isCorrection}
        label={`${values.isCorrection ? labelsEnum.WITH : labelsEnum.WITHOUT} ${labelsEnum.CORRECTION}`}
        helpText={'Aplicar a correção monetária no saldo dos juros no decorrer do cálculo'}
      />
    </ApplyOn>
  );
};
export default ApplyOnFields;
