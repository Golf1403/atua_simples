import React from 'react';
import { labelsEnum } from '@/enums/labelsEnum';
import { styled } from 'styled-components';
import { coloraero, colorwhite, rem, fontlg } from '@/styles/global';

const SummaryContainer = styled.div`
  background-color: ${colorwhite};
  border: 1px solid ${coloraero};
  border-radius: ${rem(4)};
  padding: ${rem(16)};
  margin-bottom: ${rem(16)};
  position: sticky;
  top: ${rem(16)};
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

interface CalcSummaryProps {
  totals: {
    installments: number;
    payments: number;
    expenses: number;
    fees: number;
    art523?: number;
  };
}

const CalcSummary = ({ totals }: CalcSummaryProps): JSX.Element => (
  <SummaryContainer>
    <Title>Resumo do Cálculo</Title>
    <Row>
      <Label>{labelsEnum.TOTAL_INSTALLMENTS}</Label>
      <Value>R$ {(totals.installments || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>{labelsEnum.TOTAL_PAYMENTS}</Label>
      <Value>R$ {(totals.payments || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>{labelsEnum.TOTAL_EXPENSES}</Label>
      <Value>R$ {(totals.expenses || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>{labelsEnum.TOTAL_FEES}</Label>
      <Value>R$ {(totals.fees || 0).toFixed(2)}</Value>
    </Row>
    {totals.art523 !== undefined && (
      <Row>
        <Label>{labelsEnum.TOTAL_ART523}</Label>
        <Value>R$ {totals.art523.toFixed(2)}</Value>
      </Row>
    )}
  </SummaryContainer>
);

export default CalcSummary;
