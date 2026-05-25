import React, { Fragment, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Name,
  Container,
  InputDateContainer,
  InputContainer,
  OccurrenceAction,
  HeaderContainer,
  DescriptionContainer,
} from './styles';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { Formik } from 'formik';
import { labelsEnum } from '@/enums/labelsEnum';
import OccurrenceForm from '../OccurrenceForm';
import { typeinstallment, typePayment } from '@/hooks/interfaces/CurrentAccountHookImp';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

const OccurrenceList = (): JSX.Element => {
  const {
    author,
    layout: {
      authorRow: { authorIndex },
    },
  } = useSimpleUpdate() as any;
  const targetRef = useRef<HTMLElement | null>(null);

  if (!author.list[authorIndex]) return <Fragment />;

  const visibleOccurrences = (author.list[authorIndex]?.occurrences || [])
    .map((occurrence: any, originalIndex: number) => ({ occurrence, originalIndex }))
    .filter(({ occurrence }: any) => occurrence.type === typeinstallment.id || occurrence.type === typePayment.id);

  const sorted = _.orderBy(
    visibleOccurrences,
    [
      ({ occurrence }: any) => (occurrence.type === typeinstallment.id ? 0 : 1),
      ({ occurrence }: any) => moment(occurrence.date, dateFormatEnum.DEFAULT).format('YYYY-MM'),
    ],
    ['asc', 'asc']
  );

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
      {sorted.length > 0 && (
        <>
          <HeaderContainer>
            <Name />
            <DescriptionContainer>{labelsEnum.DESCRIPTION}</DescriptionContainer>
            <InputDateContainer>{labelsEnum.DATE}</InputDateContainer>
            <InputContainer>
              <label>{labelsEnum.VALUE}</label>
            </InputContainer>
            <InputContainer>
              <label>Corrigido</label>
            </InputContainer>
            <OccurrenceAction>{labelsEnum.ACTIONS}</OccurrenceAction>
          </HeaderContainer>

          <div
            ref={el => {
              targetRef.current = el;
            }}
            onKeyDown={handleKeyDown}>
            {sorted.map(({ occurrence, originalIndex }: any) => (
              <Formik key={`${authorIndex}_${originalIndex}`} onSubmit={() => {}} initialValues={occurrence}>
                <OccurrenceForm authorIndex={authorIndex} occurrenceIndex={originalIndex} />
              </Formik>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default OccurrenceList;
