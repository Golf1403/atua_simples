import React, { Fragment, useState } from 'react';
import { Container } from './styles';
import DefaultModal from '@/components/DefaultModal';

interface IProps {
  costCenter: string;
  setCostCenter: Function;
  removeCostCenter: Function;
}

const DeleteModal = ({ costCenter, removeCostCenter, setCostCenter }: IProps): JSX.Element => {
  const [cancel, setCancel] = useState(false);

  const onCancel = () => {
    setCancel(false);
    setCostCenter('');
  };

  return (
    <Fragment>
      <DefaultModal
        title="Deseja cancelar a operação?"
        isOpen={cancel}
        onCancel={async () => {
          await removeCostCenter(costCenter);
          setCancel(false);
          setCostCenter('');
        }}
        onClose={() => {}}
        onConfirm={onCancel}>
        <Container>Todos os cálculos serão excluídos em caso de cancelamento.</Container>
      </DefaultModal>

      <DefaultModal
        title="Deseja excluir o centro de custo?"
        isOpen={!!costCenter.length && !cancel}
        onCancel={onCancel}
        onClose={() => {}}
        onConfirm={() => {
          setCancel(true);
        }}>
        <Container>Todos os cálculos serão excluídos em caso de confirmação.</Container>
      </DefaultModal>
    </Fragment>
  );
};

export default DeleteModal;
