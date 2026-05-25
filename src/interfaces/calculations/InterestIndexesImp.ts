import { IndicatorResponseImp } from '../serviceResponses/IndicatorResponseImp';
// import { IndicatorSavingsResponseImp } from '../serviceResponses/IndicatorSavingsResponseImp';

export default interface InterestIndexesImp {
  selic: IndicatorResponseImp[];
  savings: IndicatorResponseImp[];
  tr: IndicatorResponseImp[];
  newSavings: IndicatorResponseImp[];
  newSavingsDaily: IndicatorResponseImp[];
}
