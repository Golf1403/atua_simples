import React from 'react';

interface IConfirmDelete {
  show: boolean;
  key: number;
  type?: string;
}

interface IProps {
  index: number;
  confirm: Function;
  confirmDelete: IConfirmDelete;
  setConfirmDelete: Function;
  children: JSX.Element;
  type?: string;
}

const emptyConfirmDelete = {
  show: false,
  key: -1,
  type: '',
};

const ConfirmDelete = ({ index, confirm, confirmDelete, children, type, setConfirmDelete }: IProps): JSX.Element => {
  return (
    <div className={`tooltip-delete-box ${confirmDelete.show ? 'remove-confirm' : ''}`}>
      {children}
      {confirmDelete.show && index === confirmDelete.key && confirmDelete.type === type && (
        <div>
          <span>Tem certeza?</span>
          <span>
            <button
              type="button"
              onClick={() => {
                confirm();
                setConfirmDelete(emptyConfirmDelete);
              }}>
              Sim
            </button>
            <button type="button" onClick={() => setConfirmDelete(emptyConfirmDelete)}>
              Não
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfirmDelete;
