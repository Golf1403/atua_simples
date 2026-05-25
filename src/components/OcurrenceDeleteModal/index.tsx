import React, { useState, useEffect } from 'react';
import DefaultModal from '../DefaultModal';
import { Text } from './styles';

interface PropsImp {
  visible: boolean;
  closeModal: Function;
  removeOcurrence: Function;
}

const OcurrenceDeleteModal = ({ visible, closeModal, removeOcurrence }: PropsImp): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(visible);

  useEffect(() => {
    setModalOpen(visible);
  }, [visible]);

  const handleCancel = () => {
    setModalOpen(false);
    closeModal();
  };

  const handleConfirm = () => {
    removeOcurrence();
    handleCancel();
  };

  return (
    <DefaultModal
      isOpen={isModalOpen}
      title="Confirmar exclusão"
      onClose={handleCancel}
      isCloseOnConfirm={true}
      onConfirm={handleConfirm}
      onCancel={handleCancel}>
      <Text>Você tem certeza de que deseja deletar este item?</Text>
    </DefaultModal>
  );
};

export default OcurrenceDeleteModal;
