import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '@components/DataTable';
import UserServices from '@services/UserServices';
import ModalCostCenter from '../ModalCostCenter';

import { useFormikContext } from 'formik';
import { setAllLicenses } from '@store/license/actions';
import { newArrayPlusContent } from '../../../../utils/newArrayPlusContent';
import { useDispatch, useSelector } from 'react-redux';

import { ApplicationState } from '@store/index';
import { DataTableCellImp, DataTableColumnImp } from '@interfaces/DataTableImp';

import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { alertMessages } from '@/hooks/alertMessages';
import { labelsEnum } from '@/enums/labelsEnum';
import DefaultModal from '@/components/DefaultModal';
import { ButtonAction, ButtonAdd, ButtonContainer, Container, CostCenterContainer, Form, Input } from './styles';
import userEditAdminDataSchema from '../../../../validators/userEditAdminDataSchema';
import { UserImp, useUser } from '@/hooks/user';
import UserTransformer from '@/transforms/UserTransformer';
import login from '@/services/http/login';

interface IProps {
  modalIsOpen: boolean;
  onEdit: Function;
  onCancel: Function;
  user: any;
}

type EditUserImp = Omit<UserImp, 'isAdmUser' | 'id'>;

const initialValues: EditUserImp = {
  licenseId: '',
  firstName: '',
  lastName: '',
  email: '',
  costCenters: [],
};

const tableColumns: DataTableColumnImp[] = [
  {
    columnIndex: 'costCenterName',
    columnName: labelsEnum.COST_CENTER,
    columnSortable: false,
  },
  {
    columnIndex: 'profileName',
    columnName: labelsEnum.PROFILE,
    columnSortable: false,
  },
  {
    columnIndex: 'actions',
    columnName: labelsEnum.ACTIONS,
    columnSortable: false,
  },
];

const startData: DataTableCellImp[] = [];

const CustomForm = ({ modalIsOpen, onEdit, onCancel, user }: IProps): JSX.Element => {
  const alertMessage = alertMessages();
  const dispatch = useDispatch();
  const userServices = new UserServices();

  const {
    user: { id: userId },
  } = useUser();
  const { allLicenses } = useSelector((state: ApplicationState) => state.license);

  const [tableData, setTableData] = useState(startData);
  const [costCenterId, setCostCenterId] = useState<string | null>(null);
  const [selectedCostCenters, setSelectedCostCenters] = useState<any[]>([]);
  const [modalCostCenterIsOpen, setModalCostCenterIsOpen] = useState(false);
  const { setValues, values } = useFormikContext<EditUserImp>();

  const handleSubmit = async () => {
    try {
      const newValues = UserTransformer.output(values);
      const payload: any = await userEditAdminDataSchema.validate(newValues);

      const response = await userServices.updateCompleteUser({
        ...payload,
        costCenters: selectedCostCenters,
      });

      const isCurrentUser = newValues.id == userId;
      const isExistDataAuth = response?.refreshToken?.length && response.token?.length;

      if (isCurrentUser && isExistDataAuth) login(response);

      onEdit(newValues);
      setLicensesChildren(payload);
      setSelectedCostCenters([]);
      setValues(initialValues);
      alertMessage.successUpdated('Atualizado com sucesso');
    } catch (error) {
      console.log(error);
      alertMessage.error(typeof error?.message === 'string' ? error?.message : 'Erro ao atualizar usuário');
      onCancel();
    }
  };

  const setLicensesChildren = useCallback(
    (findedUser: DataTableCellImp) => {
      if (!allLicenses) return;
      const newLicensesChildren = newArrayPlusContent(allLicenses, findedUser);
      dispatch(setAllLicenses(newLicensesChildren));
    },
    [allLicenses, dispatch]
  );

  const fetchUser = useCallback(
    async (userId: string) => {
      try {
        let newLicense: any = allLicenses && allLicenses.find(user => user.id === userId);
        const foundLicense = newLicense;

        if (!newLicense?.costCenter || (allLicenses && !allLicenses.length)) {
          newLicense = await userServices.showUser(userId);
        }

        const costCenters = newLicense?.costCenter.map((costCenter: any) => {
          return {
            costCenterId: costCenter.id,
            costCenterName: costCenter.name,
            profileId: costCenter.profile.id,
            profileName: costCenter.profile.name,
          };
        });
        user.costCenters = costCenters;

        setValues(user);
        updateDataTable(costCenters);
        setSelectedCostCenters(costCenters);

        if ((foundLicense && !foundLicense.costCenter) || !foundLicense)
          setLicensesChildren({ ...newLicense, actions: foundLicense.actions });
      } catch (error) {
        alertMessage.error(typeof error?.message === 'string' ? error : 'Nenhum usuário vinculado');
      }
    },
    [user, allLicenses, setLicensesChildren, setValues]
  );

  useEffect(() => {
    if (user) fetchUser(user.id);
  }, [user, fetchUser]);

  const removeCostCenter = (index: number, selectedCostCenters: any[]) => {
    const newSelectedCostCenter = Array.from(selectedCostCenters);
    newSelectedCostCenter.splice(index, 1);
    setSelectedCostCenters(newSelectedCostCenter);
    updateDataTable(newSelectedCostCenter);
  };

  const updateDataTable = (selectedCostCenters: any[]) => {
    let dataTableCells = startData;

    dataTableCells = selectedCostCenters.map((costCenter, key) => {
      const cell: DataTableCellImp = {
        profileId: costCenter.profileId,
        profileName: costCenter.profileName,
        costCenterId: costCenter.costCenterId,
        costCenterName: costCenter.costCenterName,
      };
      cell.actions = (
        <ButtonAction onClick={() => removeCostCenter(key, selectedCostCenters)} type="button">
          <FaTrashAlt />
        </ButtonAction>
      );
      return cell;
    });
    setTableData(dataTableCells);
  };

  const submitCostCenter = (costCenter: {
    costCenterId: string;
    profileId: string;
    costCenterName: string;
    profileName: string;
  }) => {
    const existsSelectedCostCenter = selectedCostCenters.find(selectedCostCenters => {
      return selectedCostCenters.costCenterId === costCenter.costCenterId;
    });
    if (!existsSelectedCostCenter) {
      const updatedSelectedCostCenter = Array.from(selectedCostCenters);
      updatedSelectedCostCenter.push(costCenter);
      setSelectedCostCenters(updatedSelectedCostCenter);
      updateDataTable(updatedSelectedCostCenter);
    }
    setModalCostCenterIsOpen(false);
  };

  return (
    <DefaultModal
      isOpen={modalIsOpen}
      onCancel={() => onCancel()}
      onClose={() => onCancel()}
      onConfirm={handleSubmit}
      title={labelsEnum.USER_EDIT}>
      <Form>
        <Input type="text" id="firstName" name="firstName" label={labelsEnum.NAME} value={values.firstName} />
        <Input type="text" id="lastName" name="lastName" label={labelsEnum.LAST_NAME} value={values.lastName} />
        <Input type="text" id="email" name="email" label={labelsEnum.EMAIL} disabled value={values.email} />

        <CostCenterContainer>
          <label>{labelsEnum.COST_CENTER}</label>
          <ButtonContainer>
            <ButtonAdd
              label={labelsEnum.ADD}
              icon={FaPlus}
              handleOnClick={() => setModalCostCenterIsOpen(true)}
              type="button"
            />
          </ButtonContainer>
        </CostCenterContainer>

        <DataTable columns={tableColumns} data={tableData} loading={!selectedCostCenters.length} />

        <ModalCostCenter
          setCostCenterId={setCostCenterId}
          costCenterId={costCenterId}
          modalIsOpen={modalCostCenterIsOpen}
          onCancel={() => setModalCostCenterIsOpen(false)}
          onAdd={submitCostCenter}
        />
      </Form>
    </DefaultModal>
  );
};

const ModalEditUser = (props: IProps): JSX.Element => {
  return (
    <Container
      initialValues={{
        costCenters: [],
        email: '',
        firstName: '',
        id: '',
        lastName: '',
        licenseId: '',
      }}
      onSubmit={() => {}}>
      <CustomForm {...props} />
    </Container>
  );
};

export default ModalEditUser;
