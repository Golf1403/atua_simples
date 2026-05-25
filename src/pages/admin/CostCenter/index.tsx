import React, { Fragment } from 'react';
import CostCenterImp from '@interfaces/costCenters/CostCenterImp';
import DataTable from '@components/DataTable';
import UserServices from '@services/UserServices';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import AccountServices from '@services/AccountServices';
import AccessProfileResponseImp from '@interfaces/serviceResponses/AccessProfileResponseImp';

import { useDispatch, useSelector } from 'react-redux';
import { setError, setProfiles } from '@store/core/action';

import { ApplicationState } from '@store/index';
import { DataTableColumnImp, DataTableCellImp } from '@interfaces/DataTableImp';

import { IError } from '@store/core/types';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { useCore } from '@/hooks/core';
import CostCenterTable, { initialPaginate, startData, tableColumns } from './Table';
import FormModal from './FormModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { Button, ButtonContainer } from './styles';
import { FaPlus } from 'react-icons/fa';
import DeleteModal from './DeleteModal';

const CostCenter = (): JSX.Element => {
  const alertMessage = alertMessages();
  const dispatch = useDispatch();
  const { openLoading, closeLoading } = useLoading();
  const userServices = new UserServices();
  const accountServices = new AccountServices();

  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const {
    profiles: profileListState,
    costCenters: costCentersList,
    setCostCenters: setCostCentersAction,
    onSelectCostCenterOptions,
    setSidebar,
    setResults,
  } = useCore();

  const [oneAttempt, setOneAttempt] = React.useState(true);
  const [isSave, setIsSave] = React.useState(true);
  const [search, setSearch] = React.useState<string>('');
  const [tableData, setTableData] = React.useState(startData);
  const [costCenters, setCostCenters] = React.useState<DataTableCellImp[]>([]);
  const [paginateData, setPaginateData] = React.useState(initialPaginate);
  const [activeCostCenter, setActiveCostCenter] = React.useState<CostCenterImp>();
  const [showModalCostCenter, setShowModalCostCenter] = React.useState(false);
  const [profileOptions, setProfileOptions] = React.useState<SelectOptionImp[]>([]);
  const [showSaveCostCenterButton, setShowSaveCostCenterButton] = React.useState(true);
  const [costCenter, setCostCenter] = React.useState('');

  const removeCostCenter = async (id: string) => {
    try {
      openLoading();
      await accountServices.deleteCostCenter(id);

      alertMessage.sucessDeleted('Deletado(a) com sucesso');
      fetchData();
    } catch (error) {
      dispatch(setError(error as IError));
      alertMessage.error('Não foi possivel remover com sucesso');
    } finally {
      closeLoading();
    }
  };

  const editCostCenter = (costCenterTableCell: DataTableCellImp) => {
    const costCenter: CostCenterImp = {
      id: costCenterTableCell.id as string,
      name: costCenterTableCell.name as string,
    };
    setActiveCostCenter(costCenter);
    setShowModalCostCenter(true);
    setIsSave(false);
  };

  const onSave = async (costCenter: CostCenterImp) => {
    try {
      openLoading();
      setShowModalCostCenter(false);
      if (showSaveCostCenterButton) throw 'Limite de Centro de Custo atingido';
      await accountServices.saveCostCenter(costCenter);
      await fetchData();
      setActiveCostCenter(undefined);
      alertMessage.successSaved(`${costCenter.name} salvo com sucesso`);
    } catch (error) {
      alertMessage.error(error?.length ? error : `não foi possivel salvar ${costCenter.name}`);
      closeLoading();
    } finally {
      closeLoading();
    }
  };

  const onUpdate = async (costCenter: CostCenterImp) => {
    try {
      openLoading();
      alertMessage.warningWaiting(`Estamos Atualizando`);

      setShowModalCostCenter(false);
      await accountServices.updateCostCenter(costCenter);
      fetchData();
      setActiveCostCenter(undefined);
      alertMessage.successUpdated(`${costCenter.name} atualizado com sucesso`);
    } catch (error) {
      dispatch(setError(error as IError));
      alertMessage.error(`não foi possivel atualizar ${costCenter.name}`);
      closeLoading();
    } finally {
      closeLoading();
    }
  };

  const fetchData = async () => {
    alertMessage.warningWaiting(`Estamos buscando o(s) centro de custo(s)`);
    try {
      openLoading();
      const costCenters = await accountServices.listCostCenter();

      if (costCenters) {
        const tableCells = CostCenterTable(costCenters, editCostCenter, removeCostCenter);

        setCostCenters(tableCells);
        setTableData(tableCells);

        setCostCentersAction(costCenters);
        onSelectCostCenterOptions(costCenters);
      }
    } catch (error) {
      dispatch(setError(error as IError));
      closeLoading();
    } finally {
      closeLoading();
    }
  };

  const setColumnOrder = (column: DataTableColumnImp) => {
    if (paginateData.orderBy === column.columnIndex) {
      const newOrder = paginateData.order === 'asc' ? 'desc' : 'asc';
      setPaginateData({
        ...paginateData,
        order: newOrder,
      });
    } else {
      setPaginateData({
        ...paginateData,
        orderBy: column.columnIndex,
        order: 'asc',
      });
    }
  };

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const searchAction = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const costCentersHistory = costCenters;
    if (search) {
      const filteredItems = costCentersHistory.filter(data => {
        const name = data.name as string;
        return name.indexOf(search) === 0;
      });
      return setTableData(filteredItems);
    }
    setTableData(costCenters);
  };

  const getProfileOptions = (profile: AccessProfileResponseImp) => {
    const option: SelectOptionImp = {
      label: profile.name,
      value: profile.id,
      id: profile.id,
    };
    return option;
  };

  React.useEffect(() => {
    try {
      if (!costCentersList) {
        fetchData();
      } else {
        const tableCells = CostCenterTable(costCentersList, editCostCenter, setCostCenter);
        setCostCenters(tableCells);
        setTableData(tableCells);
      }
    } catch (error) {
      alertMessage.error(`Erro ao carregar centro de custo(s)`);
    } finally {
      closeLoading();
    }
  }, [costCentersList]);

  React.useEffect(() => {
    const getProfiles = async () => {
      try {
        openLoading();
        const profiles = await userServices.listAccessProfiles();
        dispatch(setProfiles(profiles));
        const options = profiles.map(getProfileOptions);
        setProfileOptions(options);
      } catch (error) {
        dispatch(setError(error as IError));
        closeLoading();
      } finally {
        closeLoading();
      }
    };

    if (oneAttempt && !profileListState) {
      setOneAttempt(false);
      getProfiles();
      return;
    }

    if (!profileListState) return;

    const options = profileListState.map(getProfileOptions);
    setProfileOptions(options);
  }, [oneAttempt, profileListState]);

  React.useEffect(() => {
    const costCenterAbility = ability.rules.find((rule: any) => {
      return rule.subject == 'CostCenter';
    });
    if (costCenterAbility && costCenterAbility.conditions && costCenterAbility.conditions.limit) {
      costCentersList &&
        setShowSaveCostCenterButton(Boolean(costCentersList.length >= Number(costCenterAbility.conditions.limit)));
    }
  }, [costCentersList]);

  React.useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.COST_CENTER }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  React.useEffect(() => {
    setResults([{ result: costCenters.length, title: labelsEnum.COST_CENTER_TOTAL }]);
    return () => setResults([]);
  }, [costCenters]);

  return (
    <Fragment>
      <ButtonContainer>
        <Button
          handleOnClick={() => {
            setShowModalCostCenter(true);
            setIsSave(true);
          }}
          icon={FaPlus}
          label={labelsEnum.ADD}
          type="button"
        />
      </ButtonContainer>

      <DataTable columns={tableColumns} data={tableData} loading={false} onOrder={setColumnOrder} />

      <FormModal
        onCancel={() => {
          setShowModalCostCenter(false);
          setActiveCostCenter(undefined);
        }}
        profileOptions={profileOptions}
        isSave={isSave}
        onConfirm={isSave ? onSave : onUpdate}
        modalIsOpen={showModalCostCenter}
        costCenter={activeCostCenter}
      />
      <DeleteModal
        removeCostCenter={removeCostCenter}
        setCostCenter={setCostCenter}
        costCenter={costCenter}></DeleteModal>
    </Fragment>
  );
};

export default CostCenter;
