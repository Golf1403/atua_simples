import React, { Fragment, useEffect, useState } from 'react';
import { Formik, useFormikContext } from 'formik';
import DefaultModal from '@/components/DefaultModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { initialInterest, typeFee } from '@/hooks/interfaces/CurrentAccountHookImp';
import {
  CheckboxContainer,
  CheckboxContent,
  Container,
  Content,
  FlexContainer,
  Footer,
  Input,
  InputContainer,
  MainCalc,
  Text,
  Title,
  TotalTitle,
  TotalValue,
} from './styles';
import SalarioMinimo from './SalarioMinimo';
import QuantiaCerta from './QuantiaCerta';
import { valueWithCurrency } from '@/lib/currency';
import CurrentOccurrenceImp, {
  QuantiaCertaImp,
  SalarioMinimoImp,
} from '@/interfaces/calculations/CurrentOccurrenceImp';
import CustomCheckbox from '@/components/CustomCheckbox';
import { getFieldName } from '@/lib/nomenclature';
import INomenclature from '@/interfaces/NomenclatureImp';
import { getCoin } from '@/utils/numberUtils';

const FeeNewCpcModal = ({ nomenclatures }: { nomenclatures: INomenclature[] }): JSX.Element => {
  const { values, handleSubmit, setFieldValue, handleChange } = useFormikContext<CurrentOccurrenceImp>();
  const [isCalcSalarioMinimo, setIsCalcSalarioMinimo] = useState(false);

  const closeModal = async () => {
    setFieldValue('isOpenFeeConfig', false);
  };

  const initialValuesSM = {
    date: values.type == typeFee.id ? values.salariominimo?.date || values.date : values.date,
    value: 0,
    total: values.type == typeFee.id ? values.salariominimo?.total : 0,
    desc0: 'Até 200 Salários (10% - 20%)',
    valueBase0: values.type == typeFee.id ? values.salariominimo?.valueBase0 : 0,
    tax0: values.type == typeFee.id ? values.salariominimo?.tax0 : 0,
    valueByTax0: 0,
    desc1: 'de 200 Até 2.000 Salários (8% - 10%)',
    valueBase1: values.type == typeFee.id ? values.salariominimo?.valueBase1 : 0,
    tax1: values.type == typeFee.id ? values.salariominimo?.tax1 : 0,
    valueByTax1: 0,
    desc2: 'de 2.000 Até 20.000 Salários (5% - 8%)',
    valueBase2: values.type == typeFee.id ? values.salariominimo?.valueBase2 : 0,
    tax2: values.type == typeFee.id ? values.salariominimo?.tax2 : 0,
    valueByTax2: 0,
    desc3: 'de 20.000 Até 100.000 Salários (3% - 5%)',
    valueBase3: values.type == typeFee.id ? values.salariominimo?.valueBase3 : 0,
    tax3: values.type == typeFee.id ? values.salariominimo?.tax3 : 0,
    valueByTax3: 0,
    desc4: 'acima de 100.000 Salários (1% - 3%)',
    valueBase4: values.type == typeFee.id ? values.salariominimo?.valueBase4 : 0,
    tax4: values.type == typeFee.id ? values.salariominimo?.tax4 : 0,
    valueSM: values.type == typeFee.id ? values.salariominimo?.valueSM : 0,
    valueByTax4: 0,
    qtdSalary: 0,
    isCalc: values.type == typeFee.id ? values.salariominimo?.isCalc : false,
    feePercentageRanges: values.type == typeFee.id ? values.salariominimo?.feePercentageRanges || [] : [],
  };

  const initialValuesQC = {
    from: values.type == typeFee.id ? values.quantiacerta?.from || values.updateSince : values.updateSince,
    updateTo: values.type == typeFee.id ? values.quantiacerta?.updateTo || values.date : values.date,
    indexId: values.type == typeFee.id ? values.quantiacerta?.indexId || initialInterest.index : 66,
    isOpen: false,
    ...initialInterest,
    formula:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.formula || initialInterest.formula
        : initialInterest.formula,
    index:
      values.type == typeFee.id ? values.quantiacerta?.interest.index || initialInterest.index : initialInterest.index,
    percentage:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.percentage || initialInterest.percentage
        : initialInterest.percentage,
    calculatedInfo:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.calculatedInfo || initialInterest.calculatedInfo
        : initialInterest.calculatedInfo,
    capitalization:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.capitalization || initialInterest.capitalization
        : initialInterest.capitalization,
    periodicity:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.periodicity || initialInterest.periodicity
        : initialInterest.periodicity,
    poupancaType:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.poupancaType || initialInterest.poupancaType
        : initialInterest.poupancaType,
    civilCode:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.civilCode || initialInterest.civilCode
        : initialInterest.civilCode,
    civilCodeDate:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.civilCodeDate || initialInterest.civilCodeDate
        : initialInterest.civilCodeDate,
    administrativeNatureFirstDate:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.administrativeNatureFirstDate || initialInterest.administrativeNatureFirstDate
        : initialInterest.administrativeNatureFirstDate,
    administrativeNatureSecondDate:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.administrativeNatureSecondDate || initialInterest.administrativeNatureSecondDate
        : initialInterest.administrativeNatureSecondDate,
    administrativeNatureThirdDate:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.administrativeNatureThirdDate || initialInterest.administrativeNatureThirdDate
        : initialInterest.administrativeNatureThirdDate,
    onCompensatoryInterest:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.onCompensatoryInterest || initialInterest.onCompensatoryInterest
        : initialInterest.onCompensatoryInterest,
    onInterestWithoutCorrection:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.onInterestWithoutCorrection || initialInterest.onInterestWithoutCorrection
        : initialInterest.onInterestWithoutCorrection,
    onCompoundInterest:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.onCompoundInterest || initialInterest.onCompoundInterest
        : initialInterest.onCompoundInterest,
    onDefaultInterest:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.onDefaultInterest || initialInterest.onDefaultInterest
        : initialInterest.onDefaultInterest,
    onInstallmentsValue:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.onInstallmentsValue || initialInterest.onInstallmentsValue
        : initialInterest.onInstallmentsValue,
    onInterestPeriod:
      values.type == typeFee.id
        ? values.quantiacerta?.interest.onInterestPeriod || initialInterest.onInterestPeriod
        : initialInterest.onInterestPeriod,
    dateStart:
      values.type == typeFee.id ? values.quantiacerta?.interest.dateStart || values.updateSince : values.updateSince,
    dateEnd: values.type == typeFee.id ? values.quantiacerta?.interest.dateEnd || values.date : values.date,
    tax:
      values.type == typeFee.id ? values.quantiacerta?.interest.percentage || initialInterest.percentage : values.tax,
    value: values.type == typeFee.id ? values.quantiacerta?.value || 0 : 0,
    total: values.type == typeFee.id ? values.quantiacerta?.total || 0 : 0,
    isCorrection: false,
  };

  if (values.type != typeFee.id) return <></>;

  return (
    <DefaultModal
      isOpen={Boolean(values.isOpenFeeConfig)}
      onClose={closeModal}
      onCancel={closeModal}
      onConfirm={handleSubmit}
      title={`${getFieldName(labelsEnum.FEE, nomenclatures)} conforme o novo CPC`}>
      <Container>
        {values.isOpenFeeConfig && (
          <Fragment>
            <MainCalc>
              <Title>Configurações dos {getFieldName(labelsEnum.FEE, nomenclatures)}</Title>

              <Content>
                <FlexContainer>
                  <CheckboxContainer>
                    <CheckboxContent>
                      <label htmlFor="">Calcular {getFieldName(labelsEnum.MAIN, nomenclatures)}</label>
                      <CustomCheckbox
                        name="isCalcByInstallment"
                        checkboxSize="20px"
                        checked={values.isCalcByInstallment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          !e.target.checked && setFieldValue('value', 0);
                          setFieldValue('isCalcByInstallment', e.target.checked);
                          e.target.checked && setFieldValue('isFeeCpc', false);
                          e.target.checked && setFieldValue('updateSince', values.date);
                        }}
                      />
                    </CheckboxContent>
                    <Text>(Soma do principal sem considerar as demais ocorrências)</Text>
                  </CheckboxContainer>

                  <CheckboxContainer>
                    <CheckboxContent>
                      <label htmlFor="">Novo CPC</label>
                      <CustomCheckbox
                        name="isFeeCpc"
                        checkboxSize="20px"
                        checked={values.isFeeCpc}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.checked && setFieldValue('value', 0);
                          setFieldValue('isFeeCpc', e.target.checked);
                          e.target.checked && setFieldValue('isCalcByInstallment', false);
                        }}
                      />
                    </CheckboxContent>
                    <Text>(Calcular conforme o novo CPC)</Text>
                  </CheckboxContainer>

                  <InputContainer>
                    <label htmlFor="">{getFieldName(labelsEnum.VALUE, nomenclatures)}</label>

                    <Input
                      maxLength={20}
                      disabled={values.isFeeCpc || values.isCalcByInstallment}
                      name="value"
                      prefix="R$"
                      className="value"
                    />
                  </InputContainer>
                </FlexContainer>
              </Content>
            </MainCalc>

            <Formik onSubmit={() => {}} initialValues={initialValuesSM}>
              <SalarioMinimo
                setFieldValueRoot={setFieldValue}
                setIsCalcSalarioMinimo={setIsCalcSalarioMinimo}
                disabled={!values.isFeeCpc || values.isCalcByInstallment}
              />
            </Formik>

            <Formik onSubmit={() => {}} initialValues={initialValuesQC}>
              <QuantiaCerta
                setFieldValueRoot={setFieldValue}
                isCalcSalarioMinimo={isCalcSalarioMinimo}
                disabled={!values.isFeeCpc || values.isCalcByInstallment || isCalcSalarioMinimo}
                description={values.description}
              />
            </Formik>
          </Fragment>
        )}
        <Footer>
          <TotalTitle>Total {getFieldName(labelsEnum.FEE, nomenclatures)} Conforme novo CPC</TotalTitle>
          <TotalValue>
            {valueWithCurrency(
              getCoin(
                (values.salariominimo?.isCalc ? values.salariominimo.date : values.quantiacerta?.updateTo) ||
                  '01/01/2000',
                0
              ),
              (values.salariominimo?.total || 0) + (values.quantiacerta?.total || 0)
            )}
          </TotalValue>
        </Footer>
      </Container>
    </DefaultModal>
  );
};

export default FeeNewCpcModal;
