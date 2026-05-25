import React from 'react';
import SystemModal from '../SystemModal';
import { useSelector } from 'react-redux';
import { ApplicationState } from '@/store';
import useCurrentAccount from '@/hooks/currentAccount';

interface PropsImp {
  visible: boolean;
  closeModal: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirm: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const SaveBeforeLogoutModal = ({ visible, closeModal, onConfirm }: PropsImp): JSX.Element => {
  const { account: simpleAccount } = useSelector((state: ApplicationState) => state.simple);
  const {
    account: { current: currentAccount },
  } = useCurrentAccount();

  return (
    <SystemModal modalIsOpen={visible} shouldCloseOnOverlayClick={true} onRequestClose={closeModal}>
      <div>
        <header>
          <h2>{`'${simpleAccount.name.length ? simpleAccount.name : currentAccount.name}'`}</h2>
        </header>
        <p>Deseja salvar essa conta antes?</p>
        <button type="button" onClick={closeModal}>
          Cancelar
        </button>
        <button type="button" onClick={onConfirm}>
          Confirmar
        </button>
      </div>
    </SystemModal>
  );
};

export default SaveBeforeLogoutModal;
