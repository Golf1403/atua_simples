import React, { Fragment, useRef } from 'react';
import {
  Name,
  Container,
  InputDateContainer,
  InputContainer,
  ExpenseAction,
  HeaderContainer,
  DescriptionContainer,
  CorrectedContainer,
} from './styles';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { Formik } from 'formik';
import { labelsEnum } from '@/enums/labelsEnum';
import ExpenseForm from '../ExpenseForm';

const ExpenseList = (): JSX.Element => {
  const {
    author,
    layout: {
      authorRow: { authorIndex },
    },
  } = useSimpleUpdate() as any;
  const targetRef = useRef<HTMLElement | null>(null);

  if (!author.list[authorIndex]?.expenses) return <Fragment />;
  const expenses = author.list[authorIndex].expenses;

  return (
    <Container>
      {expenses.length > 0 && (
        <>
          <HeaderContainer>
            <Name />
            <DescriptionContainer>{labelsEnum.DESCRIPTION}</DescriptionContainer>
            <InputDateContainer>{labelsEnum.DATE}</InputDateContainer>
            <InputContainer>
              <label>{labelsEnum.VALUE}</label>
            </InputContainer>
            <CorrectedContainer>
              <label>Corrigido</label>
            </CorrectedContainer>
            <ExpenseAction>{labelsEnum.ACTIONS}</ExpenseAction>
          </HeaderContainer>
          <div
            ref={el => {
              targetRef.current = el;
            }}>
            {expenses.map((expense: any, expenseIndex: number) => (
              <Formik key={`${authorIndex}_${expenseIndex}`} onSubmit={() => {}} initialValues={expense}>
                <ExpenseForm authorIndex={authorIndex} expenseIndex={expenseIndex} />
              </Formik>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};
export default ExpenseList;
