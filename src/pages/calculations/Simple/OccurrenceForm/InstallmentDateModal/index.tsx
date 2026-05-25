import React from 'react';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { Container, Paragraph } from './styles';
import DefaultModal from '@/components/DefaultModal';
import { useNomenclatures } from '@/hooks/nomenclatures';

const InstallmentDateModal = (): JSX.Element => {
  const {
    toggleInstallmentDateModal,
    installmentDateModal,
    onCalc,
    setLayout,
    author,
    installmentDate,
    lastInstallmentDate,
  } = useSimpleUpdate() as any;
  const { nomenclatures } = useNomenclatures();

  const closeModal = () => {
    toggleInstallmentDateModal(false);
  };

  const onConfirm = async () => {
    try {
      if (!author.list.length) return;
      setLayout((layout: any) => ({ ...layout, footerButton: { ...layout.footerButton, isLoading: true } }));

      await onCalc({ origin: 'calc', changeInstallmentDate: true, nomenclatures });
    } catch (error) {
      console.log(error);
    } finally {
      toggleInstallmentDateModal(false);
    }
  };

  return (
    <DefaultModal
      isOpen={installmentDateModal}
      onClose={closeModal}
      onCancel={closeModal}
      onConfirm={onConfirm}
      title="Deseja alterar as datas iniciais?">
      <Container>
        <Paragraph>
          A data inicial da parcela está sendo alterada de <b>{lastInstallmentDate}</b> para
          <b> {installmentDate}.</b>
        </Paragraph>
        <Paragraph>
          Deseja que todos os juros que apresentarem a data inicial <b>{lastInstallmentDate}</b> tenha suas datas
          iniciais alteradas para <b>{installmentDate}?</b>
        </Paragraph>
      </Container>
    </DefaultModal>
  );
};

export default InstallmentDateModal;
