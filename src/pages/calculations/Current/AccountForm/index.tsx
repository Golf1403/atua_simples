import _, { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CurrentAccoutImp } from '@interfaces/SimpleAccountImp';
import AccountImp from '@interfaces/AccountImp';
import worker_script from '../../../../workersweb/compress';
import { useHistory, useParams } from 'react-router-dom';
import RouteLeavingGuard from '@/components/RouteLeavingGuard';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import useCurrentAccount, {
  initialAccount,
  initialAuthor,
  initialCurrentAuthor,
  initialLayout,
  typeArt354,
} from '@/hooks/currentAccount';
import {
  CurrentAccountImp,
  CurrentAuthorTypes,
  typeFeeArt,
  typeFineArt,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { useCore } from '@/hooks/core';
import { messagesEnum } from '@/enums/messagesEnum';
import { labelsEnum } from '@/enums/labelsEnum';
import { CalcClosedContent, CalcDataContainer } from './styles';
import { initialVisibleButtons, useToolbar } from '@/hooks/toolbar';
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import CalcData from './CalcData';
import CalcSelect, { typeAccountCurrent } from './CalcSelect';
import Tab from './Tab';
import { Formik } from 'formik';
import ArtAplication from './ArtAplication';
import { indexNegative, indexPositive } from '@/data/generalData/indexNegativeRadioOptions';
import ModalAddAuthor from '../ModalAddAuthor';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import AuthorList from '../AuthorList';
import { pathEnum } from '@/enums/pathEnum';
import ViewModal from '@/pages/calculations/Current/ViewModal';
import { editCurrentAccountPage, listCurrentAccountPage, newCurrentAccountPage } from '@/Routes/pages/calculations';
import Indexes from './Indexes';
import Recalculate from './Recalculate';
import ModalEditAuthor from '../ModalEditAuthor';
import { useResource } from '@/hooks/resourses';
import PrintCurrentAccount from '@/pages/Print/CurrentAccountPrint';
import { ApplicationState } from '@/store';
import { useSelector } from 'react-redux';
import UpdateToModal from './UpdateToModal';
import FeeFinesList from './ArtAplication/FeeFinesList';
import FeeFineService from '@/services/CalculationsServices/CurrentAccountService/FeeFineService';
import { getCoin } from '@/utils/numberUtils';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import AccountServices from '@/services/AccountServices';
import IDummyObject from '@/interfaces/IDummyObject';
import CryptoJS from 'crypto-js';
import GenerateShortCuts from '../AccountList/GenerateShortCuts';
import { currentAccount as onShortcuts } from '@/utils/shortcuts';
import http from '@/services/http';
import { rem } from '@/styles/global';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import TotalsModal from './TotalsModal';

interface TooltipData {
  id?: number;
  title: string;
  userId: string;
  content: string;
}

interface TooltipMappingData {
  id?: number;
  pageName: string;
  link: string;
  sectionId: string;
}

const CurrentCalculation = () => {
  const feeFineService = new FeeFineService();

  const history = useHistory<{ force?: boolean; isCharged?: boolean; reset?: boolean }>();
  const alertMessage = alertMessages();
  const { accountConditions } = useResource();
  const { costCenters, setSidebar } = useCore();
  const { accountId } = useParams<{ accountId?: string }>();
  const { openLoading, closeLoading } = useLoading();
  const { setVisible: setVisibleToolbar, ...toolbar } = useToolbar();
  const { setResults } = useCore();
  const [authorVisible, setAuthorVisible] = useState(true);
  const [artVisible, setArtVisible] = useState(false);
  const [calcDataVisible, setCalcDataVisible] = useState(true);
  const [indexName, setIndexName] = useState('');
  const [costCenterName, setCostCenterName] = useState('');
  const [printOpen, setPrintOpen] = useState(false);
  const [articleVisible, setArticleVisible] = useState(false);
  const [isOpenTotals, setIsOpenTotals] = useState(false);

  const {
    layout: {
      modalAddAuthor: { visible: addVisible },
      modalEditAuthor: { visible: editVisible },
      authorRow: { authorIndex },
    },
    layout,
    author,
    account,
    feeFines,
    onSave,
    setAuthor,
    setAccount,
    newAccount,
    setLayout,
    onCreateAuthor,
    setFeeFines,
    setHelp,
    help,
  } = useCurrentAccount();
  const accountServices = new AccountServices();
  const targetRef = useRef<HTMLElement | null>(null);
  const { nomenclatures } = useNomenclatures();

  const [artApplicationDropDowns, setArtApplicationDropDowns] = useState<
    {
      title: string;
      type: string;
      onClick: () => void;
    }[]
  >([]);

  const { ability } = useSelector((state: ApplicationState) => state.auth);

  const worker = new Worker(worker_script);

  const toggleAuthor = useCallback((payload?: boolean) => {
    setAuthorVisible(artVisible => (payload ? payload : !artVisible));
  }, []);

  const toggleArt = useCallback(() => {
    setArtVisible(artVisible => !artVisible);
  }, []);

  const toggleCalcData = useCallback(() => {
    setCalcDataVisible(calcDataVisible => !calcDataVisible);
  }, []);

  const handleAuthorAdd = useCallback(() => {
    setLayout(layout => ({ ...layout, modalAddAuthor: { visible: true } }));
  }, []);

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
      costCenter => costCenter.id.includes(data.account.costCenterId) || costCenter.name.includes('Padrão')
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
          infos: { ...account.infos, type: data.type || typeArt354.id },
        };

        setAccount(current);

        if (data.authors.length) setAuthor({ ...author, list: data.authors });
      }

      if (data.feeFines?.list) setFeeFines(data.feeFines);
      else if (data.feeFines) setFeeFines({ list: data.feeFines as any, total: data.feeFines.total });
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
        onCreateAuthor({ authorName: values.name });
      } catch (error) {
        alertMessage.error(error.message || `Erro ao adicionar ${values.name}`);
      }
    },
    [author, layout]
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

        const newAuthor: CurrentAuthorTypes = {
          ...author,
          list,
        };

        setAuthor(newAuthor);
      } catch (error) {
        alertMessage.error(error.message || `Erro ao adicionar ${values.name}`);
      }
    },
    [author, authorIndex]
  );

  useEffect(() => {
    showAccount();

    return () => {
      setFeeFines({ total: 0, list: [] });
      setAuthor(initialAuthor);
      setLayout(initialLayout);
      setAccount(account => ({ ...initialAccount, list: account.list }));
    };
  }, [accountId, costCenters]);

  useEffect(() => {
    if (!account.list.length && !history?.location?.state?.isCharged) {
      history.push(listCurrentAccountPage.path, { force: true });
      return;
    }

    const isNewAccount = history.location.pathname.includes('/new');
    if (!isNewAccount) return;

    const isIlimitated = accountConditions?.limit == 999;

    if (accountConditions?.limit && !isIlimitated && account.list.length >= accountConditions?.limit) {
      history.push(listCurrentAccountPage.path, { force: true });
      alertMessage.error(`Você atingiu o limite contas permitidas!`);
      return;
    }
  }, [account.list.length]);

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.CURRENT_ACCOUNT }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  useEffect(() => {
    toolbar.setType(pathEnum.CURRENT_ACCOUNT);

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

    toolbar.setCurrentAccount(currentAccount => ({
      ...currentAccount,
      new: () => {
        newAccount();
        const isNewAccount = history.location.pathname.includes('/new');
        history.push(newCurrentAccountPage.path, { force: !isNewAccount, reset: true });
      },
      undo: () => {
        const isNewAccount = history.location.pathname.includes('/new');

        setAccount(
          isNewAccount ? initialAccount : { ...initialAccount, current: { ...initialAccount.current, id: accountId } }
        );

        setAuthor(initialAuthor);

        isNewAccount
          ? history.replace(newCurrentAccountPage.path)
          : accountId && history.replace(editCurrentAccountPage.path.replace(':accountId', accountId));
      },
      open: () => {
        history.push(listCurrentAccountPage.path);
      },
      save: (accountId: string) => {
        history.push(editCurrentAccountPage.path.replace(':accountId', accountId));
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

  useEffect(() => {
    const total = author.list.reduce(
      (prevAuthor, currentAuthor) => currentAuthor.occurrenceTotal + currentAuthor.expenseTotal + prevAuthor,
      0
    );
    setResults([
      {
        title: getFieldName(labelsEnum.CURRENT_ACCOUNT_TOTAL, nomenclatures),
        onClick: () => setIsOpenTotals(isOpen => !isOpen),
        currency: ' R$',
        result: total,
      },
    ]);
    return () => setResults([]);
  }, [author.list]);

  useEffect(() => {
    const costCenter = costCenters.find(costCenter => account.current.costCenterId === costCenter.id);
    setCostCenterName(costCenter?.name || 'não selecionado');
  }, [account.current.costCenterId]);

  useEffect(() => {
    const _articleVisible = ability.rules.find(
      (rule: any) => rule.subject === 'ArticleApply' && rule.action === 'view'
    );

    setArticleVisible(!!_articleVisible);
  }, [ability]);

  useEffect(() => {
    const fine = {
      title: getFieldName(labelsEnum.FINE, nomenclatures),
      type: typeFineArt.id,
      onClick: () => {
        const _feeFines = feeFineService.create({ type: typeFineArt.id, feeFines, updateTo: account.current.updateTo });
        setFeeFines(_feeFines);
      },
    };
    const fee = {
      title: getFieldName(labelsEnum.FEE, nomenclatures),
      type: typeFeeArt.id,
      onClick: () => {
        const _feeFines = feeFineService.create({ type: typeFeeArt.id, feeFines, updateTo: account.current.updateTo });
        setFeeFines(_feeFines);
      },
    };

    const _dropdowns = [];

    _dropdowns.push(fine);
    _dropdowns.push(fee);

    setArtApplicationDropDowns(_dropdowns);
  }, [feeFines, setFeeFines, account.current.updateTo]);

  useEffect(() => {
    setTimeout(() => {
      setArtVisible(true);
    }, timeoutEnum.HALF_SECONDS);
  }, []);

  const authorResult = author.list.length
    ? (author.list[authorIndex]?.occurrenceTotal || 0) + (author.list[authorIndex]?.expenseTotal || 0)
    : 0;

  const calcDataResult = !calcDataVisible
    ? `${labelsEnum.INDEX}: ${indexName}, ${labelsEnum.COST_CENTER}: ${costCenterName}, ${labelsEnum.DEFLATION}: ${
        account.current.positive ? indexPositive.label : indexNegative.label
      }, ${labelsEnum.UPDATE_TO}: ${account.current.updateTo}`
    : '';

  const artResult = feeFines?.total || 0;

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
    const currentAccountSection: { [key: string]: string } = {
      'calc-data': '',
      'calc-type': '',
      'cost-center': '',
      'update-to': '',
      deflation: '',
      'purges-apply': '',
      'pro-rata': '',
      'author-add': '',
      'occurrence-add': '',
      'interest-fines-add': '',
      'fee-fines-add': '',
      'without-correction': '',
      cpc: 'CPC',
    };

    const currentAccountSectionLink: { [key: string]: string } = {
      'calc-data': '',
      'calc-type': '',
      'cost-center': '',
      'update-to': '',
      deflation: '',
      'purges-apply': '',
      'pro-rata': '',
      'author-add': '',
      'occurrence-add': '',
      'interest-fines-add': '',
      'fee-fines-add': '',
      'without-correction': '',
      cpc: 'CPC',
    };

    const pageName = listCurrentAccountPage.path;
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

      currentAccountSection[sectionId] = content;
      currentAccountSectionLink[sectionId] = element.link;
    }

    const _help = {
      updateTo: {
        link: currentAccountSectionLink ? currentAccountSectionLink['update-to'] : undefined,
        text: currentAccountSection ? currentAccountSection['update-to'] : undefined,
        minWidth: rem(400),
      },
      proRata: {
        link: currentAccountSectionLink ? currentAccountSectionLink['pro-rata'] : undefined,
        text: currentAccountSection ? currentAccountSection['pro-rata'] : undefined,
        minWidth: rem(400),
      },
      costCenter: {
        link: currentAccountSectionLink ? currentAccountSectionLink['cost-center'] : undefined,
        text: currentAccountSection ? currentAccountSection['cost-center'] : undefined,
        minWidth: rem(400),
      },
      purges: {
        link: currentAccountSectionLink ? currentAccountSectionLink['purges-apply'] : undefined,
        text: currentAccountSection ? currentAccountSection['purges-apply'] : undefined,
        minWidth: rem(400),
      },
      deflation: {
        link: currentAccountSectionLink ? currentAccountSectionLink['deflation'] : undefined,
        text: currentAccountSection ? currentAccountSection['deflation'] : undefined,
        minWidth: rem(400),
      },
      feeFinesAdd: {
        link: currentAccountSectionLink ? currentAccountSectionLink['fee-fines-add'] : undefined,
        text: currentAccountSection ? currentAccountSection['fee-fines-add'] : undefined,
        minWidth: rem(400),
      },
      occurrenceAdd: {
        link: currentAccountSectionLink ? currentAccountSectionLink['occurrence-add'] : undefined,
        text: currentAccountSection ? currentAccountSection['occurrence-add'] : undefined,
        minWidth: rem(400),
      },
      calcType: {
        link: currentAccountSectionLink ? currentAccountSectionLink['calc-type'] : undefined,
        text: currentAccountSection ? currentAccountSection['calc-type'] : undefined,
        minWidth: rem(400),
      },
      authorAdd: {
        link: currentAccountSectionLink ? currentAccountSectionLink['author-add'] : undefined,
        text: currentAccountSection ? currentAccountSection['author-add'] : undefined,
        minWidth: rem(400),
      },
      calcData: {
        link: currentAccountSectionLink ? currentAccountSectionLink['calc-data'] : undefined,
        text: currentAccountSection ? currentAccountSection['calc-data'] : undefined,
        minWidth: rem(400),
      },
      interestFinesAdd: {
        link: currentAccountSectionLink ? currentAccountSectionLink['interest-fines-add'] : undefined,
        text: currentAccountSection ? currentAccountSection['interest-fines-add'] : undefined,
        minWidth: rem(400),
      },
      withoutCorrection: {
        link: currentAccountSectionLink ? currentAccountSectionLink['without-correction'] : undefined,
        text: currentAccountSection ? currentAccountSection['without-correction'] : undefined,
        minWidth: rem(400),
      },
      cpc: {
        link: currentAccountSectionLink ? currentAccountSectionLink['cpc'] : undefined,
        text: currentAccountSection ? currentAccountSection['cpc'] : undefined,
        minWidth: rem(400),
      },
      expenseAdd: {
        link: currentAccountSectionLink ? currentAccountSectionLink['expense-add'] : undefined,
        text: currentAccountSection ? currentAccountSection['expense-add'] : undefined,
        minWidth: rem(400),
      },
    };

    setHelp(_help);
  };

  useEffect(() => {
    fetchTooltipMappings();
  }, []);

  return (
    <CalcDataContainer>
      <PrintCurrentAccount open={printOpen} setOpen={setPrintOpen} />
      <RouteLeavingGuard message={messagesEnum.SAVE_BEFORE_LEAVE} saveBeforeLeave={saveBeforeLeave} />
      <Tab
        title={labelsEnum.CALC_DATA}
        Icon={calcDataVisible ? IoMdArrowDropup : IoMdArrowDropdown}
        visible={calcDataVisible}
        result={calcDataResult}
        helpText={help?.calcData.text}
        helpLink={help?.calcData.link}
        helpMinWidth={help?.calcData.minWidth}
        onClick={toggleCalcData}>
        <CalcClosedContent
          onKeyDown={handleKeyDown}
          ref={el => {
            targetRef.current = el;
            return targetRef;
          }}>
          <Formik initialValues={initialAccount.current} onSubmit={() => {}}>
            <CalcData />
          </Formik>
        </CalcClosedContent>
      </Tab>
      <Tab
        visible={true}
        currency=" R$"
        helpText={help?.calcType.text}
        helpLink={help?.calcType.link}
        helpMinWidth={help?.calcType.minWidth}
        title={labelsEnum.SELECT_CALC_TYPE}>
        <CalcClosedContent>
          <Formik initialValues={{ type: typeAccountCurrent.id }} onSubmit={() => {}}>
            <CalcSelect />
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
        resultTitle={getFieldName(labelsEnum.AUTHOR_TOTAL, nomenclatures)}>
        <CalcClosedContent>
          <AuthorList />
        </CalcClosedContent>
      </Tab>
      {articleVisible && (
        <ArtAplication
          currency={getCoin(feeFines.list[feeFines.list.length - 1]?.dateEnd, 0)}
          result={artResult}
          resultTitle={getFieldName(labelsEnum.ART_TOTAL, nomenclatures)}
          ResultIcon={artVisible ? IoMdArrowDropup : IoMdArrowDropdown}
          toggle={toggleArt}
          visible={artVisible}
          Icon={IoIosAdd}
          helpText={help?.feeFinesAdd.text}
          helpLink={help?.feeFinesAdd.link}
          helpMinWidth={help?.feeFinesAdd.minWidth}
          dropDownActions={artApplicationDropDowns}
          title={labelsEnum.APPLICATION_ART_ADD}>
          <CalcClosedContent>
            <FeeFinesList />
          </CalcClosedContent>
        </ArtAplication>
      )}

      <Formik initialValues={initialCurrentAuthor} onSubmit={handleAddAuthor}>
        {addVisible && <ModalAddAuthor />}
      </Formik>
      <Formik initialValues={initialCurrentAuthor} onSubmit={handleEditAuthor}>
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

export default CurrentCalculation;
