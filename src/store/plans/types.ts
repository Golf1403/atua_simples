import FrequencyImp from '@interfaces/plans/FrequencyImp';

export interface IFrequencyResponse {
  id: string;
  description: string;
}

export interface IFrequencies {
  currentPage: number;
  pages: number;
  totalPages: number;
  frequenciesList: IFrequencyResponse[];
}

export interface IFrequenciesResponse {
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
  results: IFrequencyResponse[];
}

export enum PlansActionTypes {
  SET_FREQUENCIES = '@@plans/SET_FREQUENCIES',
  SET_SELETED_FREQUENCY = '@@plans/SET_SELETED_FREQUENCY',
}

export interface PlansState {
  readonly frequencies: IFrequencies;
  readonly selectedFrequency: FrequencyImp;
}
