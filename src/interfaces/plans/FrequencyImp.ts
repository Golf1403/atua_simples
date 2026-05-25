import PlanTypeImp from './PlanTypeImp';
import PlanResourceImp from './PlanResourceImp';

export default interface FrequencyImp {
  id: string;
  plans: PlanTypeImp[];
  resourcesList: PlanResourceImp[];
}
