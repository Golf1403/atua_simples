import React from 'react';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { Container, Paragraph } from './styles';
import DefaultModal from '@/components/DefaultModal';
import { useNomenclatures } from '@/hooks/nomenclatures';

const UpdateToModal = (): JSX.Element => {
  const {
    toggleUpdateToModal,
    updateToModal,
    lastUpdateTo,
    onCalc,
    updateTo,
    setLayout,
    author: { list: authorList },
  } = useSimpleUpdate() as any;
  const { nomenclatures } = useNomenclatures();

  const closeModal = () => {
    toggleUpdateToModal(false);
  };

  const onConfirm = async () => {
    try {
      if (!authorList.length) return;
      setLayout((layout: any) => ({ ...layout, footerButton: { ...layout.footerButton, isLoading: true } }));
      await onCalc({ origin: 'calc', changeUpdateTo: true, nomenclatures });
    } catch (error) {
      console.log(error);
    } finally {
      toggleUpdateToModal(false);
    }
  };

  return (
    <DefaultModal
      isOpen={updateToModal}
      onClose={closeModal}
      onCancel={closeModal}
      onConfirm={onConfirm}
      title="Deseja alterar as datas finais?">
      <Container>
        <Paragraph>
          A data final do cálculo está sendo alterada de <b>{lastUpdateTo}</b> para <b>{updateTo}.</b>
        </Paragraph>
        <Paragraph>
          Deseja que todos os juros que apresentarem a data final <b>{lastUpdateTo}</b> tenha suas datas finais
          alteradas para <b>{updateTo}?</b>
        </Paragraph>
      </Container>
    </DefaultModal>
  );
};

export default UpdateToModal;
