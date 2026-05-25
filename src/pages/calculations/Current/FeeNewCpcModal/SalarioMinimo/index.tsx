import React, { useCallback, useEffect } from 'react';
import {
  Column,
  Container,
  Content,
  Data,
  Table,
  Title,
  Line,
  Header,
  Input,
  Footer,
  Separator,
  CheckboxContainer,
  DataResult,
  InputContainer,
  DateContainer,
  TotalTitle,
  TotalValue,
  CheckboxLabel,
  CheckboxContentContainer,
  DataChildren,
  BorderContainer,
} from './styles';
import { valueWithCurrency } from '@/lib/currency';
import DefaultDateInput from '@/components/DefaultDateInput';
import CustomCheckbox from '@/components/CustomCheckbox';
import { FormikErrors, useFormikContext } from 'formik';
import { useFactors } from '@/hooks/factors';
import FeeNewCpcService from '@/services/CalculationsServices/CurrentAccountService/FeeNewCpcService';
import { getFieldName } from '@/lib/nomenclature';
import { labelsEnum } from '@/enums/labelsEnum';
import { useNomenclatures } from '@/hooks/nomenclatures';
import useCurrentAccount from '@/hooks/currentAccount';
import CurrentOccurrenceImp from '@/interfaces/calculations/CurrentOccurrenceImp';
type ValuesImp = {
  tax0: number;
  tax1: number;
  tax2: number;
  tax3: number;
  tax4: number;
  valueBase0: number;
  valueBase1: number;
  valueBase2: number;
  valueBase3: number;
  valueBase4: number;
  valueSM: number;
  indexId: number;
  isCalc: boolean;
  feePercentageRanges: any[];
  total: number;
  date: string;
} & { save: Function; qtdSalary: number; minimumWage: number };

export const SalarioMinimo = ({
  disabled,
  setFieldValueRoot,
  setIsCalcSalarioMinimo,
}: {
  disabled?: boolean;
  setFieldValueRoot: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<CurrentOccurrenceImp>>;
  setIsCalcSalarioMinimo: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { values, setFieldValue } = useFormikContext<ValuesImp>();
  const { allMemcalcs, interestIndexesFromLaw } = useFactors();
  const { nomenclatures } = useNomenclatures();
  const {
    account: {
      infos: { type },
    },
  } = useCurrentAccount();

  const calculate = useCallback(async () => {
    let salarioMinimo = 0;
    const feeNewCpcService = new FeeNewCpcService({ nomenclatures, type, interestIndexesFromLaw });
    const indexId = 67;
    const memCalcs = allMemcalcs?.[indexId];
    const { feePercentageRanges, qtdSalary, minimumWage } = feeNewCpcService.salariominimo(values, memCalcs);

    await Promise.all([
      setFieldValue('feePercentageRanges', feePercentageRanges),
      setFieldValue('minimumWage', minimumWage),
      setFieldValue('qtdSalary', qtdSalary),
    ]);

    salarioMinimo = feeNewCpcService.calculateTotal(feePercentageRanges);

    await setFieldValue('total', salarioMinimo);
    const param = {
      tax0: values.tax0,
      tax1: values.tax1,
      tax2: values.tax2,
      tax3: values.tax3,
      tax4: values.tax4,
      valueBase0: values.valueBase0,
      valueBase1: values.valueBase1,
      valueBase2: values.valueBase2,
      valueBase3: values.valueBase3,
      valueBase4: values.valueBase4,
      valueSM: values.valueSM,
      indexId: values.indexId,
      isCalc: values.isCalc,
      feePercentageRanges: values.feePercentageRanges,
      total: salarioMinimo,
      date: values.date,
    };

    await setFieldValueRoot('salariominimo', param);
    if (param.isCalc) {
      await Promise.all([
        setFieldValueRoot('value', 0),
        setFieldValueRoot('date', param.date),
        setFieldValueRoot('updateSince', null),
      ]);
    }
  }, [values]);

  useEffect(() => {
    calculate();
  }, [allMemcalcs, values.valueSM, values.isCalc, interestIndexesFromLaw]);

  return (
    <Container onBlur={calculate}>
      <Title>{getFieldName(labelsEnum.FEE, nomenclatures)} em Salário Mínimo</Title>
      <Content>
        <Data>
          <DateContainer>
            <DefaultDateInput
              disabled={!values.isCalc || disabled}
              label="Data da condenação"
              name="date"
              className="tax"
            />
          </DateContainer>

          <InputContainer>
            <Input
              maxLength={20}
              label={getFieldName(labelsEnum.VALUE, nomenclatures)}
              name="valueSM"
              prefix="R$"
              className="value"
              disabled={!values.isCalc || disabled}
            />
          </InputContainer>

          <CheckboxContainer>
            <CheckboxLabel htmlFor="">
              {getFieldName(labelsEnum.VALUE, nomenclatures)} em quantidade de salários
            </CheckboxLabel>
            <CheckboxContentContainer>
              <CustomCheckbox
                disabled={disabled}
                name="isCalc"
                checkboxSize={'20px'}
                label="Calcular"
                checked={values.isCalc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIsCalcSalarioMinimo(e.target.checked);
                  if (!values.isCalc) setFieldValue('valueSM', 0);
                  setFieldValue('isCalc', e.target.checked);
                }}
              />
            </CheckboxContentContainer>
          </CheckboxContainer>

          <DataResult>
            <BorderContainer>
              <DataChildren> {Number(values.qtdSalary).toFixed(2)}</DataChildren>
              <DataChildren> (1 Salário = {valueWithCurrency('R$ ', values.minimumWage)})</DataChildren>
            </BorderContainer>
          </DataResult>
        </Data>

        <Title className="table">Tabela de Salário Mínimo</Title>
        <Separator />

        <Table>
          <Header>
            <Column></Column>
            <Column>{getFieldName(labelsEnum.VALUE, nomenclatures)} Base</Column>
            <Column>%</Column>
            <Column>{getFieldName(labelsEnum.VALUE, nomenclatures)} por Faixa</Column>
          </Header>

          {values.feePercentageRanges.map((line: any, key: number) => (
            <Line key={`${line.desc}_${key}`}>
              <Column>{line[`desc${key}`]}</Column>
              <Column>
                <Input
                  disabled={!values.isCalc || disabled || !line[`valueBase${key}`]}
                  name={`valueBase${key}`}
                  prefix="R$ "
                  value={line[`valueBase${key}`]}
                />
              </Column>

              <Column>
                <Input
                  disabled={!values.isCalc || disabled || !line[`valueBase${key}`]}
                  suffix=" %"
                  name={`tax${key}`}
                  className="tax"
                />
              </Column>

              <Column>{valueWithCurrency('R$ ', Number(line[`total`]))}</Column>
            </Line>
          ))}
        </Table>

        <Footer>
          <TotalTitle>{getFieldName(labelsEnum.TOTAL, nomenclatures)} das Faixas</TotalTitle>
          <TotalValue>{valueWithCurrency('R$ ', values.total)}</TotalValue>
        </Footer>
      </Content>
    </Container>
  );
};

export default SalarioMinimo;
