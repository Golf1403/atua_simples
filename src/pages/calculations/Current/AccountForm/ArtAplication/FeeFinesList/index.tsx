import React, { useCallback, useRef } from 'react';

import {
  FeeFineAction,
  Container,
  DescriptionContainer,
  HeaderContainer,
  InputContainer,
  InputDateContainer,
  Name,
  FeeFineOptions,
} from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { Formik } from 'formik';
import useCurrentAccount from '@/hooks/currentAccount';
const { Droppable, DragDropContext } = require('react-beautiful-dnd');
import { DragUpdate, DroppableProvided } from 'react-beautiful-dnd';

import ISelectOption from '@interfaces/SelectOptionImp';
import fineEntryTypes from '@data/calculations/fineEntryTypes';
import FeeFinesForm from '../FeeFinesForm';
import _ from 'lodash';

export const fineEntryTypeOptions: ISelectOption[] = fineEntryTypes.map(entry => {
  const option: ISelectOption = {
    id: entry.id,
    value: entry.id,
    label: entry.name,
  };
  return option;
});

export interface CalcSelectImp {}

const FeeFinesList = (): JSX.Element => {
  const targetRef = useRef<HTMLElement | null>(null);

  const { feeFines, onOrderFeeFine, onOrderFeeFineToUpdate, setFeeFines } = useCurrentAccount();

  const onDragEnd = useCallback(
    (result: DragUpdate) => {
      if (!result.destination) return;
      onOrderFeeFine({ startIndex: result.source.index, endIndex: result.destination.index });
    },
    [feeFines, setFeeFines]
  );

  const onDragUpdate = useCallback(() => {
    onOrderFeeFineToUpdate();
  }, [feeFines, setFeeFines]);

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
          <label>{labelsEnum.TAX}</label>
          <label>{labelsEnum.VALUE}</label>
        </InputContainer>
        <FeeFineOptions>{labelsEnum.OPTIONS}</FeeFineOptions>
        <FeeFineAction>{labelsEnum.ACTIONS}</FeeFineAction>
      </HeaderContainer>

      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Droppable droppableId={`droppable-current-fee-fine`}>
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={el => {
                targetRef.current = el;
                return provided.innerRef(el);
              }}
              onKeyDown={handleKeyDown}>
              {feeFines.list.map((feeFine, key) => {
                return (
                  <Formik key={`${JSON.stringify(feeFine)}${key}`} onSubmit={() => {}} initialValues={feeFine}>
                    <FeeFinesForm feeFineIndex={key} />
                  </Formik>
                );
              })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default FeeFinesList;
