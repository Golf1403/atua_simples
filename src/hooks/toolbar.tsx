import { pathEnum } from '@/enums/pathEnum';
import ToolBarImp, { VisibleButtonsImp } from '@/interfaces/ToolBarImp';
import React, { createContext, useCallback, useContext, useState } from 'react';
import useCurrentAccount from './currentAccount';
import useSimpleUpdate from './simpleUpdate';
import { useSelector } from 'react-redux';
import { ApplicationState } from '@/store';
import _ from 'lodash';
import INomenclature from '@/interfaces/NomenclatureImp';

const ToolbarHookContext = createContext<ToolBarImp | null>(null);

export const initialVisibleButtons: VisibleButtonsImp = {
  view: false,
  delete: false,
  new: false,
  open: false,
  print: false,
  save: false,
  reload: false,
  undo: false,
  calculator: false,
  export: false,
  import: false,
};

export const ToolbarHookProvider = ({ children }: { children: React.ReactElement }) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<pathEnum>();
  const [visibleButtons, setVisibleButtons] = useState<VisibleButtonsImp>(initialVisibleButtons);
  const { onCalc, onSave, account, author, feeFines } = useCurrentAccount();
  const simpleUpdate = useSimpleUpdate();
  const { ability } = useSelector((state: ApplicationState) => state.auth);

  const [currentAccount, setCurrentAccount] =
    useState<
      Omit<
        ToolBarImp,
        | 'visible'
        | 'setVisibleButtons'
        | 'visibleButtons'
        | 'setVisible'
        | 'type'
        | 'setType'
        | 'setCurrentAccount'
        | 'setNomenclatures'
      >
    >();

  const [nomenclatures, setNomenclatures] =
    useState<
      Omit<
        ToolBarImp,
        | 'visible'
        | 'setVisibleButtons'
        | 'visibleButtons'
        | 'setVisible'
        | 'type'
        | 'setType'
        | 'setCurrentAccount'
        | 'setNomenclatures'
      >
    >();

  const deleteFile = () => {};

  const newFile = () => {
    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (currentAccount?.new) currentAccount.new();
        break;
    }
  };
  const open = () => {
    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (currentAccount?.open) currentAccount.open();
        break;
    }
  };
  const print = () => {
    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (!currentAccount?.print) return;
        currentAccount.print();
        break;
    }
  };
  const reload = () => {
    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (!currentAccount?.reload) return;
        currentAccount.reload();
        break;
      case pathEnum.NOMENCLATURE:
        if (!nomenclatures?.reload) return;
        nomenclatures.reload();
        break;
    }
  };

  const save = useCallback(async () => {
    switch (type) {
      case pathEnum.SIMPLE_UPDATE: {
        await simpleUpdate.onSave({ isNewAccount: Boolean(simpleUpdate.account.current?.id?.length) });
        break;
      }
      case pathEnum.CURRENT_ACCOUNT: {
        const newCurrentAccount = await onSave({ isNewAccount: Boolean(account.current.id?.length) });
        if (newCurrentAccount.id?.length && currentAccount?.save) currentAccount.save(newCurrentAccount.id);
        break;
      }
    }
  }, [account, author, currentAccount, feeFines, onSave, simpleUpdate, type]);

  const undo = () => {
    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (!currentAccount?.undo) return;
        currentAccount.undo();
        break;
    }
  };

  const calculator = async (nomenclatures: INomenclature[]) => {
    switch (type) {
      case pathEnum.SIMPLE_UPDATE:
        await simpleUpdate.onCalc({ origin: 'calc', nomenclatures });
        break;
      case pathEnum.CURRENT_ACCOUNT:
        await onCalc({ origin: 'calc', nomenclatures });
        break;
    }
  };

  const view = async (nomenclatures: INomenclature[]) => {
    switch (type) {
      case pathEnum.SIMPLE_UPDATE:
        await simpleUpdate.onCalc({ origin: 'view', nomenclatures });
        break;
      case pathEnum.CURRENT_ACCOUNT:
        await onCalc({ origin: 'view', nomenclatures });
        break;
    }
  };

  const importCalc = () => {
    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (!currentAccount?.importCalc) return;
        currentAccount.importCalc();
        break;
    }
  };

  const exportCalc = () => {
    const name = account.current.name;
    const newName = name.includes('(Importado)') ? name : `(Importado) ${name}`;

    const newAccount = {
      ...account.current,
      name: newName,
    };

    const payload = {
      account: newAccount,
      authors: author.list,
      feeFines,
      from: 'SEI',
      rules: _.cloneDeep(ability.rules),
    };

    switch (type) {
      case pathEnum.CURRENT_ACCOUNT:
      case pathEnum.SIMPLE_UPDATE:
        if (!currentAccount?.exportCalc) return;
        currentAccount.exportCalc(payload);
        break;
    }
  };

  return (
    <ToolbarHookContext.Provider
      value={{
        visible,
        type,
        importCalc,
        exportCalc,
        setCurrentAccount,
        setNomenclatures,
        setType,
        setVisible,
        delete: deleteFile,
        new: newFile,
        open,
        print,
        visibleButtons,
        setVisibleButtons,
        reload,
        save,
        undo,
        calculator,
        view,
      }}>
      {children}
    </ToolbarHookContext.Provider>
  );
};

export const useToolbar = (): ToolBarImp => {
  const toolbar = useContext(ToolbarHookContext);

  if (!toolbar) {
    throw new Error('useToolbar deve ser usado dentro de um ToolbarHookProvider');
  }

  return toolbar;
};
