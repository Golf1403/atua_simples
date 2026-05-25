import React from 'react';

import SystemModal from '@components/SystemModal';
import ButtonDefault from '@components/ButtonDefault';

interface IProps {
  modalIsOpen: boolean;
  closeModal: Function;
}

const ModalSuccess = (props: IProps): JSX.Element => {
  const { modalIsOpen, closeModal } = props;

  return (
    <SystemModal modalIsOpen={modalIsOpen} contentLabel="Pagamento atualizado">
      <section>
        <img
          loading="lazy"
          src={require('../../../../images/success-modal-image.png')}
          alt="Pagamento atualizado com sucesso!"
          title="Pagamento atualizado com sucesso!"
        />
        <h2>Pagamento atualizado com sucesso!</h2>
        <div>
          <ButtonDefault type="button" handleOnClick={closeModal} label="Ok" />
        </div>
      </section>
    </SystemModal>
  );
};

export default ModalSuccess;
