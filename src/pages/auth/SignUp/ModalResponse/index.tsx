import React, { useEffect } from 'react';
const { Link } = require('react-router-dom');

interface IProps {
  modalIsOpen?: boolean;
  closeModal?: Function;
}

const ModalResponse = ({ modalIsOpen = false, closeModal }: IProps): JSX.Element => {
  return (
    <div>
      {closeModal && <button onClick={() => closeModal()}>Fechar</button>}
      <img
        width="100%"
        height="100%"
        loading="lazy"
        src={require('../../../../images/success-modal-image.png')}
        alt="Pagamento efetuado com sucesso!"
        title="Pagamento efetuado com sucesso!"
      />
      <h2>Pagamento efetuado com sucesso!</h2>
      <p></p>
      <Link to="/login">Acessar o sistema</Link>
    </div>
  );
};

export default ModalResponse;
