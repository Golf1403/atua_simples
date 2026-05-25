import _, { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CurrentAccoutImp } from '@interfaces/SimpleAccountImp';
import AccountImp from '@interfaces/AccountImp';
import worker_script from '../../../../workersweb/compress';
import { useHistory, useParams } from 'react-router-dom';
import RouteLeavingGuard from '@/components/RouteLeavingGuard';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { CurrentAccountImp, typePayment, typeinstallment } from '@/hooks/interfaces/CurrentAccountHookImp';
import { useCore } from '@/hooks/core';
import { messagesEnum } from '@/enums/messagesEnum';
import { labelsEnum } from '@/enums/labelsEnum';
import { CalcClosedContent, CalcDataContainer } from './styles';
import { initialVisibleButtons, useToolbar } from '@/hooks/toolbar';
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { Fragment } from 'react';
import ExpenseList from '../ExpenseList';
import FeeList from '../FeeList';
import CalcData from './CalcData';
import Tab from './Tab';
import { Formik } from 'formik';
import ModalAddAuthor from '../ModalAddAuthor';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import AuthorList from '../AuthorList';
import { pathEnum } from '@/enums/pathEnum';
import ViewModal from '@/pages/calculations/Simple/ViewModal';
import { editSimpleUpdatePage, listSimpleUpdatePage, newSimpleUpdatePage } from '@/Routes/pages/calculations';
import Indexes from './Indexes';
import Recalculate from './Recalculate';
import ModalEditAuthor from '../ModalEditAuthor';
import { useResource } from '@/hooks/resourses';
import PrintSimpleUpdate from '@/pages/Print/SimpleUpdatePrint';
import { ApplicationState } from '@/store';
import { useSelector } from 'react-redux';
import UpdateToModal from './UpdateToModal';
import { getCoin } from '@/utils/numberUtils';
import AccountServices from '@/services/AccountServices';
import IDummyObject from '@/interfaces/IDummyObject';
import CryptoJS from 'crypto-js';
import GenerateShortCuts from '../AccountList/GenerateShortCuts';
import { simpleAccount as onShortcuts } from '@/utils/shortcuts';
import http from '@/services/http';
import { rem } from '@/styles/global';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import TotalsModal from './TotalsModal';
import Art523Modal from './Art523Modal';
import { valueWithCurrency } from '@/lib/currency';

interface TabTotalTooltipItem {
  title: string;
  total?: string;
}

const calculateSimpleAuthorTotals = (currentAuthor: any) => {
  const occurrences = currentAuthor?.occurrences || [];
  const expenses = currentAuthor?.expenses || [];
  const fees = currentAuthor?.fees || [];

  const getOccurrenceValue = (occurrence: any) =>
    occurrence.correctedValue || occurrence.total || occurrence.value || 0;
  const getInterestValue = (occurrence: any) =>
    (occurrence.interests || []).reduce((sum: number, interest: any) => sum + (interest.calculated || 0), 0);
  const getFineValue = (occurrence: any) =>
    (occurrence.fines || []).reduce((sum: number, fine: any) => sum + (fine.calculated || 0), 0);

  const installments = occurrences.filter((occurrence: any) => occurrence.type === typeinstallment.id);
  const payments = occurrences.filter((occurrence: any) => occurrence.type === typePayment.id);
  const installmentTotal = installments.reduce(
    (sum: number, occurrence: any) => sum + getOccurrenceValue(occurrence),
    0
  );
  const installmentInterestTotal = installments.reduce(
    (sum: number, occurrence: any) => sum + getInterestValue(occurrence),
    0
  );
  const paymentTotal = payments.reduce((sum: number, occurrence: any) => sum + getOccurrenceValue(occurrence), 0);
  const paymentInterestTotal = payments.reduce((sum: number, occurrence: any) => sum + getInterestValue(occurrence), 0);
  const installmentFineTotal = installments.reduce((sum: number, occurrence: any) => sum + getFineValue(occurrence), 0);
  const expenseTotal = expenses.reduce(
    (sum: number, expense: any) => sum + (expense.correctedValue || expense.total || expense.value || 0),
    0
  );
  const feeTotal = fees.reduce(
    (sum: number, fee: any) => sum + (fee.correctedValue || fee.total || fee.calculated || fee.value || 0),
    0
  );
  const total =
    installmentTotal +
    installmentInterestTotal +
    installmentFineTotal -
    paymentTotal -
    paymentInterestTotal +
    expenseTotal +
    feeTotal;

  return {
    expenseTotal,
    feeTotal,
    installmentFineTotal,
    installmentInterestTotal,
    installmentTotal,
    paymentInterestTotal,
    paymentTotal,
    total,
  };
};

const SimpleCalculation: React.FC = () => {
  const history = useHistory<{ force?: boolean; isCharged?: boolean; reset?: boolean }>();
  const alertMessage = alertMessages();
  const { accountConditions } = useResource();
  const { costCenters, setSidebar } = useCore();
  const { accountId } = useParams<{ accountId?: string }>();
  const { openLoading, closeLoading } = useLoading();
  const { setVisible: setVisibleToolbar, ...toolbar } = useToolbar();
  const { setResults } = useCore();
  const [authorVisible, setAuthorVisible] = useState(true);
  const [calcDataVisible, setCalcDataVisible] = useState(true);
  const [indexName, setIndexName] = useState('');
  const [costCenterName, setCostCenterName] = useState('');
  const [printOpen, setPrintOpen] = useState(false);
  const [isOpenTotals, setIsOpenTotals] = useState(false);
  const [art523Visible, setArt523Visible] = useState(false);
  const [isArt523ModalVisible, setIsArt523ModalVisible] = useState(false);

  const {
    layout: {
      modalAddAuthor: { visible: addVisible },
      modalEditAuthor: { visible: editVisible },
      authorRow: { authorIndex },
    },
    layout,
    author,
    account,
    onSave,
    setAuthor,
    setAccount,
    newAccount,
    setLayout,
    setHelp,
    help,
    summary,
    addAuthor,
    onRegisterExpense,
    onRegisterFee,
    expenseVisible,
    feeVisible,
    toggleExpense,
    toggleFee,
    handleArt523Toggle,
    art523Enabled,
    expenseTotal,
    feeTotal,
    art523Total,
  } = useSimpleUpdate() as any;
  const accountServices = new AccountServices();
  const targetRef = useRef<HTMLElement | null>(null);
  const { nomenclatures } = useNomenclatures();

  const { ability } = useSelector((state: ApplicationState) => state.auth);

  const worker = new Worker(worker_script);

  const toggleAuthor = useCallback((payload?: boolean) => {
    setAuthorVisible(artVisible => (payload ? payload : !artVisible));
  }, []);

  const toggleCalcData = useCallback(() => {
    setCalcDataVisible(calcDataVisible => !calcDataVisible);
  }, []);

  const handleAuthorAdd = useCallback(() => {
    setLayout((layout: any) => ({ ...layout, modalAddAuthor: { visible: true } }));
  }, []);

  const handleAddExpense = useCallback(() => {
    onRegisterExpense();
    toggleExpense(true);
  }, [onRegisterExpense, toggleExpense]);

  const handleAddFee = useCallback(() => {
    onRegisterFee();
    toggleFee(true);
  }, [onRegisterFee, toggleFee]);

  const errorListener = () => {
    closeLoading();
    worker.terminate();
  };

  const listener = (event: MessageEvent) => {
    const message = event.data;

    if (message.type != 'decompressed') {
      worker.terminate();
      return;
    }

    const data: CurrentAccoutImp = JSON.parse(message.data);

    const costCenterFound = costCenters?.find(
      (costCenter: any) => costCenter.id.includes(data.account.costCenterId) || costCenter.name.includes('Padrão')
    );

    if (!costCenterFound) {
      worker.terminate();
      return;
    }

    if (message.data?.length) {
      if (data.account) {
        const payload: AccountImp = {
          ...data.account,
          updateTo: data.account.updateTo,
          positive: Boolean(data.account.positive),
          indexId: Number(data.account.indexId),
          id: accountId,
          costCenterId: costCenterFound.id,
        };

        const current: CurrentAccountImp = {
          ...account,
          current: payload,
          infos: { ...account.infos, type: data.type || '' },
        };

        setAccount(current);

        if (data.authors.length) setAuthor({ ...author, list: data.authors });
      }
    }
    closeLoading();
  };

  const showAccount = useCallback(async () => {
    try {
      openLoading();

      const hasCostCenters = costCenters?.length;
      const hasAccount = accountId?.trim()?.length;
      const isNewAccount = history.location.pathname.includes('/new');

      if (!hasAccount || !hasCostCenters || isNewAccount) throw '';

      const currentAccount = await accountServices.showAccount(accountId);

      const compressed = currentAccount.data ? currentAccount.data : '';
      worker.postMessage({ type: 'decompress', data: compressed });
      worker.addEventListener('message', listener);
      worker.addEventListener('error', errorListener);
    } catch (error) {
      closeLoading();
    }
  }, [openLoading, closeLoading, accountId, setAccount, setAuthor, costCenters]);

  const saveBeforeLeave = async () => {
    await onSave({ isNewAccount: Boolean(accountId?.length) });
  };

  const handleAddAuthor = useCallback(
    (values: CurrentAuthorImp) => {
      try {
        addAuthor({ author: values });
      } catch (error) {
        alertMessage.error(error.message || `Erro ao adicionar ${values.name}`);
      }
    },
    [addAuthor]
  );

  const handleEditAuthor = useCallback(
    (values: CurrentAuthorImp) => {
      try {
        const resetValues: CurrentAuthorImp = {
          ...author.list[authorIndex],
          name: values.name,
        };
        const list = author.list;
        list[authorIndex] = _.cloneDeep(resetValues);

        setAuthor({
          ...author,
          list,
        });
      } catch (error) {
        alertMessage.error(error.message || `Erro ao adicionar ${values.name}`);
      }
    },
    [author, authorIndex]
  );

  useEffect(() => {
    showAccount();

    return () => {
      setAuthor({ list: [], pagination: {} } as any);
      // setLayout and setAccount cleanup
    };
  }, [accountId, costCenters]);

  useEffect(() => {
    console.log(
      '[Simple:Redirect] account.list.length:',
      account.list.length,
      'isCharged:',
      history?.location?.state?.isCharged,
      'state:',
      JSON.stringify(history?.location?.state)
    );
    if (!account.list.length && !history?.location?.state?.isCharged) {
      console.log('[Simple:Redirect] REDIRECTING to list page');
      history.push(listSimpleUpdatePage.path, { force: true });
      return;
    }

    const isNewAccount = history.location.pathname.includes('/new');
    if (!isNewAccount) return;

    const isIlimitated = accountConditions?.limit == 999;

    if (accountConditions?.limit && !isIlimitated && account.list.length >= accountConditions?.limit) {
      history.push(listSimpleUpdatePage.path, { force: true });
      alertMessage.error(`Você atingiu o limite contas permitidas!`);
      return;
    }
  }, [account.list.length]);

  useEffect(() => {
    setSidebar((sidebar: any) => ({ ...sidebar, title: labelsEnum.SIMPLE_UPDATE }));
    return () => setSidebar((sidebar: any) => ({ ...sidebar, title: null }));
  }, []);

  useEffect(() => {
    toolbar.setType(pathEnum.SIMPLE_UPDATE);

    toolbar.setVisibleButtons({
      ...initialVisibleButtons,
      new: true,
      open: true,
      undo: true,
      save: true,
      view: true,
      calculator: true,
      print: true,
      export: true,
    });

    setVisibleToolbar(true);

    toolbar.setCurrentAccount((currentAccount: any) => ({
      ...currentAccount,
      new: () => {
        newAccount();
        const isNewAccount = history.location.pathname.includes('/new');
        history.push(newSimpleUpdatePage.path, { force: !isNewAccount, reset: true });
      },
      undo: () => {
        const isNewAccount = history.location.pathname.includes('/new');
        isNewAccount
          ? history.replace(newSimpleUpdatePage.path)
          : accountId && history.replace(editSimpleUpdatePage.path.replace(':accountId', accountId));
      },
      open: () => {
        history.push(listSimpleUpdatePage.path);
      },
      save: (accountId: string) => {
        history.push(editSimpleUpdatePage.path.replace(':accountId', accountId));
      },
      print: () => {
        setPrintOpen(true);
      },
      exportCalc: (payload: IDummyObject) => {
        const worker = new Worker(worker_script);

        delete payload.account.id;
        delete payload.account.userId;

        const encJson = CryptoJS.AES.encrypt(
          JSON.stringify(payload),
          process.env.REACT_APP_ENCRYPTION_SECRET_KEY
        ).toString();

        const encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));

        worker.postMessage({ type: 'compress', data: encData });

        worker.addEventListener('message', async function (event) {
          if (event.data.type === 'compressed') {
            try {
              const dataBase64compressed = event.data.data;

              const binaryStringToArrayBuffer = (binary: any) => {
                const len = binary.length;
                const buffer = new ArrayBuffer(len);
                const view = new Uint8Array(buffer);
                for (let i = 0; i < len; i++) {
                  view[i] = binary.charCodeAt(i);
                }
                return buffer;
              };

              const arrayBuffer = binaryStringToArrayBuffer(dataBase64compressed);
              const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });

              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `${payload.account.name}.sei`;

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              console.info(`${(Buffer.byteLength(event.data.data) / 1000000).toFixed(2)} mb`);
            } catch (error) {
              console.log(error);
            } finally {
              worker.terminate();
            }
          }
        });
      },
      importCalc: () => {},
    }));

    return () => {
      setVisibleToolbar(false);
      toolbar.setType(undefined);
      toolbar.setCurrentAccount(undefined);
    };
  }, []);

  const accountTotal = useMemo(
    () =>
      author.list.reduce(
        (prevAuthor: number, currentAuthor: any) => prevAuthor + calculateSimpleAuthorTotals(currentAuthor).total,
        0
      ),
    [author.list]
  );

  useEffect(() => {
    setResults([
      {
        title: getFieldName(labelsEnum.SIMPLE_UPDATE_TOTAL, nomenclatures),
        onClick: () => setIsOpenTotals((isOpen: boolean) => !isOpen),
        currency: ' R$',
        result: accountTotal,
      },
    ]);
    return () => setResults([]);
  }, [accountTotal, nomenclatures, setResults]);

  useEffect(() => {
    const costCenter = costCenters.find((costCenter: any) => account.current.costCenterId === costCenter.id);
    setCostCenterName(costCenter?.name || 'não selecionado');
  }, [account.current.costCenterId]);

  const currentAuthor = author.list[authorIndex];

  const getCurrencyValue = useCallback(
    (value: number) => valueWithCurrency(getCoin(account.current.updateTo || new Date().toISOString(), 0), value),
    [account.current.updateTo]
  );

  const authorSummaryTotals = useMemo(() => calculateSimpleAuthorTotals(currentAuthor), [currentAuthor]);

  const authorResult = authorSummaryTotals.total;

  const authorTotalsTooltip = useMemo<TabTotalTooltipItem[]>(() => {
    const occurrences = currentAuthor?.occurrences || [];
    const expenses = currentAuthor?.expenses || [];
    const fees = currentAuthor?.fees || [];
    if (!occurrences.length && !expenses.length && !fees.length) return [];

    return [
      { title: 'Resumo do Autor' },
      { title: 'Parcelas', total: getCurrencyValue(authorSummaryTotals.installmentTotal) },
      { title: 'Juros Parcelas', total: getCurrencyValue(authorSummaryTotals.installmentInterestTotal) },
      { title: 'Multa Parcelas', total: getCurrencyValue(authorSummaryTotals.installmentFineTotal) },
      { title: 'Pagamentos', total: getCurrencyValue(-authorSummaryTotals.paymentTotal) },
      { title: 'Juros Pagamentos', total: getCurrencyValue(-authorSummaryTotals.paymentInterestTotal) },
      { title: 'Despesas', total: getCurrencyValue(authorSummaryTotals.expenseTotal) },
      { title: 'Honorários', total: getCurrencyValue(authorSummaryTotals.feeTotal) },
      { title: 'Total', total: getCurrencyValue(authorSummaryTotals.total) },
    ];
  }, [
    authorSummaryTotals.expenseTotal,
    authorSummaryTotals.feeTotal,
    authorSummaryTotals.installmentFineTotal,
    authorSummaryTotals.installmentInterestTotal,
    authorSummaryTotals.installmentTotal,
    authorSummaryTotals.paymentInterestTotal,
    authorSummaryTotals.paymentTotal,
    authorSummaryTotals.total,
    currentAuthor?.expenses,
    currentAuthor?.fees,
    currentAuthor?.occurrences,
    getCurrencyValue,
  ]);

  const expenseTotalsTooltip = useMemo<TabTotalTooltipItem[]>(() => {
    const expenses = currentAuthor?.expenses || [];
    if (!expenses.length) return [];

    const corrected = expenses.reduce(
      (sum: number, expense: any) => sum + (expense.correctedValue || expense.total || expense.value || 0),
      0
    );

    return [
      { title: 'Total Despesas' },
      { title: 'Despesas corrigidas', total: getCurrencyValue(corrected) },
      { title: 'Total', total: getCurrencyValue(corrected) },
    ];
  }, [currentAuthor?.expenses, getCurrencyValue]);

  const feeTotalsTooltip = useMemo<TabTotalTooltipItem[]>(() => {
    const fees = currentAuthor?.fees || [];
    if (!fees.length) return [];

    const corrected = fees.reduce(
      (sum: number, fee: any) => sum + (fee.correctedValue || fee.total || fee.calculated || fee.value || 0),
      0
    );

    return [
      { title: 'Total Honorários' },
      { title: 'Honorários corrigidos', total: getCurrencyValue(corrected) },
      { title: 'Total', total: getCurrencyValue(corrected) },
    ];
  }, [currentAuthor?.fees, getCurrencyValue]);

  const calcDataResult = !calcDataVisible
    ? `${labelsEnum.INDEX}: ${indexName}, ${labelsEnum.COST_CENTER}: ${costCenterName}, ${labelsEnum.UPDATE_TO}: ${account.current.updateTo}`
    : '';

  const handleEnterAsTab = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) return;

    const target = event.target as HTMLElement;
    const editableSelector = 'input:not([type="hidden"]), select, textarea, [contenteditable="true"]';
    if (!target.matches(editableSelector)) return;

    const field = target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const isReadOnly = target.getAttribute('readonly') !== null;
    if (field.disabled || isReadOnly || field.tabIndex === -1) return;

    event.preventDefault();

    const elements = Array.from(
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(editableSelector)
    ).filter(element => {
      const rect = element.getBoundingClientRect();
      return (
        !element.disabled &&
        element.getAttribute('readonly') === null &&
        element.tabIndex !== -1 &&
        rect.width > 0 &&
        rect.height > 0
      );
    });

    const currentIndex = elements.indexOf(field);
    const nextElement = elements[currentIndex + 1] || elements[0];
    nextElement?.focus();
    if (nextElement instanceof HTMLInputElement || nextElement instanceof HTMLTextAreaElement) nextElement.select();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.persist();
    const VALUE_FIELD_ID = 'value';
    const onKeyDown = (type: 'up' | 'down') => {
      const form = targetRef.current?.getElementsByTagName('form');
      if (form) {
        let isValueOrDescrition = false;
        let inputIndex = -1;

        (event.target as any)?.focus();

        const currentIndex = Array.from(form).findIndex(currentForm => {
          if (Object(event.target).id.includes('date')) {
            const calendar = document.getElementsByClassName('react-datepicker-popper');
            if (calendar.item(0)) calendar.item(0)?.remove();
          }
          isValueOrDescrition = Object(event.target).id.includes(VALUE_FIELD_ID);
          const CURRENT_FORM = Array.from(currentForm);
          inputIndex = CURRENT_FORM.findIndex(currentInput => currentInput == Object(event.target));
          return inputIndex != -1;
        });

        if (currentIndex != -1 && inputIndex != -1) {
          const newFormIndex = type == 'up' ? currentIndex + 1 : currentIndex - 1;
          const formLength = form.length;
          const input = newFormIndex < formLength ? form[newFormIndex] : form[formLength];
          if (!input) return;

          const DESCRIPTION_ID = 0;
          const valueInputIndex = isValueOrDescrition
            ? Array.from(input).findIndex(target => target.id.includes(VALUE_FIELD_ID))
            : DESCRIPTION_ID;

          const elememt = Object(input[valueInputIndex]);

          if (elememt) {
            elememt.blur();
            elememt.focus();
          }
        }
      }
    };

    switch (event.keyCode) {
      case 38:
        return onKeyDown('down');
      case 40:
        return onKeyDown('up');
    }
  };

  const fetchTooltipMappings = async () => {
    try {
      const simpleUpdateSection: { [key: string]: string } = {
        'calc-data': '',
        'cost-center': '',
        'update-to': '',
        deflation: '',
        'purges-apply': '',
        'pro-rata': '',
        'author-add': '',
        'occurrence-add': '',
        'expense-add': '',
        'fee-add': '',
      };

      const simpleUpdateSectionLink: { [key: string]: string } = {
        'calc-data': '',
        'cost-center': '',
        'update-to': '',
        deflation: '',
        'purges-apply': '',
        'pro-rata': '',
        'author-add': '',
        'occurrence-add': '',
        'expense-add': '',
        'fee-add': '',
      };

      const pageName = listSimpleUpdatePage.path;
      const response = await http().get(`/wrapper/tooltip-mappings?pageName=${pageName}&operator=or`);

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        const sectionId = element.sectionId;

        const elementSorteds = isEqual(sectionId, 'occurrence-add')
          ? element.tooltips.sort((a: any, b: any) => {
              const order = ['Parcelas', 'Pagamentos', 'Despesas', 'Honorários'];
              const indexA = order.findIndex(keyword => isEqual(a.title, keyword));
              const indexB = order.findIndex(keyword => isEqual(b.title, keyword));

              if (indexA === -1 && indexB === -1) return 0;
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;

              return indexA - indexB;
            })
          : element.tooltips;

        const content = elementSorteds.reduce((a: any, b: any) => a + `${b.title}: ${b.content}` + '\n', '');

        simpleUpdateSection[sectionId] = content;
        simpleUpdateSectionLink[sectionId] = element.link;
      }

      const _help = {
        updateTo: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['update-to'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['update-to'] : undefined,
          minWidth: rem(400),
        },
        proRata: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['pro-rata'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['pro-rata'] : undefined,
          minWidth: rem(400),
        },
        costCenter: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['cost-center'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['cost-center'] : undefined,
          minWidth: rem(400),
        },
        purges: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['purges-apply'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['purges-apply'] : undefined,
          minWidth: rem(400),
        },
        deflation: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['deflation'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['deflation'] : undefined,
          minWidth: rem(400),
        },
        occurrenceAdd: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['occurrence-add'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['occurrence-add'] : undefined,
          minWidth: rem(400),
        },
        authorAdd: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['author-add'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['author-add'] : undefined,
          minWidth: rem(400),
        },
        calcData: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['calc-data'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['calc-data'] : undefined,
          minWidth: rem(400),
        },
        expenseAdd: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['expense-add'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['expense-add'] : undefined,
          minWidth: rem(400),
        },
        feeAdd: {
          link: simpleUpdateSectionLink ? simpleUpdateSectionLink['fee-add'] : undefined,
          text: simpleUpdateSection ? simpleUpdateSection['fee-add'] : undefined,
          minWidth: rem(400),
        },
      };

      setHelp(_help);
    } catch {
      // tooltip mappings not available for this page yet
    }
  };

  useEffect(() => {
    fetchTooltipMappings();
  }, []);

  useEffect(() => {
    const _articleVisible = ability.rules.find(
      (rule: any) => rule.subject === 'ArticleApply' && rule.action === 'view'
    );
    setArt523Visible(!!_articleVisible);
  }, [ability]);

  return (
    <CalcDataContainer onKeyDownCapture={handleEnterAsTab}>
      <PrintSimpleUpdate open={printOpen} setOpen={setPrintOpen} />
      <RouteLeavingGuard message={messagesEnum.SAVE_BEFORE_LEAVE} saveBeforeLeave={saveBeforeLeave} />
      <Tab
        title={labelsEnum.CALC_DATA}
        Icon={calcDataVisible ? IoMdArrowDropup : IoMdArrowDropdown}
        visible={calcDataVisible}
        result={calcDataResult}
        helpText={help?.calcData.text}
        helpLink={help?.calcData.link}
        helpMinWidth={help?.calcData.minWidth}
        onClick={toggleCalcData}
        uppercase={false}>
        <CalcClosedContent
          onKeyDown={handleKeyDown}
          ref={(el: any) => {
            targetRef.current = el;
            return targetRef;
          }}>
          <Formik initialValues={account.current || {}} onSubmit={() => {}}>
            <CalcData />
          </Formik>
        </CalcClosedContent>
      </Tab>
      <Tab
        onClick={handleAuthorAdd}
        visible={authorVisible}
        toggle={toggleAuthor}
        currency="R$ "
        result={authorResult}
        Icon={IoIosAdd}
        ResultIcon={authorVisible ? IoMdArrowDropup : IoMdArrowDropdown}
        title={`${labelsEnum.ADD} ${getFieldName(labelsEnum.AUTHOR, nomenclatures)}`}
        helpText={help?.authorAdd.text}
        helpLink={help?.authorAdd.link}
        authors={author.list}
        isAuthor={true}
        updateTo={account.current.updateTo}
        helpMinWidth={help?.authorAdd.minWidth}
        resultTitle={getFieldName(labelsEnum.AUTHOR_TOTAL, nomenclatures)}
        resultTooltip={authorTotalsTooltip}
        uppercase={false}>
        <CalcClosedContent>
          <AuthorList />
        </CalcClosedContent>
      </Tab>

      {/* === NÍVEL RAIZ: Incluir Despesas === */}
      <Tab
        title={labelsEnum.EXPENSES_ADD}
        Icon={IoIosAdd}
        onClick={handleAddExpense}
        ResultIcon={expenseVisible ? IoMdArrowDropup : IoMdArrowDropdown}
        toggle={toggleExpense}
        visible={expenseVisible}
        currency="R$ "
        result={expenseTotal}
        resultTitle={labelsEnum.TOTAL_EXPENSES}
        helpText={help?.expenseAdd?.text}
        helpLink={help?.expenseAdd?.link}
        helpMinWidth={help?.expenseAdd?.minWidth}
        totalsTooltip={expenseTotalsTooltip}
        uppercase={false}>
        <CalcClosedContent>
          <ExpenseList />
        </CalcClosedContent>
      </Tab>

      {/* === NÍVEL RAIZ: Incluir Honorários === */}
      <Tab
        title={labelsEnum.FEES_ADD}
        Icon={IoIosAdd}
        onClick={handleAddFee}
        ResultIcon={feeVisible ? IoMdArrowDropup : IoMdArrowDropdown}
        toggle={toggleFee}
        visible={feeVisible}
        currency="R$ "
        result={feeTotal}
        resultTitle={labelsEnum.TOTAL_FEES}
        helpText={help?.feeAdd?.text}
        helpLink={help?.feeAdd?.link}
        helpMinWidth={help?.feeAdd?.minWidth}
        totalsTooltip={feeTotalsTooltip}
        uppercase={false}>
        <CalcClosedContent>
          <FeeList />
        </CalcClosedContent>
      </Tab>

      {/* === NÍVEL RAIZ: Incluir Art. 523 (checkbox no lugar do +) === */}
      {art523Visible && (
        <Tab
          title={labelsEnum.ART523_ADD}
          checkbox
          checked={art523Enabled}
          onCheckboxChange={handleArt523Toggle}
          onClick={() => setIsArt523ModalVisible(true)}
          visible={false}
          currency="R$ "
          result={art523Total}
          resultTitle={labelsEnum.TOTAL_ART523}
          helpText={help?.art523Add?.text}
          helpLink={help?.art523Add?.link}
          helpMinWidth={help?.art523Add?.minWidth}
          uppercase={false}>
          <Fragment />
        </Tab>
      )}
      <Art523Modal isOpen={isArt523ModalVisible} onClose={() => setIsArt523ModalVisible(false)} />

      <Formik initialValues={{ name: '' } as any} onSubmit={handleAddAuthor}>
        {addVisible && <ModalAddAuthor />}
      </Formik>
      <Formik initialValues={{ name: '' } as any} onSubmit={handleEditAuthor}>
        {editVisible && <ModalEditAuthor />}
      </Formik>
      <GenerateShortCuts onShortcuts={onShortcuts} />

      <ViewModal />
      <Indexes />
      <Recalculate setIndexName={setIndexName} />

      <UpdateToModal />
      <TotalsModal onClose={() => setIsOpenTotals(false)} isOpen={isOpenTotals} />
    </CalcDataContainer>
  );
};

export default SimpleCalculation;
