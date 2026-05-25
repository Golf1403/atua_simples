import React, { Fragment, useEffect } from 'react';
import { InputDate } from '../styles';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { useFormikContext } from 'formik';
import { typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import CustomCheckbox from '@/components/CustomCheckbox';
import { Box, CustomCheckboxContainer } from './styles';

const AdministrativeNatureFields = (): JSX.Element => {
  const { values, setFieldValue } = useFormikContext<CurrentInterestFineImp>();

  if (values.type != typeInterest.id) return <Fragment />;
  const isAdministrativeNature: boolean = values.civilCode === CivilCodeInterest.ADMINISTRATIVE_NATURE;

  useEffect(() => {
    setFieldValue(
      'administrativeNatureThirdDate',
      moment(values.administrativeNatureSecondDate, dateFormatEnum.DEFAULT).add(1, 'day').format(dateFormatEnum.DEFAULT)
    );
  }, [values.administrativeNatureSecondDate]);

  if (isAdministrativeNature) {
    const secondDateString = moment(values.administrativeNatureFirstDate, dateFormatEnum.DEFAULT)
      .add(1, 'd')
      .format(dateFormatEnum.DEFAULT);
    return (
      <Fragment>
        <InputDate
          label={`Data - 0,5% ate ${values.administrativeNatureFirstDate}`}
          id="administrativeNatureFirstDate"
          name="administrativeNatureFirstDate"
        />
        <Box>
          <InputDate
            label={`Data - Selic de ${secondDateString} a ${values.administrativeNatureSecondDate}`}
            id="administrativeNatureSecondDate"
            name="administrativeNatureSecondDate"
          />
          <CustomCheckboxContainer>
            <CustomCheckbox
              label="Sem Correcao"
              id="onInterestWithoutCorrection"
              name="onInterestWithoutCorrection"
              checked={values.onInterestWithoutCorrection}
            />
          </CustomCheckboxContainer>
        </Box>
        <InputDate
          label={`Data - Poupanca a partir de ${values.administrativeNatureThirdDate}`}
          id="addInterestNccDate"
          name="administrativeNatureThirdDate"
          disabled={true}
        />
      </Fragment>
    );
  }

  return <></>;
};
export default AdministrativeNatureFields;
