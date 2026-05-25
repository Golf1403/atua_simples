import React, { useState, useEffect } from 'react';
import IndexFlags from '@/enums/IndexFlags';
import CustomSelect from '@components/CustomSelect';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import IndexConverterService from '@services/ToolsServices/IndexConverterService';
import moment from 'moment';
import { mapIndexList, replaceCurrencyString } from '@lib/utils';
import { IIndexConverterRequest } from '@interfaces/tools/indexConverter/IIndexConverter';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { setError } from '@store/core/action';
import { IError } from '@store/core/types';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { useFactors } from '@/hooks/factors';
import { Container, Form, IndexInfo, Input, InputDate, Separator } from './styles';
import { useFormikContext } from 'formik';
import IDummyObject from '@/interfaces/IDummyObject';
import { useCore } from '@/hooks/core';
import { IoMdArrowDropdown } from 'react-icons/io';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

interface IDateRestriction {
  value: string;
  id: string;
  dateStart: string;
  dateEnd?: string;
}

const indexesEmptyList: SelectOptionImp[] = [];
const indexesEmptyListWithDate: IDateRestriction[] = [];

const CustomForm = (): JSX.Element => {
  const alertMessage = alertMessages();
  const { setResults } = useCore();
  const { getIndexes } = useFactors();
  const indexes = getIndexes();
  const { closeLoading, openLoading } = useLoading();
  const { values } = useFormikContext<IDummyObject>();

  const indexConverterService = new IndexConverterService();
  const [indexesList, setIndexesList] = useState(indexesEmptyList);
  const [indexesListDates, setIndexesListDates] = useState(indexesEmptyListWithDate);
  const [range, setRange] = useState<string>('');

  const fetchData = async (props: IIndexConverterRequest) => {
    setRange(
      `Período: ${capitalizeFirstLetter(moment(props.dateStart).utc().format('MMM/YY'))} até ${capitalizeFirstLetter(
        moment(props.dateEnd || new Date())
          .utc()
          .format('MMM/YY')
      )}`
    );

    if (!values.date) return;

    const dateWithDayOne = moment(values.date, dateFormatEnum.DEFAULT).set('date', 1).format('YYYY-MM-DDT[00:00:00Z]');
    const index = indexes.find(index => Number(index.id) === Number(values.index));
    const dateRangeError = validateIndexRangeDate(String(index?.name), dateWithDayOne, props.dateStart, props.dateEnd);

    if (dateRangeError) {
      alertMessage.error(dateRangeError);
      return;
    }
    props.date = dateWithDayOne;
    try {
      openLoading();
      const { result } = await indexConverterService.indexConverter(props);
      setResults([{ currency: result.split(' ')[0], result: Number(replaceCurrencyString(result.split(' ')[1])) }]);
      closeLoading();
    } catch (error) {
      const errorAny: any = error;
      setError(error as IError);
      closeLoading();
      const errorMessage: string = typeof error === 'string' ? error : errorAny.msg || '';

      alertMessage.atentionError(errorMessage);
    }
  };

  const refreshAfterIndexOrDateChange = () => {
    if (!values.index && !values.quantity && !values.date) return;

    const indexFiltered = indexesListDates.find(calcIndex => calcIndex.id == values.index);

    if (!indexFiltered?.dateStart && !indexFiltered?.dateEnd) return;
    if (!indexFiltered) return;

    fetchData({
      index: indexFiltered.value,
      indexId: String(indexFiltered.id),
      value: String(values.quantity),
      date: values.date,
      dateStart: indexFiltered.dateStart,
      dateEnd: indexFiltered.dateEnd,
    });
  };

  const validateIndexRangeDate = (indexName: string, date: string, startDate: string, endDate?: string) => {
    const currentDate = moment(date).utc();
    const indexStartDate = moment(startDate).utc();
    const indexEndDate = moment(endDate || new Date()).utc();

    if (currentDate.isBefore(indexStartDate) || currentDate.isAfter(indexEndDate))
      return `Data para o índice ${indexName} deve ser entre ${capitalizeFirstLetter(
        indexStartDate.format('MMM/YY')
      )} e ${capitalizeFirstLetter(indexEndDate.format('MMM/YY'))}`;

    return;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    event.persist();
    if (event.keyCode !== 13) return;
    refreshAfterIndexOrDateChange();
  };

  useEffect(() => {
    const noCalcIndex: SelectOptionImp = {
      id: 'noCalcIndex',
      label: 'Nenhum índice',
      value: -1,
      selected: false,
    };

    if (!indexes.length) {
      setIndexesList([noCalcIndex]);
      return;
    }

    const mappedIndexList = mapIndexList(indexes, IndexFlags.CONVERSAO);
    const selectList: SelectOptionImp[] = mappedIndexList.map((calcIndex, key) => {
      const calcIndexOpton: SelectOptionImp = {
        id: key,
        label: calcIndex.name,
        value: calcIndex.id,
      };
      return calcIndexOpton;
    });

    const indexesListWithDate = mappedIndexList.map(calcIndex => {
      const calcIndexFormat: IDateRestriction = {
        value: calcIndex.name,
        dateStart: calcIndex.dateStart,
        dateEnd: calcIndex.dateEnd,
        id: calcIndex.id,
      };
      return calcIndexFormat;
    });

    selectList.unshift(noCalcIndex);

    setIndexesList(selectList);

    setIndexesListDates(indexesListWithDate);
  }, [indexes]);

  useEffect(() => {
    refreshAfterIndexOrDateChange();
  }, [values.index, values.date]);

  return (
    <Form onKeyDown={handleKeyDown}>
      <Separator>
        <CustomSelect label="Índice" name="index" options={indexesList} icon={IoMdArrowDropdown} />
        <IndexInfo>{range}</IndexInfo>
        <Input precision={2} prefix=" " label="Quantidade" name="quantity" value={values.quantity} />
      </Separator>

      <Separator>
        <InputDate
          shouldValidate={false}
          label="Data"
          name="date"
          placeholder={dateFormatEnum.DEFAULT}
          value={values.date}
        />
      </Separator>
    </Form>
  );
};

const TabIndex = (): JSX.Element => {
  return (
    <Container
      initialValues={{
        quantity: 0,
        index: -1,
        date: null,
      }}
      onSubmit={() => {}}>
      <CustomForm />
    </Container>
  );
};

export default TabIndex;
