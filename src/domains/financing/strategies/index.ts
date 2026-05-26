import { FinancingStrategy } from '../types';
import { priceStrategy } from './price';
import { sacStrategy } from './sac';

export const financingStrategies: Record<string, FinancingStrategy> = {
  linear: sacStrategy,
  price: priceStrategy,
  sac: sacStrategy,
  sacre: sacStrategy,
};

export { priceStrategy, sacStrategy };
