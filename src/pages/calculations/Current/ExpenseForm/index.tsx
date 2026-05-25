import React, { useCallback, useEffect, useState } from 'react';

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
} from './styles';
import useCurrentAccount from '@/hooks/currentAccount';
import { useFormikContext } from 'formik';
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { labelsEnum } from '@/enums/labelsEnum';
import { typeExpenseSection } from '@/hooks/interfaces/CurrentAccountHookImp';
import { getCoin } from '@/utils/numberUtils';
const { Draggable } = require('react-beautiful-dnd');
import { DraggableProvided } from 'react-beautiful-dnd';
import { CurrentExpenseImp } from '@/interfaces/calculations/CurrentOccurrenceImp';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
export interface CalcSelectImp {}

const ExpenseForm = ({ expenseIndex, authorIndex }: { expenseIndex: number; authorIndex: number }): JSX.Element => {
  const { values, setValues } = useFormikContext<CurrentExpenseImp>();
  const [isModalVisible, setModalVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const { author, onDuplicateExpense, onRemoveExpense, setExpense } = useCurrentAccount();

  const handleDuplicateExpense = useCallback(() => {
    onDuplicateExpense({ expenseIndex });
  }, [expenseIndex, author]);

  const handleRemoveExpense = useCallback(() => {
    onRemoveExpense({ expenseIndex });
  }, [expenseIndex, author]);

  useEffect(() => {
    setExpense({ expense: values, expenseIndex });
  }, [values, expenseIndex]);

  useEffect(() => {
    setValues(author.list[authorIndex].expenses[expenseIndex]);
  }, [author.list[authorIndex].expenses[expenseIndex]]);

  return (
    <Draggable
      key={`item-${authorIndex}-${expenseIndex}`}
      draggableId={`item-${authorIndex}-${expenseIndex}`}
      index={expenseIndex}>
      {(provider: DraggableProvided) => (
        <BorderContainer $isActive={author.list[authorIndex].expenses[expenseIndex].newestOccurrence}>
          <Form key={expenseIndex} ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps}>
            <Name>
              <VerticalLine />
              {getFieldName(typeExpenseSection.label, nomenclatures)}
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
            <ExpenseAction>
              <BackgroudContainer>
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
      )}
    </Draggable>
  );
};
export default ExpenseForm;
