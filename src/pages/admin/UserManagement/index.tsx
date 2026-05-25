import React, { useState, useCallback, useRef, Fragment } from 'react';
import UserServices from '@services/UserServices';
import ModalNewUser from './ModalNewUser';
import ModalEditUser from './ModalEditUser';
import { useCore } from '@/hooks/core';
import { setError } from '@store/core/action';
import { alertMessages } from '@/hooks/alertMessages';
import { DataTableCellImp } from '@interfaces/DataTableImp';
import { ApplicationState } from '@store/index';
import Table, { tableColumns, tableDataInitial } from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { setAvaible, setAllLicenses, setTotal } from '@store/license/actions';
import { Button, ButtonContainer, DataTable, Text, TextContainer } from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { FaPlus, FaUndo } from 'react-icons/fa';
import DefaultModal from '@/components/DefaultModal';
import { UserImp, useUser } from '@/hooks/user';

const UserList = (): JSX.Element => {
  const alertMessage = alertMessages();

  const {
    allLicenses,
    total: totalLicensesNumber,
    avaible: avaibleLicensesNumber,
  } = useSelector((state: ApplicationState) => state.license);
  const dispatch = useDispatch();
  const userServices = new UserServices();
  const isFirstState = useRef(true);
  const [user, setUser] = useState<DataTableCellImp | null>(null);
  const [tableData, setTableData] = useState(tableDataInitial);
  const [activeUser, setActiveUser] = useState<Omit<UserImp, 'isAdmUser'>>();
  const [showModalUser, setShowModalUser] = useState(false);
  const [showModalEditUser, setShowModalEditUser] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [isRemoveAlertModalOpen, setIsRemoveAlertModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSidebar, setResults } = useCore();

  const { user: userHook, setUser: setUserHook } = useUser();

  const handleRemoveUser = async () => {
    try {
      setLoading(true);
      alertMessage.warningWaiting(`Estamos removendo o ${user?.firstName + ' ' + user?.lastName || 'usuário'}`);
      if (!user) throw new Error('Usuário não encontrado');

      await userServices.removeCompleteProfile(String(user.id));

      alertMessage.sucessDeleted(`${user?.firstName + ' ' + user?.lastName} removido(a) com sucesso`);
    } catch (error) {
      dispatch(setError(error));
      alertMessage.error(`Erro ao remover o(a) ${user?.firstName + ' ' + user?.lastName}`);
    } finally {
      setLoading(false);
      setIsRemoveAlertModalOpen(false);
      fetchData();
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      alertMessage.warningWaiting('Estamos buscando o(s) usuário(s)');
      const { avaible, allLicenses: _allLicenses, total } = await userServices.listUsers();

      setShowRegisterButton(avaible > 0);

      if (_allLicenses.length) {
        const tableCells = Table({
          user: { list: _allLicenses, id: userHook.id, setUser },
          onEdit: editUser,
          isRemoveAlertModalOpen,
          setIsRemoveAlertModalOpen,
        });

        setTableData(tableCells);

        dispatch(setTotal(total));
        dispatch(setAvaible(avaible));
        dispatch(setAllLicenses(_allLicenses));
      }
      alertMessage.successLoaded(`Usuário(s) carregado(s) com sucesso`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(setError(error));
      alertMessage.error(`Erro ao carregar usuário(s)`);
    }
  }, [Table, dispatch]);

  React.useEffect(() => {
    if (!allLicenses) {
      if (!isFirstState.current) return;
      isFirstState.current = false;
      fetchData();
      return;
    }

    setShowRegisterButton(avaibleLicensesNumber > 0);

    const tableCells = Table({
      user: { list: allLicenses, id: userHook.id, setUser },
      onEdit: editUser,
      isRemoveAlertModalOpen,
      setIsRemoveAlertModalOpen,
    });

    setTableData(tableCells);
  }, [avaibleLicensesNumber, allLicenses]);

  const editUser = (userTableCell: DataTableCellImp) => {
    const user: Omit<UserImp, 'isAdmUser'> = {
      licenseId: userTableCell.licenseId as string,
      id: userTableCell.id as string,
      firstName: userTableCell.firstName as string,
      lastName: userTableCell.lastName as string,
      password: userTableCell.password as string,
      email: userTableCell.email as string,
      costCenters: userTableCell.costCenters as string[],
    };
    setActiveUser(user);
    setShowModalEditUser(true);
  };

  const onSaveUser = () => {
    setShowModalUser(false);
    fetchData();
  };

  const onEditUser = (values: UserImp) => {
    if (values.id === userHook.id) setUserHook(values);
    setShowModalEditUser(false);
    fetchData();
  };

  React.useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.USERS }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  React.useEffect(() => {
    setResults([{ result: totalLicensesNumber, title: labelsEnum.USERS_TOTAL }]);
    return () => setResults([]);
  }, [totalLicensesNumber]);

  return (
    <Fragment>
      <ButtonContainer>
        <Button handleOnClick={fetchData} icon={FaUndo} label={labelsEnum.RELOAD} type="button" />
        <Button
          handleOnClick={() => setShowModalUser(value => !value)}
          icon={FaPlus}
          label={labelsEnum.ADD}
          type="button"
        />
      </ButtonContainer>

      <DataTable numberOfSkeletons={4} lines={5} loading={loading} columns={tableColumns} data={tableData} />
      <ModalNewUser onCancel={() => setShowModalUser(false)} onSave={onSaveUser} modalIsOpen={showModalUser} />
      <ModalEditUser
        onCancel={() => setShowModalEditUser(false)}
        onEdit={onEditUser}
        modalIsOpen={showModalEditUser}
        user={activeUser}
      />

      <DefaultModal
        isOpen={isRemoveAlertModalOpen}
        onConfirm={handleRemoveUser}
        onCancel={() => setIsRemoveAlertModalOpen(false)}
        onClose={() => setIsRemoveAlertModalOpen(false)}
        title="Confirmar">
        <TextContainer>
          <Text>Tem certeza que deseja excluir o usuário?</Text>
        </TextContainer>
      </DefaultModal>
    </Fragment>
  );
};

export default UserList;
