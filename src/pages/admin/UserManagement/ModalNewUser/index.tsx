import React, { Fragment, useEffect, useState } from 'react';
import DataTable from '@components/DataTable';
import UserServices from '@services/UserServices';
import ModalCostCenter from '../ModalCostCenter';

import recoveryUserAdminDataSchema from '../../../../validators/recoveryUserAdminDataSchema';

import { useFormikContext } from 'formik';
import { DataTableCellImp, DataTableColumnImp } from '@interfaces/DataTableImp';
import { FaEye, FaEyeSlash, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { alertMessages } from '@/hooks/alertMessages';

import { useLoading } from '@/hooks/loading';
import DefaultModal from '@/components/DefaultModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { Button, ButtonContainer, Container, CostCenterContainer, Form, Input, InputContainer, Link } from './styles';
import { useUser } from '@/hooks/user';

interface IProps {
  modalIsOpen: boolean;
  onSave: Function;
  onCancel: Function;
}

interface UserImp {
  readonly firstName: string;
  readonly licenseId: string;
  readonly lastName: string;
  readonly password: string;
  readonly planId: string;
  readonly email: string;
  readonly costCenters: string[];
  readonly confirmPassword: string;
  readonly isAdmUser: boolean;
}

const initialIUser: UserImp = {
  firstName: '',
  lastName: '',
  licenseId: '',
  planId: '',
  email: '',
  costCenters: [],
  password: '',
  confirmPassword: '',
  isAdmUser: false,
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

const CustomForm = ({ modalIsOpen, onSave, onCancel }: IProps): JSX.Element => {
  const { openLoading, isLoading, closeLoading } = useLoading();
  const userServices = new UserServices();
  const alertMessage = alertMessages();

  const {
    user: { licenseId },
  } = useUser();

  const [isShow, setIsShow] = useState(false);
  const [tableData, setTableData] = useState(startData);
  const [showPassword, setShowPassword] = useState(false);
  const [costCenterId, setCostCenterId] = useState<string | null>(null);
  const [modalCostCenterIsOpen, setModalCostCenterIsOpen] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCostCenters, setSelectedCostCenters] = useState<any[]>([]);

  const { values, resetForm, setValues } = useFormikContext<UserImp>();

  const handleSubmit = async () => {
    try {
      openLoading();
      alertMessage.successWaiting(`Estamos salvando o novo usuário`);
      const newUser: Omit<UserImp, 'id'> = { ...values, licenseId, email: values.email };
      const savedUser = await userServices.saveUser(newUser);

      await onSave(savedUser);
      alertMessage.successSaved('Salvo com sucesso');
    } catch (error) {
      alertMessage.error(String(error) || 'Erro ao salvar usuário');
    } finally {
      setSelectedCostCenters([]);
      closeLoading();
      setValues(initialIUser);
    }
  };

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
        <button onClick={() => removeCostCenter(key, selectedCostCenters)} type="button">
          <FaTrashAlt />
        </button>
      );
      return cell;
    });
    setTableData(dataTableCells);
  };

  const submitCostCenter = (costCenter: {
    costCenterId: string;
    profileId: string;
    constCenterName: string;
    profileName: string;
  }) => {
    const existsSelectedCostCenter = selectedCostCenters.find(
      selectedCostCenters => selectedCostCenters.costCenterId === costCenter.costCenterId
    );

    if (!existsSelectedCostCenter) {
      const updatedSelectedCostCenter = Array.from(selectedCostCenters);
      updatedSelectedCostCenter.push(costCenter);
      setSelectedCostCenters(updatedSelectedCostCenter);
      updateDataTable(updatedSelectedCostCenter);
    }
    setModalCostCenterIsOpen(false);
  };

  const checkValidEmail = async () => {
    try {
      openLoading();
      const isValid = await recoveryUserAdminDataSchema.isValid({ email: values.email });
      if (!isValid) throw new Error();

      const user = await userServices.checkEmail(values.email);
      if (user) {
        alertMessage.error('E-mail inativo, por favor consultar o administrador do SEI Cálculos');
        return false;
      }
    } catch (status) {
      switch (status) {
        case 404:
          alertMessage.success('Email válido');
          return true;
        default:
          alertMessage.error('E-mail não válido');
          return false;
      }
    } finally {
      closeLoading();
    }
    return true;
  };

  const onCancelClick = () => {
    onCancel();
    resetForm();
  };

  const validEmail = async () => {
    const isValid = await checkValidEmail();
    setIsShow(isValid);
  };

  useEffect(() => {
    if (modalIsOpen) {
      setIsShow(false);
      setValues(initialIUser);
    }
  }, [modalIsOpen]);

  useEffect(() => {
    if (selectedCostCenters.length) setValues(_values => ({ ..._values, costCenters: selectedCostCenters }));
  }, [selectedCostCenters]);

  return (
    <DefaultModal
      isOpen={modalIsOpen}
      onCancel={onCancelClick}
      onClose={onCancelClick}
      onConfirm={handleSubmit}
      title={labelsEnum.NEW_USER}>
      <Form>
        <InputContainer>
          <Input
            type="text"
            id="email"
            name="email"
            label="E-mail"
            value={values.email}
            onKeyDown={async e => {
              if (e.keyCode != 9) return;

              await validEmail();
            }}
          />
        </InputContainer>
        <InputContainer>
          <Input type="text" id="firstName" name="firstName" label="Nome" disabled={!isShow} value={values.firstName} />
        </InputContainer>
        <InputContainer>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            label="Sobrenome"
            value={values.lastName}
            disabled={!isShow}
          />
        </InputContainer>

        {isShow && (
          <Fragment>
            <InputContainer>
              <Input id="password" name="password" type={showPassword ? 'text' : 'password'} label="Senha" />
              <Link href="#loginPassword" onClick={event => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye color={'black'} /> : <FaEyeSlash color={'black'} />}
              </Link>
            </InputContainer>

            <InputContainer>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmar Senha"
              />
              <Link href="#loginConfirmPassword" onClick={event => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEye color={'black'} /> : <FaEyeSlash color={'black'} />}
              </Link>
            </InputContainer>
          </Fragment>
        )}

        <Fragment>
          <CostCenterContainer>
            <label>{labelsEnum.COST_CENTER}</label>
            <ButtonContainer>
              <Button
                icon={FaPlus}
                label={labelsEnum.ADD}
                handleOnClick={() => setModalCostCenterIsOpen(true)}
                type="button"
              />
            </ButtonContainer>
          </CostCenterContainer>
        </Fragment>

        {selectedCostCenters.length > 0 && <DataTable loading={isLoading} columns={tableColumns} data={tableData} />}

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
const ModalUser = (props: IProps): JSX.Element => {
  return (
    <Container initialValues={{}} onSubmit={() => {}}>
      <CustomForm {...props} />
    </Container>
  );
};

export default ModalUser;
