import React, { useCallback, useEffect, useState } from 'react';

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
import useCurrentAccount from '@/hooks/currentAccount';
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

export interface CalcDataImp {}

const CalcData: React.FC<CalcDataImp> = (): JSX.Element => {
  const location = useLocation();
  const { setAccount, account, setLastUpdateTo, setUpdateTo, toggleUpdateToModal, author, help } = useCurrentAccount();
  const { indexesOptions, allMemcalcs } = useFactors();
  const { costCenters, costCenterSelectOptions, validateCalculationPeriod } = useCore();
  const { nomenclatures } = useNomenclatures();

  const { values, setValues, initialValues, setFieldValue } = useFormikContext<AccountImp>();
  const [memCalcs, setMemCalcs] = useState<MemCalcImp[]>([]);
  const [hint, setHint] = useState<string>();
  const [showHint, setShowHint] = useState<boolean>();

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
    setAccount(account => ({
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
          setAccount(account => ({
            ...account,
            current: { ...account.current, [name]: value },
          }));
        }
      }
      return;
    }

    if (name.includes('proRataDay')) {
      setAccount(account => ({
        ...account,
        current: { ...account.current, [name]: !account.current.proRataDay },
      }));
      return;
    }

    if (name.includes('onePercentSelic')) {
      setAccount(account => ({
        ...account,
        current: { ...account.current, [name]: !account.current.onePercentSelic },
      }));
      return;
    }

    setAccount(account => ({
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
          const isExistInterestFine = author.list.reduce((a, b) => a && !!b.interestFines.length, true);
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

  useEffect(() => {
    if (values.costCenterId.length) return;

    const costCenterDefault = costCenters.find(costCenter => costCenter.name.includes('Padrão'));
    if (costCenterDefault) {
      setFieldValue('costCenterId', costCenterDefault.id);
      setAccount(account => ({ ...account, current: { ...account.current, costCenterId: costCenterDefault.id } }));
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
            options={costCenterSelectOptions}
            icon={IoMdArrowDropdown}
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
                options={indexesOptions}
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
