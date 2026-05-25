import React, { useRef } from 'react';
import { Name, Container, DescriptionContainer, HeaderContainer, InputContainer, InputDateContainer, InterestFineAction } from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { Formik } from 'formik';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import FineForm from '../FineForm';

const FineList = (): JSX.Element => {
  const targetRef = useRef<HTMLElement | null>(null);
  const { author, layout: { authorRow: { authorIndex } } } = useSimpleUpdate() as any;

  if (!author.list[authorIndex]) return <></>;

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
      <div ref={el => { targetRef.current = el; }}>
        {(author.list[authorIndex] || []).interestFines?.filter((i: any) => i.type?.includes('fine')).map((fine: any, key: number) => (
          <Formik key={key} onSubmit={() => {}} initialValues={fine}>
            <FineForm authorIndex={authorIndex} fineIndex={key} />
          </Formik>
        ))}
      </div>
    </Container>
  );
};
export default FineList;
