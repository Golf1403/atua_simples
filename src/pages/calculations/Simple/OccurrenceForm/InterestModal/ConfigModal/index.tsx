import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import capitalizationOptions from '@/data/calculations/capitalizationOptions';
import civilCodeOptions from '@/data/calculations/civilCodeOptions';
import {
  ApplyPanel,
  ApplyTitle,
  Checkbox,
  CheckboxLabel,
  Content,
  Dialog,
  Field,
  Header,
  HeaderActions,
  HeaderButton,
  MainFields,
  Overlay,
  Select,
  Separator,
  Title,
} from './styles';
import { InterestModalValues } from '..';

interface InterestConfigModalProps {
  isOpen: boolean;
  values: InterestModalValues;
  onClose: () => void;
  onConfirm: (values: InterestModalValues) => void;
}

const applyFields: { field: keyof InterestModalValues; label: string }[] = [
  { field: 'onInstallmentsValue', label: 'Valor das parcelas' },
  { field: 'onDefaultInterest', label: 'Juros moratórios' },
  { field: 'onCompensatoryInterest', label: 'Juros compensatórios' },
  { field: 'onCompoundInterest', label: 'Juros compostos' },
  { field: 'onInterestPeriod', label: 'Juros do período' },
  { field: 'onInterestWithoutCorrection', label: 'Sem correção' },
];

const InterestConfigModal = ({ isOpen, values, onClose, onConfirm }: InterestConfigModalProps): JSX.Element => {
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(values);
  }, [isOpen, values]);

  const updateValue = (field: keyof InterestModalValues, value: string | boolean) => {
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
          <Title>Configuração de Juros</Title>
          <HeaderActions>
            <HeaderButton type="button" onClick={() => onConfirm(draft)}>
              <FaCheck />
            </HeaderButton>
            <HeaderButton type="button" onClick={onClose}>
              <FaTimes />
            </HeaderButton>
          </HeaderActions>
        </Header>
        <Content>
          <MainFields>
            <Field>
              Capitalização
              <Select
                value={draft.capitalization}
                onChange={event => updateValue('capitalization', event.target.value)}>
                {capitalizationOptions.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Separator />
            <Field>
              Novo Código Civil
              <Select value={draft.civilCode} onChange={event => updateValue('civilCode', event.target.value)}>
                {civilCodeOptions.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </MainFields>
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
        </Content>
      </Dialog>
    </Overlay>
  );
};

export default InterestConfigModal;
