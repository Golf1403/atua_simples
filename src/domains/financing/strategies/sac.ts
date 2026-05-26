import { FinancingStrategy } from '../types';

// SAC: amortizacao constante e prestacao decrescente.
export const sacStrategy: FinancingStrategy = ({ balance, context, interest }) => {
  const amortization = Math.min(context.fixedAmortization, balance);

  return {
    amortization,
    installment: amortization + interest,
  };
};
