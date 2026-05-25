import React, { useCallback, useRef } from 'react';

import {
  InterestFineAction,
  Container,
  DescriptionContainer,
  HeaderContainer,
  InputContainer,
  InputDateContainer,
  Name,
} from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { Formik } from 'formik';
import useCurrentAccount from '@/hooks/currentAccount';
import { DragUpdate, DroppableProvided } from 'react-beautiful-dnd';
const { DragDropContext, Droppable } = require('react-beautiful-dnd');

import ISelectOption from '@interfaces/SelectOptionImp';
import fineEntryTypes from '@data/calculations/fineEntryTypes';
import InterestFineForm from '../InterestFineForm';

export const fineEntryTypeOptions: ISelectOption[] = fineEntryTypes.map(entry => {
  const option: ISelectOption = {
    id: entry.id,
    value: entry.id,
    label: entry.name,
  };
  return option;
});

export interface CalcSelectImp {}

const InterestFineList = (): JSX.Element => {
  const targetRef = useRef<HTMLElement | null>(null);

  const {
    author,
    layout: {
      authorRow: { authorIndex },
    },
    onOrderInterestFine,
    onOrderInterestFineToUpdate,
  } = useCurrentAccount();

  const onDragEnd = useCallback(
    (result: DragUpdate) => {
      if (!result.destination) return;

      onOrderInterestFine({ startIndex: result.source.index, endIndex: result.destination.index });
    },
    [author]
  );

  const onDragUpdate = useCallback(() => {
    onOrderInterestFineToUpdate();
  }, [author]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.persist();
    const VALUE_FIELD_ID = 'value';
    const onKeyDown = (type: 'up' | 'down') => {
      const form = targetRef.current?.getElementsByTagName('form');
      if (form) {
        let isValueOrDescrition = false;
        let inputIndex = -1;

        (event.target as any)?.focus();

        const currentIndex = Array.from(form).findIndex(currentForm => {
          if (Object(event.target).id.includes('date')) {
            const calendar = document.getElementsByClassName('react-datepicker-popper');
            if (calendar.item(0)) calendar.item(0)?.remove();
          }
          isValueOrDescrition = Object(event.target).id.includes(VALUE_FIELD_ID);
          const CURRENT_FORM = Array.from(currentForm);
          inputIndex = CURRENT_FORM.findIndex(currentInput => currentInput == Object(event.target));
          return inputIndex != -1;
        });

        if (currentIndex != -1 && inputIndex != -1) {
          const newFormIndex = type == 'up' ? currentIndex + 1 : currentIndex - 1;
          const formLength = form.length;
          const input = newFormIndex < formLength ? form[newFormIndex] : form[formLength];
          if (!input) return;

          const DESCRIPTION_ID = 0;
          const valueInputIndex = isValueOrDescrition
            ? Array.from(input).findIndex(target => target.id.includes(VALUE_FIELD_ID))
            : DESCRIPTION_ID;

          const elememt = Object(input[valueInputIndex]);

          if (elememt) {
            elememt.blur();
            elememt.focus();
          }
        }
      }
    };

    switch (event.keyCode) {
      case 38:
        return onKeyDown('down');
      case 40:
        return onKeyDown('up');
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <Name />
        <DescriptionContainer>{labelsEnum.DESCRIPTION}</DescriptionContainer>
        <InputDateContainer>{labelsEnum.DATE}</InputDateContainer>
        <InputContainer>
          <label>{labelsEnum.PERIODICITY_TAX}</label>
          <label>{labelsEnum.VALUE_PERCENT}</label>
        </InputContainer>
        <InterestFineAction>{labelsEnum.ACTIONS}</InterestFineAction>
      </HeaderContainer>

      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Droppable droppableId={`droppable-current-interest-fine`}>
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={el => {
                targetRef.current = el;
                return provided.innerRef(el);
              }}
              onKeyDown={handleKeyDown}>
              {(author.list[authorIndex] || []).interestFines.map((interestFine, key) => (
                <Formik key={key} onSubmit={() => {}} initialValues={interestFine}>
                  <InterestFineForm authorIndex={authorIndex} interestFineIndex={key} />
                </Formik>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default InterestFineList;
