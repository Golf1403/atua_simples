import React, { createContext, useContext, useEffect } from 'react';
import NomenclatureImp from '@interfaces/NomenclatureImp';
import { NomenclatureActionTypes, NomenclatureState } from '@/store/nomenclature/types';
import { ApplicationState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { getFieldName } from '@/lib/nomenclature';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import { alertMessages } from '@/hooks/alertMessages';
import feeTypesOptions from '@/data/calculations/feeTypesOptions';
import AccountServices from '@/services/AccountServices';
import { useCore } from './core';
import { tableDataInitial } from '@/pages/admin/Nomenclature/Table';
import { DataTableCellImp } from '@/interfaces/DataTableImp';

interface NomenclaturesHookImp {
  nomenclatures: NomenclatureImp[];
  updateNomenclatures: (payload: { costCenterId: string }) => Promise<void>;
  getNomenclature: (costCenterId: string) => Promise<NomenclatureImp[]>;
  tableData: DataTableCellImp[];
  setTableData: React.Dispatch<React.SetStateAction<DataTableCellImp[]>>;
}

const NomenclaturesHookContext = createContext<NomenclaturesHookImp | null>(null);

export const NomenclaturesHookProvider = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = React.useState(tableDataInitial);

  const { selectedCostCenter } = useCore();
  const alertMessage = alertMessages();
  const accountServices = new AccountServices();

  const { nomenclaturesHasCostCenter, nomenclatures }: NomenclatureState = useSelector(
    (state: ApplicationState) => state.nomenclature
  );

  const getNomenclature = async (costCenterId: string) => {
    try {
      const nomenclatures: NomenclatureImp[] = await accountServices.listNomenclatures(costCenterId);

      dispatch({
        type: NomenclatureActionTypes.SET_NOMENCLATURES_WITH_COST_CENTER,
        payload: { nomenclatures, costCenterId },
      });

      return nomenclatures;
    } catch (error) {
      alertMessage.error('Houve um erro Nomenclature!');
      throw error;
    }
  };

  const updateNomenclatures = async (payload: { costCenterId: string }) => {
    try {
      const { costCenterId } = payload;

      let nomenclatures: NomenclatureImp[] | undefined = [];

      const [nomenclaturesFiltered] = nomenclaturesHasCostCenter.filter(
        nomenclature => nomenclature.costCenterId === costCenterId
      );

      if (nomenclaturesFiltered?.nomenclatures.length > 0) nomenclatures = nomenclaturesFiltered.nomenclatures;
      else {
        nomenclatures = await getNomenclature(costCenterId);
        if (!nomenclatures) return;
        nomenclatures = nomenclatures.sort((a, b) => (b.default_value > a.default_value ? -1 : 1));
      }

      const newFeeOptions = feeTypesOptions.map(feeType => {
        const name = getFieldName(feeType.label, nomenclatures || []);

        const option: SelectOptionImp = {
          id: feeType.id,
          value: feeType.id,
          label: name || feeType.label,
        };

        return option;
      });

      dispatch({ type: NomenclatureActionTypes.SET_FEES_NOMENCLATURES, payload: newFeeOptions });
      dispatch({ type: NomenclatureActionTypes.SET_NOMENCLATURES, payload: nomenclatures });
    } catch (error) {
      alertMessage.error('Houve um erro Nomenclature!');
    }
  };

  useEffect(() => {
    if (selectedCostCenter) updateNomenclatures({ costCenterId: selectedCostCenter });
  }, [selectedCostCenter]);

  return (
    <NomenclaturesHookContext.Provider
      value={{ updateNomenclatures, getNomenclature, nomenclatures, setTableData, tableData }}>
      {children}
    </NomenclaturesHookContext.Provider>
  );
};

export const useNomenclatures = (): NomenclaturesHookImp => {
  const nomenclature = useContext(NomenclaturesHookContext);

  if (!nomenclature) {
    throw new Error('useNomenclatures deve ser usado dentro de um NomenclaturesHookProvider');
  }

  return nomenclature;
};
