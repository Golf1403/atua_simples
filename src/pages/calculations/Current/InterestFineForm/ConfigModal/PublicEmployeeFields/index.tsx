import React, { Fragment } from 'react';
import { InputDate } from '../styles';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { useFormikContext } from 'formik';
import { typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import { FaCalendarAlt } from 'react-icons/fa';

const PublicEmployeeFields = (): JSX.Element => {
  const { values } = useFormikContext<CurrentInterestFineImp>();

  if (values.type != typeInterest.id) return <Fragment />;
  const isPublicEmployees: boolean = values.civilCode === CivilCodeInterest.PUBLIC_EMPLOYEES;

  if (isPublicEmployees)
    return (
      <Fragment>
        <InputDate
          label={`Data - 1,0% até ${values.administrativeNatureFirstDate}`}
          id="dateOnePer"
          name="administrativeNatureFirstDate"
        />
        <InputDate
          label={`Data - 0,5% de ${moment(values.administrativeNatureFirstDate, dateFormatEnum.DEFAULT)
            .add(1, 'day')
            .format(dateFormatEnum.DEFAULT)} até ${values.administrativeNatureSecondDate}`}
          id="dateOneByTwoPer"
          name="administrativeNatureSecondDate"
        />
        <InputDate
          label={`Data - Poupança a partir de ${values.administrativeNatureThirdDate}`}
          id="addInterestNccDate"
          name="administrativeNatureThirdDate"
          disabled={true}
        />
      </Fragment>
    );

  return <Fragment />;
};
export default PublicEmployeeFields;
