import React, { Fragment } from 'react';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { useFormikContext } from 'formik';
import { typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import CustomSelect from '@/components/CustomSelect';
import { poupancaOptions } from '@/data/calculations/poupancaTypes';
import { IoMdArrowDropdown } from 'react-icons/io';

const SelectWhichPoupanca = (): JSX.Element => {
  const { values } = useFormikContext<CurrentInterestFineImp>();

  if (values.type != typeInterest.id) return <Fragment />;
  const isPublicEmployees: boolean = values.civilCode === CivilCodeInterest.PUBLIC_EMPLOYEES;
  const isAdministrativeNature: boolean = values.civilCode === CivilCodeInterest.ADMINISTRATIVE_NATURE;

  if (isAdministrativeNature || isPublicEmployees)
    return (
      <Fragment>
        <CustomSelect
          label="Índice poupança"
          id="addInterestIndex"
          name="poupancaType"
          value={values.poupancaType}
          placeholder="Selecionar"
          options={poupancaOptions}
          icon={IoMdArrowDropdown}
        />
      </Fragment>
    );

  return <Fragment />;
};
export default SelectWhichPoupanca;
