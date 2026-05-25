import React, { Fragment } from 'react';
import { InputDate } from '../styles';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { useFormikContext } from 'formik';
import { typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import { getCivilCodeType } from '@/utils/interestCivilCodeHelper';

const SavingsOnePerFields = (): JSX.Element => {
  const { values } = useFormikContext<CurrentInterestFineImp>();

  if (values.type != typeInterest.id) return <Fragment />;
  const isOnePercent: boolean = values.civilCode === CivilCodeInterest.ONE_PERCENT;

  if (isOnePercent)
    return (
      <Fragment>
        <InputDate label={`Data - ${getCivilCodeType(values)}`} id="addInterestNccDate" name="civilCodeDate" />
      </Fragment>
    );

  return <Fragment />;
};
export default SavingsOnePerFields;
