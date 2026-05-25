import React, { Fragment } from 'react';
import DataTableImp from '@/interfaces/DataTableImp';
import { Body, Button, Container, Data, Head, Header, LoadingEffectContainer, Row } from './styles';
import { MdSort } from 'react-icons/md';
import { valueWithCorrectionCurrency } from '@/lib/currency';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { v4 } from 'uuid';

const DataTable = ({ financing = false, ...props }: DataTableImp): JSX.Element => {
  const { columns, data, numberOfSkeletons = 10, loading, onOrder } = props;

  const fakeLines = new Array(numberOfSkeletons).fill(0);
  const calculate = (data: any) => {
    if (data.type === 'P') return `${String(data.percentual).slice(0, 6)} %`;

    return valueWithCorrectionCurrency(
      {
        correctedCoin: data.coinSign,
        value: +data.value,
      },
      +data.value
    );
  };

  return (
    <Container>
      <Head>
        <Row>
          {columns.map((column, key) => (
            <Header $isAction={column.columnIndex == 'actions'} key={key}>
              {column.columnSortable ? (
                <Button type="button" onClick={() => (onOrder ? onOrder(column) : null)}>
                  {column.columnName}
                  <MdSort />
                </Button>
              ) : (
                <Fragment>{column.columnName}</Fragment>
              )}
            </Header>
          ))}
        </Row>
      </Head>
      <Body>
        {loading
          ? fakeLines.map(() => (
              <Row key={v4()}>
                {columns.map((column, key) => (
                  <Data $isName={column.columnIndex == 'name'} $isAction={column.columnIndex == 'actions'} key={v4()}>
                    <LoadingEffectContainer $index={key} />
                  </Data>
                ))}
              </Row>
            ))
          : data.map((dataRow, key) => (
              <Row key={key}>
                {columns.map(column => {
                  return (
                    <Data $isName={column.columnIndex == 'name'} $isAction={column.columnIndex == 'actions'} key={v4()}>
                      {financing && column.columnIndex == 'value'
                        ? calculate(dataRow)
                        : financing && column.columnIndex == 'date'
                        ? moment(new Date(dataRow.date)).utc().format(dateFormatEnum.DEFAULT)
                        : dataRow[column.columnIndex]}
                    </Data>
                  );
                })}
              </Row>
            ))}
      </Body>
    </Container>
  );
};

export default DataTable;
