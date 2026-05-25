import React from 'react';
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

interface OccurrenceSummaryProps {
  correctedValue?: number;
  totalInterest?: number;
  totalFine?: number;
}

const OccurrenceSummary = ({ correctedValue, totalInterest, totalFine }: OccurrenceSummaryProps): JSX.Element => (
  <Container>
    <Title>Resumo</Title>
    <Row>
      <Label>Valor Corrigido</Label>
      <Value>R$ {(correctedValue || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>Total Juros</Label>
      <Value>R$ {(totalInterest || 0).toFixed(2)}</Value>
    </Row>
    <Row>
      <Label>Total Multa</Label>
      <Value>R$ {(totalFine || 0).toFixed(2)}</Value>
    </Row>
  </Container>
);

export default OccurrenceSummary;
