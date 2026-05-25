import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCheck, FaCog, FaTimes } from 'react-icons/fa';
import frequencyDaysOptions from '@/data/calculations/frequencyDaysOptions';
import { fineAmountType, finePercentageType, PercentageOrFixedType } from '@/data/calculations/fineEntryTypes';
import {
  Content,
  DateInputWrap,
  Dialog,
  Field,
  Header,
  HeaderActions,
  HeaderButton,
  Input,
  Overlay,
  Select,
  Title,
} from './styles';
import FineConfigModal from './ConfigModal';
import { formatDateInput, selectInputValue } from '../dateInputUtils';

export interface FineModalValues {
  periodicity: string;
  dateStart: string;
  dateEnd: string;
  type: PercentageOrFixedType;
  percentage: number;
  value: number;
  onInstallmentsValue: boolean;
  onDefaultInterest: boolean;
  onCompensatoryInterest: boolean;
  onCompoundInterest: boolean;
  onInterestPeriod: boolean;
}

interface FineModalProps {
  isOpen: boolean;
  initialValues: FineModalValues;
  onClose: () => void;
  onConfirm: (values: FineModalValues) => void;
}

const entryOptions = [
  { value: finePercentageType.id, label: finePercentageType.name },
  { value: fineAmountType.id, label: fineAmountType.name },
];

const FineModal = ({ isOpen, initialValues, onClose, onConfirm }: FineModalProps): JSX.Element => {
  const [values, setValues] = useState(initialValues);
  const [isConfigOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setValues(initialValues);
  }, [initialValues, isOpen]);

  const updateValue = (field: keyof FineModalValues, value: string) => {
    setValues(current => ({
      ...current,
      [field]:
        field === 'percentage' || field === 'value'
          ? Number(value.replace(',', '.')) || 0
          : field === 'dateStart' || field === 'dateEnd'
          ? formatDateInput(value)
          : (value as FineModalValues[keyof FineModalValues]),
    }));
  };

  const getAmountValue = () => (values.type === fineAmountType.id ? values.value : values.percentage);

  if (!isOpen) return <></>;

  return (
    <Overlay
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <Dialog>
        <Header>
          <Title>Multa</Title>
          <HeaderActions>
            <HeaderButton type="button" onClick={() => setConfigOpen(true)}>
              <FaCog />
            </HeaderButton>
            <HeaderButton type="button" onClick={() => onConfirm(values)}>
              <FaCheck />
            </HeaderButton>
            <HeaderButton type="button" onClick={onClose}>
              <FaTimes />
            </HeaderButton>
          </HeaderActions>
        </Header>
        <Content>
          <Field>
            Periodicidade
            <Select value={values.periodicity} onChange={event => updateValue('periodicity', event.target.value)}>
              {frequencyDaysOptions.map(option => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            De
            <DateInputWrap>
              <Input
                value={values.dateStart || ''}
                maxLength={10}
                onFocus={selectInputValue}
                onChange={event => updateValue('dateStart', event.target.value)}
              />
              <FaCalendarAlt />
            </DateInputWrap>
          </Field>
          <Field>
            Até
            <DateInputWrap>
              <Input
                value={values.dateEnd || ''}
                maxLength={10}
                onFocus={selectInputValue}
                onChange={event => updateValue('dateEnd', event.target.value)}
              />
              <FaCalendarAlt />
            </DateInputWrap>
          </Field>
          <Field>
            Entrada
            <Select value={values.type} onChange={event => updateValue('type', event.target.value)}>
              {entryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            {values.type === fineAmountType.id ? 'Valor' : 'Percentual'}
            <Input
              value={String(getAmountValue() || 0).replace('.', ',')}
              onChange={event =>
                updateValue(values.type === fineAmountType.id ? 'value' : 'percentage', event.target.value)
              }
            />
          </Field>
        </Content>
        <FineConfigModal
          isOpen={isConfigOpen}
          values={values}
          onClose={() => setConfigOpen(false)}
          onConfirm={configValues => {
            setValues(configValues);
            setConfigOpen(false);
          }}
        />
      </Dialog>
    </Overlay>
  );
};

export default FineModal;
