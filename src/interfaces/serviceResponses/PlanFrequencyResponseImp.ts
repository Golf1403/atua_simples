export interface PlanResponseImp {
  description: string;
  id: string;
  value: string;
  additionalValue: string;
  planHasFrequencyId: string;
}

export interface PlanResourceResponseImp {
  id: number;
  description: string;
}

export interface PlanResourcesResponseImp {
  plan: string;
  resources: [
    {
      id: number;
      description: string;
      limit: string | null;
    }
  ];
}

export default interface PlanFrequencyResponseImp {
  planHasResources: PlanResourcesResponseImp[];
  plans: PlanResponseImp[];
  resources: PlanResourceResponseImp[];
}
