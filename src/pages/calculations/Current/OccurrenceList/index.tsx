import React, { Fragment, useCallback, useRef } from 'react';

import {
  Name,
  Container,
  InputDateContainer,
  InputContainer,
  OccurrenceAction,
  HeaderContainer,
  DescriptionContainer,
} from './styles';
import useCurrentAccount from '@/hooks/currentAccount';
import { Formik } from 'formik';
import { labelsEnum } from '@/enums/labelsEnum';
import { DropResult, DroppableProvided } from 'react-beautiful-dnd';
const { DragDropContext, Droppable } = require('react-beautiful-dnd');
import OccurrenceForm from '../OccurrenceForm';
export interface CalcSelectImp {}

const OccurrenceList = (): JSX.Element => {
  const {
    author,
    layout: {
      authorRow: { authorIndex },
    },
    onOrderOccurrence,
  } = useCurrentAccount();
  const targetRef = useRef<HTMLElement | null>(null);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      onOrderOccurrence({ startIndex: result.source.index, endIndex: result.destination.index });
    },
    [author, authorIndex]
  );

  const onDragUpdate = () => {};

  if (!author.list[authorIndex]) return <Fragment />;

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
        <OccurrenceAction>{labelsEnum.ACTIONS}</OccurrenceAction>
      </HeaderContainer>

      <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        <Droppable droppableId={`droppable-current-occurrence`}>
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={el => {
                targetRef.current = el;
                return provided.innerRef(el);
              }}
              onKeyDown={handleKeyDown}>
              {author.list[authorIndex].occurrences.map((occurrence, occurrenceIndex) => (
                <Formik key={`${authorIndex}_${occurrenceIndex}`} onSubmit={() => {}} initialValues={occurrence}>
                  <OccurrenceForm authorIndex={authorIndex} occurrenceIndex={occurrenceIndex} />
                </Formik>
              ))}
              {provided.placeholder as React.ReactNode}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default OccurrenceList;
