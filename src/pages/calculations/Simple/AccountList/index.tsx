import React, { Fragment, useEffect, useRef } from 'react';
import DataTable from '@components/DataTable';
import { DataTableColumnImp } from '@interfaces/DataTableImp';
import { Formik, useFormikContext } from 'formik';
import Pagination from '@components/Pagination';
import simpleUpdateAccountSchema from '@/validators/components/simpleUpdateAccountSchema';
import { simpleAccountList as onShortcuts } from '@/utils/shortcuts';
import useSimpleUpdate, { pagination } from '@/hooks/simpleUpdate';
import { labelsEnum } from '@/enums/labelsEnum';
import GenerateTable from './GenerateTable';
import GenerateToolbar from './GenerateToolbar';
import GenerateSidebar from './GenerateSidebar';
import GenerateShortCuts from './GenerateShortCuts';
import DefaultInput from '@/components/DefaultInput';
import { ButtonSearch, Search } from './styles';
import DefaultTooltip from '@/components/DefaultTooltip';
import { MdManageSearch } from 'react-icons/md';
import { useCore } from '@/hooks/core';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { getFieldName } from '@/lib/nomenclature';

const NUMBERS_OF_SKELETONS = 50;

const initialValues = {
  modal: {
    visible: false,
    message: '',
  },
  search: '',
  reload: false,
  newAccount: false,
  loading: false,
  pagination,
  data: [],
};

const CustomForm = (): JSX.Element => {
  const { listAccountsByTypeId } = useSimpleUpdate() as any;
  const firstInit = useRef(true);

  const { values, setFieldValue } = useFormikContext<{
    modal: {
      visible: boolean;
      message: string;
    };
    search: string;
    reload: boolean;
    newAccount: boolean;
    loading: boolean;
    data: never[];
  }>();

  const { pagination, setPagination } = useCore();
  const { nomenclatures } = useNomenclatures();

  const tableColumns: DataTableColumnImp[] = [
    {
      columnIndex: 'name',
      columnName: labelsEnum.NAME,
      columnSortable: true,
    },
    {
      columnIndex: 'defendantId',
      columnName: getFieldName(labelsEnum.DEFENDANTS, nomenclatures),
      columnSortable: true,
    },
    {
      columnIndex: 'recordId',
      columnName: getFieldName(labelsEnum.RECORD, nomenclatures),
      columnSortable: true,
    },
    {
      columnIndex: 'courtId',
      columnName: getFieldName(labelsEnum.COURT, nomenclatures),
      columnSortable: true,
    },
    {
      columnIndex: 'costCenterName',
      columnName: getFieldName(labelsEnum.COST_CENTER, nomenclatures),
      columnSortable: true,
    },
    {
      columnIndex: 'createdAt',
      columnName: labelsEnum.DATE,
      columnSortable: true,
    },
    {
      columnIndex: 'actions',
      columnName: labelsEnum.ACTIONS,
      columnSortable: false,
    },
  ];

  const reload = async (_search?: string, page?: number) => {
    try {
      await setFieldValue('loading', true);

      const response = await listAccountsByTypeId({
        page: page || pagination.current,
        paginate: pagination,
        search: _search !== undefined ? _search : '',
      });

      if (response.results.length)
        setPagination({
          current: page || pagination.current,
          pages: response.pagination.pages || pagination.pages,
          total: response.pagination.total || pagination.total,
          orderBy: response.pagination.orderBy || pagination.orderBy,
          order: response.pagination.order || pagination.order,
        });

      await setFieldValue('loading', false);
    } catch (error) {
      console.log(error);
      await setFieldValue('loading', false);
    }
  };

  const handleOrderColunm = (column: DataTableColumnImp) => {
    if (pagination.orderBy === column.columnIndex) {
      const newOrder = pagination.order === 'asc' ? 'desc' : 'asc';
      setPagination({
        ...pagination,
        orderBy: column.columnIndex,
        order: newOrder,
      });
    } else
      setPagination({
        ...pagination,
        orderBy: column.columnIndex,
        order: 'asc',
      });
  };

  useEffect(() => {
    reload(values.search, 1);
  }, [pagination.order, pagination.orderBy]);

  const onPressEnterDateField = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.persist();
    if (event.keyCode !== 13) return;
    reload(values.search, 1);
  };

  useEffect(() => {
    if (firstInit.current) {
      firstInit.current = false;
      return;
    }
    if (!values.search.length) reload();
  }, [values.search]);

  return (
    <Fragment>
      <GenerateToolbar />
      <GenerateSidebar title={labelsEnum.SIMPLE_UPDATE} />
      <GenerateShortCuts onShortcuts={onShortcuts} />
      <Search>
        <DefaultInput placeholder="Pesquisar cálculo" name="search" onKeyDown={onPressEnterDateField} />
        <ButtonSearch type="button" onClick={() => values.search.length && reload(values.search, 1)}>
          <DefaultTooltip text="Pesquisar">
            <MdManageSearch />
          </DefaultTooltip>
        </ButtonSearch>
      </Search>
      <GenerateTable />
      <DataTable
        numberOfSkeletons={NUMBERS_OF_SKELETONS}
        columns={tableColumns}
        data={values.data}
        loading={values.loading}
        onOrder={handleOrderColunm}
      />
      <Pagination reload={reload} isCurrent />
    </Fragment>
  );
};

const SimpleList = (): JSX.Element => {
  return (
    <Formik validationSchema={simpleUpdateAccountSchema} initialValues={initialValues} onSubmit={() => {}}>
      <CustomForm />
    </Formik>
  );
};

export default SimpleList;
