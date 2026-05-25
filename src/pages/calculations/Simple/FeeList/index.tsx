import React, { Fragment, useRef } from 'react';
import {
  Name,
  Container,
  InputDateContainer,
  InputContainer,
  ExpenseAction,
  HeaderContainer,
  DescriptionContainer,
  PercentageContainer,
  CorrectedContainer,
} from './styles';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { Formik } from 'formik';
import { labelsEnum } from '@/enums/labelsEnum';
import FeeForm from '../FeeForm';

const FeeList = (): JSX.Element => {
  const {
    author,
    layout: {
      authorRow: { authorIndex },
    },
  } = useSimpleUpdate() as any;
  const targetRef = useRef<HTMLElement | null>(null);

  if (!author.list[authorIndex]?.fees) return <Fragment />;
  const fees = author.list[authorIndex].fees;

  return (
    <Container>
      {fees.length > 0 && (
        <>
          <HeaderContainer>
            <Name />
            <DescriptionContainer>{labelsEnum.DESCRIPTION}</DescriptionContainer>
            <PercentageContainer>
              <label>(Percentual %)</label>
            </PercentageContainer>
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
            {fees.map((fee: any, feeIndex: number) => (
              <Formik key={`${authorIndex}_${feeIndex}`} onSubmit={() => {}} initialValues={fee}>
                <FeeForm authorIndex={authorIndex} feeIndex={feeIndex} />
              </Formik>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};
export default FeeList;
