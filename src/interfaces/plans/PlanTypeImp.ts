import PlanResourceImp from './PlanResourceImp';

export default interface PlanTypeImp {
  id: string;
  description: string;
  value: number;
  additionalValue?: number;
  planHasFrequencyId: string;
  resources: PlanResourceImp[];
}
