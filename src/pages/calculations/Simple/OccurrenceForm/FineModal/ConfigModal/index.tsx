import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import {
  ApplyPanel,
  ApplyTitle,
  Checkbox,
  CheckboxLabel,
  Dialog,
  Header,
  HeaderActions,
  HeaderButton,
  Overlay,
  Title,
} from './styles';
import { FineModalValues } from '..';

interface FineConfigModalProps {
  isOpen: boolean;
  values: FineModalValues;
  onClose: () => void;
  onConfirm: (values: FineModalValues) => void;
}

const applyFields: { field: keyof FineModalValues; label: string }[] = [
  { field: 'onInstallmentsValue', label: 'Valor das parcelas' },
  { field: 'onDefaultInterest', label: 'Juros moratórios' },
  { field: 'onCompensatoryInterest', label: 'Juros compensatórios' },
  { field: 'onCompoundInterest', label: 'Juros compostos' },
  { field: 'onInterestPeriod', label: 'Juros do período' },
];

const FineConfigModal = ({ isOpen, values, onClose, onConfirm }: FineConfigModalProps): JSX.Element => {
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(values);
  }, [isOpen, values]);

  const updateValue = (field: keyof FineModalValues, value: boolean) => {
    setDraft(current => ({
      ...current,
      [field]: value,
    }));
  };

  if (!isOpen) return <></>;

  return (
    <Overlay
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <Dialog>
        <Header>
          <Title>Configuração de Multa</Title>
          <HeaderActions>
            <HeaderButton type="button" onClick={() => onConfirm(draft)}>
              <FaCheck />
            </HeaderButton>
            <HeaderButton type="button" onClick={onClose}>
              <FaTimes />
            </HeaderButton>
          </HeaderActions>
        </Header>
        <ApplyPanel>
          <ApplyTitle>Aplicar Sobre</ApplyTitle>
          {applyFields.map(item => (
            <CheckboxLabel key={item.field}>
              <Checkbox
                type="checkbox"
                checked={Boolean(draft[item.field])}
                onChange={event => updateValue(item.field, event.target.checked)}
              />
              {item.label}
            </CheckboxLabel>
          ))}
        </ApplyPanel>
      </Dialog>
    </Overlay>
  );
};

export default FineConfigModal;
