import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { useFormikContext } from 'formik';
import {
  AuthorAction,
  AuthorCount,
  AuthorListContainer,
  AuthorName,
  BackgroudContainer,
  ButtonAction,
  InputContainer,
  TabContainer,
  Tooltip,
  VerticalLine,
  Form,
} from '../AuthorList/styles';
import { FaEdit, FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { labelsEnum } from '@/enums/labelsEnum';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import CustomSelect from '@/components/CustomSelect';
import { CalcClosedContent } from '../AccountForm/styles';
import Tab from './Tab';
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import OccurrenceList from '../OccurrenceList';
import { typeinstallment, typePayment } from '@/hooks/interfaces/CurrentAccountHookImp';
import { useResource } from '@/hooks/resourses';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { getFieldName } from '@/lib/nomenclature';
import { valueWithCurrency } from '@/lib/currency';
import { getCoin } from '@/utils/numberUtils';

interface TabTotalTooltipItem {
  title: string;
  total?: string;
}

const AuthorForm = (): JSX.Element => {
  const {
    onDuplicateAuthor,
    onRemoveAuthor,
    layout: {
      authorRow: { authorIndex: authorSelected },
    },
    setLayout,
    author: stateAuthor,
    account,
    help,
    onRegisterOccurrence,
    installmentVisible,
    toggleInstallment,
    installmentTotal,
  } = useSimpleUpdate() as any;

  const { isCanInstallment, isCanPayment } = useResource();

  const { values, setFieldValue } = useFormikContext<CurrentAuthorImp & { authorIndex: number }>();
  const [isModalVisible, setModalVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const author = stateAuthor.list[authorSelected];

  const [installmentPaymentDropDowns, setInstallmentPaymentDropDowns] = useState<
    { title: string; type: string; onClick: () => void }[]
  >([]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleDuplicateAuthor = useCallback(() => {
    onDuplicateAuthor({ authorIndex: values.authorIndex });
  }, [stateAuthor, values.authorIndex]);

  const handleAuthorRemove = useCallback(async () => {
    onRemoveAuthor({ authorIndex: values.authorIndex });
    await setFieldValue('authorIndex', 0);
  }, [stateAuthor, values.authorIndex]);

  const handleEditAuthor = useCallback(() => {
    setLayout((layout: any) => ({
      ...layout,
      modalEditAuthor: { visible: true },
    }));
  }, [setLayout]);

  useEffect(() => {
    setFieldValue('name', author.name);
  }, []);

  useEffect(() => {
    setFieldValue('authorIndex', authorSelected);
  }, [authorSelected]);

  useEffect(() => {
    const installment = {
      title: getFieldName(labelsEnum.INSTALLMENTS, nomenclatures),
      type: typeinstallment.id,
      onClick: () => {
        onRegisterOccurrence({ type: typeinstallment.id, newestOccurrence: true });
      },
    };
    const payment = {
      title: getFieldName(labelsEnum.PAYMENT, nomenclatures),
      type: typePayment.id,
      onClick: () => {
        onRegisterOccurrence({ type: typePayment.id, newestOccurrence: true });
      },
    };

    const _dropdowns = [];
    isCanInstallment && _dropdowns.push(installment);
    isCanPayment && _dropdowns.push(payment);

    setInstallmentPaymentDropDowns(_dropdowns);
  }, [nomenclatures, isCanInstallment, isCanPayment, onRegisterOccurrence]);

  const authorOptions = stateAuthor.list.map((author: any, key: number) => ({
    id: key,
    label: author.name,
    value: key,
  }));

  const getCurrencyValue = useCallback(
    (value: number) => valueWithCurrency(getCoin(account.current.updateTo || new Date().toISOString(), 0), value),
    [account.current.updateTo]
  );

  const occurrenceTotalsTooltip = useMemo<TabTotalTooltipItem[]>(() => {
    const occurrences = author?.occurrences || [];
    if (!occurrences.length) return [];

    const getOccurrenceValue = (occurrence: any) =>
      occurrence.correctedValue || occurrence.total || occurrence.value || 0;
    const getInterestValue = (occurrence: any) =>
      (occurrence.interests || []).reduce((sum: number, interest: any) => sum + (interest.calculated || 0), 0);
    const getFineValue = (occurrence: any) =>
      (occurrence.fines || []).reduce((sum: number, fine: any) => sum + (fine.calculated || 0), 0);

    const installments = occurrences.filter((occurrence: any) => occurrence.type === typeinstallment.id);
    const payments = occurrences.filter((occurrence: any) => occurrence.type === typePayment.id);
    const tooltip: TabTotalTooltipItem[] = [];

    if (installments.length) {
      const corrected = installments.reduce((sum: number, occurrence: any) => sum + getOccurrenceValue(occurrence), 0);
      const interest = installments.reduce((sum: number, occurrence: any) => sum + getInterestValue(occurrence), 0);
      const fine = installments.reduce((sum: number, occurrence: any) => sum + getFineValue(occurrence), 0);

      tooltip.push(
        { title: 'Total Parcela' },
        { title: 'Parcela corrigida', total: getCurrencyValue(corrected) },
        { title: 'Total Juros', total: getCurrencyValue(interest) },
        { title: 'Total Multa', total: getCurrencyValue(fine) },
        { title: 'Total', total: getCurrencyValue(corrected + interest + fine) }
      );
    }

    if (payments.length) {
      const corrected = payments.reduce((sum: number, occurrence: any) => sum + getOccurrenceValue(occurrence), 0);
      const interest = payments.reduce((sum: number, occurrence: any) => sum + getInterestValue(occurrence), 0);

      tooltip.push(
        { title: 'Total Pagamento' },
        { title: 'Pagamento corrigido', total: getCurrencyValue(corrected) },
        { title: 'Total Juros', total: getCurrencyValue(interest) },
        { title: 'Total', total: getCurrencyValue(corrected + interest) }
      );
    }

    return tooltip;
  }, [author?.occurrences, getCurrencyValue]);

  return (
    <Form
      onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
        if (e.target.name.includes('authorIndex'))
          setLayout((layout: any) => ({
            ...layout,
            authorRow: {
              ...layout.authorRow,
              [e.target.name]: Number(e.target.value),
            },
          }));
      }}>
      <AuthorListContainer>
        <AuthorName>
          <VerticalLine />
          <AuthorCount>{Number(authorSelected) + 1}</AuthorCount>
          <InputContainer>
            <CustomSelect icon={IoMdArrowDropdown} name="authorIndex" value={authorSelected} options={authorOptions} />
          </InputContainer>
        </AuthorName>
        <AuthorAction>
          <BackgroudContainer>
            <ButtonAction onBlur={e => e.preventDefault()} onClick={handleEditAuthor}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.EDIT} ${
                  author.name.length ? author.name : getFieldName(labelsEnum.AUTHOR, nomenclatures)
                }`}>
                <FaEdit />
              </Tooltip>
            </ButtonAction>
            <ButtonAction onClick={handleDuplicateAuthor}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DUPLICATE} ${
                  author.name.length ? author.name : getFieldName(labelsEnum.AUTHOR, nomenclatures)
                }`}>
                <FaRegCopy />
              </Tooltip>
            </ButtonAction>
            <ButtonAction
              onClick={event => {
                if (event.ctrlKey || event.shiftKey) {
                  handleAuthorRemove();
                } else {
                  openModal();
                }
              }}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DELETE} ${
                  author.name.length ? author.name : getFieldName(labelsEnum.AUTHOR, nomenclatures)
                }`}>
                <FaTrashAlt />
              </Tooltip>
            </ButtonAction>
            <OcurrenceDeleteModal
              visible={isModalVisible}
              closeModal={closeModal}
              removeOcurrence={handleAuthorRemove}
            />
          </BackgroudContainer>
        </AuthorAction>
      </AuthorListContainer>

      {/* Tab "Incluir Ocorrências" — FILHO do autor, só Parcela + Pagamento */}
      {(isCanInstallment || isCanPayment) && (
        <TabContainer $visibility={true}>
          <Tab
            title={labelsEnum.OCCURRENCES_ADD}
            Icon={IoIosAdd}
            ResultIcon={installmentVisible ? IoMdArrowDropup : IoMdArrowDropdown}
            currency=" R$"
            result={installmentTotal}
            resultTitle={labelsEnum.TOTAL_INSTALLMENTS}
            visible={installmentVisible}
            toggle={toggleInstallment}
            dropDownActions={installmentPaymentDropDowns}
            helpText={help?.occurrenceAdd?.text}
            helpLink={help?.occurrenceAdd?.link}
            helpMinWidth={help?.occurrenceAdd?.minWidth}
            totalsTooltip={occurrenceTotalsTooltip}
            uppercase={false}>
            <CalcClosedContent>
              <OccurrenceList />
            </CalcClosedContent>
          </Tab>
        </TabContainer>
      )}
    </Form>
  );
};

export default AuthorForm;
