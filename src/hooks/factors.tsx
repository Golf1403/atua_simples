import React, { createContext, useContext, useState } from 'react';
import { alertMessages } from '@/hooks/alertMessages';
import MemCalcImp from '@/interfaces/MemCalcImp';
import { IndexResponseImp } from '@/interfaces/serviceResponses/IndexResponseImp';
import AccountServices from '@/services/AccountServices';
import { useLoading } from './loading';
import { mapIndexList } from '@/lib/utils';
import IndexFlags from '@/enums/IndexFlags';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import { AWSS3 } from '@/services/S3';
import { useAuth } from './auth';
import LawImp from '@/interfaces/Law';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';

interface FactorsHookImp {
  getIndexes: () => IndexResponseImp[];
  loadIndexes: Function;
  indexesOptions: SelectOptionImp[];
  allMemcalcs: {
    [key: number]: MemCalcImp[];
  };
  memcalcs: MemCalcImp[];
  setMemcalcs: React.Dispatch<React.SetStateAction<MemCalcImp[]>>;
  interestIndexesFromLaw: LawImp[];
  setInterestIndexesFromLaw: React.Dispatch<React.SetStateAction<LawImp[]>>;
  interestIndexes: InterestIndexesImp;
  setInterestIndexes: React.Dispatch<React.SetStateAction<InterestIndexesImp>>;
}

const FactorsHookContext = createContext<FactorsHookImp | null>(null);

export const FactorsHookProvider = ({ children }: { children: React.ReactElement }) => {
  const { closeLoading, openLoading } = useLoading();

  const alertMessage = alertMessages();
  const accountServices = new AccountServices();
  const [allMemcalcs, setallMemcalcs] = useState<{ [key: number]: MemCalcImp[] }>([]);
  const [memcalcs, setMemcalcs] = useState<MemCalcImp[]>([]);
  const [interestIndexesFromLaw, setInterestIndexesFromLaw] = useState<LawImp[]>([]);
  const [interestIndexes, setInterestIndexes] = useState<InterestIndexesImp>({
    newSavings: [],
    newSavingsDaily: [],
    savings: [],
    selic: [],
    tr: [],
  });

  const { isAuth } = useAuth();

  const [indexes, setIndexes] = useState<IndexResponseImp[]>([]);
  const [indexesOptions, setIndexesOptions] = useState<SelectOptionImp[]>([]);

  const getIndexes = () => {
    return indexes;
  };

  const onloadIndex = (indexes: IndexResponseImp[]) => {
    console.info('on_change_index');

    const withoutCorrectionIndexOption = {
      id: '-1',
      label: 'Sem correção',
      value: '-1',
    };

    const mappedIndexList = mapIndexList(indexes, IndexFlags.CORRECAO_PELO_SISTEMA);
    const selectList: SelectOptionImp[] = mappedIndexList.map(calcIndex => {
      const calcIndexOpton: SelectOptionImp = {
        id: Number(calcIndex.id),
        label: calcIndex.name,
        value: Number(calcIndex.id),
        disp: calcIndex.disp,
      };
      return calcIndexOpton;
    });

    selectList.unshift(withoutCorrectionIndexOption);
    setIndexesOptions(selectList);
  };

  const loadIndexes = async () => {
    try {
      openLoading();
      const indexesResponse: IndexResponseImp[] = await accountServices.listIndexes();

      setIndexes(indexesResponse);
      onloadIndex(indexesResponse);
    } catch (error) {
      closeLoading();
      alertMessage.error('Erro ao carregar o índice');
    } finally {
      closeLoading();
    }
  };

  const getallMemcalcs = async () => {
    let key = '';
    const loadLocalMemcalcs = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL || ''}/memcalcs.json`);
      if (!response.ok) throw new Error('local memcalcs not found');

      const jsonData = await response.json();
      setallMemcalcs(jsonData);
    };

    try {
      key = `memcalcs.json`;

      const configuration = await new AWSS3().getValue(key);
      const BodyS3: any | undefined = configuration.Body;
      if (BodyS3) {
        const buffer = Buffer.from(BodyS3);
        const blob = new Blob([buffer], { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = function (event) {
          if (event?.target?.result) {
            const jsonData = JSON.parse(event.target.result as any);
            setallMemcalcs(jsonData);
          }
        };
        reader.readAsText(blob);
      }
    } catch (error) {
      console.log(error);
      try {
        await loadLocalMemcalcs();
      } catch (localError) {
        console.log(localError);
      }
    }
  };

  React.useEffect(() => {
    if (!isAuth) return;
    getallMemcalcs();
  }, [isAuth]);

  return (
    <FactorsHookContext.Provider
      value={{
        interestIndexes,
        setInterestIndexes,
        interestIndexesFromLaw,
        setInterestIndexesFromLaw,
        memcalcs,
        setMemcalcs,
        indexesOptions,
        getIndexes,
        loadIndexes,
        allMemcalcs,
      }}>
      {children}
    </FactorsHookContext.Provider>
  );
};

export const useFactors = (): FactorsHookImp => {
  const socket = useContext(FactorsHookContext);

  if (!socket) {
    throw new Error('useFactors deve ser usado dentro de um FactorsHookProvider');
  }

  return socket;
};
