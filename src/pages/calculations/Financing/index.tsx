import moment from 'moment';
import React, { useState, useEffect, Fragment } from 'react';
import DataTable from './DataTable';
import FinancingImp from '@interfaces/calculations/FinancingImp';
import IndexFlags from '../../../enums/IndexFlags';
import ISelectOption from '@interfaces/SelectOptionImp';
import TotalBottomBar from '@components/TotalBottomBar';
import FormGroupCurrency from '@components/FormGroupCurrency';
import CalculationsServices from '@services/CalculationsServices/FinancingService';

import financingSchema from '../../../validators/calculations/financing';

import { useFormik } from 'formik';
import { mapIndexList } from '@lib/utils';
import { convertCurrencyToPtBr } from '@lib/currency';
import { defaultTableColumns, defaultTableColumnsWithIndex } from './TableColumns/index';
import { DataTableColumnImp, DataTableCellImp } from '@interfaces/DataTableImp';

import MemTabImp from '@interfaces/MemTabImp';
import IndicadorImp from '@interfaces/IndicadorImp';
import { IndexResponseImp } from '@interfaces/serviceResponses/IndexResponseImp';
import Tooltip from '@/components/DefaultTooltip';
import PrintFinancing from '@/pages/Print/FinancingPrint';
import { alertMessages } from '@/hooks/alertMessages';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { useLoading } from '@/hooks/loading';
import { useFactors } from '@/hooks/factors';
import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';

const startData: DataTableCellImp[] = [];

const typeOptions = [
  { id: 1, value: 'price', label: 'Price' },
  { id: 2, value: 'sac', label: 'SAC' },
  { id: 3, value: 'sacre', label: 'SACRE' },
  { id: 4, value: 'linear', label: 'Linear' },
];

const initialValues: FinancingImp = {
  date: new Date(),
  deadline: 0,
  interest: '0.0000',
  index: '-1',
  name: '',
  type: '',
  value: 0,
  shortage: 0,
  positive: false,
};

const indexesEmptyList: ISelectOption[] = [];

const startTotalData = {
  amortization: 0,
  correction: 0,
  installment: 0,
  interest: 0,
  sum: 0,
};

const FormikFinancing = (): JSX.Element => {
  const { isLoading, openLoading, closeLoading } = useLoading();
  const alertMessage = alertMessages();
  const { getIndexes } = useFactors();
  const { setSidebar } = useCore();
  const indexes = getIndexes();

  const calculationsServices = new CalculationsServices();
  const [tableData, setTableData] = useState(startData);
  const [totalData, setTotalData] = useState(startTotalData);
  const [allowPrint, setAllowPrint] = useState(false);
  const [indexesList, setIndexesList] = useState(indexesEmptyList);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [indexFound, setIndexFound] = useState<IndexResponseImp | null>(null);
  const [tableColumns, setTableColumns] = useState<DataTableColumnImp[]>([]);

  const withoutCorrectionIndexOption = {
    id: '-1',
    label: 'Sem correção',
    value: '-1',
  };

  useEffect(() => {
    if (indexes.length) {
      const mappedIndexList = mapIndexList(indexes, IndexFlags.FINANCIAMENTO);
      const selectList: any[] = mappedIndexList.map((calcIndex, key) => {
        const calcIndexOpton: any = {
          id: key,
          label: calcIndex.name,
          value: calcIndex.id,
          visibility: calcIndex.disp,
        };
        return calcIndexOpton;
      });

      selectList.unshift(withoutCorrectionIndexOption);

      setIndexesList(selectList);
      return;
    }
    const noCalcIndex: ISelectOption = {
      id: 'noCalcIndex',
      label: 'Nenhum índice',
      value: '',
    };
    setIndexesList([noCalcIndex]);
  }, [indexes]);

  const { handleChange, handleSubmit, values, errors, setFieldValue, setValues } = useFormik({
    initialValues,
    validationSchema: financingSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      if (values.shortage < 0) {
        alertMessage.warning('O campo carência não pode ser negativo');
        return;
      }
      if (values.shortage >= values.deadline) {
        alertMessage.warning(`O campo carência não pode ser maior que o prazo`);
        return;
      }
      if (!values.deadline) {
        alertMessage.error(``);
      }
      if (!values.index && !Number(values.interest)) {
        alertMessage.warning('Juros ou índice não podem estar vazios, pelo menos um deve ser selecionado');
        return;
      }

      openLoading();
      setAllowPrint(false);
      setTableData(startData);
      setTotalData(startTotalData);

      try {
        const financingInstallments = await calculationsServices.calculate(values);
        if (values.index) {
          const indexOption = indexesList.find(index => {
            return index.value.toString() === values.index;
          });
          financingInstallments.installments.map((item: DataTableCellImp) => {
            item.index = indexOption ? indexOption.label : '';
            return item;
          });
        }

        const { total, installments } = financingInstallments;
        const newTableData: DataTableCellImp[] = [];

        installments.map((install: DataTableCellImp) => {
          const { rate, indexValue } = install;
          install.rateAndIndex = +rate + +indexValue;
          install.indexValue = +indexValue;
          newTableData.push(install);
        });
        setTableData(newTableData);
        setTotalData(total);
        setAllowPrint(true);
      } catch (error) {
        setAllowPrint(false);
        alertMessage.error('');

        if (error.validationErrors?.date) alertMessage.error(String(error.validationErrors.date));

        if (error.message) alertMessage.error(String(error.message));

        if (typeof error === 'string') alertMessage.error(String(error));
      } finally {
        closeLoading();
      }
    },
  });

  const _setChangeDate = (date: Date): void => {
    const selectedDate = moment(date).format('YYYY-MM-DD');
    if (moment(selectedDate).isSameOrAfter('1994-08-01')) {
      setFieldValue('date', date);
      return;
    }
    alertMessage.warning('A data deve ser maior que 01/08/1994');
  };

  const datePickerKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Tab') {
      const calendar: HTMLElement | null = document.querySelector('.react-datepicker__tab-loop');
      if (calendar) calendar.style.display = 'none';
    }
  };

  const setMoneyField = (maskedValue: string, float: number, name: string) => {
    setFieldValue(name, float || 0);
  };

  const onIndexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    setTableData(startData);
    if (value && value !== String(-1)) {
      const columns = Array.from(defaultTableColumnsWithIndex);
      setTableColumns(columns);
      return;
    }
    setTableColumns(defaultTableColumns);
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isIndexSelected = values.index;
    setFieldValue(name, value);
    setTableData(startData);

    if (isIndexSelected && isIndexSelected !== String(-1)) {
      const columns = Array.from(defaultTableColumnsWithIndex);
      setTableColumns(columns);
      return;
    }

    setTableColumns(defaultTableColumns);
  };

  const newFile = () => {
    setValues(initialValues);
    setTableData(startData);
    setAllowPrint(false);
  };

  const print = () => {
    setModalIsOpen(true);
  };

  useEffect(() => {
    const _indexFound = indexes.find(_index => Number(values.index) == _index.id);
    if (values.index == String(-1)) {
      setIndexFound({
        id: -1,
        name: 'Sem Correção',
        dateStart: moment('01/01/1964', dateFormatEnum.DEFAULT).format(),
        dateEnd: moment().format(),
        costCenterId: '',
        costCenter: '',
        ind7028: 0,
        ind4272: 0,
        ind1014: 0,
        ind8432: 0,
        ind4480: 0,
        ind0787: 0,
        ind2187: 0,
      });
    } else if (_indexFound) setIndexFound(_indexFound);
  }, [indexes, values.index]);

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

  React.useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.FINANCING }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="financing-type">{labelsEnum.TYPE}</label>
          <select id="financing-type" name="type" className="form-control" onChange={onTypeChange} value={values.type}>
            <option value="" disabled>
              Selecione...
            </option>
            {typeOptions.map(option => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="financing-name">Nome</label>
          <input
            type="text"
            id="financing-name"
            name="name"
            className="form-control"
            onChange={handleChange}
            value={values.name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="financing-date">{labelsEnum.DATE}</label>
          <input
            type="date"
            id="financing-date"
            name="date"
            className="form-control"
            min="1994-08-01"
            onChange={event => _setChangeDate(moment(event.target.value, 'YYYY-MM-DD').toDate())}
            onKeyDown={datePickerKeyDown}
            value={moment(values.date).format('YYYY-MM-DD')}
          />
        </div>
        <FormGroupCurrency
          label={labelsEnum.VALUE}
          name="value"
          id="financing-value"
          onChange={setMoneyField}
          maxLength={18}
          value={values.value}
          error={errors.value}
        />
        <div className="form-group">
          <label htmlFor="financing-deadline">{labelsEnum.DEADLINE}</label>
          <input
            type="number"
            id="financing-deadline"
            name="deadline"
            className="form-control"
            min="0"
            onChange={handleChange}
            value={values.deadline}
          />
        </div>
        <div className="form-group">
          <label htmlFor="financing-grace">{labelsEnum.SHORTAGE}</label>
          <input
            type="number"
            id="financing-grace"
            name="shortage"
            className="form-control"
            min="0"
            onChange={handleChange}
            value={values.shortage}
          />
        </div>
        <FormGroupCurrency
          id="financing-interest"
          name="interest"
          label={labelsEnum.INTEREST}
          onChange={setMoneyField}
          precision={4}
          value={values.interest}
          error={errors.interest}
        />
        <label className="form-check">
          <input
            id="financing-positive"
            name="positive"
            type="checkbox"
            checked={values.positive}
            onChange={handleChange}
          />
          Percentual negativo
        </label>
        {values.type && (
          <Tooltip indexTooltip={indexTooltipPayload}>
            <div className="form-group">
              <label htmlFor="financing-index">Índice</label>
              <select
                id="financing-index"
                name="index"
                className="form-control"
                onChange={onIndexChange}
                value={values.index}>
                {indexesList.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </Tooltip>
        )}
        <button type={'submit'}>{labelsEnum.GENERAGE_INSTALLMENT}</button>
      </form>

      <Fragment>
        <h2>{labelsEnum.PURCHASE}</h2>
        <DataTable columns={tableColumns} data={tableData} numberOfSkeletons={12} loading={isLoading} />
        <h2>{labelsEnum.AMORTIZATION}</h2>
        <p>{!isLoading && convertCurrencyToPtBr(totalData.amortization)}</p>
        <h2>{labelsEnum.CORRECTION}</h2>
        <p>{!isLoading && convertCurrencyToPtBr(totalData.correction)}</p>
        <h2>{labelsEnum.INSTALLMENTS}</h2>
        <p>{!isLoading && convertCurrencyToPtBr(totalData.installment)}</p>
        <h2>{labelsEnum.INTEREST}</h2>
        <p>{!isLoading && convertCurrencyToPtBr(totalData.interest)}</p>
        <TotalBottomBar total={totalData.installment} />
      </Fragment>

      <PrintFinancing
        onClose={() => setModalIsOpen(false)}
        modalIsOpen={modalIsOpen}
        financing={{
          ...values,
          data: {
            total: totalData,
            installments: tableData,
          },
        }}
      />
    </Fragment>
  );
};

const Financing = () => <FormikFinancing />;

export default Financing;
