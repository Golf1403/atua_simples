import React, { Fragment, ReactNode, useEffect } from 'react';
import { Button, Header, ModalContainer, ModalOverlay, Title } from './styles';
import { TitleContainer } from './styles';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import exportToExcel from '@/utils/exportToExcel';
import { FaCopy, FaFileExport, FaSave } from 'react-icons/fa';

interface SimpleModalProps {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  onConfirm?: () => Promise<void> | void;
  keyDownDependencies?: any[];
  onCancel?: () => void;
  children: ReactNode;
  type?: 'button' | 'submit';
  filename?: string;
  onSave?: () => void;
  onCopy?: () => void;
  isCloseOnConfirm?: boolean;
}

const DefaultModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  type = 'button',
  keyDownDependencies,
  onCopy,
  children,
  filename,
  onSave,
  isCloseOnConfirm = true,
}) => {
  const handleClose = () => {
    setTimeout(() => {
      onClose && onClose();
    }, timeoutEnum.HALF_SECONDS);
  };

  const handleConfirm = async (isClose?: boolean) => {
    if (onConfirm) await onConfirm();
    if (isClose) handleClose();
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
    if (e.keyCode != 13) return;
    e.preventDefault();
    if (isCloseOnConfirm) await handleConfirm(isCloseOnConfirm);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, keyDownDependencies);

  return (
    <Fragment>
      {isOpen && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContainer>
            <Header>
              <TitleContainer>
                <Title>{title}</Title>
              </TitleContainer>

              {filename && (
                <Button
                  onClick={() => {
                    exportToExcel('viewer-table', filename);
                  }}>
                  <FaFileExport color="green" />
                </Button>
              )}
              {onSave && (
                <Button onClick={onSave}>
                  <FaSave color="green" />
                </Button>
              )}
              {onCopy && (
                <Button onClick={onCopy}>
                  <FaCopy color="green" />
                </Button>
              )}
              {onConfirm && (
                <Button onClick={() => handleConfirm(isCloseOnConfirm)} type={type}>
                  <IoMdCheckmark color="green" />
                </Button>
              )}
              {onCancel && (
                <Button onClick={onCancel}>
                  <IoMdClose color="red" />
                </Button>
              )}
            </Header>
            {children}
          </ModalContainer>
        </ModalOverlay>
      )}
    </Fragment>
  );
};

export default DefaultModal;
