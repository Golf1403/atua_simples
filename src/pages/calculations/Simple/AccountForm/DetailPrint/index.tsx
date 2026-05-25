import React from 'react';
import CustomSelect from '@/components/CustomSelect';
import { labelsEnum } from '@/enums/labelsEnum';
import { IoMdArrowDropdown } from 'react-icons/io';

const detailPrintOptions = [
  { id: 'omit', value: 'omit', label: labelsEnum.OMIT },
  { id: 'first', value: 'first', label: labelsEnum.FIRST_INSTALLMENT },
  { id: 'all', value: 'all', label: labelsEnum.ALL_INSTALLMENTS },
];

const DetailPrint = (): JSX.Element => (
  <CustomSelect
    label={labelsEnum.DETAIL_PRINT}
    name="detailPrint"
    value="omit"
    options={detailPrintOptions}
    icon={IoMdArrowDropdown}
  />
);

export default DetailPrint;
