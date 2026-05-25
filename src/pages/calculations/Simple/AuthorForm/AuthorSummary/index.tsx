import React from 'react';
import { labelsEnum } from '@/enums/labelsEnum';
import { styled } from 'styled-components';
import { coloraero, colorwhite, rem, fontlg } from '@/styles/global';

const Container = styled.div`
  background-color: ${colorwhite};
  border: 1px solid ${coloraero};
  border-radius: ${rem(4)};
  padding: ${rem(16)};
  margin-bottom: ${rem(16)};
`;

const Title = styled.h3`
  color: ${coloraero};
  font-size: ${fontlg};
  margin-bottom: ${rem(12)};
  border-bottom: 1px solid ${coloraero};
  padding-bottom: ${rem(8)};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${rem(4)} 0;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  text-align: right;
`;

interface AuthorSummaryProps {
  author: {
    installmentTotal?: number;
    installmentInterestTotal?: number;
    paymentTotal?: number;
    paymentInterestTotal?: number;
  };
}

const AuthorSummary = ({ author }: AuthorSummaryProps): JSX.Element => (
  <Container>
    <Title>Resumo do Autor</Title>
    <Row>
      <Label>{labelsEnum.INSTALLMENTS}</Label>
      <Value>R$ {(author.installmentTotal || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>Juros {labelsEnum.INSTALLMENTS}</Label>
      <Value>R$ {(author.installmentInterestTotal || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>{labelsEnum.PAYMENT}</Label>
      <Value>R$ {(author.paymentTotal || 0).toFixed(2)}</Value>
    </Row>
  </Container>
);

export default AuthorSummary;
