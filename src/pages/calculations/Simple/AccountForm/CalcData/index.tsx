import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Container,
  Content,
  CustomCheckboxContainer,
  CustomSelectContainer,
  Footer,
  FormRow1,
  FormRow2,
  FormRow3,
  FormRow4,
  Header,
  Input,
  InputDate,
  Label,
  LabelContainer,
  ProRata,
  Tooltip,
} from './styles';
import CustomSelect from '@/components/CustomSelect';
import { labelsEnum } from '@/enums/labelsEnum';
import { useFormikContext } from 'formik';
import { useCore } from '@/hooks/core';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import AccountImp from '@/interfaces/AccountImp';
import { useFactors } from '@/hooks/factors';
import indexNegativeRadioOptions, { indexPositive } from '@/data/generalData/indexNegativeRadioOptions';
import { useLocation } from 'react-router-dom';
import { IoMdArrowDropdown, IoMdHelp } from 'react-icons/io';
import DefaultTooltip, { getIndexComposition } from '@/components/DefaultTooltip';
import MemCalcImp from '@/interfaces/MemCalcImp';
import CustomCheckbox from '@/components/CustomCheckbox';
import { validDateIndexes, validateDate } from '@/utils/validateDate';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';
import { rem } from '@/styles/global';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { IndexEnum } from '@/enums/IndexEnum';

export interface CalcDataImp {}

const CalcData: React.FC<CalcDataImp> = (): JSX.Element => {
  const location = useLocation();
  const { setAccount, account, setLastUpdateTo, setUpdateTo, toggleUpdateToModal, author, help } =
    useSimpleUpdate() as any;
  const { indexesOptions, allMemcalcs } = useFactors();
  const { costCenters, costCenterSelectOptions, setSelectedCostCenter, validateCalculationPeriod } = useCore();
  const { nomenclatures } = useNomenclatures();

  const { values, setValues, initialValues, setFieldValue } = useFormikContext<AccountImp>();
  const [memCalcs, setMemCalcs] = useState<MemCalcImp[]>([]);
  const [hint, setHint] = useState<string>();
  const [showHint, setShowHint] = useState<boolean>();

  const fallbackCostCenterOptions = useMemo(() => {
    const costCenterId = values.costCenterId || account.current.costCenterId || 'default';
    const costCenterName = account.current.costCenterName || 'Padrão';

    return [{ id: costCenterId, value: costCenterId, label: costCenterName }];
  }, [account.current.costCenterId, account.current.costCenterName, values.costCenterId]);

  const fallbackIndexOptions = useMemo(
    () => [
      { id: '-1', value: '-1', label: 'Sem correção' },
      { id: 48, value: 48, label: 'INPC do IBGE' },
      { id: 50, value: 50, label: 'Dólar compra - Comercial' },
      { id: 51, value: 51, label: 'Dólar venda - Comercial' },
      { id: 52, value: 52, label: 'TR' },
      { id: 54, value: 54, label: 'TR-Diária' },
      { id: 55, value: 55, label: 'UFIR (Valor)' },
      { id: 56, value: 56, label: 'URV - Diária' },
      { id: 57, value: 57, label: 'IPCA-15' },
      { id: 58, value: 58, label: 'IPCA-E' },
      { id: 59, value: 59, label: 'IPCA' },
      { id: 60, value: 60, label: 'IPC-FIPE' },
      { id: 61, value: 61, label: 'Poupança' },
      { id: 62, value: 62, label: 'Poupança-Nova' },
      { id: 63, value: 63, label: 'INCC - Índice Nacional Construção Civil' },
      { id: 64, value: 64, label: 'TBF' },
      { id: 65, value: 65, label: 'TJLP' },
      { id: IndexEnum.CDI_INDEX, value: IndexEnum.CDI_INDEX, label: 'CDI' },
      { id: 67, value: 67, label: 'Salário mínimo' },
      { id: 68, value: 68, label: 'ICV' },
      { id: 69, value: 69, label: 'IPC-R' },
      { id: 70, value: 70, label: 'IPC-M' },
      { id: 71, value: 71, label: 'IGP-DI - FGV' },
      { id: 72, value: 72, label: 'IGP-M - FGV' },
      { id: 73, value: 73, label: 'SELIC' },
      { id: 74, value: 74, label: 'BTN (Valor)' },
      { id: 75, value: 75, label: 'ORTN (Valor)' },
      { id: 76, value: 76, label: 'OTN (Valor)' },
      { id: 77, value: 77, label: 'TJRJ' },
      { id: 78, value: 78, label: 'Piso salarial' },
      { id: 79, value: 79, label: 'IPC-IBGE' },
      { id: 81, value: 81, label: 'CUB-PR - Custo Unitário Básico' },
      { id: 84, value: 84, label: 'UFM' },
      { id: 85, value: 85, label: 'Média (INPC/IGP-DI) Valor' },
      { id: 86, value: 86, label: 'IGP-DI (De Fev/91)' },
      { id: 87, value: 87, label: 'IGP-M (De Fev/91)' },
      { id: 88, value: 88, label: 'INPC (De Fev/91)' },
      { id: 89, value: 89, label: 'IPC do IBGE (INPC)' },
      { id: 90, value: 90, label: 'Justiça Federal (IPCA-e)' },
      { id: 91, value: 91, label: 'IPC-DI (FGV)' },
      { id: 92, value: 92, label: 'Justiça Federal (Desapropriação)' },
      { id: 93, value: 93, label: 'Justiça Federal (Previdenciário)' },
      { id: 94, value: 94, label: 'Justiça Federal (Repetição de Indébito Tributário)' },
      { id: 95, value: 95, label: 'Média (INPC-IGP-DI)' },
      { id: 96, value: 96, label: 'TJSP - Precatórios' },
      { id: 97, value: 97, label: 'ENCOGE' },
      { id: 98, value: 98, label: 'TJPR - Resolução 303-2019' },
      { id: 99, value: 99, label: 'TJSP (INPC)' },
      { id: 100, value: 100, label: 'Poupança Nova Mensal' },
      { id: 102, value: 102, label: 'IGP-M Calc. Cidadão' },
      { id: 103, value: 103, label: 'INCC-M' },
      { id: 104, value: 104, label: 'Selic Somada' },
      { id: 109, value: 109, label: 'Média (INPC+IGPM)' },
    ],
    []
  );

  const memcalcIndexOptions = useMemo(() => {
    if (!allMemcalcs || !Object.keys(allMemcalcs).length) return [];

    const mappedOptions = Object.entries(allMemcalcs)
      .map(([indexId, memcalcs]) => {
        const label = memcalcs?.find(memcalc => memcalc?.indicador?.indnome)?.indicador?.indnome;
        const value = Number(indexId);

        if (!label || Number.isNaN(value)) return null;

        return {
          id: value,
          value,
          label,
        };
      })
      .filter(Boolean) as typeof fallbackIndexOptions;

    const uniqueOptions = mappedOptions.filter((option, index, options) => {
      return options.findIndex(currentOption => Number(currentOption.value) === Number(option.value)) === index;
    });

    return [
      { id: '-1', value: '-1', label: 'Sem correção' },
      ...uniqueOptions.sort((optionA, optionB) => optionA.label.localeCompare(optionB.label)),
    ];
  }, [allMemcalcs]);

  const costCenterOptions = costCenterSelectOptions.length ? costCenterSelectOptions : fallbackCostCenterOptions;
  const correctionIndexOptions = indexesOptions.length
    ? indexesOptions
    : memcalcIndexOptions.length
    ? memcalcIndexOptions
    : fallbackIndexOptions;

  useEffect(() => {
    if (memCalcs?.length) {
      const newMemCalc: string[] = [];
      memCalcs.forEach(memCalc => {
        newMemCalc.push(getIndexComposition(memCalc));
      });

      setHint(newMemCalc.join('\n'));
    } else {
      setHint('');
    }
  }, [memCalcs, hint, showHint, setHint]);

  useEffect(() => {
    if (account.current?.id || location.pathname.includes('/new')) {
      setValues(value => ({
        ...value,
        ...account.current,
      }));
      return;
    }

    setValues(initialValues);
    return () => {
      setValues(initialValues);
    };
  }, [account.current?.id, location]);

  useEffect(() => {
    const positive = !!values.deflation?.includes(indexPositive.id);
    setFieldValue('positive', positive);
    setAccount((account: any) => ({
      ...account,
      current: { ...account.current, ...values, positive },
    }));
  }, [values.deflation]);

  useEffect(() => {
    try {
      if (!allMemcalcs) throw 'not found memcalcs';
      const _memCalcs = allMemcalcs?.[values.indexId];
      setMemCalcs(_memCalcs || []);
    } catch (error) {
      console.log(error);
    }
  }, [values.indexId]);

  const onChangeForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (!e?.target?.name || !e?.target?.value) return;

    const value = e.target.value;
    const name = e.target.name;
    if (name.includes('updateTo')) {
      const isValidRegex = validateDate(value);

      if (isValidRegex) {
        const { type } = validDateIndexes(value, dateFormatEnum.DEFAULT);

        if (type.includes('warning') || type.includes('success')) {
          setAccount((account: any) => ({
            ...account,
            current: { ...account.current, [name]: value },
          }));
        }
      }
      return;
    }

    if (name.includes('proRataDay')) {
      setAccount((account: any) => ({
        ...account,
        current: { ...account.current, [name]: !account.current.proRataDay },
      }));
      return;
    }

    if (name.includes('onePercentSelic')) {
      setAccount((account: any) => ({
        ...account,
        current: { ...account.current, [name]: !account.current.onePercentSelic },
      }));
      return;
    }

    setAccount((account: any) => ({
      ...account,
      current: { ...account.current, [name]: value },
    }));
  };

  const onChangeUpdateTo = (value: string) => {
    try {
      const isValidRegex = validateDate(value);
      const date = moment(value, dateFormatEnum.DEFAULT);
      const isValid = date.isValid();

      if (isValidRegex) {
        const { type } = validDateIndexes(value, dateFormatEnum.DEFAULT);

        if (type.includes('warning')) {
          setFieldValue('updateTo', values.updateTo);
          return;
        }

        if (isValid) {
          validateCalculationPeriod(value);
          const isExistInterestFine = author.list.reduce((a: any, b: any) => a && !!b.interestFines.length, true);
          if (!isExistInterestFine || !author.list.length) return;

          toggleUpdateToModal(true);
          values.updateTo && setLastUpdateTo(values.updateTo);
          setUpdateTo(value);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeCostCenter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const costCenterId = event.target.value;
    const selectedCostCenter = costCenters.find(costCenter => costCenter.id === costCenterId);

    setFieldValue('costCenterId', costCenterId);
    setSelectedCostCenter(costCenterId);
    setAccount((account: any) => ({
      ...account,
      current: {
        ...account.current,
        costCenterId,
        costCenterName: selectedCostCenter?.name,
      },
    }));
  };

  useEffect(() => {
    if (values.costCenterId?.length) return;

    const costCenterDefault = costCenters.find(costCenter => costCenter.name.includes('Padrão'));
    if (costCenterDefault) {
      setFieldValue('costCenterId', costCenterDefault.id);
      setSelectedCostCenter(costCenterDefault.id);
      setAccount((account: any) => ({
        ...account,
        current: { ...account.current, costCenterId: costCenterDefault.id, costCenterName: costCenterDefault.name },
      }));
    }
  }, [costCenters]);

  return (
    <Container onChange={onChangeForm}>
      <FormRow1>
        <Header>
          <CustomSelect
            helpMinWidth={help?.costCenter.minWidth}
            helpLink={help?.costCenter.link}
            helpText={help?.costCenter.text || 'Ajuda'}
            label={getFieldName(labelsEnum.COST_CENTER, nomenclatures)}
            name="costCenterId"
            value={values.costCenterId}
            options={costCenterOptions}
            icon={IoMdArrowDropdown}
            onChange={onChangeCostCenter}
          />
        </Header>
        <Content>
          <Input
            id={'calc-value'}
            label={labelsEnum.CALC}
            name="name"
            placeholder={labelsEnum.CALC_NAME}
            value={values.name}
          />
        </Content>
        <Footer>
          <InputDate
            helpMinWidth={help?.updateTo.minWidth}
            helpLink={help?.updateTo.link}
            helpText={help?.updateTo.text || 'Ajuda'}
            id={'updateTo-value'}
            label={getFieldName(labelsEnum.UPDATE_TO, nomenclatures)}
            onChange={onChangeUpdateTo}
            name="updateTo"
            value={values.updateTo}
          />
        </Footer>
      </FormRow1>

      <FormRow2>
        <Header>
          <CustomSelectContainer className="custem-select-container">
            <Tooltip withoutHoverColor={true} text={hint}>
              <CustomSelect
                icon={IoMdArrowDropdown}
                label={getFieldName(labelsEnum.INDEX, nomenclatures)}
                name="indexId"
                value={values.indexId}
                options={correctionIndexOptions}
                onMouseOver={() => setShowHint(!showHint)}
                onMouseOut={() => setShowHint(!showHint)}
              />
            </Tooltip>
          </CustomSelectContainer>
          <CustomCheckboxContainer>
            <Tooltip
              withoutHoverColor={true}
              text={Number(values.indexId) != 73 ? undefined : 'Aplicar 1% ao último mês'}>
              <CustomCheckbox
                disabled={Number(values.indexId) != 73}
                checkboxSize={rem(16)}
                name="onePercentSelic"
                checked={values.onePercentSelic}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('onePercentSelic', e.target.checked)
                }
              />
            </Tooltip>
          </CustomCheckboxContainer>
        </Header>
        <Content>
          <CustomSelect
            helpMinWidth={help?.deflation.minWidth}
            helpLink={help?.deflation.link}
            helpText={help?.deflation.text || 'Ajuda'}
            className="deflation"
            label={labelsEnum.DEFLATION}
            name="deflation"
            value={values.deflation}
            options={indexNegativeRadioOptions}
            icon={IoMdArrowDropdown}
          />
          <Input
            helpMinWidth={help?.purges.minWidth}
            helpLink={help?.purges.link}
            helpText={help?.purges.text || 'Ajuda'}
            id={'purges-value'}
            className="purges"
            disabled
            label={getFieldName(labelsEnum.PURGES, nomenclatures)}
            placeholder=" "
            name=" "
            value={' '}
          />
        </Content>
        <Footer>
          <LabelContainer>
            <Label>PRO RATA</Label>
            <DefaultTooltip
              isClick
              minWidth={help?.proRata.minWidth}
              link={help?.proRata.link}
              text={help?.proRata.text || 'Ajuda'}>
              <IoMdHelp size={rem(16)} />
            </DefaultTooltip>
          </LabelContainer>
          <ProRata>
            <CustomCheckbox name="proRataDay" checked={values.proRataDay} label="DIA" />
            <CustomCheckbox name="proRataOtn" label="OTN" disabled />
          </ProRata>
        </Footer>
      </FormRow2>
      <FormRow3>
        <Input
          id={'court-value'}
          placeholder={labelsEnum.COURT}
          label={getFieldName(labelsEnum.COURT, nomenclatures)}
          name="courtId"
          className="court-id"
          value={values.courtId}
        />
        <Input
          id={'record-value'}
          placeholder={labelsEnum.RECORD}
          label={getFieldName(labelsEnum.RECORD, nomenclatures)}
          name="recordId"
          className="record-id"
          value={values.recordId}
        />
      </FormRow3>
      <FormRow4>
        <Input
          id={'defendants-value'}
          placeholder={labelsEnum.DEFENDANTS}
          label={getFieldName(labelsEnum.DEFENDANTS, nomenclatures)}
          name="defendantId"
          className="defendant-id"
          value={values.defendantId}
        />
        <Input
          id={'observation-value'}
          maxLength={150}
          placeholder={labelsEnum.OBSERVATION}
          label={getFieldName(labelsEnum.OBSERVATION, nomenclatures)}
          name="observation"
          className="observation"
          value={values.observation}
        />
      </FormRow4>
    </Container>
  );
};

export default CalcData;
