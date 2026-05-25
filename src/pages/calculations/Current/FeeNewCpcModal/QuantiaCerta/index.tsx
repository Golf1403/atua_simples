import React, { useEffect, useState } from 'react';
import { FormikErrors, useFormikContext } from 'formik';
import {
  Container,
  Content,
  Correction,
  DateContainer,
  Footer,
  InputContainer,
  Interest,
  SelectContainer,
  SettingsContainer,
  Title,
  TotalTitle,
  TotalValue,
  ValueContainer,
} from './styles';
import CustomSelect from '@/components/CustomSelect';
import { labelsEnum } from '@/enums/labelsEnum';
import DefaultDateInput from '@/components/DefaultDateInput';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useFactors } from '@/hooks/factors';
import DefaultTooltip, { getIndexComposition } from '@/components/DefaultTooltip';
import MemCalcImp from '@/interfaces/MemCalcImp';
import DefaultInput from '@/components/DefaultInput';
import InterestFineConfigModal from '../../InterestFineForm/ConfigModal';
import { FiSettings } from 'react-icons/fi';
import { ButtonActionDefault } from '@/styles/global';
import { valueWithCurrency } from '@/lib/currency';
import FeeNewCpcService, {
  CorrectionImp,
} from '@/services/CalculationsServices/CurrentAccountService/FeeNewCpcService';
import MonetaryInterestImp from '@/interfaces/calculations/MonetaryInterestImp';
import { initialInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import { typeDefault } from '@/data/calculations/interestTypes';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import useCurrentAccount from '@/hooks/currentAccount';
import { getCoin } from '@/utils/numberUtils';
import CurrentOccurrenceImp from '@/interfaces/calculations/CurrentOccurrenceImp';
import { typeFee } from '@/data/calculations/typeValueOccorrenceOptions';
type ValuesImp = MonetaryInterestImp & {
  indexId: number;
  tax: number;
  value: number;
  save: Function;
  from: string;
  hint: string;
  updateTo: string;
  total: number;
  showHint: boolean;
  isOpen: boolean;
};

const QuantiaCerta = ({
  disabled,
  description,
  isCalcSalarioMinimo,
  setFieldValueRoot,
}: {
  disabled?: boolean;
  description: string;
  setFieldValueRoot: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<CurrentOccurrenceImp>>;
  isCalcSalarioMinimo: boolean;
}): JSX.Element => {
  const { indexesOptions, allMemcalcs, interestIndexes, interestIndexesFromLaw } = useFactors();

  const { values, setFieldValue } = useFormikContext<ValuesImp>();
  const [memcalcs, setMemcalcs] = useState<MemCalcImp[]>([]);
  const { nomenclatures } = useNomenclatures();
  const {
    account: {
      infos: { type },
      current: { proRataDay },
    },
  } = useCurrentAccount();

  useEffect(() => {
    if (memcalcs?.length) {
      const newMemCalc: string[] = [];
      memcalcs.forEach((memCalc: MemCalcImp) => {
        newMemCalc.push(getIndexComposition(memCalc));
      });

      setFieldValue('hint', newMemCalc.join('\n'));
    } else {
      setFieldValue('hint', '');
    }
  }, [memcalcs]);

  useEffect(() => {
    try {
      if (!allMemcalcs) throw 'not found memcalcs';
      const _memCalcs = allMemcalcs?.[values.indexId];
      setMemcalcs(_memCalcs || []);
    } catch (error) {
      console.log(error);
    }
  }, [values.indexId, allMemcalcs]);

  const calculate = async () => {
    if (!allMemcalcs) return;
    const feeNewCpcService = new FeeNewCpcService({ nomenclatures, type, interestIndexesFromLaw });
    const payload = { ...values, percentage: values.tax };
    const correction = {
      from: values.from,
      proRataDay,
      indexId: values.indexId,
      updateTo: values.updateTo,
      value: values.value,
    };

    const { total } = feeNewCpcService.quantiacerta(payload, interestIndexes, allMemcalcs, correction, description);

    await setFieldValue('total', total);

    const interest: MonetaryInterestImp = {
      ...initialInterest,
      type: typeDefault.id,
      dateEnd: values.dateEnd,
      dateStart: values.dateStart,
      formula: values.formula,
      index: String(values.indexId),
      percentage: values.tax,
      calculatedInfo: {
        ...values.calculatedInfo,
        value: values.value,
      },
      capitalization: values.capitalization,
      periodicity: values.periodicity,
      poupancaType: values.poupancaType,
      civilCode: values.civilCode,
      civilCodeDate: values.civilCodeDate,
      administrativeNatureFirstDate: values.administrativeNatureFirstDate,
      administrativeNatureSecondDate: values.administrativeNatureSecondDate,
      administrativeNatureThirdDate: values.administrativeNatureThirdDate,
      onCompensatoryInterest: values.onCompensatoryInterest,
      onInterestWithoutCorrection: values.onInterestWithoutCorrection,
      onCompoundInterest: values.onCompoundInterest,
      onDefaultInterest: values.onDefaultInterest,
      onInstallmentsValue: values.onInstallmentsValue,
      onInterestPeriod: values.onInterestPeriod,
    };

    const param = {
      total,
      from: values.from,
      updateTo: values.updateTo,
      value: values.value,
      indexId: values.indexId,
      tax: values.tax,
      interest,
    };

    await setFieldValueRoot('quantiacerta', param);
    if (values.type == typeFee.id && !isCalcSalarioMinimo) {
      await Promise.all([
        setFieldValueRoot('value', 0),
        setFieldValueRoot('updateSince', null),
        setFieldValueRoot('date', param.updateTo),
      ]);
    }
  };

  useEffect(() => {
    if (!isCalcSalarioMinimo) calculate();
    else {
      setFieldValue('value', 0);
      setFieldValue('total', 0);
    }
  }, [isCalcSalarioMinimo]);

  return (
    <Container onBlur={calculate}>
      <Title>
        {getFieldName(labelsEnum.FEE, nomenclatures)} {getFieldName(labelsEnum.QUANTIA_CERTA, nomenclatures)}
      </Title>
      <Content>
        <Correction>
          <DateContainer>
            <DefaultDateInput disabled={disabled} label="Desde" name="from" />
          </DateContainer>

          <DateContainer>
            <DefaultDateInput
              disabled={disabled}
              label={getFieldName(labelsEnum.UPDATE_TO, nomenclatures)}
              name="updateTo"
            />
          </DateContainer>

          <SelectContainer>
            <DefaultTooltip withoutHoverColor={true} text={values.hint}>
              <CustomSelect
                disabled={disabled}
                icon={IoMdArrowDropdown}
                label={getFieldName(labelsEnum.INDEX, nomenclatures)}
                name="indexId"
                options={indexesOptions}
                onMouseOver={() => setFieldValue('showHint', !values.showHint)}
                onMouseOut={() => setFieldValue('showHint', !values.showHint)}
              />
            </DefaultTooltip>
          </SelectContainer>
        </Correction>
        <Interest>
          <DateContainer>
            <DefaultDateInput disabled={disabled} label="Trânsito julgado" name="dateStart" />
          </DateContainer>

          <DateContainer>
            <DefaultDateInput disabled={disabled} label={getFieldName(labelsEnum.TO, nomenclatures)} name="dateEnd" />
          </DateContainer>

          <InputContainer>
            <DefaultInput
              disabled={disabled}
              label={`% dos ${getFieldName(labelsEnum.INTEREST, nomenclatures)}`}
              name="tax"
              suffix=" %"
            />
          </InputContainer>

          <SettingsContainer>
            <ButtonActionDefault disabled={disabled} onClick={() => setFieldValue('isOpen', !values.isOpen)}>
              <FiSettings />
            </ButtonActionDefault>
          </SettingsContainer>

          <ValueContainer>
            <DefaultInput
              disabled={disabled}
              label={getFieldName(labelsEnum.VALUE, nomenclatures)}
              name="value"
              prefix={getCoin(values.from, 0)}
            />
          </ValueContainer>

          <InterestFineConfigModal
            onBlur={calculate}
            interests={[]}
            isOpen={values.isOpen}
            onCancel={() => {
              setFieldValue('isOpen', false);
            }}
            onClose={() => {
              setFieldValue('isOpen', false);
            }}
            onConfirm={() => {
              setFieldValue('isOpen', false);
            }}
          />
        </Interest>

        <Footer>
          <TotalTitle>
            {getFieldName(labelsEnum.TOTAL, nomenclatures)} {getFieldName(labelsEnum.QUANTIA_CERTA, nomenclatures)}
          </TotalTitle>
          <TotalValue>{valueWithCurrency(getCoin(values.updateTo, 0), values.total)}</TotalValue>
        </Footer>
      </Content>
    </Container>
  );
};

export default QuantiaCerta;
