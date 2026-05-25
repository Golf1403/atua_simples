import React, { useEffect } from 'react';

import { FC, PropsWithChildren } from 'react';
const Modal = require('react-modal');

interface IProps {
  id?: string;
  className?: string;
  modalIsOpen: boolean;
  contentLabel?: string;
  shouldCloseOnOverlayClick?: boolean;
  onAfterOpen?: Function;
  onAfterClose?: Function;
  onRequestClose?: Function;
  onSubmit?: Function;
  shouldCloseOnEsc?: boolean;
}

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P = {}> = FC<PropsWithChildren<P>>;

const SystemModal: FCC<IProps> = (props): JSX.Element => {
  const {
    className,
    children,
    modalIsOpen,
    id,
    contentLabel,
    onAfterOpen,
    onAfterClose,
    onRequestClose,
    shouldCloseOnOverlayClick = true,
    shouldCloseOnEsc = true,
  } = props;

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalIsOpen]);

  const _onRequestClose = () => {
    if (onRequestClose) {
      onRequestClose();
    }
  };

  const _onAfterOpen = () => {
    if (onAfterOpen) {
      onAfterOpen();
    }
  };

  const _onAfterClose = () => {
    if (onAfterClose) {
      onAfterClose();
    }
  };

  return (
    <Modal
      id={id}
      isOpen={modalIsOpen}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      contentLabel={contentLabel}
      shouldCloseOnEsc={shouldCloseOnEsc}
      className={`system-modal-default ${className ? className : ''}`}
      overlayClassName="system-modal-default-overlay"
      onAfterClose={_onAfterClose}
      onRequestClose={_onRequestClose}
      onAfterOpen={_onAfterOpen}>
      <>{children}</>
    </Modal>
  );
};

export default SystemModal;
