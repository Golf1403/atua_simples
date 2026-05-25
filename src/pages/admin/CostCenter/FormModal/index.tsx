import React, { Fragment, useEffect, useState } from 'react';
import { Formik, useFormikContext } from 'formik';
import CostCenterImp from '@interfaces/costCenters/CostCenterImp';

import SelectOptionImp from '@interfaces/SelectOptionImp';
import DataTable from '@components/DataTable';

import moment from 'moment';
import { useLoading } from '@/hooks/loading';
import { FaCalendarAlt, FaEdit } from 'react-icons/fa';
import {
  ButtonSearch,
  Container,
  DateInputContainer,
  Input,
  InputContainer,
  NameContainer,
  TotalLabels,
} from './styles';
import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultModal from '@/components/DefaultModal';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { getUserManagementCell, tableDataInitial } from '../../UserManagement/Table';
import { tableColumns } from '../../UserManagement/Table';
import { labelsEnum } from '@/enums/labelsEnum';
import AccountServices, { ICostCenterInfo } from '@/services/AccountServices';
import IDummyObject from '@/interfaces/IDummyObject';
import { alertMessages } from '@/hooks/alertMessages';
import { messagesEnum } from '@/enums/messagesEnum';
import { errorsEnum } from '@/enums/errorsEnum';
import DefaultTooltip from '@/components/DefaultTooltip';
import { MdManageSearch } from 'react-icons/md';

interface IProps {
  modalIsOpen: boolean;
  onConfirm: Function;
  isSave: boolean;
  onCancel: Function;
  costCenter?: CostCenterImp;
  profileOptions: SelectOptionImp[];
}

const initialValues = {
  id: '',
  name: '',
  profile: undefined,
  dateStart: moment(new Date()).subtract(5, 'year').format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
};

type CostCenterInfoType = ICostCenterInfo | null;

const CustomForm = ({ costCenter, isSave, modalIsOpen, onCancel, onConfirm }: IProps): JSX.Element => {
  const accountServices = new AccountServices();
  const alertMessage = alertMessages();
  const { openLoading, closeLoading } = useLoading();
  const [dataTable, setDataTable] = useState(tableDataInitial);
  const { values, setValues } = useFormikContext<IDummyObject>();
  const [costCenterInfo, setCostCenterInfo] = useState<CostCenterInfoType>(null);

  const listCostCenter = async () => {
    try {
      alertMessage.warning(messagesEnum.LOADING);
      openLoading();
      const start = moment(values.dateStart, dateFormatEnum.DEFAULT).utc().format(dateFormatEnum.AMERICAN_DATE);
      const end = moment(values.dateEnd, dateFormatEnum.DEFAULT).utc().format(dateFormatEnum.AMERICAN_DATE);

      const response = await accountServices.getCostCenterInfo({
        dateStart: start,
        dateEnd: end,
        costCenterId: values.id,
      });

      const tableCells = response.users.list.map(user => {
        return getUserManagementCell(user as any);
      });

      setCostCenterInfo(response);
      setDataTable(tableCells);
      tableCells.length
        ? alertMessage.success(messagesEnum.LOADING_SUCCESS)
        : alertMessage.warning(messagesEnum.LOADING_SUCCESS_USER_NOT_FOUND_ON_RANGE);
    } catch (error) {
      alertMessage.error(errorsEnum.DEFAULT);
    } finally {
      closeLoading();
    }
  };

  React.useEffect(() => {
    if (!costCenter) return;
    setValues(values => ({ ...values, ...costCenter }));
  }, [costCenter]);

  React.useEffect(() => {
    if (!isSave) return;

    isSave && setValues(initialValues);
    return () => {
      setValues(initialValues);
    };
  }, [modalIsOpen, isSave]);

  useEffect(() => {
    return () => {
      setDataTable([]);
      setCostCenterInfo(null);
    };
  }, [costCenter?.id]);

  const onPressEnterDateField = (event: React.KeyboardEvent<HTMLFormElement>) => {
    event.persist();
    const target: any = event?.target;
    const form = target?.form;
    if (!form) return;
    if (event.keyCode != 13) return;
    values.id.length && listCostCenter();
  };

  return (
    <DefaultModal
      title={isSave ? labelsEnum.COST_CENTER_NEW : labelsEnum.COST_CENTER_UPDATE}
      isOpen={modalIsOpen}
      onCancel={() => onCancel()}
      onClose={() => onCancel()}
      isCloseOnConfirm={false}
      onConfirm={() =>
        onConfirm({
          id: values.id,
          name: values.name,
          profile: values.profile,
        })
      }>
      <Container onKeyDown={onPressEnterDateField}>
        <InputContainer>
          <NameContainer>
            <Input label="Nome" name="name" />
          </NameContainer>
          {values.id.length ? (
            <DateInputContainer>
              <DefaultDateInput label={labelsEnum.DATE_START} name="dateStart" />
              <DefaultDateInput label={labelsEnum.DATE_END} name="dateEnd" />
              <ButtonSearch
                type="button"
                onClick={() => {
                  values.id.length && listCostCenter();
                }}>
                <DefaultTooltip text="Pesquisar">
                  <MdManageSearch />
                </DefaultTooltip>
              </ButtonSearch>
            </DateInputContainer>
          ) : (
            <></>
          )}
        </InputContainer>
        {dataTable.length ? (
          <DataTable numberOfSkeletons={3} lines={4} columns={tableColumns} data={dataTable} />
        ) : (
          <></>
        )}
        {costCenterInfo?.users.total || costCenterInfo?.accounts.total ? (
          <TotalLabels>
            <p>
              <b>Total de usuário:</b> <span>{costCenterInfo?.users.total} usuário(s)</span>
            </p>
            <p>
              <b>Total de contas:</b> <span>{costCenterInfo?.accounts.total} conta(s)</span>
            </p>
          </TotalLabels>
        ) : (
          <Fragment />
        )}
      </Container>
    </DefaultModal>
  );
};

const FormModal = ({ costCenter, ...props }: IProps): JSX.Element => {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <CustomForm {...props} costCenter={costCenter} />
    </Formik>
  );
};

export default FormModal;
