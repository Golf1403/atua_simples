import React from 'react';
import Tooltip from '@/components/DefaultTooltip';
import { DataTableCellImp, DataTableColumnImp } from '@interfaces/DataTableImp';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { validateDate } from '@/utils/validateDate';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { Button, Container } from './styles';
import { labelsEnum } from '@/enums/labelsEnum';

interface IProps {
  user: {
    list: DataTableCellImp[];
    id: string;
    setUser: React.Dispatch<React.SetStateAction<DataTableCellImp | null>>;
  };
  onEdit: (userTableCell: DataTableCellImp) => void;
  setIsRemoveAlertModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRemoveAlertModalOpen: boolean;
}

export const getUserManagementCell = (user: DataTableCellImp, actionsElement?: JSX.Element): DataTableCellImp => {
  if (typeof user.createdAt === 'string') {
    const dateFormated = validateDate(user.createdAt);
    if (!dateFormated) {
      const dateFormated = moment(user.createdAt, 'YYYY-MM-DD').format(dateFormatEnum.DEFAULT);
      user.createdAt = dateFormated;
    }
  }

  const tableCell: DataTableCellImp = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    master: user.master,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  if (actionsElement) tableCell.actions = actionsElement;
  return tableCell;
};

export const tableDataInitial: DataTableCellImp[] = [];

export const tableColumns: DataTableColumnImp[] = [
  {
    columnIndex: 'firstName',
    columnName: 'Nome',
    columnSortable: false,
  },
  {
    columnIndex: 'email',
    columnName: 'E-mail',
    columnSortable: false,
  },
  {
    columnIndex: 'createdAt',
    columnName: 'Data de inclusão',
    columnSortable: false,
  },
  {
    columnIndex: 'actions',
    columnName: 'Ações',
    columnSortable: false,
  },
];

const Table = ({ user, onEdit, setIsRemoveAlertModalOpen }: IProps): DataTableCellImp[] => {
  return user.list.map((_user, index) => {
    const notVisible = String(_user.email).includes('Email não vinculado');
    const buttonElement = (!notVisible && (
      <Container key={user.id || index}>
        <Button onClick={() => onEdit(_user)} type="button">
          <Tooltip text={labelsEnum.USER_EDIT}>
            <FaEdit />
          </Tooltip>
        </Button>

        {user.id !== _user.id && (
          <Button
            type="button"
            onClick={() => {
              setIsRemoveAlertModalOpen(true);
              user.setUser && user.setUser(_user);
            }}>
            <Tooltip text={labelsEnum.USER_DELETE}>
              <FaTrashAlt />
            </Tooltip>
          </Button>
        )}
      </Container>
    )) || <></>;

    return getUserManagementCell(_user, buttonElement);
  });
};

export default Table;
