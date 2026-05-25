import IPlanFrequencyResponse from '@interfaces/serviceResponses/PlanFrequencyResponseImp';
import FrequencyImp from '@interfaces/plans/FrequencyImp';
import IPlanType from '@interfaces/plans/PlanTypeImp';
import PlanResourceImp from '@interfaces/plans/PlanResourceImp';
import { IFrequenciesResponse, IFrequencies } from '@store/plans/types';

export const planFrequenciesSerializer = (responseData: IFrequenciesResponse) => {
  const {
    pagination: { current, pages, total },
    results,
  } = responseData;

  const parseFrequencies: IFrequencies = {
    currentPage: current,
    pages,
    totalPages: total,
    frequenciesList: results,
  };

  return parseFrequencies;
};

export const planFrequencySerializer = (responseData: IPlanFrequencyResponse, frequencyId: string) => {
  const { planHasResources, plans, resources } = responseData;

  const planFrequency: FrequencyImp = {
    id: frequencyId,
    plans: [],
    resourcesList: resources,
  };

  if (plans.length) {
    const parsePlans = plans.map(plan => {
      const { id, description, value, planHasFrequencyId, additionalValue } = plan;
      const parsePlan: IPlanType = {
        id,
        description,
        planHasFrequencyId,
        additionalValue: parseFloat(additionalValue),
        value: parseFloat(value),
        resources: [],
      };

      if (resources.length) {
        const planResourceList = planHasResources.find(item => item.plan === id);
        if (planResourceList && planResourceList.resources.length) {
          const parseResources = resources.map(resource => {
            const { id: resourceId, description } = resource;

            const planResource = planResourceList.resources.find(item => item.id === resourceId);

            const parseResource: PlanResourceImp = {
              id: resourceId,
              description: description,
              limit: planResource ? (planResource.limit === null ? true : planResource.limit) : false,
            };

            return parseResource;
          });

          parsePlan.resources = parseResources;
        }
      }

      return parsePlan;
    });

    planFrequency.plans = parsePlans;
  }

  return planFrequency;
};
