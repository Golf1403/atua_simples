import React, { useEffect, useRef, useState } from 'react';
import DefaultModal from '@/components/DefaultModal';
import useCurrentAccount from '@/hooks/currentAccount';
import { Column, Table, Row, TableBody } from './styles';
import { alertMessages } from '@/hooks/alertMessages';
import { typeTotal } from '@/hooks/interfaces/CurrentAccountHookImp';

const TotalsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    layout: {
      viewModal: { views },
    },
    summary,
  } = useCurrentAccount();
  const tableRef = useRef(null);
  const alertMessage = alertMessages();
  const [total, setTotal] = useState(0);
  const [totalAround, setTotalAround] = useState(0);

  const copyTableToClipboard = () => {
    const table = tableRef.current as any;
    if (!table) return;
    let tableText = '';

    for (const row of table.rows) {
      const rowData = Array.from(row.cells)
        .map((cell: any) => cell.innerText)
        .join('\t');
      tableText += rowData + '\n';
    }

    navigator.clipboard
      .writeText(tableText)
      .then(() => alertMessage.success('Resumo copiado para a área de transferência!'))
      .catch(() => alertMessage.error('Erro ao copiar resumo!'));
  };

  useEffect(() => {
    const total = summary.reduce((acc, sum) => (sum.year || 0) + acc, 0);
    const totalAround = summary.reduce((acc, sum) => Math.ceil(sum.year || 0) + acc, 0);

    setTotal(Number(total.toFixed(2)));
    setTotalAround(Number(totalAround.toFixed(2)));
  }, [summary]);

  return (
    <DefaultModal isOpen={isOpen} onCopy={copyTableToClipboard} onCancel={onClose} onClose={onClose} title="Resumo">
      <Table ref={tableRef}>
        <TableBody>
          {summary.map((description, index) => (
            <Row key={index}>
              <Column $type={description.from}>{description.desc ? description.desc : ''}</Column>
              <Column $type={description.from}>{description.year ? description.year : ''}</Column>
              <Column $type={description.from}>{description.year ? Math.ceil(description.year) : ''}</Column>
            </Row>
          ))}
          <Row>
            <Column $type={typeTotal.id}>{typeTotal.label}</Column>
            <Column $type={typeTotal.id}>{total}</Column>
            <Column $type={typeTotal.id}>{totalAround}</Column>
          </Row>
        </TableBody>
      </Table>
    </DefaultModal>
  );
};

export default TotalsModal;
