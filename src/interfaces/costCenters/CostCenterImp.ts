import ProfileImp from '../ProfileImp';

export default interface CostCenterImp {
  id: string;
  name: string;
  profile?: ProfileImp;
}

export interface UpdateCostCenterImp {
  id: string;
  name: string;
  profileId: string;
}
