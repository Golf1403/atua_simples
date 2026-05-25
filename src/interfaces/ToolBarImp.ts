import { pathEnum } from '@/enums/pathEnum';
import INomenclature from './NomenclatureImp';

export interface VisibleButtonsImp {
  open: boolean;
  new: boolean;
  save: boolean;
  undo: boolean;
  reload: boolean;
  calculator: boolean;
  view: boolean;
  print: boolean;
  delete: boolean;
  export: boolean;
  import: boolean;
}

export default interface ToolBarImp extends ToolBarReloadImp {
  type?: pathEnum;
  setType: React.Dispatch<React.SetStateAction<pathEnum | undefined>>;
  setCurrentAccount: React.Dispatch<
    React.SetStateAction<
      | Omit<
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
      | undefined
    >
  >;
  setNomenclatures: React.Dispatch<
    React.SetStateAction<
      | Omit<
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
      | undefined
    >
  >;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  new?: Function;
  open?: Function;
  save?: Function;
  calculator?: (nomenclatures: INomenclature[]) => void;
  view?: (nomenclatures: INomenclature[]) => void;
  delete?: Function;
  print?: Function;
  visibleButtons: VisibleButtonsImp;
  setVisibleButtons: React.Dispatch<React.SetStateAction<VisibleButtonsImp>>;
  importCalc?: Function;
  exportCalc?: Function;
}

export interface ToolBarReloadImp {
  reload?: Function;
  undo?: Function;
}
