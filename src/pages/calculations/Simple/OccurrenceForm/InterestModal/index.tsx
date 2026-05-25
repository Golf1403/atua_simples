import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCheck, FaCog, FaTimes } from 'react-icons/fa';
import { typeCompensatory, typeCompound, typeDefault, typePeriod } from '@/data/calculations/interestTypes';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
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
import InterestConfigModal from './ConfigModal';

export interface InterestModalValues {
  type: string;
  dateStart: string;
  dateEnd: string;
  percentage: number;
  capitalization: string;
  civilCode: CivilCodeInterest;
  onInstallmentsValue: boolean;
  onDefaultInterest: boolean;
  onCompensatoryInterest: boolean;
  onCompoundInterest: boolean;
  onInterestPeriod: boolean;
  onInterestWithoutCorrection: boolean;
}

interface InterestModalProps {
  isOpen: boolean;
  initialValues: InterestModalValues;
  onClose: () => void;
  onConfirm: (values: InterestModalValues) => void;
  onConfig?: () => void;
}

const interestOptions = [
  { value: typeDefault.id, label: 'Moratórios' },
  { value: typeCompensatory.id, label: 'Compensatórios' },
  { value: typeCompound.id, label: 'Compostos' },
  { value: typePeriod.id, label: 'Período' },
];

const InterestModal = ({ isOpen, initialValues, onClose, onConfirm, onConfig }: InterestModalProps): JSX.Element => {
  const [values, setValues] = useState(initialValues);
  const [isConfigOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setValues(initialValues);
  }, [initialValues, isOpen]);

  const updateValue = (field: keyof InterestModalValues, value: string) => {
    setValues(current => ({
      ...current,
      [field]: field === 'percentage' ? Number(value.replace(',', '.')) || 0 : value,
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
          <Title>Juros</Title>
          <HeaderActions>
            <HeaderButton
              type="button"
              onClick={() => {
                setConfigOpen(true);
                onConfig && onConfig();
              }}>
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
            Tipos de Juros
            <Select value={values.type} onChange={event => updateValue('type', event.target.value)}>
              {interestOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            De
            <DateInputWrap>
              <Input value={values.dateStart || ''} onChange={event => updateValue('dateStart', event.target.value)} />
              <FaCalendarAlt />
            </DateInputWrap>
          </Field>
          <Field>
            Até
            <DateInputWrap>
              <Input value={values.dateEnd || ''} onChange={event => updateValue('dateEnd', event.target.value)} />
              <FaCalendarAlt />
            </DateInputWrap>
          </Field>
          <Field>
            Percentual
            <Input
              value={String(values.percentage || 0).replace('.', ',')}
              onChange={event => updateValue('percentage', event.target.value)}
            />
          </Field>
        </Content>
        <InterestConfigModal
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

export default InterestModal;
