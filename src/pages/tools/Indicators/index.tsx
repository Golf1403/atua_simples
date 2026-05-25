import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '@components/DataTable';
import IndexFlags from '../../../enums/IndexFlags';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import CustomSelect from '@components/CustomSelect';
import IndicatorService from '@services/ToolsServices/IndicatorService';

import MemTabImp from '@interfaces/MemTabImp';
import IndicadorImp from '@interfaces/IndicadorImp';
import { monthDiff } from '../../../utils/monthDiff';
import { mapIndexList } from '@lib/utils';
import { getConversionList } from '../../../utils/conversionHelper';
import { DataTableColumnImp } from '@interfaces/DataTableImp';
import { AiFillCloseCircle } from 'react-icons/ai';
import { IndicatorResponseImp } from '@interfaces/serviceResponses/IndicatorResponseImp';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndexResponseImp } from '@interfaces/serviceResponses/IndexResponseImp';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { useFactors } from '@/hooks/factors';
import { useCore } from '@/hooks/core';
import {
  Button,
  ButtonContainer,
  Chart,
  ChartContainer,
  ChartLabel,
  Container,
  Filter,
  FilterContent,
  FilterLabel,
  FilterContainer,
  Form,
  FormikContainer,
  InputDate,
  Separator,
  SelectContainer,
  ButtonSearch,
  InputContainer,
  FlexContainer,
  FilterHeader,
} from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { FaCalendarAlt, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useFormikContext } from 'formik';
import IDummyObject from '@/interfaces/IDummyObject';
import moment from 'moment';
import { colorsfinancing, fontmd } from '@/styles/global';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdManageSearch } from 'react-icons/md';
import DefaultTooltip from '@/components/DefaultTooltip';
import _ from 'lodash';

interface IDataList {
  date: string;
  coinSign: string;
  percentual: string;
  percentualCalculated: number;
  name: string;
  type: string;
  value: string;
}

interface IChartData {
  [index: string]: string;
}

const indexesEmptyList: SelectOptionImp[] = [];
const tableColumns: DataTableColumnImp[] = [
  {
    columnIndex: 'date',
    columnName: labelsEnum.DATE,
    date: true,
    columnSortable: true,
  },
  {
    columnIndex: 'name',
    columnName: labelsEnum.INDEX,
    columnSortable: false,
  },
  {
    columnIndex: 'value',
    columnName: labelsEnum.VALUE,
    columnSortable: false,
  },
];

let filter: any[] = [];
let selectedIndex = '';

const initialValues = {
  type: '',
  dateStart: moment(new Date()).subtract(1, 'month').format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
};

const CustomForm = (): JSX.Element => {
  const indicatorService = new IndicatorService();
  const { closeLoading, openLoading, isLoading } = useLoading();
  const alertMessage = alertMessages();

  const { getIndexes } = useFactors();
  const indexes = getIndexes();

  const { values, setFieldValue, setValues } = useFormikContext<IDummyObject>();
  const [filters, setFilters] = useState<any[]>([]);
  const [order, setOrder] = useState(0);
  const [response, setResponse] = useState<IndicatorResponseImp[][]>([[]]);
  const [tableData, setTableData] = useState<IDataList[]>([]);
  const [indexesList, setIndexesList] = useState(indexesEmptyList);
  const [indexFound, setIndexFound] = useState<IndexResponseImp | null>(null);
  const [indexSelected, setIndexSelected] = useState<string>('');
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [chatVisible, setCharVisible] = useState(true);
  const [accumulationChartData, setAccumulationChartData] = useState<IChartData[]>([]);
  const [monthlyVariationChartData, setMonthlyVariationChartData] = useState<IChartData[]>([]);
  const indexTooltipPayload =
    (indexFound && [
      {
        mecid: -1,
        mecindid: -1,
        mecformula: '',
        mecmetid: -1,
        mecnome: String(indexFound.name),
        mecunidade: '',
        memTab: {} as MemTabImp,
        mecstarta: indexFound.dateStart,
        mecenda: indexFound.dateEnd,
        indicador: {
          ind0787: indexFound.ind0787,
          ind1014: indexFound.ind1014,
          ind2187: indexFound.ind2187,
          ind4272: indexFound.ind4272,
          ind4480: indexFound.ind4480,
          ind7028: indexFound.ind7028,
          ind8432: indexFound.ind8432,
          indid: indexFound.id,
          indnome: indexFound.name,
        } as IndicadorImp,
      },
    ]) ||
    [];

  const addFilter = ({ label, value }: SelectOptionImp) => {
    const newFi = (
      <Filter $index={index} key={value.toString()}>
        <Button onClick={() => onSelectFilter(value.toString())}>
          <p>{label}</p>
        </Button>
        <AiFillCloseCircle onClick={() => removeFilter(value.toString())} />
      </Filter>
    );

    filter = [...filter, newFi];

    setFilters(filter);

    onSelectFilter(value.toString());
  };

  function arrayIsEmpty(array: any[]) {
    if (!Array.isArray(array)) {
      return true;
    }
    if (array.length == 0) {
      return true;
    }
    return false;
  }

  const fetchData = async () => {
    try {
      openLoading();

      const indexes = filters.map(item => item.key);
      alertMessage.warningWaiting('Estamos carregando o(s) indicadores(s)');

      const response = await indicatorService.fetchIndicators({
        indicatorIds: indexes,
        dateStart: moment(values.dateStart, dateFormatEnum.DEFAULT).utc().toDate(),
        dateEnd: moment(values.dateEnd, dateFormatEnum.DEFAULT).utc().toDate(),
      });

      setNumberOfFilters(response.filter(item => item).length);
      setResponse(response);
      setIndexSelected('');
      let isEmpty = true;
      response.forEach(res => (isEmpty = isEmpty && arrayIsEmpty(res)));
      !isEmpty && alertMessage.successLoaded(`Indicador carregado(s) com sucesso`);
      isEmpty && alertMessage.warning(`Nenhum indicador encontrado no período`);
      setCharVisible(true);
      closeLoading();
    } catch (error) {
      closeLoading();
      alertMessage.error(`Erro ao carregar os indicadores(s)`);
    }
  };

  const removeFilter = async (value: string) => {
    const newAuthors = filter.filter(item => item.key !== value);

    filter = newAuthors;
    setFilters(newAuthors);
    setFieldValue('type', '');
    setNumberOfFilters(newAuthors.length);

    if (!newAuthors.length) return;
    const lastAuthor = newAuthors.length - 1;
    onSelectFilter(newAuthors[lastAuthor].key);
  };

  const onChangeIndex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setIndexSelected(value);
    if (value && filter.length < 6) {
      const indexOption = indexesList.find(index => index.value.toString() === value);
      const foundFilter = filter.find(item => item.key === value);
      if (indexOption && !foundFilter) addFilter(indexOption);
    }
  };

  const onSelectFilter = (value: string) => {
    const filterMod = filter.map((item, index) => {
      const label = item.props['children'][0]['props']['children']['props']['children'];
      const key = item.key;
      const active = value === key;

      return (
        <Filter $index={index} $active={active} key={key}>
          <div onClick={() => onSelectFilter(key)}>
            <p>{label.toString()}</p>
          </div>
          <AiFillCloseCircle onClick={async () => await removeFilter(key)} />
        </Filter>
      );
    });

    filter = filterMod;
    selectedIndex = value;
    setFilters(filter);
  };

  const getLabelToChart = (index: number) => {
    return filters[index]?.props['children'][0].props['children'].props['children'];
  };

  const getDataCalculated = (data: IndicatorResponseImp[]) => {
    const calculated: IDataList[] = [];

    for (let i = 0; i < data.length; i++) {
      const currentData = data[i];
      const previousData = data[i - 1];
      const { percentual } = currentData;
      const name = currentData.index.name.toUpperCase();
      const type = currentData.index.type;
      const indexTypeValue = currentData.index.type === 'V';
      const indexTypePercentual = currentData.index.type === 'P';
      const isFirstIndex = i === 0;

      if (indexTypeValue && isFirstIndex) {
        const percentual = currentData.value;
        const percentualCalculated = 0;
        const firstIndexValue = { ...currentData, percentual, percentualCalculated, name, type };

        calculated.push(firstIndexValue);
        continue;
      }

      if (indexTypeValue) {
        const currentValue = Number(currentData.value);
        const previousValue = Number(previousData.value);
        let indexTypeValueResult: number = parseFloat(
          ((Number(currentValue) / Number(previousValue) - 1) * 100).toFixed(4)
        );

        for (const conversion of getConversionList()) {
          if (conversion.date === currentData.date) {
            indexTypeValueResult = parseFloat(
              (((currentValue / previousValue) * conversion.value - 1) * 100).toFixed(4)
            );
            continue;
          }
          if (conversion.date === previousData.date && previousData.index.name !== currentData.index.name) {
            indexTypeValueResult = parseFloat((((currentValue * previousValue) / previousValue - 1) * 100).toFixed(4));
          }
        }
        const percentualCalculated = indexTypeValueResult;
        const indexValue = {
          ...currentData,
          percentualCalculated,
          name,
          type,
        };
        calculated.push(indexValue);
        continue;
      }

      if (indexTypePercentual) {
        const percentualCalculated = Number(percentual);
        const indexPercentual = { ...currentData, percentualCalculated, name, type };

        calculated.push(indexPercentual);
      }
    }

    return calculated;
  };

  const onPressEnterDateField = async (event: any) => {
    event.persist();
    if (event.keyCode !== 13) return;
    await fetchData();
  };

  const generateChart = () => {
    const chartMonthlyData: IChartData[] = [];
    const chartAccumulationData: IChartData[] = [];
    const formatedDateStart = moment(values.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.AMERICAN_DATE);
    const formatedDateEnd = moment(values.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.AMERICAN_DATE);
    const monthInterval = monthDiff(new Date(formatedDateStart), new Date(formatedDateEnd));
    const dateInterval: string[] = [];
    let accumulationPercentage = 0;
    let i = 1;
    const date = moment(values.dateStart, dateFormatEnum.DEFAULT).utc();

    for (let i = 0; i <= monthInterval; i++) {
      dateInterval.push(date.format('YYYY-MM-01'));
      date.add(1, 'M');
    }

    response.map(() => {
      const indexName: string = filters[i - 1]?.props['children'][0].props['children'].props['children'];
      const filterKey = Number(filters[i - 1]?.key);
      const toTable: IDataList[] = getDataCalculated(response[filterKey] || []);

      for (let month = 0; month <= monthInterval; month++) {
        const chartDate = moment(dateInterval[month]).utc().format('MM/YYYY');
        const fakeIndicator = {
          date: chartDate,
          percentualCalculated: 0,
          name: 'empty',
        };

        let indicator = fakeIndicator;
        toTable.map(ind => {
          const indicatorDate = moment(ind.date).utc().format('YYYY-MM-DD');
          if (indicatorDate === dateInterval[month]) {
            indicator = ind;
          }
        });
        const isNotFakeIndicator = indicator.name !== 'empty';
        const monthlyVariationPercentage = isNotFakeIndicator ? indicator.percentualCalculated : 0;
        if (month === 0 && isNotFakeIndicator) accumulationPercentage = +toTable[0]?.percentualCalculated;
        if (month === 0 && !isNotFakeIndicator) accumulationPercentage = 0;
        if (month > 0 && isNotFakeIndicator) {
          const accumulationFactor = 1 + accumulationPercentage / 100;
          const currentFactor = 1 + indicator.percentualCalculated / 100;
          accumulationPercentage = (accumulationFactor * currentFactor - 1) * 100;
        }

        chartMonthlyData[month] = {
          ...chartMonthlyData[month],
          date: chartDate,
          [indexName]: monthlyVariationPercentage.toFixed(4),
        };
        chartAccumulationData[month] = {
          ...chartAccumulationData[month],
          date: chartDate,
          [indexName]: accumulationPercentage.toFixed(4),
        };
      }
      i++;
    });
    setMonthlyVariationChartData(chartMonthlyData);
    setAccumulationChartData(chartAccumulationData);
  };

  const handleOrderTable = useCallback(() => {
    setOrder(Number(!order));

    const newTableData = tableData.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return (order ? dateA > dateB : dateA < dateB) ? 1 : -1;
    });

    setTableData(_.cloneDeep(newTableData));
  }, [tableData]);

  useEffect(() => {
    if (indexes.length) {
      const mappedIndexList = mapIndexList(indexes, IndexFlags.CONSULTA_EXTERNA);
      const selectList: SelectOptionImp[] = mappedIndexList.map((calcIndex, key) => {
        const calcIndexOpton: SelectOptionImp = {
          id: key,
          label: calcIndex.name,
          value: calcIndex.id,
        };
        return calcIndexOpton;
      });
      setIndexesList(selectList);

      return () => {
        filter = [];
      };
    }
    const noCalcIndex: SelectOptionImp = {
      id: 'noCalcIndex',
      label: 'Nenhum índice',
      value: '',
    };
    setIndexesList([noCalcIndex]);
  }, [indexes]);

  useEffect(() => {
    const index = Number(selectedIndex);
    const toTable: IDataList[] = getDataCalculated(response[index] || []);
    toTable && setTableData(toTable);
  }, [response, values.dateEnd, filters, values.dateStart]);

  useEffect(() => {
    generateChart();
  }, [response]);

  useEffect(() => {
    const indexFound = indexes.find(_index => +indexSelected == _index.id);
    if (indexFound) setIndexFound(indexFound);
  }, [indexes, indexSelected]);

  useEffect(() => {
    return () => {
      filter = [];
      setFilters([]);
      setValues(initialValues);
    };
  }, []);

  function chunk(arr: any[], chunkSize: number) {
    if (chunkSize <= 0) return [];
    const R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
    return R;
  }

  let index = -1;

  return (
    <Container>
      <Form onSubmit={() => false}>
        <FilterHeader>
          <FilterLabel>{labelsEnum.FILTERS}</FilterLabel>
          <Separator>
            <SelectContainer>
              <DefaultTooltip indexTooltip={indexTooltipPayload}>
                <CustomSelect
                  id="financing-type"
                  value={indexSelected}
                  label={labelsEnum.SELECT_INDEX}
                  name="type"
                  onChange={onChangeIndex}
                  options={indexesList}
                  icon={IoMdArrowDropdown}
                />
              </DefaultTooltip>
            </SelectContainer>
            <ButtonContainer>
              <ButtonSearch
                type="button"
                onClick={() => {
                  fetchData();
                }}>
                <DefaultTooltip text="Pesquisar">
                  <MdManageSearch />
                </DefaultTooltip>
              </ButtonSearch>
            </ButtonContainer>
          </Separator>
          <InputContainer>
            <FlexContainer>
              <InputDate
                id="dateStart"
                label={labelsEnum.DATE_START}
                placeholder={dateFormatEnum.DEFAULT}
                name="dateStart"
                className="date-start"
                onKeyDown={(e: any) => onPressEnterDateField(e)}
              />
              <InputDate
                id="dateEnd"
                label={labelsEnum.DATE_END}
                placeholder={dateFormatEnum.DEFAULT}
                name="dateEnd"
                className="date-end"
                onKeyDown={(e: any) => onPressEnterDateField(e)}
              />
            </FlexContainer>
          </InputContainer>
        </FilterHeader>

        <FilterContent>
          {chunk(filters, 2).map((parts, key) => {
            return (
              <FilterContainer key={index}>
                {parts.map(part => {
                  index = index + 1;
                  return part;
                })}
              </FilterContainer>
            );
          })}
        </FilterContent>

        <Separator>
          {filters.length && tableData.length ? (
            <DataTable
              onOrder={handleOrderTable}
              financing
              sortableIcon={order ? FaSortAmountDown : FaSortAmountUp}
              columns={tableColumns}
              data={tableData}
              numberOfSkeletons={3}
              loading={isLoading}
            />
          ) : (
            <></>
          )}
        </Separator>
      </Form>

      <ChartContainer $visibility={chatVisible}>
        <Chart>
          <ChartLabel>{labelsEnum.MONTHLY_VARIATION_GRAPH}</ChartLabel>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              syncId="anyId"
              data={monthlyVariationChartData}
              margin={{
                top: 10,
                right: 35,
                left: 0,
                bottom: 30,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis fontSize={fontmd} dataKey="date" angle={-30} tick={{ fontSize: '70%' }} />
              <YAxis fontSize={fontmd} />
              <Tooltip contentStyle={{ fontSize: fontmd }} />
              {numberOfFilters >= 1 && (
                <Area
                  type="linear"
                  dataKey={getLabelToChart(0)}
                  stackId="1"
                  stroke={colorsfinancing[0]}
                  fill="transparent"
                />
              )}
              {numberOfFilters >= 2 && (
                <Area
                  type="linear"
                  dataKey={getLabelToChart(1)}
                  stackId="2"
                  stroke={colorsfinancing[1]}
                  fill="transparent"
                />
              )}
              {numberOfFilters >= 3 && (
                <Area
                  type="linear"
                  dataKey={getLabelToChart(2)}
                  stackId="3"
                  stroke={colorsfinancing[2]}
                  fill="transparent"
                />
              )}
              {numberOfFilters >= 4 && (
                <Area
                  type="linear"
                  dataKey={getLabelToChart(3)}
                  stackId="4"
                  stroke={colorsfinancing[3]}
                  fill="transparent"
                />
              )}
              {numberOfFilters >= 5 && (
                <Area
                  type="linear"
                  dataKey={getLabelToChart(4)}
                  stackId="5"
                  stroke={colorsfinancing[4]}
                  fill="transparent"
                />
              )}
              {numberOfFilters === 6 && (
                <Area
                  type="linear"
                  dataKey={getLabelToChart(5)}
                  stackId="6"
                  stroke={colorsfinancing[5]}
                  fill="transparent"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
        <Chart>
          <ChartLabel>Gráfico de acumulação (%)</ChartLabel>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              syncId="anyId"
              data={accumulationChartData}
              margin={{
                top: 10,
                right: 35,
                left: 0,
                bottom: 30,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis fontSize={fontmd} dataKey="date" angle={-30} />
              <YAxis fontSize={fontmd} />
              <Tooltip contentStyle={{ fontSize: fontmd }} />
              {numberOfFilters >= 1 && (
                <Area type="linear" dataKey={getLabelToChart(0)} stackId="1" stroke="#8884d8" fill="transparent" />
              )}
              {numberOfFilters >= 2 && (
                <Area type="linear" dataKey={getLabelToChart(1)} stackId="2" stroke="#82ca9d" fill="transparent" />
              )}
              {numberOfFilters >= 3 && (
                <Area type="linear" dataKey={getLabelToChart(2)} stackId="3" stroke="#fdad5c" fill="transparent" />
              )}
              {numberOfFilters >= 4 && (
                <Area type="linear" dataKey={getLabelToChart(3)} stackId="4" stroke="#346991" fill="transparent" />
              )}
              {numberOfFilters >= 5 && (
                <Area type="linear" dataKey={getLabelToChart(4)} stackId="5" stroke="#ff726f" fill="transparent" />
              )}
              {numberOfFilters === 6 && (
                <Area type="linear" dataKey={getLabelToChart(5)} stackId="6" stroke="#000000" fill="transparent" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </ChartContainer>
    </Container>
  );
};

const Indicator = () => {
  const { setSidebar } = useCore();

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.INDICATORS }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  return (
    <FormikContainer initialValues={initialValues} onSubmit={() => {}}>
      <CustomForm />
    </FormikContainer>
  );
};

export default Indicator;
