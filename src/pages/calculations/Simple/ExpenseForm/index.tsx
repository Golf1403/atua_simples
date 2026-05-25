import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';

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
  IndexText,
} from './styles';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { useFormikContext } from 'formik';
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { labelsEnum } from '@/enums/labelsEnum';
import { typeExpenseSection } from '@/hooks/interfaces/CurrentAccountHookImp';
import { currencyFormat, getCoin } from '@/utils/numberUtils';
import { CurrentExpenseImp } from '@/interfaces/calculations/CurrentOccurrenceImp';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import CustomCheckbox from '@/components/CustomCheckbox';
export interface CalcSelectImp {}

const ExpenseForm = ({ expenseIndex, authorIndex }: { expenseIndex: number; authorIndex: number }): JSX.Element => {
  const { values, setValues } = useFormikContext<CurrentExpenseImp>();
  const valuesRef = useRef(values);
  const expenseValues = values as any;
  const [isModalVisible, setModalVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const { author, onDuplicateExpense, onRemoveExpense, setExpense } = useSimpleUpdate() as any;

  const handleDuplicateExpense = useCallback(() => {
    onDuplicateExpense({ authorIndex, expenseIndex });
  }, [authorIndex, expenseIndex, onDuplicateExpense]);

  const handleRemoveExpense = useCallback(() => {
    onRemoveExpense({ authorIndex, expenseIndex });
  }, [authorIndex, expenseIndex, onRemoveExpense]);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    setExpense({ authorIndex, expense: values, expenseIndex });
  }, [authorIndex, expenseIndex, setExpense, values]);

  useEffect(() => {
    const expense = author.list[authorIndex]?.expenses?.[expenseIndex];
    if (!expense || _.isEqual(expense, valuesRef.current)) return;
    setValues(expense);
  }, [author.list, authorIndex, expenseIndex, setValues]);

  const formatMoney = (value?: number | string) => `R$${currencyFormat(Number(value) || 0)}`;
  const getCorrectedValue = () => expenseValues.correctedValue || expenseValues.total || values.value || 0;

  return (
    <BorderContainer
      $isActive={author.list[authorIndex].expenses[expenseIndex].newestOccurrence}
      onFocusCapture={() => {
        if (!expenseValues.newestOccurrence) return;
        setValues((prevValues: any) => ({ ...prevValues, newestOccurrence: false }));
      }}>
      <Form key={expenseIndex}>
        <Name>
          <VerticalLine />
          <IndexText>{String(expenseIndex + 1).padStart(5, '0')}</IndexText>
        </Name>
        <DescriptionContainer>
          <Input id="description" className="description" name="description" value={values.description} />
        </DescriptionContainer>
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
        <CorrectedContainer>{formatMoney(getCorrectedValue())}</CorrectedContainer>
        <ExpenseAction>
          <BackgroudContainer>
            <CustomCheckbox name="article_523" label="ART. 523" />
            <ButtonAction onClick={handleDuplicateExpense}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DUPLICATE} ${getFieldName(typeExpenseSection.label, nomenclatures)}`}>
                <FaRegCopy />
              </Tooltip>
            </ButtonAction>
            <ButtonAction
              onClick={event => {
                if (event.ctrlKey || event.shiftKey) {
                  handleRemoveExpense();
                } else {
                  openModal();
                }
              }}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DELETE} ${getFieldName(typeExpenseSection.label, nomenclatures)}`}>
                <FaTrashAlt />
              </Tooltip>
            </ButtonAction>
            <OcurrenceDeleteModal
              visible={isModalVisible}
              closeModal={closeModal}
              removeOcurrence={handleRemoveExpense}
            />
          </BackgroudContainer>
        </ExpenseAction>
      </Form>
    </BorderContainer>
  );
};
export default ExpenseForm;
