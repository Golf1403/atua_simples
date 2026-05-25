import React, { createContext, useContext, useState } from 'react';
import _ from 'lodash';
import SelectOptionImp, { OptionImp } from '@/interfaces/SelectOptionImp';
import CostCenterImp from '@/interfaces/costCenters/CostCenterImp';
import AccountServices from '@/services/AccountServices';
import useCurrentAccount from './currentAccount';
import { DefaultResultImp } from '@/components/DefaultResult';
import { labelsEnum } from '@/enums/labelsEnum';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { useResource } from './resourses';
import { useFactors } from './factors';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import { initialAccountPagination } from '@/store/simple/payload';

interface AccessProfileResponseImp {
  id: string;
  name: string;
  can_read: boolean;
  can_write: boolean;
}

interface SidebarImp {
  visible: boolean;
  title: labelsEnum | null;
}

interface CoreHookImp {
  sidebar: SidebarImp;
  setSidebar: React.Dispatch<React.SetStateAction<SidebarImp>>;
  costCenters: CostCenterImp[];
  profiles: AccessProfileResponseImp[] | null;
  selectedCostCenter?: string;
  costCenterSelectOptions: SelectOptionImp[];
  calculationFieldsDisabled: boolean;
  setCostCenters: React.Dispatch<React.SetStateAction<CostCenterImp[]>>;
  pagination: PaginateResponseImp;
  setPagination: React.Dispatch<React.SetStateAction<PaginateResponseImp>>;
  onSelectCostCenterOptions: (costCenters: CostCenterImp[]) => void;
  validateCalculationPeriod: (date: string, indexId?: number) => void;
  setSelectedCostCenter: React.Dispatch<React.SetStateAction<string | undefined>>;
  loadCostCenters: () => Promise<void>;
  results: DefaultResultImp[];
  setResults: React.Dispatch<React.SetStateAction<DefaultResultImp[]>>;
}

const CoreHookContext = createContext<CoreHookImp | null>(null);

export const CoreHookProvider = ({ children: Children }: { children: React.ReactElement }) => {
  const accountServices = new AccountServices();
  const [results, setResults] = useState<DefaultResultImp[]>([]);
  const { account, setAccount } = useCurrentAccount();
  const [costCenters, setCostCenters] = useState<CostCenterImp[]>([]);
  const [costCenterSelectOptions, setCostCenterSelectOptions] = useState<SelectOptionImp[]>([]);
  const [profiles, setProfiles] = useState<AccessProfileResponseImp[]>([]);
  const [pagination, setPagination] = useState<PaginateResponseImp>(initialAccountPagination);
  const { getIndexes } = useFactors();
  const indexes = getIndexes();
  const [sidebar, setSidebar] = useState<SidebarImp>({
    visible: true,
    title: null,
  });
  const { calculationPeriodConditions } = useResource();

  const [selectedCostCenter, setSelectedCostCenter] = useState<string | undefined>();
  const [calculationFieldsDisabled, setCalculationFieldsDisabled] = useState(false);

  function onSelectCostCenterOptions(costCenters: CostCenterImp[]) {
    const _costCenterSelectOptions: SelectOptionImp[] = mountSelectOptions(costCenters);
    setCostCenterSelectOptions(_costCenterSelectOptions);
  }

  function onSelectCostCenter({ costCenterId }: { costCenterId: string }) {
    console.info('on_select_cost_center');

    const selectedCostCenter = costCenters?.find(costCenter => costCenter.id === costCenterId);

    if (selectedCostCenter && selectedCostCenter.profile) {
      const _calculationFieldsDisabled = selectedCostCenter.profile.canWrite ? false : true;
      setCalculationFieldsDisabled(_calculationFieldsDisabled);
    }

    const newCurrentAccount = _.cloneDeep({
      ...account,
      current: {
        ...account.current,
        costCenterId: costCenterId,
        costCenterName: selectedCostCenter?.name,
      },
    });

    setAccount(newCurrentAccount);
  }

  function mountSelectOptions<T extends OptionImp>(items: T[]) {
    const costCenterOptions: SelectOptionImp[] = items.map((item, key) => {
      const option: SelectOptionImp = {
        id: key,
        label: item.name,
        value: item.id,
      };
      return item.disp ? { ...option, disp: item.disp } : option;
    });

    return costCenterOptions;
  }

  const loadCostCenters = async () => {
    try {
      const costCentersResponse: CostCenterImp[] = await accountServices.listCostCenter();

      if (costCentersResponse.length) {
        setCostCenters(costCentersResponse);
        setSelectedCostCenter(costCentersResponse[0].id);
        onSelectCostCenterOptions(costCentersResponse);
      }
    } catch (error) {
      setCostCenters([]);
    }
  };

  const validateCalculationPeriod = (date: string, indexId?: number) => {
    const calculationPeriodAbility = calculationPeriodConditions;
    if (calculationPeriodAbility?.limitText.length) {
      const limit = calculationPeriodAbility.limitText;
      const today = moment(new Date());

      const installmentDate = moment(date, dateFormatEnum.DEFAULT);
      const limitDate = moment(limit, dateFormatEnum.DEFAULT);

      const instalDiffInDays = today.diff(installmentDate, 'd');
      const limitDiffInDays = today.diff(limitDate, 'd');

      if (instalDiffInDays > limitDiffInDays) {
        throw `Permitido somente desde ${limit}`;
      }

      const index = indexes.find(index => Number(index.id) === Number(indexId || account.current.indexId));
      const startDate = moment(index?.dateStart || new Date());
      if (index && installmentDate.isSameOrBefore(startDate)) {
        throw `Data selecionada (${installmentDate.format(
          dateFormatEnum.DEFAULT
        )}) é anterior ao índice escolhido (${startDate.format(dateFormatEnum.DEFAULT)}).`;
      }
    }
  };
  React.useEffect(() => {
    if (selectedCostCenter?.length) onSelectCostCenter({ costCenterId: selectedCostCenter });
  }, [selectedCostCenter]);

  return (
    <CoreHookContext.Provider
      value={{
        sidebar,
        results,
        profiles,
        costCenters,
        selectedCostCenter,
        costCenterSelectOptions,
        calculationFieldsDisabled,
        pagination,
        setPagination,
        setSidebar,
        setResults,
        setCostCenters,
        loadCostCenters,
        setSelectedCostCenter,
        onSelectCostCenterOptions,
        validateCalculationPeriod,
      }}>
      {Children}
    </CoreHookContext.Provider>
  );
};

export const useCore = (): CoreHookImp => {
  const socket = useContext(CoreHookContext);

  if (!socket) {
    throw new Error('useCore deve ser usado dentro de um CoreHookProvider');
  }

  return socket;
};
