import React from 'react';
import { DataTableCellImp, DataTableColumnImp } from '@/interfaces/DataTableImp';
import CostCenterImp from '@/interfaces/costCenters/CostCenterImp';
import { Button, Container } from './styles';
import Tooltip from '@/components/DefaultTooltip';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import PaginateDataImp from '@/interfaces/PaginateDataImp';
import { labelsEnum } from '@/enums/labelsEnum';

export const initialPaginate: PaginateDataImp = {
  page: 1,
  search: '',
  orderBy: 'accountName',
  order: 'asc',
};

export const startData: DataTableCellImp[] = [];

export const tableColumns: DataTableColumnImp[] = [
  {
    columnIndex: 'name',
    columnName: 'Nome',
    columnSortable: false,
  },
  {
    columnIndex: 'actions',
    columnName: 'Ações',
    columnSortable: false,
  },
];

const CostCenterTable = (costCenters: CostCenterImp[], edit: Function, remove: Function) => {
  return costCenters.map(costCenter => {
    const tableCell: DataTableCellImp = {
      id: costCenter.id,
      name: costCenter.name,
    };
    if (costCenter.profile?.canWrite)
      tableCell.actions = (
        <Container>
          <Button onClick={async () => await edit(tableCell)} type="button">
            <Tooltip text={labelsEnum.COST_CENTER_EDIT}>
              <FaEdit />
            </Tooltip>
          </Button>
          {costCenters.length > 1 && (
            <Button
              type="button"
              onClick={async () => {
                await remove(costCenter.id);
              }}>
              <Tooltip text={labelsEnum.COST_CENTER_DELETE}>
                <FaTrashAlt />
              </Tooltip>
            </Button>
          )}
        </Container>
      );
    return tableCell;
  });
};
export default CostCenterTable;
