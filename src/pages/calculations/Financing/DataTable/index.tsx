import React from 'react';
import DataTableImp from '@interfaces/DataTableImp';
import TablePlaceholder from '@components/TablePlaceholder';

import moment from 'moment';

import { convertCurrencyToPtBr, parsePercentage } from '@lib/currency';

import { dateFormatEnum } from '@/enums/DateFormatEnum';

const DataTable = (props: DataTableImp): JSX.Element => {
  const { columns, data, loading = false, lines = 5, numberOfSkeletons = 12, className } = props;

  const needSmallerTable = columns.length >= 10;

  return (
    <div className={`data-table-content ${className ? className : ''}`}>
      <table className={`data-table ${needSmallerTable ? 'small-table' : ''}`} cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {columns.map((column, key) => {
              return (
                <th key={key} className={`${column.columnIndex === 'actions' ? 'actions-column' : ''}`}>
                  <span>{column.columnName}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TablePlaceholder lines={lines} numberOfSkeletons={numberOfSkeletons} />
          ) : (
            data.map((dataRow, dataKey) => {
              return (
                <tr key={`data-row-${dataKey}`}>
                  {columns.map((column, key) => {
                    let value = dataRow[column.columnIndex];
                    if (column.percentage && typeof value === 'number') {
                      value = `${parsePercentage(value)}`;
                    }
                    if (column.currency && typeof value === 'number') {
                      value = convertCurrencyToPtBr(value);
                    }
                    if (column.date && typeof value === 'string') {
                      const date = moment(value);
                      value = date.format(dateFormatEnum.DEFAULT).toString();
                    }
                    return (
                      <td
                        key={`${key}-${column.columnIndex}`}
                        className={`${column.columnIndex === 'actions' ? 'actions-column' : ''}`}>
                        {column.columnIndex === 'parcel' ? dataKey + 1 : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
