import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import _ from 'lodash';
import { SimpleUpdateHookImp } from './interfaces/SimpleUpdateHookImp';
import {
  CurrentAccountImp,
  LayoutImp,
  selectOccurrenceTypes,
  selectInterestFine,
  typeExpenseSection,
  typeFee,
  typeFine,
  typeInterest,
  typeCorrection,
  typeinstallment,
  typePayment,
  typeTotal,
} from './interfaces/CurrentAccountHookImp';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '@/store';
import * as SimpleActions from '@/store/simple/actions';
import {
  editInstallmentFine,
  duplicateInstallmentFine,
  registerInstallmentFine,
  removeInstallmentFine,
  updateInstallmentFines,
} from '@/store/simple/actions/installment/fine';
import {
  editInstallmentInterest,
  duplicateInstallmentInterest,
  registerInstallmentInterest as registerInstallmentInterestAction,
  removeInstallmentInterest,
} from '@/store/simple/actions/installment/interest';
import {
  showAddInstallmentModal as showAddInstallmentModalAction,
  hideAddInstallmentModal as hideAddInstallmentModalAction,
  showEditInstallmentModal as showEditInstallmentModalAction,
  hideEditInstallmentModal as hideEditInstallmentModalAction,
} from '@/store/simple/actions/installment/layout';
import { SimpleActionTypes } from '@/store/simple/types';
import AccountServices from '@/services/AccountServices';
import { alertMessages } from '@/hooks/alertMessages';
import { useFactors } from '@/hooks/factors';
import { useResource } from '@/hooks/resourses';
import { messagesEnum } from '@/enums/messagesEnum';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import CalculationsResponseImp from '@/interfaces/serviceResponses/CalculationsResponseImp';
import { ListAccountsByTypeIdImp } from '@/services/AccountServices';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import { help as defaultHelp } from '@/data/calculations/help';
import ViewOccorrenceImp, { SummaryImp } from '@/interfaces/calculations/ViewOccorrenceImp';
import { CurrentTypes } from '@/data/calculations/currentTypes';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import INomenclature from '@/interfaces/NomenclatureImp';
import { fineAmountType } from '@/data/calculations/fineEntryTypes';
import { getCoin } from '@/utils/numberUtils';
import IndexesService from '@/services/IndexesService';
import MemCalcImp from '@/interfaces/MemCalcImp';

export const initialFeeFines = { list: [], total: 0 };

export const pagination: PaginateResponseImp = {
  current: 1,
  pages: 1,
  order: 'asc',
  orderBy: 'costCenterId',
  total: 1,
};

export const typeArt354 = {
  id: 'art354' as CurrentTypes,
  value: 'art354' as CurrentTypes,
  label: 'Art. 354',
};

export const initialCurrentAuthor: CurrentAuthorImp = {
  name: '',
  occurrenceTotal: 0,
  expenseTotal: 0,
  occurrences: [],
  expenses: [],
  fees: [],
  interestFines: [],
  view: [] as any,
} as any;

export const initialAccount = {
  list: [],
  current: {} as any,
  pagination,
  infos: { type: '' },
} as unknown as CurrentAccountImp;

const createDefaultOccurrence = (type: string, order: number) =>
  ({
    type,
    description: type === typeinstallment.id ? 'Parcela' : 'Pagamento',
    date: moment().format(dateFormatEnum.DEFAULT),
    value: 0,
    order,
    correctedValue: 0,
    total: 0,
    detailed: true,
    interests: [],
    fines: [],
    newestOccurrence: true,
  } as any);

const createDefaultExpense = (order: number) =>
  ({
    type: typeExpenseSection.id,
    description: 'Despesa',
    date: moment().format(dateFormatEnum.DEFAULT),
    value: 0,
    total: 0,
    correctedValue: 0,
    article_523: false,
    order,
    newestOccurrence: true,
  } as any);

const createDefaultFee = (order: number) =>
  ({
    type: typeFee.id,
    description: 'Descrição dos honorários',
    date: moment().format(dateFormatEnum.DEFAULT),
    updateSince: null,
    tax: 10,
    percentage: 10,
    value: 0,
    total: 0,
    correctedValue: 0,
    calculated: 0,
    order,
    newCpc: false,
    selectType: 'attorneys',
    isOpenFeeConfig: false,
    isCalcByInstallment: false,
    isFeeCpc: false,
    newestOccurrence: true,
  } as any);

const addOneMonthToDate = (date?: string | null) => {
  if (!date) return date;

  const parsed = moment(date, dateFormatEnum.DEFAULT, true);
  if (!parsed.isValid()) return date;

  return parsed.add(1, 'month').format(dateFormatEnum.DEFAULT);
};

const cloneOccurrenceWithNextMonth = (occurrence: any) => {
  const cloned = _.cloneDeep(occurrence);
  return {
    ...cloned,
    date: addOneMonthToDate(cloned.date),
    interests: (cloned.interests || []).map((interest: any) => ({
      ...interest,
      dateStart: addOneMonthToDate(interest.dateStart),
      dateEnd: addOneMonthToDate(interest.dateEnd),
    })),
    fines: (cloned.fines || []).map((fine: any) => ({
      ...fine,
      dateStart: addOneMonthToDate(fine.dateStart),
      dateEnd: addOneMonthToDate(fine.dateEnd),
    })),
    newestOccurrence: true,
  };
};

const clearNewestFlagAfterEdit = (current: any, next: any) => {
  if (!current?.newestOccurrence) return next;
  if (_.isEqual(_.omit(current, 'newestOccurrence'), _.omit(next, 'newestOccurrence'))) return next;

  return { ...next, newestOccurrence: false };
};

const clearNewestFlags = (items: any[]) =>
  items.map(item => (item?.newestOccurrence ? { ...item, newestOccurrence: false } : item));

const clearAuthorNewestFlags = (author: CurrentAuthorImp): CurrentAuthorImp =>
  ({
    ...author,
    occurrences: clearNewestFlags(author.occurrences || []),
    expenses: clearNewestFlags(author.expenses || []),
    fees: clearNewestFlags(author.fees || []),
  } as CurrentAuthorImp);

// Campos de moeda/percentual chegam da tela formatados; o motor de calculo espera numero puro.
const toCalculationNumber = (value: any) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined || value === '') return 0;

  const normalized = String(value)
    .trim()
    .replace(/[^\d,.-]/g, '');
  if (!normalized) return 0;

  const parsed = normalized.includes(',')
    ? Number(normalized.replace(/\./g, '').replace(',', '.'))
    : Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeCalculatedNumberFields = <T extends Record<string, any>>(item: T, fields: string[]) =>
  fields.reduce(
    (currentItem, field) => ({
      ...currentItem,
      [field]: toCalculationNumber(currentItem[field]),
    }),
    item
  );

const mapOccurrenceInterestToInterestFine = (interest: any) => ({
  ...interest,
  type: typeInterest.id,
  description: interest.type,
  value: toCalculationNumber(interest.percentage),
  tax: toCalculationNumber(interest.percentage),
  percentage: toCalculationNumber(interest.percentage),
  onTransitiveInterest: true,
  calculated: toCalculationNumber(interest.calculated),
  calculatedInfo: interest.calculatedInfo || {
    periods: [],
    result: 0,
    value: 0,
    totalPercentage: 0,
    withoutTaxCorrection: false,
  },
});

const mapOccurrenceFineToInterestFine = (fine: any) => {
  const isAmount = fine.type === fineAmountType.id;
  const value = isAmount ? toCalculationNumber(fine.value) : toCalculationNumber(fine.percentage);

  return {
    ...fine,
    type: typeFine.id,
    selectType: fine.type,
    value,
    tax: value,
    percentage: toCalculationNumber(fine.percentage),
    calculated: toCalculationNumber(fine.calculated),
    calculatedInfo: fine.calculatedInfo || {
      periods: [],
      result: 0,
      totalPercentage: 0,
      value: 0,
    },
  };
};

const mapAuthorToCalculation = (currentAuthor: CurrentAuthorImp): CurrentAuthorImp => {
  // Honorarios sao exibidos em lista propria na tela simples, mas o motor legado calcula como ocorrencia.
  const occurrences = (currentAuthor.occurrences || []).map((occurrence: any) => ({
    ...normalizeCalculatedNumberFields(occurrence, ['value', 'correctedValue', 'total', 'tax']),
    interests: (occurrence.interests || []).map((interest: any) =>
      normalizeCalculatedNumberFields(interest, ['value', 'percentage', 'calculated'])
    ),
    fines: (occurrence.fines || []).map((fine: any) =>
      normalizeCalculatedNumberFields(fine, ['value', 'percentage', 'calculated'])
    ),
  }));
  const fees = (currentAuthor.fees || []).map((fee: any) =>
    normalizeCalculatedNumberFields(fee, ['value', 'correctedValue', 'total', 'tax', 'percentage', 'calculated'])
  );
  const expenses = (currentAuthor.expenses || []).map((expense: any) =>
    normalizeCalculatedNumberFields(expense, ['value', 'correctedValue', 'total', 'tax'])
  );
  const occurrenceInterestFines = occurrences.flatMap((occurrence: any) => [
    ...(occurrence.interests || []).map(mapOccurrenceInterestToInterestFine),
    ...(occurrence.fines || []).map(mapOccurrenceFineToInterestFine),
  ]);

  return {
    ...currentAuthor,
    occurrences: [...occurrences, ...fees],
    expenses,
    interestFines: [...(currentAuthor.interestFines || []), ...occurrenceInterestFines],
  } as CurrentAuthorImp;
};

const getBaseLineKey = (item: any) => `${item.type || ''}|${item.date || ''}|${item.description || ''}`;

const findBaseViewIndex = (views: ViewOccorrenceImp[], item: any, startIndex: number) => {
  const exactIndex = views.findIndex(
    (view, index) => index >= startIndex && getBaseLineKey(view) === getBaseLineKey(item)
  );
  if (exactIndex >= 0) return exactIndex;

  return views.findIndex((view, index) => index >= startIndex && view.type === item.type && view.date === item.date);
};

const getCorrectionValueUntilNextBase = (views: ViewOccorrenceImp[], baseIndex: number, correctedFrom: string) => {
  if (baseIndex < 0) return 0;

  let total = 0;

  for (let index = baseIndex + 1; index < views.length; index++) {
    const view = views[index];
    const isNextBaseLine =
      [typeinstallment.id, typePayment.id, typeExpenseSection.id, typeFee.id, typeTotal.id].includes(
        view.type as any
      ) && view.type !== typeCorrection.id;

    if (isNextBaseLine) break;
    if (view.type === typeCorrection.id && view.correctedFrom === correctedFrom) total += Number(view.value) || 0;
  }

  return total;
};

const applyCalculatedLineValues = (items: any[], views: ViewOccorrenceImp[]) => {
  let viewStartIndex = 0;

  return items.map(item => {
    const baseIndex = findBaseViewIndex(views, item, viewStartIndex);
    if (baseIndex < 0) return item;

    viewStartIndex = baseIndex + 1;

    const baseValue = toCalculationNumber(item.value);
    const correctionValue = getCorrectionValueUntilNextBase(views, baseIndex, item.type);
    const correctedValue = baseValue + correctionValue;

    return { ...item, correctedValue, total: correctedValue, newestOccurrence: false };
  });
};

const applyCalculatedFees = (items: any[], views: ViewOccorrenceImp[]) => {
  let viewStartIndex = 0;

  return items.map(item => {
    const baseIndex = findBaseViewIndex(views, item, viewStartIndex);
    if (baseIndex < 0) return item;

    viewStartIndex = baseIndex + 1;

    const view = views[baseIndex];
    const calculated = toCalculationNumber(view.value) || toCalculationNumber(item.value);

    return { ...item, calculated, correctedValue: calculated, total: calculated, newestOccurrence: false };
  });
};

const splitViewsByAuthor = (views: ViewOccorrenceImp[]) => {
  const groups: ViewOccorrenceImp[][] = [];
  let currentGroup: ViewOccorrenceImp[] = [];

  views.forEach(view => {
    if (view.type === 'authors') {
      if (currentGroup.length) groups.push(currentGroup);
      currentGroup = [];
      return;
    }

    currentGroup.push(view);
  });

  if (currentGroup.length) groups.push(currentGroup);

  return groups;
};

const getMemCalcDate = (row: any) => row?.inadata || row?.date || row?.data || row?.createdAt || '';

const getMemCalcsMaxDate = (memcalcs: MemCalcImp[]) => {
  let maxDate: moment.Moment | null = null;

  memcalcs.forEach((memcalc: any) => {
    (memcalc?.indicadorDado || []).forEach((row: any) => {
      const currentDate = moment(
        getMemCalcDate(row),
        ['YYYY-MM-DD HH:mm:ss.SSSSSS', 'YYYY-MM-DD', dateFormatEnum.DEFAULT],
        true
      );
      if (currentDate.isValid() && (!maxDate || currentDate.isAfter(maxDate))) maxDate = currentDate;
    });
  });

  return maxDate;
};

// Usa a menor data lancada para reduzir a memoria de indice buscada no banco.
const getAuthorStartDate = (authors: CurrentAuthorImp[]) => {
  const dates = authors
    .flatMap((currentAuthor: any) => [
      ...(currentAuthor?.occurrences || []),
      ...(currentAuthor?.expenses || []),
      ...(currentAuthor?.fees || []),
    ])
    .map((item: any) => moment(item.date, dateFormatEnum.DEFAULT, true))
    .filter(date => date.isValid());

  const startDate = dates.reduce<moment.Moment | null>((smallerDate, date) => {
    if (!smallerDate || date.isBefore(smallerDate)) return date;
    return smallerDate;
  }, null);

  return (startDate || moment('01/01/1964', dateFormatEnum.DEFAULT)).format(dateFormatEnum.DEFAULT);
};

const mapCalculatedAuthorToSimple = (
  calculatedAuthor: CurrentAuthorImp,
  originalAuthor: CurrentAuthorImp,
  authorViews: ViewOccorrenceImp[]
) => {
  // Depois do motor legado, separa honorarios novamente para manter o desenho da tela simples.
  const calculatedOccurrences = calculatedAuthor.occurrences || [];
  const occurrences = calculatedOccurrences.filter((occurrence: any) => occurrence.type !== typeFee.id);
  const feesFromOccurrences = calculatedOccurrences.filter((occurrence: any) => occurrence.type === typeFee.id);
  const fees = feesFromOccurrences.length ? feesFromOccurrences : originalAuthor.fees || [];

  return {
    ...originalAuthor,
    ...calculatedAuthor,
    occurrences: applyCalculatedLineValues(occurrences, authorViews),
    expenses: applyCalculatedLineValues(calculatedAuthor.expenses || originalAuthor.expenses || [], authorViews),
    fees: applyCalculatedFees(fees, authorViews),
    interestFines: originalAuthor.interestFines || [],
  } as CurrentAuthorImp;
};

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
} as LayoutImp;

export const SimpleUpdateHook = createContext<SimpleUpdateHookImp>({} as SimpleUpdateHookImp);
const { Provider } = SimpleUpdateHook;

export const SimpleUpdateHookProvider = ({ children }: { children: JSX.Element }) => {
  const dispatch = useDispatch();
  const alertMessage = alertMessages();
  const simpleState = useSelector((state: ApplicationState) => state.simple);
  const { allMemcalcs, indexesOptions, interestIndexes, interestIndexesFromLaw, memcalcs: memCalcs } = useFactors();
  const { accountConditions } = useResource();

  const [account, setAccount] = useState<CurrentAccountImp>({ list: [] } as unknown as CurrentAccountImp);
  const [layout, setLayout] = useState<LayoutImp>(initialLayout);
  const [author, setAuthor] = useState<{ list: CurrentAuthorImp[]; pagination: any }>({ list: [], pagination: {} });
  const [lastUpdateTo, setLastUpdateTo] = useState<string>('');
  const [summary, setSummary] = useState<SummaryImp[]>([]);
  const [help, setHelp] = useState<{
    [key: string]: {
      link: string | undefined;
      text: string | undefined;
      minWidth: string;
    };
  }>(defaultHelp as any);

  const [installmentVisible, setInstallmentVisible] = useState(true);
  const [expenseVisible, setExpenseVisible] = useState(true);
  const [feeVisible, setFeeVisible] = useState(true);
  const [art523Enabled, setArt523Enabled] = useState(false);

  const toggleInstallment = useCallback((payload?: boolean) => {
    setInstallmentVisible(v => (payload !== undefined ? payload : !v));
  }, []);
  const toggleExpense = useCallback((payload?: boolean) => {
    setExpenseVisible(v => (payload !== undefined ? payload : !v));
  }, []);
  const toggleFee = useCallback((payload?: boolean) => {
    setFeeVisible(v => (payload !== undefined ? payload : !v));
  }, []);
  const handleArt523Toggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setArt523Enabled(e.target.checked);
      dispatch(SimpleActions.onCheckArt523(e.target.checked));
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Account listing
  // ---------------------------------------------------------------------------
  const listAccountsByTypeId = useCallback(
    async (payload: { page: number; paginate: any; search: string }) => {
      try {
        alertMessage.warning(messagesEnum.LOADING);

        const { page, paginate, search } = payload;
        let params: ListAccountsByTypeIdImp = {} as ListAccountsByTypeIdImp;
        if (paginate) {
          const orderBy =
            paginate.orderBy === 'costCenterName' ? 'costCenterId' : paginate.orderBy || account.pagination?.orderBy;
          const order = paginate.order || account.pagination?.order || 'asc';
          params = {
            accountTypeId: 1,
            page: page || paginate.current || account.pagination?.current,
            orderBy,
            order,
            search: search || '',
          };
        } else {
          params = {
            accountTypeId: 1,
            orderBy: account.pagination?.orderBy,
            order: account.pagination?.order || 'asc',
            page,
            search: search || '',
          };
        }

        const service = new AccountServices();
        const response: CalculationsResponseImp = await service.listAccountsByTypeId(params);

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
    [account.pagination, alertMessage, setAccount]
  );

  const newAccount = useCallback(async () => {
    setAccount((account: any) => ({
      ...initialAccount,
      list: account.list,
      current: {
        ...initialAccount.current,
        accountTypeId: 1,
        updateTo: moment().format(dateFormatEnum.DEFAULT),
      },
    }));
    setAuthor({ list: [], pagination: {} });
  }, [setAccount, setAuthor]);

  // ---------------------------------------------------------------------------
  // Installment operations
  // ---------------------------------------------------------------------------
  const registerInstallment = useCallback(
    async (payload: { authorIndex: number; installment: any }) => {
      console.warn('registerInstallment not yet implemented');
      dispatch({ type: SimpleActionTypes.REGISTER_INSTALLMENT, payload });
      return Promise.resolve();
    },
    [dispatch]
  );

  const editInstallment = useCallback(
    async (payload: { authorIndex: number; installment: any; installmentIndex: number; changeFinesDate: boolean }) => {
      console.warn('editInstallment not yet implemented');
      dispatch({ type: SimpleActionTypes.EDIT_INSTALLMENT, payload });
      return Promise.resolve();
    },
    [dispatch]
  );

  const removeInstallment = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number }) => {
      console.warn('removeInstallment not yet implemented');
      dispatch({ type: SimpleActionTypes.REMOVE_INSTALLMENT, payload });
      return Promise.resolve();
    },
    [dispatch]
  );

  const duplicateInstallment = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number }) => {
      console.warn('duplicateInstallment not yet implemented');
      dispatch({ type: SimpleActionTypes.DUPLICATE_INSTALLMENT, payload });
      return Promise.resolve();
    },
    [dispatch]
  );

  const reorderInstallmentsByIndex = useCallback(
    (payload: { installments: any[]; startIndex: number; endIndex: number; authorIndex: number }) => {
      console.warn('reorderInstallmentsByIndex not yet implemented');
      dispatch({ type: SimpleActionTypes.REORDER_INSTALLMENTS_BY_INDEX, payload });
    },
    [dispatch]
  );

  const reorderInstallmentsByDate = useCallback(
    (payload: { installments: any[]; orderByDesc: boolean; authorIndex: number }) => {
      console.warn('reorderInstallmentsByDate not yet implemented');
      dispatch({ type: SimpleActionTypes.REORDER_INSTALLMENTS_BY_DATE, payload });
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Art. 523
  // ---------------------------------------------------------------------------
  const submitArt523 = useCallback(
    async (payload: { art523: any; isChecked: boolean }) => {
      console.warn('submitArt523 not yet implemented');
      dispatch(SimpleActions.submitArt523(payload.art523));
      return Promise.resolve();
    },
    [dispatch]
  );

  const onCheckArt523 = useCallback(
    (payload: { isChecked: boolean }) => {
      dispatch(SimpleActions.onCheckArt523(payload.isChecked));
    },
    [dispatch]
  );

  const handleIndicatorChange = useCallback(
    (payload: any) => {
      dispatch(SimpleActions.handleIndicatorChange(payload));
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Print modal
  // ---------------------------------------------------------------------------
  const hidePrintModal = useCallback(() => {
    dispatch(SimpleActions.hidePrintModal());
  }, [dispatch]);

  const showPrintModal = useCallback(() => {
    dispatch(SimpleActions.showPrintModal());
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Installment fine operations
  // ---------------------------------------------------------------------------
  const duplicateInstallmentFineFn = useCallback(
    async (payload: { authorIndex: number; fine: any; fineIndex: number; installmentIndex: number }) => {
      dispatch(
        duplicateInstallmentFine(payload.authorIndex, payload.installmentIndex, payload.fineIndex, payload.fine)
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  const registerInstallmentFineFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number; fine: any }) => {
      dispatch(registerInstallmentFine(payload.authorIndex, payload.installmentIndex, payload.fine));
      return Promise.resolve();
    },
    [dispatch]
  );

  const removeInstallmentFineFn = useCallback(
    async (param: { authorIndex: number; installmentIndex: number; fineIndex: number }) => {
      dispatch(removeInstallmentFine(param.authorIndex, param.installmentIndex, param.fineIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const updateInstallmentFinesFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number }) => {
      dispatch(updateInstallmentFines(payload.authorIndex, payload.installmentIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Installment interest operations
  // ---------------------------------------------------------------------------
  const registerInstallmentInterestFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number; interest: any }) => {
      dispatch(registerInstallmentInterestAction(payload.authorIndex, payload.installmentIndex, '', payload.interest));
      return Promise.resolve();
    },
    [dispatch]
  );

  const editInstallmentInterestFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number; interestIndex: number; interest: any }) => {
      dispatch(
        editInstallmentInterest(payload.authorIndex, payload.installmentIndex, payload.interestIndex, payload.interest)
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  const duplicateInstallmentInterestFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number; interestIndex: number; interest: any }) => {
      dispatch(
        duplicateInstallmentInterest(
          payload.authorIndex,
          payload.installmentIndex,
          payload.interestIndex,
          payload.interest
        )
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  const removeInstallmentInterestFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number; interestIndex: number }) => {
      dispatch(removeInstallmentInterest(payload.authorIndex, payload.installmentIndex, payload.interestIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Installment modal controls
  // ---------------------------------------------------------------------------
  const showAddInstallmentModal = useCallback(() => {
    dispatch(showAddInstallmentModalAction());
  }, [dispatch]);

  const hideAddInstallmentModal = useCallback(() => {
    dispatch(hideAddInstallmentModalAction());
  }, [dispatch]);

  const editInstallmentFineFn = useCallback(
    async (payload: { authorIndex: number; installmentIndex: number; fineIndex: number; fine: any }) => {
      dispatch(editInstallmentFine(payload.authorIndex, payload.installmentIndex, payload.fineIndex, payload.fine));
      return Promise.resolve();
    },
    [dispatch]
  );

  const showEditInstallmentModal = useCallback(
    (param: { data: any; key: number }) => {
      dispatch(showEditInstallmentModalAction(param));
    },
    [dispatch]
  );

  const hideEditInstallmentModal = useCallback(() => {
    dispatch(hideEditInstallmentModalAction());
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Author modal controls
  // ---------------------------------------------------------------------------
  const showAuthorModal = useCallback(() => {
    dispatch(SimpleActions.showAuthorModal());
  }, [dispatch]);

  const showEditAuthorModal = useCallback(
    (param: any) => {
      dispatch(SimpleActions.showEditAuthorModal(param));
    },
    [dispatch]
  );

  const hideAuthorModal = useCallback(() => {
    dispatch({ type: SimpleActionTypes.HIDE_AUTHOR_MODAL });
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Author CRUD operations
  // ---------------------------------------------------------------------------
  const addAuthor = useCallback((payload: { author: any; authorName?: string }) => {
    const authorName = payload.author?.name || payload.authorName || '';

    const newAuthor: CurrentAuthorImp = {
      ...initialCurrentAuthor,
      name: authorName,
    };

    setAuthor((prev: any) => {
      const list = [...(prev.list || []), newAuthor];
      const authorIndex = list.length - 1;

      setLayout((prevLayout: any) => ({
        ...prevLayout,
        modalAddAuthor: { ...prevLayout.modalAddAuthor, visible: false },
        footerButton: { ...prevLayout.footerButton, isCalculated: false },
        authorRow: {
          ...prevLayout.authorRow,
          authorIndex,
        },
      }));

      return {
        ...prev,
        list,
      };
    });
  }, []);

  const removeAuthor = useCallback((payload: { authorIndex: number; authors?: any[] }) => {
    setAuthor((prev: any) => {
      const list = [...(prev.list || [])];
      if (!list[payload.authorIndex]) return prev;

      list.splice(payload.authorIndex, 1);
      const nextAuthorIndex = Math.max(0, Math.min(payload.authorIndex, list.length - 1));

      setLayout((prevLayout: any) => ({
        ...prevLayout,
        footerButton: { ...prevLayout.footerButton, isCalculated: false },
        authorRow: {
          ...prevLayout.authorRow,
          authorIndex: nextAuthorIndex,
        },
      }));

      return {
        ...prev,
        list,
      };
    });
  }, []);

  const editAuthor = useCallback(
    (payload: { authorIndex: number; authors: any[]; author: any }) => {
      console.warn('editAuthor not yet implemented');
      dispatch({ type: SimpleActionTypes.EDIT_AUTHOR, payload });
    },
    [dispatch]
  );

  const duplicateAuthor = useCallback(
    (payload: { authorIndex: number; authors?: any[] }) => {
      setAuthor((prev: any) => {
        const list = [...(prev.list || [])];
        const current = list[payload.authorIndex];
        if (!current) return prev;

        const duplicatedAuthor = clearAuthorNewestFlags(_.cloneDeep(current));
        const newAuthorIndex = payload.authorIndex + 1;
        list.splice(newAuthorIndex, 0, duplicatedAuthor);

        setLayout((prevLayout: any) => ({
          ...prevLayout,
          footerButton: { ...prevLayout.footerButton, isCalculated: false },
          authorRow: {
            ...prevLayout.authorRow,
            authorIndex: newAuthorIndex,
          },
        }));

        return {
          ...prev,
          list,
        };
      });
    },
    [setLayout]
  );

  const setOccurrence = useCallback(
    (payload: { occurrence: any; occurrenceIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const occurrences = [...(current.occurrences || [])];
        if (_.isEqual(occurrences[payload.occurrenceIndex], payload.occurrence)) return prev;

        occurrences[payload.occurrenceIndex] = clearNewestFlagAfterEdit(
          occurrences[payload.occurrenceIndex],
          payload.occurrence
        );
        list[authorIndex] = { ...current, occurrences };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onDuplicateOccurrence = useCallback(
    (payload: { occurrenceIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const occurrences = clearNewestFlags([...(current.occurrences || [])]);
        const occurrence = occurrences[payload.occurrenceIndex];
        if (!occurrence) return prev;

        occurrences.splice(payload.occurrenceIndex + 1, 0, cloneOccurrenceWithNextMonth(occurrence));
        list[authorIndex] = { ...current, occurrences };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onRemoveOccurrence = useCallback(
    (payload: { occurrenceIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const occurrences = [...(current.occurrences || [])];
        occurrences.splice(payload.occurrenceIndex, 1);
        list[authorIndex] = { ...current, occurrences };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const setExpense = useCallback(
    (payload: { expense: any; expenseIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const expenses = [...(current.expenses || [])];
        if (_.isEqual(expenses[payload.expenseIndex], payload.expense)) return prev;

        expenses[payload.expenseIndex] = clearNewestFlagAfterEdit(expenses[payload.expenseIndex], payload.expense);
        list[authorIndex] = { ...current, expenses };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onDuplicateExpense = useCallback(
    (payload: { expenseIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const expenses = clearNewestFlags([...(current.expenses || [])]);
        const expense = expenses[payload.expenseIndex];
        if (!expense) return prev;

        expenses.splice(payload.expenseIndex + 1, 0, {
          ..._.cloneDeep(expense),
          newestOccurrence: true,
        });
        list[authorIndex] = { ...current, expenses };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onRemoveExpense = useCallback(
    (payload: { expenseIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const expenses = [...(current.expenses || [])];
        expenses.splice(payload.expenseIndex, 1);
        list[authorIndex] = { ...current, expenses };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const setFee = useCallback(
    (payload: { fee: any; feeIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const fees = [...(current.fees || [])];
        if (_.isEqual(fees[payload.feeIndex], payload.fee)) return prev;

        fees[payload.feeIndex] = clearNewestFlagAfterEdit(fees[payload.feeIndex], payload.fee);
        list[authorIndex] = { ...current, fees };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onDuplicateFee = useCallback(
    (payload: { feeIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const fees = clearNewestFlags([...(current.fees || [])]);
        const fee = fees[payload.feeIndex];
        if (!fee) return prev;

        fees.splice(payload.feeIndex + 1, 0, {
          ..._.cloneDeep(fee),
          newestOccurrence: true,
        });
        list[authorIndex] = { ...current, fees };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onRemoveFee = useCallback(
    (payload: { feeIndex: number; authorIndex?: number }) => {
      setAuthor((prev: any) => {
        const authorIndex = payload.authorIndex ?? layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const fees = [...(current.fees || [])];
        fees.splice(payload.feeIndex, 1);
        list[authorIndex] = { ...current, fees };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  // ---------------------------------------------------------------------------
  // Fee operations
  // ---------------------------------------------------------------------------
  const showAddFeeModal = useCallback(() => {
    dispatch(SimpleActions.showAddFeeModal());
  }, [dispatch]);

  const hideAddFeeModal = useCallback(() => {
    dispatch(SimpleActions.hideAddFeeModal());
  }, [dispatch]);

  const showEditFeeModal = useCallback(
    (param: { data: any; key: number }) => {
      dispatch(SimpleActions.showEditFeeModal(param));
    },
    [dispatch]
  );

  const hideEditFeeModal = useCallback(() => {
    dispatch(SimpleActions.hideEditFeeModal());
  }, [dispatch]);

  const registerFee = useCallback(
    async (param: { fee: any }) => {
      dispatch(SimpleActions.registerFee(param.fee));
      return Promise.resolve();
    },
    [dispatch]
  );

  const editFee = useCallback(
    async (param: { fee: any; feeIndex: number }) => {
      dispatch(SimpleActions.editFee(param.fee, param.feeIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const removeFee = useCallback(
    (payload: { feeIndex: number }) => {
      dispatch(SimpleActions.removeFee(payload.feeIndex));
    },
    [dispatch]
  );

  const onCheckNewCpc = useCallback(
    (payload: { feeIndex: number; isChecked: boolean }) => {
      dispatch(SimpleActions.onCheckNewCpc(payload.feeIndex, payload.isChecked));
    },
    [dispatch]
  );

  const duplicateFee = useCallback(
    async (payload: { feeIndex: number }) => {
      dispatch(SimpleActions.duplicateFee(payload.feeIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const reorderFees = useCallback(
    (payload: { fees: any[]; startIndex: number; endIndex: number }) => {
      dispatch(SimpleActions.reorderFees(payload.fees, payload.startIndex, payload.endIndex));
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Expense operations
  // ---------------------------------------------------------------------------
  const registerExpense = useCallback(
    async (payload: { expense: any }) => {
      dispatch(SimpleActions.registerExpense(payload.expense));
      return Promise.resolve();
    },
    [dispatch]
  );

  const recalculateAttorneyFees = useCallback((installmentsWithFeesTotal: number, fees: any[]) => {
    console.warn('recalculateAttorneyFees not yet implemented');
  }, []);

  const editExpense = useCallback(
    async (payload: { expense: any; expenseIndex: number }) => {
      dispatch(SimpleActions.editExpense(payload.expense, payload.expenseIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const removeExpense = useCallback(
    (payload: { expenseIndex: number }) => {
      dispatch(SimpleActions.removeExpense(payload.expenseIndex));
    },
    [dispatch]
  );

  const duplicateExpense = useCallback(
    async (payload: { expenseIndex: number }) => {
      dispatch(SimpleActions.duplicateExpense(payload.expenseIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const reorderExpenses = useCallback(
    (payload: { expenses: any[]; startIndex: number; endIndex: number }) => {
      dispatch(SimpleActions.reorderExpenses(payload.expenses, payload.startIndex, payload.endIndex));
    },
    [dispatch]
  );

  const showAddExpenseModal = useCallback(() => {
    dispatch(SimpleActions.showAddExpenseModal());
  }, [dispatch]);

  const hideAddExpenseModal = useCallback(() => {
    dispatch(SimpleActions.hideAddExpenseModal());
  }, [dispatch]);

  const showEditExpenseModal = useCallback(
    (param: { data: any; key: number }) => {
      dispatch(SimpleActions.showEditExpenseModal(param));
    },
    [dispatch]
  );

  const hideEditExpenseModal = useCallback(() => {
    dispatch(SimpleActions.hideEditExpenseModal());
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Payment operations
  // ---------------------------------------------------------------------------
  const showAddPaymentModal = useCallback(() => {
    dispatch(SimpleActions.showAddPaymentModal());
  }, [dispatch]);

  const hideAddPaymentModal = useCallback(() => {
    dispatch(SimpleActions.hideAddPaymentModal());
  }, [dispatch]);

  const showEditPaymentModal = useCallback(
    (param: any) => {
      dispatch(SimpleActions.showEditPaymentModal(param));
    },
    [dispatch]
  );

  const hideEditPaymentModal = useCallback(() => {
    dispatch(SimpleActions.hideEditPaymentModal());
  }, [dispatch]);

  const registerPayment = useCallback(
    async (payload: { authorIndex: number; payment: any }) => {
      dispatch(SimpleActions.registerPayment(payload.authorIndex, payload.payment));
      return Promise.resolve();
    },
    [dispatch]
  );

  const editPayment = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number; payment: any }) => {
      dispatch(SimpleActions.editPayment(payload.authorIndex, payload.payment, payload.paymentIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const removePayment = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number }) => {
      dispatch(SimpleActions.removePayment(payload.authorIndex, payload.paymentIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const duplicatePayment = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number }) => {
      dispatch(SimpleActions.duplicatePayment(payload.authorIndex, payload.paymentIndex));
      return Promise.resolve();
    },
    [dispatch]
  );

  const reorderPayments = useCallback(
    (payload: { payments: any[]; startIndex: number; endIndex: number; authorIndex: number }) => {
      dispatch(
        SimpleActions.reorderPayments(payload.payments, payload.startIndex, payload.endIndex, payload.authorIndex)
      );
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Payment interest operations
  // ---------------------------------------------------------------------------
  const duplicatePaymentInterestFn = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number; interestIndex: number; interest: any }) => {
      dispatch(
        (SimpleActions as any).duplicatePaymentInterest(
          payload.authorIndex,
          payload.paymentIndex,
          payload.interestIndex,
          payload.interest
        )
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  const editPaymentInterestFn = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number; interestIndex: number; interest: any }) => {
      dispatch(
        (SimpleActions as any).editPaymentInterest(
          payload.authorIndex,
          payload.paymentIndex,
          payload.interestIndex,
          payload.interest
        )
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  const removePaymentInterestFn = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number; interestIndex: number }) => {
      dispatch(
        (SimpleActions as any).removePaymentInterest(payload.authorIndex, payload.paymentIndex, payload.interestIndex)
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  const registerPaymentInterestFn = useCallback(
    async (payload: { authorIndex: number; paymentIndex: number; interest: any }) => {
      dispatch(
        (SimpleActions as any).registerPaymentInterest(payload.authorIndex, payload.paymentIndex, payload.interest)
      );
      return Promise.resolve();
    },
    [dispatch]
  );

  // ---------------------------------------------------------------------------
  // Direct occurrence / expense / fee registration (for AuthorForm Tabs)
  // ---------------------------------------------------------------------------
  const onRegisterOccurrence = useCallback(
    (params: { type: string; newestOccurrence: boolean }) => {
      setLayout((prev: any) => ({
        ...prev,
        selectOccurrence: { ...prev.selectOccurrence, newestOccurrence: params.newestOccurrence },
      }));
      setAuthor((prev: any) => {
        const authorIndex = layout.authorRow.authorIndex;
        const list = [...(prev.list || [])];
        const current = list[authorIndex];
        if (!current) return prev;

        const occurrences = clearNewestFlags([...(current.occurrences || [])]);
        occurrences.push(createDefaultOccurrence(params.type, occurrences.length + 1));
        list[authorIndex] = { ...current, occurrences };
        return { ...prev, list };
      });
    },
    [layout.authorRow.authorIndex]
  );

  const onRegisterExpense = useCallback(() => {
    setAuthor((prev: any) => {
      const authorIndex = layout.authorRow.authorIndex;
      const list = [...(prev.list || [])];
      const current = list[authorIndex];
      if (!current) return prev;

      const expenses = clearNewestFlags([...(current.expenses || [])]);
      expenses.push(createDefaultExpense(expenses.length + 1));
      list[authorIndex] = { ...current, expenses };
      return { ...prev, list };
    });
  }, [layout.authorRow.authorIndex]);

  const onRegisterFee = useCallback(() => {
    setAuthor((prev: any) => {
      const authorIndex = layout.authorRow.authorIndex;
      const list = [...(prev.list || [])];
      const current = list[authorIndex];
      if (!current) return prev;

      const fees = clearNewestFlags([...(current.fees || [])]);
      fees.push(createDefaultFee(fees.length + 1));
      list[authorIndex] = { ...current, fees };
      return { ...prev, list };
    });
  }, [layout.authorRow.authorIndex]);

  // ---------------------------------------------------------------------------
  // Per-author totals
  // ---------------------------------------------------------------------------
  const currentAuthor = author.list[layout.authorRow?.authorIndex || 0];

  const installmentTotal = useMemo(() => {
    if (!currentAuthor?.occurrences) return 0;
    return currentAuthor.occurrences
      .filter((o: any) => o.type === typeinstallment.id)
      .reduce((sum: number, o: any) => sum + (o.correctedValue || o.value || 0), 0);
  }, [currentAuthor?.occurrences]);

  const expenseTotal = useMemo(() => {
    if (!currentAuthor?.expenses) return 0;
    return currentAuthor.expenses.reduce((sum: number, e: any) => sum + (e.total || e.value || 0), 0);
  }, [currentAuthor?.expenses]);

  const feeTotal = useMemo(() => {
    if (!currentAuthor?.fees) return 0;
    return currentAuthor.fees.reduce(
      (sum: number, fee: any) => sum + (fee.correctedValue || fee.total || fee.calculated || fee.value || 0),
      0
    );
  }, [currentAuthor?.fees]);

  const art523Total = useSelector((state: ApplicationState) => state.simple.art523?.value || 0);

  // ---------------------------------------------------------------------------
  // Update and calculation
  // ---------------------------------------------------------------------------
  const updateAuthorTotals = useCallback(
    (payload: { authorIndex: number; authors: any[] }) => {
      console.warn('updateAuthorTotals not yet implemented');
      dispatch({ type: SimpleActionTypes.UPDATE_AUTHOR_TOTALS, payload });
    },
    [dispatch]
  );

  const updateAccountTotal = useCallback(() => {
    console.warn('updateAccountTotal not yet implemented');
    dispatch({ type: SimpleActionTypes.UPDATE_ACCOUNT_TOTAL });
  }, [dispatch]);

  const saveSimpleCalculation = useCallback(
    async (payload: boolean) => {
      dispatch(SimpleActions.saveSimpleCalculation(payload));
      return Promise.resolve();
    },
    [dispatch]
  );

  const onCalc = useCallback(
    async ({
      origin,
      nomenclatures,
      memcalcs,
    }: {
      origin: 'view' | 'calc';
      nomenclatures: INomenclature[];
      memcalcs?: MemCalcImp[];
    }) => {
      try {
        const currentAccount = {
          ...account,
          current: {
            ...account.current,
            updateTo: account.current?.updateTo || moment().format(dateFormatEnum.DEFAULT),
            proRataDay: Boolean(account.current?.proRataDay),
          },
          infos: {
            ...account.infos,
            type: account.infos?.type || typeArt354.id,
          },
        };
        const calculationAuthors = {
          ...author,
          list: (author.list || []).map(mapAuthorToCalculation),
        };
        const indexId = Number(currentAccount.current?.indexId);
        let calculationMemCalcs: MemCalcImp[] = [];

        if (indexId && indexId !== -1) {
          try {
            const startDate = getAuthorStartDate(author.list || []);
            const { memCalcs: currentMemCalcs } = await new IndexesService().getMemCalcs(
              startDate,
              currentAccount.current.updateTo,
              indexId
            );
            calculationMemCalcs = currentMemCalcs || [];
          } catch (error) {
            console.log(error);
            const fallbackMemCalcs = memcalcs || allMemcalcs?.[indexId] || memCalcs || [];
            const fallbackMaxDate = getMemCalcsMaxDate(fallbackMemCalcs);
            const updateTo = moment(currentAccount.current.updateTo, dateFormatEnum.DEFAULT, true);
            // Fallback local defasado bloqueia o calculo para evitar resultado financeiro incorreto.
            const canUseFallback =
              fallbackMaxDate && updateTo.isValid() && moment(fallbackMaxDate).isSameOrAfter(updateTo, 'day');

            if (!canUseFallback) {
              throw 'Não foi possível carregar os índices atualizados do banco. O cálculo não será feito com índices defasados.';
            }

            calculationMemCalcs = fallbackMemCalcs;
          }
        } else {
          calculationMemCalcs = memcalcs || memCalcs || [];
        }

        await new Promise<void>((resolve, reject) => {
          const worker = new Worker(new URL('../workersweb/RecalculateAccountWorker.ts', import.meta.url));
          setLayout(layout => ({ ...layout, footerButton: { ...layout.footerButton, isLoading: true } }));

          worker.addEventListener('message', event => {
            try {
              const message = event.data;
              if (message.type == 'error') throw message?.data || 'Houve um erro ao calcular!';
              if (message.type !== 'recalculated') throw 'Houve um erro ao calcular!';

              const { authorList: calculatedAuthorList, views, summary } = message.data;
              const currency = getCoin(currentAccount.current.updateTo, 0);
              const authorViews = splitViewsByAuthor(views || []);
              const nextAuthorList = (calculatedAuthorList || []).map(
                (calculatedAuthor: CurrentAuthorImp, index: number) =>
                  mapCalculatedAuthorToSimple(calculatedAuthor, author.list[index], authorViews[index] || [])
              );

              setSummary(summary || []);
              setAuthor(author => ({ ...author, list: nextAuthorList }));
              setLayout(layout => ({
                ...layout,
                viewModal: {
                  views: views || [],
                  visible: origin === 'view',
                },
                authorRow: {
                  ...layout.authorRow,
                  currency,
                },
                footerButton: {
                  isLoading: false,
                  isCalculated: true,
                },
              }));
              resolve();
            } catch (error) {
              setLayout(layout => ({ ...layout, footerButton: { ...layout.footerButton, isLoading: false } }));
              reject(error);
            } finally {
              worker.terminate();
            }
          });

          worker.postMessage({
            type: 'recalculate',
            data: {
              account: currentAccount,
              author: calculationAuthors,
              feeFines: initialFeeFines,
              allMemcalcs,
              memCalcs: calculationMemCalcs,
              interestIndexes,
              interestIndexesFromLaw,
              nomenclatures,
              authorIndex: layout.authorRow?.authorIndex || 0,
              type: origin,
            },
          });
        });
      } catch (error) {
        console.error('simple_update_calculation_error', error);
        alertMessage.error(String(error || 'Houve um erro ao calcular!'));
        setLayout(layout => ({ ...layout, footerButton: { ...layout.footerButton, isLoading: false } }));
      }
    },
    [
      account,
      alertMessage,
      allMemcalcs,
      author,
      interestIndexes,
      interestIndexesFromLaw,
      layout.authorRow?.authorIndex,
      memCalcs,
      setAuthor,
      setLayout,
      setSummary,
    ]
  );

  const onSave = useCallback(
    async ({ isNewAccount }: { isNewAccount: boolean }) => {
      try {
        alertMessage.warning(messagesEnum.ACCOUNT_SAVE);
        dispatch(SimpleActions.saveSimpleCalculation(isNewAccount));
        alertMessage.success(messagesEnum.ACCOUNT_SAVE_SUCESS);
      } catch {
        alertMessage.error('Houve um erro ao salvar!');
      }
    },
    [dispatch, alertMessage]
  );

  const calculateArt523 = useCallback(
    (
      art523: any,
      expenses: any[],
      feesTotal: number,
      paymentsTotal: number,
      installmentsTotal: number,
      installmentsInterestTotal: number,
      installmentsFinesTotal: number
    ) => {
      console.warn('calculateArt523 not yet implemented');
    },
    []
  );

  const recalculateAccount = useCallback(
    async (param: { type: string[]; account: any }) => {
      dispatch(SimpleActions.recalculateAccount(param.type, param.account));
      return Promise.resolve();
    },
    [dispatch]
  );

  const recalculateAllAccount = useCallback(
    async (account: any) => {
      console.warn('recalculateAllAccount not yet implemented');
      dispatch(SimpleActions.recalculateAccount('all', account));
      return Promise.resolve();
    },
    [dispatch]
  );

  const validateCalculationPeriod = useCallback((date: string) => {
    console.warn('validateCalculationPeriod not yet implemented');
  }, []);

  const setUpdateTo = useCallback((value: string) => {
    setAccount(account => ({ ...account, current: { ...account.current, updateTo: value } }));
  }, []);

  const toggleUpdateToModal = useCallback((visible: boolean) => {
    setLayout(layout => ({ ...layout, updateToModal: { visible } }));
  }, []);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------
  const value: SimpleUpdateHookImp = {
    listAccountsByTypeId,
    newAccount,
    registerInstallment,
    editInstallment,
    removeInstallment,
    duplicateInstallment,
    reorderInstallmentsByIndex,
    reorderInstallmentsByDate,
    submitArt523,
    onCheckArt523,
    handleIndicatorChange,
    hidePrintModal,
    showPrintModal,
    duplicateInstallmentFine: duplicateInstallmentFineFn,
    registerInstallmentFine: registerInstallmentFineFn,
    removeInstallmentFine: removeInstallmentFineFn,
    updateInstallmentFines: updateInstallmentFinesFn,
    registerInstallmentInterest: registerInstallmentInterestFn,
    editInstallmentInterest: editInstallmentInterestFn,
    duplicateInstallmentInterest: duplicateInstallmentInterestFn,
    removeInstallmentInterest: removeInstallmentInterestFn,
    showAddInstallmentModal,
    hideAddInstallmentModal,
    editInstallmentFine: editInstallmentFineFn,
    showEditInstallmentModal,
    hideEditInstallmentModal,
    showAuthorModal,
    showEditAuthorModal,
    hideAuthorModal,
    addAuthor,
    removeAuthor,
    onRemoveAuthor: removeAuthor,
    editAuthor,
    duplicateAuthor,
    onDuplicateAuthor: duplicateAuthor,
    setOccurrence,
    onDuplicateOccurrence,
    onRemoveOccurrence,
    setExpense,
    onDuplicateExpense,
    onRemoveExpense,
    setFee,
    onDuplicateFee,
    onRemoveFee,
    showAddFeeModal,
    hideAddFeeModal,
    showEditFeeModal,
    hideEditFeeModal,
    registerFee,
    editFee,
    removeFee,
    onCheckNewCpc,
    duplicateFee,
    reorderFees,
    registerExpense,
    recalculateAttorneyFees,
    editExpense,
    removeExpense,
    duplicateExpense,
    reorderExpenses,
    showAddExpenseModal,
    hideAddExpenseModal,
    showEditExpenseModal,
    hideEditExpenseModal,
    showAddPaymentModal,
    hideAddPaymentModal,
    showEditPaymentModal,
    hideEditPaymentModal,
    registerPayment,
    editPayment,
    removePayment,
    duplicatePayment,
    reorderPayments,
    duplicatePaymentInterest: duplicatePaymentInterestFn,
    editPaymentInterest: editPaymentInterestFn,
    removePaymentInterest: removePaymentInterestFn,
    registerPaymentInterest: registerPaymentInterestFn,
    updateAuthorTotals,
    updateAccountTotal,
    saveSimpleCalculation,
    onSave,
    onCalc,
    calculateArt523,
    recalculateAccount,
    recalculateAllAccount,
    validateCalculationPeriod,
    account,
    setAccount,
    layout,
    setLayout,
    author,
    setAuthor,
    help,
    setHelp,
    summary,
    lastUpdateTo,
    setLastUpdateTo,
    setUpdateTo,
    toggleUpdateToModal,
    onRegisterOccurrence,
    onRegisterExpense,
    onRegisterFee,
    installmentVisible,
    expenseVisible,
    feeVisible,
    art523Enabled,
    toggleInstallment,
    toggleExpense,
    toggleFee,
    handleArt523Toggle,
    installmentTotal,
    expenseTotal,
    feeTotal,
    art523Total,
  };

  return <Provider value={value}>{children}</Provider>;
};

export const useSimpleUpdate = () => {
  const context = useContext(SimpleUpdateHook);
  if (!context) throw new Error('useSimpleUpdate must be within SimpleUpdateHookProvider');
  return context;
};

export default useSimpleUpdate;
