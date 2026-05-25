import React, { createContext, useCallback, useContext } from 'react';
import { alertMessages } from '@/hooks/alertMessages';
import AccountServices, { ListAccountsByTypeIdImp } from '@/services/AccountServices';
import CalculationsResponseImp from '@/interfaces/serviceResponses/CalculationsResponseImp';
import {
  CurrentAccountImp,
  CurrentAuthorTypes,
  InfoCurrentAccountImp,
  InterestFineTypes,
  LayoutImp,
  OccurrenceTypes,
  selectInterestFine,
  selectOccurrenceTypes,
  typeFeeArt,
  typeFineArt,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import IDummyObject from '@/interfaces/IDummyObject';
import Dictionary from '@/services/DictionaryServices';
import AccountImp from '@/interfaces/AccountImp';
import { IndexEnum } from '@/enums/IndexEnum';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { IndexResponseImp } from '@/interfaces/serviceResponses/IndexResponseImp';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import OccurrenceService from '@/services/CalculationsServices/CurrentAccountService/OccurrenceService';
import InterestsFineService from '@/services/CalculationsServices/CurrentAccountService/InterestsFineService';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import { getCoin } from '@/utils/numberUtils';
import { CurrentAccoutImp } from '@/interfaces/SimpleAccountImp';
import AuthorService from '@/services/CalculationsServices/CurrentAccountService/AuthorService';
import CurrentOccurrenceImp, { CurrentExpenseImp } from '@/interfaces/calculations/CurrentOccurrenceImp';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import {
  CurrentFormRowImp,
  CurrentFormRow2Imp,
  CurrentFormRow3Imp,
  CurrentFormRow4Imp,
  CurrentTypes,
} from '@/data/calculations/currentTypes';
import { messagesEnum } from '@/enums/messagesEnum';
import ExpenseService from '@/services/CalculationsServices/CurrentAccountService/ExpenseService';
import { useResource } from './resourses';
import { indexNegative } from '@/data/generalData/indexNegativeRadioOptions';
import { useFactors } from './factors';
import CurrentFeeFineImp from '@/interfaces/calculations/CurrentFeeFineImp';
import _ from 'lodash';
import FeeFineService from '@/services/CalculationsServices/CurrentAccountService/FeeFineService';
import INomenclature from '@/interfaces/NomenclatureImp';
import MemCalcImp from '@/interfaces/MemCalcImp';
import { SummaryImp } from '@/interfaces/calculations/ViewOccorrenceImp';
const url = require('url');

interface CurrentAccountHookImp {
  author: CurrentAuthorTypes;
  account: CurrentAccountImp;
  summary: SummaryImp[];
  feeFines: FeeFinesImp;
  setHelp: React.Dispatch<
    React.SetStateAction<
      | {
          [key: string]: {
            link: string | undefined;
            text: string | undefined;
            minWidth: string;
          };
        }
      | undefined
    >
  >;
  help?: {
    [key: string]: {
      link: string | undefined;
      text: string | undefined;
      minWidth: string;
    };
  };
  layout: LayoutImp;
  reset: boolean;
  onRemoveExpense: (payload: { expenseIndex: number }) => void;
  onDuplicateExpense: (payload: { expenseIndex: number }) => void;
  toggleUpdateToModal: (payload: boolean) => void;
  toggleInstallmentDateModal: (payload: boolean) => void;
  setExpense: ({ expense, expenseIndex }: { expense: CurrentExpenseImp; expenseIndex: number }) => void;
  updateToModal: boolean;
  installmentDateModal: boolean;
  installmentDate: string;
  updateTo: string;
  lastUpdateTo: string;
  authorIndex: number;
  lastInstallmentDate: string;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  setLastUpdateTo: React.Dispatch<React.SetStateAction<string>>;
  setFeeFines: React.Dispatch<React.SetStateAction<FeeFinesImp>>;
  setInstallmentDate: React.Dispatch<React.SetStateAction<string>>;
  setUpdateTo: React.Dispatch<React.SetStateAction<string>>;
  setAuthorIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectInterestFineVisible(payload: boolean): void;
  setInterestFine({
    interestFine,
    interestFineIndex,
  }: {
    interestFine: CurrentInterestFineImp;
    interestFineIndex: number;
  }): void;
  setLastInstallmentDate: React.Dispatch<React.SetStateAction<string>>;
  setOccurrence({ occurrence, occurrenceIndex }: { occurrence: CurrentOccurrenceImp; occurrenceIndex: number }): void;
  setLayout: React.Dispatch<React.SetStateAction<LayoutImp>>;
  setAccount: React.Dispatch<React.SetStateAction<CurrentAccountImp>>;
  setAuthor: React.Dispatch<React.SetStateAction<CurrentAuthorTypes>>;
  setCurrentAccount: (
    payload: CurrentFormRowImp | CurrentFormRow2Imp | CurrentFormRow3Imp | CurrentFormRow4Imp
  ) => void;
  listAccountsByTypeId: (payload: {
    page: number;
    paginate: PaginateResponseImp;
    search: string;
  }) => Promise<CalculationsResponseImp>;
  onRegisterOccurrence: (params: { type: OccurrenceTypes; newestOccurrence: boolean; isStart?: boolean }) => void;
  onDuplicateOccurrence: (payload: { occurrenceIndex: number }) => void;
  newAccount: () => void;
  onRemoveOccurrence: (payload: { occurrenceIndex: number }) => void;
  onRegisterInterestOrFine: ({ type }: { type: InterestFineTypes }) => void;
  onRegisterExpense: () => void;
  onDuplicateInterestFine: ({ interestFineIndex }: { interestFineIndex: number }) => void;
  onRemoveInterestFine: ({
    interestFineIndex,
    authorIndex,
  }: {
    interestFineIndex: number;
    authorIndex: number;
  }) => void;
  onCalc: (values: {
    changeInstallmentDate?: boolean;
    origin: 'view' | 'calc';
    changeUpdateTo?: boolean;
    memcalcs?: MemCalcImp[];
    nomenclatures: INomenclature[];
  }) => Promise<void>;
  onSave: ({ isNewAccount }: { isNewAccount: boolean }) => Promise<AccountImp>;
  onOrderOccurrence: (payload: { startIndex: number; endIndex: number }) => void;
  onOrderInterestFine: (payload: { startIndex: number; endIndex: number }) => void;
  onOrderFeeFine: (payload: { startIndex: number; endIndex: number }) => void;
  onDuplicateAuthor: (payload: { authorIndex: number }) => void;
  onCreateAuthor: (payload: { authorName: string }) => void;
  onRemoveAuthor: (payload: { authorIndex: number }) => void;
  onOrderInterestFineToUpdate: () => void;
  onOrderFeeFineToUpdate: () => void;
  setSelectOccurrenceVisible: (payload: boolean) => void;
}

export const initialFeeFines = { list: [], total: 0 };

export const typeArt354 = {
  id: 'art354' as CurrentTypes,
  value: 'art354' as CurrentTypes,
  label: 'Art. 354',
};

export const initialCurrentAuthor: CurrentAuthorImp = {
  name: '',
  occurrenceTotal: 0,
  expenseTotal: 0,
  smallerDate: moment(new Date()).format(dateFormatEnum.DEFAULT),
  occurrences: [],
  interestFines: [],
  expenses: [],
  view: [],
};

const dictionary = new Dictionary('pt-br');

export const authorRow = {
  authorIndex: 0,
  currency: 'R$',
};

export const initialLayout: LayoutImp = {
  accountForm: {
    toolbar: {
      loading: {
        reload: false,
        save: false,
      },
    },
  },
  viewModal: {
    views: [],
    visible: false,
  },
  selectOccurrence: {
    buttons: selectOccurrenceTypes,
    visible: false,
    newestOccurrence: false,
    authorIndex: authorRow.authorIndex,
  },
  selectInterestFine: {
    buttons: selectInterestFine,
    visible: false,
    authorIndex: authorRow.authorIndex,
  },
  modalAddAuthor: {
    visible: false,
  },
  modalEditAuthor: {
    visible: false,
  },
  footerButton: {
    isCalculated: false,
    isLoading: false,
  },
  authorRow,
};

export const pagination: PaginateResponseImp = {
  current: 1,
  pages: 1,
  order: 'asc',
  orderBy: 'costCenterId',
  total: 1,
};

export const initialAuthor: CurrentAuthorTypes = {
  list: [],
  pagination,
};

export const initialAccountValue: AccountImp = {
  accountTypeId: 1,
  costCenterId: '',
  name: 'Nome do cálculo',
  deflation: indexNegative.id,
  indexId: IndexEnum.CDI_INDEX,
  observation: '',
  proRataDay: false,
  proRataOtn: false,
  onePercentSelic: false,
  recordId: '',
  courtId: '',
  defendantId: '',
  positive: false,
  updateTo: moment(new Date()).utc().format(dateFormatEnum.DEFAULT),
};

export const infos: InfoCurrentAccountImp = {
  positive: {
    list: [],
    current: false,
  },
  index: {
    current: null as null | IndexResponseImp,
    list: [] as SelectOptionImp[],
  },
  loading: false,
  message: '',
  visible: true,
  type: typeArt354.id,
};

export const initialAccount = {
  list: [],
  current: { ...initialAccountValue, accountTypeId: 3 },
  pagination,
  infos,
};

export const initialFeeArt: CurrentFeeFineImp = {
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  dateStart: '01/01/1999',
  description: '',
  tax: 0,
  type: typeFeeArt.id,
  afterTotal: false,
  value: 0,
};
export const initialFineArt: CurrentFeeFineImp = {
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  description: '',
  tax: 0,
  type: typeFineArt.id,
  afterTotal: false,
  value: 0,
};

export type FeeFinesImp = { list: CurrentFeeFineImp[]; total: number };

const CurrentAccountHookContext = createContext<CurrentAccountHookImp | null>(null);

export const CurrentAccountHookProvider = ({ children }: { children: React.ReactElement }) => {
  const alertMessage = alertMessages();
  const { authorsConditions } = useResource();
  const { allMemcalcs, memcalcs: memCalcs, interestIndexesFromLaw, interestIndexes } = useFactors();

  const authorService = new AuthorService();
  const accountServices = new AccountServices();
  const occurrenceService = new OccurrenceService();
  const expenseService = new ExpenseService();
  const interestFineService = new InterestsFineService();
  const feeFineService = new FeeFineService();

  const [reset, setReset] = React.useState(false);
  const [author, setAuthor] = React.useState<CurrentAuthorTypes>(initialAuthor);
  const [summary, setSummary] = React.useState<SummaryImp[]>([]);
  const [feeFines, setFeeFines] = React.useState<FeeFinesImp>(initialFeeFines);
  const [layout, setLayout] = React.useState<LayoutImp>(initialLayout);
  const [account, setAccount] = React.useState<CurrentAccountImp>(initialAccount);
  const [authorIndex, setAuthorIndex] = React.useState(0);
  const [installmentDate, setInstallmentDate] = React.useState('');
  const [updateTo, setUpdateTo] = React.useState('');
  const [lastInstallmentDate, setLastInstallmentDate] = React.useState('');
  const [lastUpdateTo, setLastUpdateTo] = React.useState('');
  const [updateToModal, setUpdateToModal] = React.useState(false);
  const [installmentDateModal, setInstallmentDateModal] = React.useState(false);
  const [help, setHelp] = React.useState<{
    [key: string]: {
      link: string | undefined;
      text: string | undefined;
      minWidth: string;
    };
  }>();

  const toggleUpdateToModal = (payload: boolean) => {
    setUpdateToModal(payload);
  };

  const toggleInstallmentDateModal = (payload: boolean) => {
    setInstallmentDateModal(payload);
  };

  const setCurrentAccount = (
    payload: CurrentFormRowImp | CurrentFormRow2Imp | CurrentFormRow3Imp | CurrentFormRow4Imp
  ) => {
    console.info('set_current_account');
    try {
      const current: AccountImp = { ...account.current, ...payload };
      const newAccount: CurrentAccountImp = { ...account, current };
      setAccount(newAccount);
    } catch (error) {
      setAccount(account);
    }
  };
  const listAccountsByTypeId = useCallback(
    async (payload: { page: number; paginate: PaginateResponseImp; search: string }) => {
      try {
        console.info('list_accounts');
        alertMessage.warning(messagesEnum.LOADING);

        const { page, paginate, search } = payload;
        const typeId = 3;

        let params: ListAccountsByTypeIdImp = {} as ListAccountsByTypeIdImp;
        if (paginate) {
          const orderBy =
            paginate.orderBy === 'costCenterName' ? 'costCenterId' : paginate.orderBy || account.pagination.orderBy;
          const order = paginate.order || account.pagination.order || 'asc';
          params = {
            accountTypeId: typeId,
            page,
            orderBy,
            order,
            search,
          };
        } else {
          const orderBy = account.pagination.orderBy || 'costCenterId';
          const order = account.pagination.order || 'asc';
          params = {
            accountTypeId: typeId,
            orderBy,
            order,
            page,
            search,
          };
        }

        const response: CalculationsResponseImp = await accountServices.listAccountsByTypeId(params);

        setAccount(account => ({
          ...account,
          list: response.results as any,
          pagination: { ...response.pagination, current: Number(response.pagination.current) },
        }));

        alertMessage.success(messagesEnum.LOADING_SUCCESS);
        return response;
      } catch (error) {
        alertMessage.error('Houve um erro ao carregar as contas!');
      }
      throw 'Houve um erro ao carregar as contas!';
    },
    [setAccount, alertMessage]
  );
  const onRegisterOccurrence = (params: { type: OccurrenceTypes; newestOccurrence: boolean; isStart?: boolean }) => {
    const { type, newestOccurrence, isStart } = params;

    const newAuthorList = occurrenceService.create({
      authorIndex: layout.authorRow.authorIndex,
      authorList: author.list,
      updateTo: account.current.updateTo,
      type,
      newestOccurrence,
      isStart,
    });

    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: newAuthorList,
    };
    setAuthor(newAuthor);
    setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
  };

  const newAccount = useCallback(async () => {
    setAccount(account => ({
      ...initialAccount,
      list: account.list,
      current: { ...initialAccountValue, accountTypeId: 3 },
    }));
    setFeeFines({ list: [], total: 0 });
    setAuthor(initialAuthor);
  }, [setAccount, setAuthor, account]);

  const onDuplicateOccurrence = (payload: { occurrenceIndex: number }) => {
    const { occurrenceIndex } = payload;

    const authorList = occurrenceService.duplicate({
      authorList: author.list,
      authorIndex: layout.authorRow.authorIndex,
      occurrenceIndex,
    });

    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: authorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
  };
  const onRemoveOccurrence = (payload: { occurrenceIndex: number }) => {
    const { occurrenceIndex } = payload;
    const authorIndex = layout.authorRow.authorIndex;

    const newAuthorList = occurrenceService.delete({
      authorIndex,
      authorList: author.list,
      occurrenceIndex,
    });

    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: newAuthorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({
      ...layout,
      footerButton: { ...initialLayout.footerButton, isCalculated: false },
    }));
  };
  const setExpense = ({ expense, expenseIndex }: { expense: CurrentExpenseImp; expenseIndex: number }) => {
    try {
      const currentAuthor = author.list[layout.authorRow.authorIndex];
      currentAuthor.expenses[expenseIndex] = expense;
      if (moment(expense.date, dateFormatEnum.DEFAULT).isBefore(currentAuthor.smallerDate))
        currentAuthor.smallerDate = expense.date || undefined;
      setAuthor(author);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      console.error(error);
    }
  };
  const onDuplicateExpense = (payload: { expenseIndex: number }) => {
    const { expenseIndex } = payload;

    const authorList = expenseService.duplicate({
      authorList: author.list,
      authorIndex: layout.authorRow.authorIndex,
      expenseIndex,
    });

    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: authorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
  };
  const onRemoveExpense = (payload: { expenseIndex: number }) => {
    const { expenseIndex } = payload;
    const authorIndex = layout.authorRow.authorIndex;

    const newAuthorList = expenseService.delete({
      authorIndex,
      authorList: author.list,
      expenseIndex,
    });

    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: newAuthorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({
      ...layout,
      footerButton: { ...initialLayout.footerButton, isCalculated: false },
    }));
  };
  const onRegisterExpense = () => {
    const newAuthorList = expenseService.create({
      authorIndex: layout.authorRow.authorIndex,
      authorList: author.list,
      updateTo: account.current.updateTo,
    });

    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: newAuthorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
  };

  const onRegisterInterestOrFine = ({ type }: { type: InterestFineTypes }) => {
    try {
      const authorList = interestFineService.create({
        authorList: author.list,
        authorIndex: layout.authorRow.authorIndex,
        type,
        updateTo: account.current.updateTo,
      });

      const newAuthor: CurrentAuthorTypes = {
        ...author,
        list: authorList,
      };

      setAuthor(newAuthor);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      alertMessage.error(interestFineService.translateErrorType(interestFineService.errorType(error)));
    }
  };
  const onDuplicateInterestFine = ({ interestFineIndex }: IDummyObject) => {
    const newAuthorList = interestFineService.duplicate({
      authorIndex: layout.authorRow.authorIndex,
      authorList: author.list,
      interestFineIndex,
    });
    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: newAuthorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
  };
  const onRemoveInterestFine = ({ interestFineIndex, authorIndex }: IDummyObject) => {
    const newAuthorList = interestFineService.delete({
      authorIndex,
      authorList: author.list,
      interestFineIndex,
    });
    const newAuthor: CurrentAuthorTypes = {
      ...author,
      list: newAuthorList,
    };

    setAuthor(newAuthor);
    setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
  };
  const onOrderOccurrence = (payload: { startIndex: number; endIndex: number }) => {
    const { startIndex, endIndex } = payload;
    try {
      const currentAuthor = occurrenceService.orderByDate({
        author,
        authorIndex: layout.authorRow.authorIndex,
        endIndex,
        startIndex,
      });
      setAuthor(currentAuthor);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      alertMessage.error();
    }
  };
  const onOrderInterestFine = (payload: { startIndex: number; endIndex: number }) => {
    const { startIndex, endIndex } = payload;
    try {
      const currentAuthor = interestFineService.orderByDate({
        author,
        authorIndex: layout.authorRow.authorIndex,
        endIndex,
        startIndex,
      });

      setAuthor(currentAuthor);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      alertMessage.error();
    }
  };
  const onOrderFeeFine = (payload: { startIndex: number; endIndex: number }) => {
    const { startIndex, endIndex } = payload;
    try {
      const currentFeeFines = feeFineService.reorderByDate({
        feeFines,
        endIndex,
        startIndex,
      });
      setFeeFines(currentFeeFines);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isLoading: false } }));
    } catch (error) {
      alertMessage.error();
    }
  };
  const onOrderInterestFineToUpdate = () => {
    try {
      const newAuthor = interestFineService.orderAuthors(author);
      setAuthor(newAuthor);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      alertMessage.error();
    }
  };
  const onOrderFeeFineToUpdate = () => {
    try {
      const newFeeFines = feeFineService.orderByOption({ feeFines: feeFines.list });
      setFeeFines(feeFines => ({ ...feeFines, list: newFeeFines }));
    } catch (error) {
      alertMessage.error();
    }
  };
  const onDuplicateAuthor = ({ authorIndex }: { authorIndex: number }) => {
    try {
      const newAuthor = authorService.duplicate({ author, authorIndex, authorsConditions });
      setAuthor(newAuthor);
      setLayout(layout => ({
        ...layout,
        footerButton: { ...layout.footerButton, isCalculated: false },
      }));
    } catch (error) {
      alertMessage.error();
    }
  };

  const onCreateAuthor = ({ authorName }: { authorName: string }) => {
    try {
      const newAuthor = authorService.create({ author, authorName, authorsConditions });
      setAuthor(newAuthor);
      setLayout(layout => ({
        ...layout,
        modalAddAuthor: { ...layout.modalAddAuthor, visible: false },
        footerButton: { ...layout.footerButton, isCalculated: false },
        authorRow: {
          ...layout.authorRow,
          authorIndex: newAuthor.list.length - 1,
        },
      }));
    } catch (error) {
      alertMessage.error();
    }
  };

  const onRemoveAuthor = ({ authorIndex }: { authorIndex: number }) => {
    try {
      const newAuthor = authorService.remove({ authorIndex, author });
      setAuthor(newAuthor);
      setLayout(layout => ({
        ...layout,
        footerButton: { ...layout.footerButton, isCalculated: false },
        authorRow: {
          ...layout.authorRow,
          authorIndex: authorRow.authorIndex,
        },
      }));
    } catch (error) {
      alertMessage.error();
    }
  };

  const setSelectOccurrenceVisible = (payload: boolean) => {
    try {
      setLayout(layout => ({
        ...layout,
        modalAddAuthor: { ...layout.modalAddAuthor, visible: false },
        modalEditAuthor: { ...layout.modalAddAuthor, visible: false },
        selectInterestFine: { ...layout.selectInterestFine, visible: false },
        selectOccurrence: { ...layout.selectOccurrence, visible: payload },
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const setOccurrence = ({
    occurrence,
    occurrenceIndex,
  }: {
    occurrence: CurrentOccurrenceImp;
    occurrenceIndex: number;
  }) => {
    try {
      const currentAuthor = author.list[layout.authorRow.authorIndex];
      currentAuthor.occurrences[occurrenceIndex] = occurrence;
      if (moment(occurrence.date, dateFormatEnum.DEFAULT).isBefore(currentAuthor.smallerDate))
        currentAuthor.smallerDate = occurrence.date || undefined;
      setAuthor(author);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      console.error(error);
    }
  };

  const setSelectInterestFineVisible = (payload: boolean) => {
    try {
      setLayout(layout => ({
        ...layout,
        footerButton: { ...initialLayout.footerButton, isCalculated: false },
        selectOccurrence: { ...layout.selectOccurrence, visible: false },
        selectInterestFine: { ...layout.selectInterestFine, visible: payload },
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const setInterestFine = ({
    interestFine,
    interestFineIndex,
  }: {
    interestFine: CurrentInterestFineImp;
    interestFineIndex: number;
  }) => {
    try {
      author.list[layout.authorRow.authorIndex].interestFines[interestFineIndex] = interestFine;
      setAuthor(author);
      setLayout(layout => ({ ...layout, footerButton: { ...initialLayout.footerButton, isCalculated: false } }));
    } catch (error) {
      console.error(error);
    }
  };

  const onCalc = async ({
    origin,
    changeUpdateTo,
    changeInstallmentDate,
    nomenclatures,
    memcalcs,
  }: {
    changeInstallmentDate?: boolean;
    changeUpdateTo?: boolean;
    origin: 'view' | 'calc';
    memcalcs?: MemCalcImp[];
    nomenclatures: INomenclature[];
  }) => {
    console.info('on_calc');
    const worker = new Worker(
      new URL('../workersweb/RecalculateAccountWorker', 'file:///sei-spa/src/hooks/currentAccount.tsx')
    );
    setLayout({ ...layout, footerButton: { ...layout.footerButton, isLoading: true } });
    worker.postMessage({
      type: 'recalculate',
      data: {
        author,
        account,
        changeUpdateTo,
        lastUpdateTo,
        updateTo,
        feeFines,
        allMemcalcs,
        changeInstallmentDate,
        lastInstallmentDate,
        occurrenceDate: installmentDate,
        authorIndex,
        memCalcs: memcalcs || memCalcs,
        type: origin,
        interestIndexesFromLaw,
        interestIndexes,
        nomenclatures,
      },
    });
    worker.addEventListener('message', async function (event) {
      try {
        const message = event.data;
        if (message.type == 'error') return alertMessage.error(message?.data || 'Houve um erro');
        if (message.type !== 'recalculated') throw 'Houve um erro!';
        const { authorList: newAuthorList, views, feeFineList, summary } = message.data;

        const currency = getCoin(account.current.updateTo, 0);
        const layoutPayload: LayoutImp = {
          ...layout,
          viewModal: {
            visible: false,
            views,
          },
          authorRow: {
            ...layout.authorRow,
            currency,
          },
          footerButton: {
            isLoading: false,
            isCalculated: true,
          },
        };

        const newAuthor: CurrentAuthorTypes = {
          ...author,
          list: newAuthorList,
        };

        setFeeFines(feeFines => ({ ...feeFines, list: feeFineList }));
        setSummary(summary);
        setAuthor(newAuthor);

        switch (origin) {
          case 'view':
            layoutPayload.viewModal.visible = true;
            setLayout(layoutPayload);
            break;
          default:
            setLayout(layoutPayload);
            break;
        }
      } catch (error) {
        const translatedError = dictionary.translate(error);
        alertMessage.error(translatedError);
      }
    });
  };

  const onSave = useCallback(
    async ({ isNewAccount }: { isNewAccount: boolean }) => {
      console.info('on_save');
      try {
        alertMessage.warning(messagesEnum.ACCOUNT_SAVE);
        setLayout(layout => ({
          ...layout,
          footerButton: { ...layout.footerButton, isLoading: true },
          accountForm: {
            toolbar: { ...layout.accountForm.toolbar, loading: { ...layout.accountForm.toolbar.loading, save: true } },
          },
        }));
        const params: CurrentAccoutImp = {
          account: {
            ...account.current,
            accountTypeId: 3,
          },
          feeFines,
          authors: author.list,
          type: account.infos.type,
        };
        const accountSaved: AccountImp = await accountServices.saveAccount(params);

        if (!isNewAccount)
          setAccount(account => ({
            ...account,
            current: { ...account.current, id: account.current.id?.length ? account.current.id : accountSaved.id },
            infos: { ...account.infos, loading: false },
          }));

        setLayout(layout => ({
          ...layout,
          footerButton: { ...layout.footerButton, isLoading: false },
          accountForm: {
            toolbar: { ...layout.accountForm.toolbar, loading: { ...layout.accountForm.toolbar.loading, save: false } },
          },
        }));
        alertMessage.success(messagesEnum.ACCOUNT_SAVE_SUCESS);

        return accountSaved;
      } catch (error) {
        alertMessage.error(error.msg || messagesEnum.ACCOUNT_SAVE_ERROR);
        setLayout(layout => ({
          ...layout,
          footerButton: { ...layout.footerButton, isCalculated: false, isLoading: false },
          accountForm: {
            toolbar: { ...layout.accountForm.toolbar, loading: { ...layout.accountForm.toolbar.loading, save: false } },
          },
        }));
        return account.current;
      }
    },
    [author, account, feeFines, setAccount, setLayout, alertMessage]
  );

  return (
    <CurrentAccountHookContext.Provider
      value={{
        feeFines,
        reset,
        author,
        layout,
        account,
        updateToModal,
        lastUpdateTo,
        lastInstallmentDate,
        installmentDateModal,
        installmentDate,
        authorIndex,
        updateTo,
        help,
        summary,
        setHelp,
        setFeeFines,
        setUpdateTo,
        setAuthorIndex,
        setLastInstallmentDate,
        setInstallmentDate,
        toggleInstallmentDateModal,
        setReset,
        setLastUpdateTo,
        toggleUpdateToModal,
        setInterestFine,
        setOccurrence,
        setSelectInterestFineVisible,
        onDuplicateExpense,
        onRemoveExpense,
        setAuthor,
        setLayout,
        setAccount,
        onCalc,
        setExpense,
        listAccountsByTypeId,
        onDuplicateInterestFine,
        onRemoveInterestFine,
        onDuplicateOccurrence,
        onOrderInterestFine,
        onOrderOccurrence,
        onRegisterInterestOrFine,
        onRegisterExpense,
        setSelectOccurrenceVisible,
        onRegisterOccurrence,
        onRemoveOccurrence,
        onOrderFeeFineToUpdate,
        onSave,
        setCurrentAccount,
        onOrderInterestFineToUpdate,
        onDuplicateAuthor,
        onOrderFeeFine,
        onCreateAuthor,
        onRemoveAuthor,
        newAccount,
      }}>
      {children}
    </CurrentAccountHookContext.Provider>
  );
};
const useCurrentAccount = (): CurrentAccountHookImp => {
  const socket = useContext(CurrentAccountHookContext);
  if (!socket) {
    throw new Error('useCurrentAccount deve ser usado dentro de um CurrentAccountHookProvider');
  }

  return socket;
};

export default useCurrentAccount;
