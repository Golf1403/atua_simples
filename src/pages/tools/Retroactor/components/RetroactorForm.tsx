import React, { useState, useEffect } from 'react';
import IndexFlags from '@enums/IndexFlags';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import CustomSelect from '@components/CustomSelect';
import moment from 'moment';
import { mapIndexList } from '@lib/utils';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { getCoin } from '@utils/numberUtils';
import { alertMessages } from '@/hooks/alertMessages';
import { initialAccountValue } from '@/store/simple/reducer';
import { useLoading } from '@/hooks/loading';
import { useFactors } from '@/hooks/factors';
import { useFormikContext } from 'formik';
import {
  CheckBox,
  CheckBoxContainer,
  Wrapper,
  DateContainer,
  DateInput,
  Form,
  InlineFlex,
  Input,
  ValueContainer,
  IndexInfo,
  IndexContainer,
} from './styles';
import { useCore } from '@/hooks/core';
import Tabs from '@/components/Tabs';
import { labelsEnum } from '@/enums/labelsEnum';
import { IoMdArrowDropdown } from 'react-icons/io';
import RetroactorService from '@/services/RetroactorService';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

const indexesEmptyList: SelectOptionImp[] = [];

export const RetroactorForm = () => {
  const [proRata, setProRata] = useState(false);

  const alertMessage = alertMessages();

  const { getIndexes, allMemcalcs, setMemcalcs, memcalcs: memCalcs } = useFactors();
  const indexes = getIndexes();
  const { closeLoading } = useLoading();
  const { setResults } = useCore();

  const [indexesList, setIndexesList] = useState(indexesEmptyList);
  const { values } = useFormikContext<{ [key: string]: string }>();
  const [range, setRange] = useState<string>('');

  useEffect(() => {
    if (indexes.length) {
      const mappedIndexList = mapIndexList(indexes, IndexFlags.CORRECAO_PELO_SISTEMA);
      const selectList: SelectOptionImp[] = mappedIndexList.map((calcIndex, key) => {
        const calcIndexOpton: SelectOptionImp = {
          id: key,
          label: calcIndex.name,
          value: calcIndex.id,
        };
        return calcIndexOpton;
      });
      setIndexesList(selectList);
      return;
    }
    const noCalcIndex: SelectOptionImp = {
      id: 'noCalcIndex',
      label: 'Nenhum índice',
      value: '',
    };
    setIndexesList([noCalcIndex]);
  }, [indexes]);

  const onPressEnterDateField = (event: React.KeyboardEvent, nextInputId: string) => {
    event.persist();
    const target: any = event?.target;
    const form = target?.form;
    if (!form) return;
    const pressEnterOrTab = event.keyCode === 13;
    if (!pressEnterOrTab) return;
    event.preventDefault();
    if (form.elements[nextInputId]) {
      if (target?.blur) target.blur();
      if (form.elements[nextInputId]?.focus) form.elements[nextInputId].focus();
    }
  };

  const validator = async () => {
    const selectedDate = moment(values.dateStart, dateFormatEnum.DEFAULT);
    const endDate = moment(values.dateEnd, dateFormatEnum.DEFAULT);

    if (moment(selectedDate).isSameOrBefore(endDate)) alertMessage.atentionError('"De" tem de ser maior do que "Para"');

    closeLoading();
  };

  const calculate = async () => {
    const retroactorService = new RetroactorService();

    const memcalcs = allMemcalcs?.[Number(values.fromCurrency)];
    setMemcalcs(memcalcs || []);
    if (!values.fromCurrency.length) return;

    const { value: result } = await retroactorService.calculate({
      account: { ...initialAccountValue, indexId: Number(values.fromCurrency), updateTo: values.dateStart },
      date: values.dateEnd,
      value: Number(values.capital),
      memCalcs,
    });

    setResults([{ currency: getCoin(values.dateStart, 0), result }]);
    closeLoading();
  };

  const preCalc = async () => {
    if (!values.fromCurrency && !values.capital) return;

    await validator();
    await calculate();
  };

  useEffect(() => {
    const indexFiltered = indexes.find(calcIndex => Number(calcIndex.id) == Number(values.fromCurrency));
    if (!indexFiltered) return;

    let dateEnd = indexFiltered.dateEnd || new Date();
    const memcalcs = allMemcalcs?.[Number(values.fromCurrency)];
    const indicadorDado = memcalcs[memcalcs.length - 1].indicadorDado;
    if (indicadorDado) dateEnd = indicadorDado[indicadorDado?.length - 1].inadata;

    setRange(
      `Período: ${capitalizeFirstLetter(
        moment(indexFiltered.dateStart).utc().format('MMM/YY')
      )} até ${capitalizeFirstLetter(moment(dateEnd).utc().format('MMM/YY'))}`
    );

    return () => setRange('');
  }, [indexes, values]);

  useEffect(() => {
    setResults([]);
    return () => {
      setResults([]);
    };
  }, []);

  useEffect(() => {
    preCalc();
  }, [values.fromCurrency, values.dateEnd, values.dateStart, values.capital, proRata]);

  return (
    <Form>
      <Tabs
        tabs={[
          {
            content: (
              <Wrapper>
                <CheckBoxContainer>
                  <CheckBox id="financing-positive" name="proRata" label="PRO-Rata OTN " />
                </CheckBoxContainer>

                <InlineFlex>
                  <DateContainer>
                    <DateInput
                      indexToValidate={Number(values.fromCurrency)}
                      id="from"
                      onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'to')}
                      label="Retroagir De"
                      name="dateStart"
                    />
                  </DateContainer>
                  <DateContainer>
                    <DateInput
                      indexToValidate={Number(values.fromCurrency)}
                      id="to"
                      onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'value')}
                      label="Para"
                      name="dateEnd"
                    />
                  </DateContainer>
                  <ValueContainer>
                    <Input
                      label={labelsEnum.VALUE}
                      name="capital"
                      id="value"
                      onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'from-currency')}
                      prefix={'R$ '}
                      maxLength={32}
                      precision={2}
                    />
                  </ValueContainer>
                  <ValueContainer>
                    <IndexContainer>
                      <CustomSelect
                        id="from-currency"
                        label={labelsEnum.INDEX}
                        name="fromCurrency"
                        options={indexesList}
                        icon={IoMdArrowDropdown}
                      />
                      <IndexInfo>{range}</IndexInfo>
                    </IndexContainer>
                  </ValueContainer>
                </InlineFlex>
              </Wrapper>
            ),
            title: labelsEnum.RETROACTOR,
          },
        ]}
      />
    </Form>
  );
};
