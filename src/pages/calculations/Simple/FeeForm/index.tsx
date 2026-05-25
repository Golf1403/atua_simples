import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Name,
  Input,
  InputDateContainer,
  InputDate,
  InputContainer,
  ExpenseAction,
  Form,
  DescriptionContainer,
  ButtonAction,
  Tooltip,
  VerticalLine,
  BackgroudContainer,
  BorderContainer,
  CorrectedContainer,
  CpcAction,
  IndexText,
  PercentageContainer,
} from './styles';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { useFormikContext } from 'formik';
import { FaCog, FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { labelsEnum } from '@/enums/labelsEnum';
import { typeFee } from '@/hooks/interfaces/CurrentAccountHookImp';
import { currencyFormat, getCoin } from '@/utils/numberUtils';
import { CurrentFeeOccorrenceImp } from '@/interfaces/calculations/CurrentOccurrenceImp';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import _ from 'lodash';
import FeeNewCpcModal from '../FeeNewCpcModal';

export interface CalcSelectImp {}

const FeeForm = ({ feeIndex, authorIndex }: { feeIndex: number; authorIndex: number }): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<CurrentFeeOccorrenceImp>();
  const valuesRef = useRef(values);
  const [isModalVisible, setModalVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();
  const feeValues = values as any;

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const { author, onDuplicateFee, onRemoveFee, setFee } = useSimpleUpdate() as any;

  const handleDuplicateFee = useCallback(() => {
    onDuplicateFee({ authorIndex, feeIndex });
  }, [authorIndex, feeIndex, onDuplicateFee]);

  const handleRemoveFee = useCallback(() => {
    onRemoveFee({ authorIndex, feeIndex });
  }, [authorIndex, feeIndex, onRemoveFee]);

  const openCpcModal = useCallback(() => {
    setFieldValue('type', typeFee.id);
    setFieldValue('isOpenFeeConfig', true);
  }, [setFieldValue]);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    setFee({ authorIndex, fee: values, feeIndex });
  }, [authorIndex, feeIndex, setFee, values]);

  useEffect(() => {
    const fee = author.list[authorIndex]?.fees?.[feeIndex];
    if (!fee || _.isEqual(fee, valuesRef.current)) return;
    setValues(fee);
  }, [author.list, authorIndex, feeIndex, setValues]);

  const formatMoney = (value?: number | string) => `R$${currencyFormat(Number(value) || 0)}`;
  const getCorrectedValue = () =>
    feeValues.correctedValue || feeValues.total || feeValues.calculated || feeValues.value || 0;

  return (
    <BorderContainer
      $isActive={author.list[authorIndex].fees[feeIndex]?.newestOccurrence}
      onFocusCapture={() => {
        if (!feeValues.newestOccurrence) return;
        setValues((prevValues: any) => ({ ...prevValues, newestOccurrence: false }));
      }}>
      <Form key={feeIndex}>
        <Name>
          <VerticalLine />
          <IndexText>{String(feeIndex + 1).padStart(5, '0')}</IndexText>
        </Name>
        <DescriptionContainer>
          <Input id="description" className="description" name="description" value={values.description} />
        </DescriptionContainer>
        <PercentageContainer>
          <Input id="percentage" name="percentage" suffix=" %" placeholder="(Percentual %)" />
        </PercentageContainer>
        <InputDateContainer>
          <Input reset className="update-since" />
          <InputDate id="date" className="date" name="date" value={values.date || ''} />
        </InputDateContainer>
        <InputContainer>
          <Input reset className="tax" />
          <Input
            id="value"
            className="value"
            prefix={values.date ? `${getCoin(values.date, 0)} ` : undefined}
            name="value"
            value={values.value}
          />
        </InputContainer>
        <CorrectedContainer>
          {formatMoney(getCorrectedValue())}
          <CpcAction type="button" onClick={openCpcModal}>
            CPC
          </CpcAction>
        </CorrectedContainer>
        <ExpenseAction>
          <BackgroudContainer>
            <ButtonAction type="button" onClick={openCpcModal}>
              <Tooltip withoutHoverColor={true} text="Configurar CPC">
                <FaCog />
              </Tooltip>
            </ButtonAction>
            <ButtonAction type="button" onClick={handleDuplicateFee}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DUPLICATE} ${getFieldName(typeFee.label, nomenclatures)}`}>
                <FaRegCopy />
              </Tooltip>
            </ButtonAction>
            <ButtonAction
              type="button"
              onClick={event => {
                if (event.ctrlKey || event.shiftKey) {
                  handleRemoveFee();
                } else {
                  openModal();
                }
              }}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DELETE} ${getFieldName(typeFee.label, nomenclatures)}`}>
                <FaTrashAlt />
              </Tooltip>
            </ButtonAction>
            <OcurrenceDeleteModal visible={isModalVisible} closeModal={closeModal} removeOcurrence={handleRemoveFee} />
          </BackgroudContainer>
        </ExpenseAction>
      </Form>
      <FeeNewCpcModal nomenclatures={nomenclatures} />
    </BorderContainer>
  );
};
export default FeeForm;
