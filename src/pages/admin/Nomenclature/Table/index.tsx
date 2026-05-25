import React from 'react';
import { FaEdit } from 'react-icons/fa';
import NomenclatureImp from '@interfaces/NomenclatureImp';
import { DataTableCellImp, DataTableColumnImp } from '@interfaces/DataTableImp';
import { Button, Tooltip } from './styles';
import { labelsEnum } from '@/enums/labelsEnum';

interface IProps {
  nomenclatures: NomenclatureImp[];
  onEdit: (param: number) => void;
}

const tableColumns: DataTableColumnImp[] = [
  {
    columnIndex: 'default_value',
    columnName: 'Padrão',
    columnSortable: false,
  },
  {
    columnIndex: 'value',
    columnName: 'Personalizado',
    columnSortable: false,
  },
  {
    columnIndex: 'actions',
    columnName: 'Ações',
    columnSortable: false,
  },
];

const tableDataInitial: DataTableCellImp[] = [];

export { tableDataInitial, tableColumns };

export const getNomenclaturesCell = (nomenclaturesData: any, actionsElement: JSX.Element): DataTableCellImp => {
  const tableCell: DataTableCellImp = {
    id: nomenclaturesData.id,
    description: nomenclaturesData.description,
    default_value: nomenclaturesData.default_value,
    value: nomenclaturesData.value ? nomenclaturesData.value : nomenclaturesData.default_value,
  };

  tableCell.actions = actionsElement;

  return tableCell;
};

interface IProps {
  nomenclatures: NomenclatureImp[];
  onEdit: (param: number) => void;
}

const NomenclaturesTable = ({ nomenclatures, onEdit }: IProps) => {
  return nomenclatures.map((_nomenclature, index) => {
    const buttonElement = (
      <Button key={index} onClick={async () => await onEdit(index)} type="button">
        <Tooltip text={labelsEnum.NOMENCLATURE_EDIT}>
          <FaEdit />
        </Tooltip>
      </Button>
    );

    return getNomenclaturesCell(_nomenclature, buttonElement);
  });
};

export default NomenclaturesTable;
