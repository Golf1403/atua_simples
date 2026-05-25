import React, { Fragment, useEffect } from 'react';
import useSimpleUpdate, { typeArt354 } from '@/hooks/simpleUpdate';
import ViewOccorrenceImp, { ViewType } from '@interfaces/calculations/ViewOccorrenceImp';
import {
  typeinstallment,
  typeExpense,
  typeFee,
  typeFine,
  typeInterest,
  typePayment,
  typeCorrection,
  typeTotal,
  typeExpenseTitle,
  typeAuthors,
  typeInterestCorrection,
  typeFeeArt,
  typeFineArt,
  typeExpenseSection,
  typeFeeQC,
  typeFeeSM,
  typeInterestCorrectionSuspend,
  typeFineCorrection,
} from '@/hooks/interfaces/CurrentAccountHookImp';

import { typeAccountCurrent } from '@/data/calculations/currentTypes';
import { translateInterest } from '../../../../utils/interestCivilCodeHelper';
import { valueWithCurrency } from '@/lib/currency';
import { fileNamesCurrentAccountEnum } from '@/enums/fileNamesEnum';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { labelsEnum } from '@/enums/labelsEnum';
import { Description, Modal, TableCell, TableContainer, TableHeader, TableLine } from './styles';
import { v4 } from 'uuid';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { getFieldName } from '@/lib/nomenclature';

const ViewModal = ({ isOpen = false }): JSX.Element => {
  const {
    layout: {
      viewModal: { views, visible },
    },
    setLayout,
    layout,
    account,
    account: { infos },
  } = useSimpleUpdate() as any;
  const { nomenclatures } = useNomenclatures();

  const closeModal = () => {
    setLayout({ ...layout, viewModal: { views, visible: false } });
    return;
  };

  const translateTypeName = (view: ViewOccorrenceImp) => {
    const getInfo = (view: ViewOccorrenceImp) => {
      switch (view.type) {
        case typePayment.id:
          return getFieldName(view.description?.length ? view.description : typePayment.label, nomenclatures);
        case typeFeeQC.id:
          return view.description?.length
            ? view.description
            : `${getFieldName(labelsEnum.FEE, nomenclatures)} ${getFieldName(labelsEnum.QUANTIA_CERTA, nomenclatures)}`;
        case typeFeeSM.id:
          return view.description?.length ? view.description : typeFeeSM.label;
        case typeinstallment.id:
          return getFieldName(
            view.description?.length ? view.description.trim() : typeinstallment.label,
            nomenclatures
          );
        case typeFee.id:
          return getFieldName(view.description?.length ? view.description : typeFee.label, nomenclatures);
        case typeFeeArt.id:
          return getFieldName(view.description?.length ? view.description : typeFeeArt.label, nomenclatures);
        case typeFine.id:
          return getFieldName(view.description?.length ? view.description : typeFine.label, nomenclatures);
        case typeFineArt.id:
          return getFieldName(view.description?.length ? view.description : typeFineArt.label, nomenclatures);
        default:
          return view.description?.length ? view.description : ``;
      }
    };

    switch (view.type) {
      case typeExpenseTitle.id:
        return getFieldName(typeExpenseTitle.label, nomenclatures);
      case typeInterest.id:
        return `${translateInterest(view, nomenclatures)} \n ${view.extraDescription}`;
      case typeFine.id:
        return `${getInfo(view)} \n ${view.extraDescription}`;
      case typeinstallment.id:
        return `${getInfo(view)} \n ${view.descriptionCalc || ''}`;
      case typePayment.id:
        return `${getInfo(view)} \n ${view.descriptionCalc || ''}`;
      case typeFee.id:
        return `${getInfo(view)} \n ${view.extraDescription}`;
      case typeFeeQC.id:
        return `${getInfo(view)} \n ${view.extraDescription}`;
      case typeFeeSM.id:
        return `${getInfo(view)} \n ${view.extraDescription}`;
      case typeFeeArt.id:
        return `${getInfo(view)} \n ${view.extraDescription}`;
      case typeFineArt.id:
        return `${getInfo(view)} \n ${view.extraDescription}`;
      case typeExpense.id:
        return getFieldName(view.description?.length ? view.description : typeExpense.label, nomenclatures);
      case typeExpenseSection.id:
        return getFieldName(view.description?.length ? view.description : typeExpenseSection.label, nomenclatures);
      case typeInterestCorrection.id:
        return `${typeCorrection.label} dos ${getFieldName(labelsEnum.INTEREST, nomenclatures)} \n ${
          view.extraDescription
        }`;
      case typeFineCorrection.id:
        return `${typeCorrection.label} da ${getFieldName(labelsEnum.FINE, nomenclatures)} \n ${view.extraDescription}`;
      case typeInterestCorrectionSuspend.id:
        return `${typeInterestCorrectionSuspend.label} \n ${view.extraDescription}`;
      case typeCorrection.id:
        return `${typeCorrection.label} \n ${view.description}`;
      case typeTotal.id:
        return view.description?.length
          ? view.description
          : `${getFieldName(labelsEnum.TOTAL, nomenclatures)} ${
              infos.type == typeArt354.id
                ? `(Soma do principal com o saldo dos ${getFieldName(labelsEnum.INTEREST, nomenclatures)})`
                : ''
            }`;
      case typeAuthors.id:
        return view.description;
    }
    return '';
  };

  const dateFormat = account.current.proRataDay ? dateFormatEnum.DEFAULT : dateFormatEnum.MONTH_AND_YEAR;

  const getInitialDate = (view: ViewOccorrenceImp) => {
    if (view.type.includes(typeAuthors.id)) return '';
    if (view.type.includes(typeExpenseTitle.id)) return '';
    if (view.type.includes(typeFee.id))
      return moment(view.updateSince, dateFormatEnum.DEFAULT).format(dateFormat) || '';
    if (view.type.includes(typeFeeQC.id))
      return moment(view.updateSince, dateFormatEnum.DEFAULT).format(dateFormat) || '';
    if (view.type.includes(typeinstallment.id) && !view.value) return '';
    return moment(view.date, dateFormatEnum.DEFAULT).format(dateFormat) || '';
  };

  const getTotalValue = (view: ViewOccorrenceImp) => {
    if (view.type.includes(typeAuthors.id)) return '';
    if (view.type.includes(typeExpenseTitle.id)) return '';
    if (view.type.includes(typeFeeArt.id) && !view.total) return '';
    if (view.type.includes(typeFineArt.id) && !view.total) return '';
    if (view.type.includes(typeinstallment.id) && !view.value) return '';
    return valueWithCurrency(view.currencyBalance || view.currency, view.total);
  };

  const getValue = (view: ViewOccorrenceImp) => {
    if (!view.value || view.type.includes(typeExpenseTitle.id)) return '';
    if (view.type.includes(typeAuthors.id)) return '';
    if (view.type.includes(typeFeeArt.id) && !view.value) return '';
    if (view.type.includes(typeFineArt.id) && !view.value) return '';
    if (view.type.includes(typeinstallment.id) && !view.value) return '';
    if (view.type.includes(typeCorrection.id))
      return valueWithCurrency(view.currencyBalance || view.currency, view.value);
    return valueWithCurrency(view.currency, view.value);
  };

  const getBalance = (view: ViewOccorrenceImp) => {
    if (view.type.includes(typeAuthors.id)) return '';
    if (view.type.includes(typeTotal.id) && account.infos.type != typeAccountCurrent.id) return '';
    if (view.type.includes(typeExpenseTitle.id)) return '';
    if (view.type.includes(typeFeeArt.id) && !view.balance) return '';
    if (view.type.includes(typeFineArt.id) && !view.balance) return '';
    if (view.type.includes(typeinstallment.id) && !view.value) return '';
    if (view.type.includes(typeCorrection.id))
      return valueWithCurrency(view.currencyBalance || view.currency, view.balance);
    return valueWithCurrency(view.currencyBalance || view.currency, view.balance);
  };

  const getInterestBalance = (view: ViewOccorrenceImp) => {
    if (view.type.includes(typeAuthors.id)) return '';
    if (view.type.includes(typeExpenseTitle.id)) return '';
    if (view.type.includes(typeTotal.id)) return '';
    if (view.type.includes(typeFeeArt.id)) return '';
    if (view.type.includes(typeFineArt.id)) return '';
    if (view.type.includes(typeinstallment.id) && !view.value) return '';

    const interestBalance = view.interestBalance;

    return interestBalance ? valueWithCurrency(view.currency, interestBalance) : valueWithCurrency(view.currency, 0);
  };

  const getFineBalance = (view: ViewOccorrenceImp) => {
    if (view.type.includes(typeAuthors.id)) return '';
    if (view.type.includes(typeExpenseTitle.id)) return '';
    if (view.type.includes(typeTotal.id)) return '';
    if (view.type.includes(typeFeeArt.id)) return '';
    if (view.type.includes(typeFineArt.id)) return '';
    if (view.type.includes(typeinstallment.id) && !view.value) return '';
    return valueWithCurrency(view.currency, view.fineBalance || 0);
  };

  const getHeader = () => (
    <thead>
      <tr>
        <TableHeader>{getFieldName(labelsEnum.DESCRIPTION, nomenclatures)}</TableHeader>
        <TableHeader>{labelsEnum.DATE_START}</TableHeader>
        <TableHeader>{labelsEnum.DATE_END}</TableHeader>
        <TableHeader>{labelsEnum.VALUE}</TableHeader>
        <TableHeader>{labelsEnum.MAIN}</TableHeader>
        {account.infos.type !== typeAccountCurrent.id && (
          <Fragment>
            <TableHeader>{`${labelsEnum.BALANCE} ${getFieldName(labelsEnum.FINE, nomenclatures)}`}</TableHeader>
            <TableHeader>{`${labelsEnum.BALANCE} ${getFieldName(labelsEnum.INTEREST, nomenclatures)}`}</TableHeader>
            <TableHeader>{getFieldName(labelsEnum.TOTAL, nomenclatures)}</TableHeader>
          </Fragment>
        )}
      </tr>
    </thead>
  );

  const getNameCell = (view: ViewOccorrenceImp) => (
    <TableCell $type={([typeinstallment.id, typePayment.id] as ViewType[]).includes(view.type)}>
      {translateTypeName(view)
        .split('\n')
        .map((description: string, key: number) =>
          key == 0 ? <div key={key}>{description}</div> : <Description key={key}>{description}</Description>
        )}
    </TableCell>
  );

  const getStartDateCell = (view: ViewOccorrenceImp) => <TableCell>{view.date ? getInitialDate(view) : ''}</TableCell>;
  const getEndDateCell = (view: ViewOccorrenceImp) => {
    if (view.type.includes(typeinstallment.id) && !view.value) return '';
    return <TableCell>{view.dateEnd ? moment(view.dateEnd, dateFormatEnum.DEFAULT).format(dateFormat) : ''}</TableCell>;
  };
  const getValueCell = (view: ViewOccorrenceImp) => (
    <TableCell $isRight $red={view.value < 0}>
      {getValue(view)}
    </TableCell>
  );

  const getBalanceCell = (view: ViewOccorrenceImp) => (
    <TableCell $isRight $red={view.balance < 0} $type={true}>
      {getBalance(view)}
    </TableCell>
  );

  const getInterestBalanceCell = (view: ViewOccorrenceImp) => (
    <TableCell $isRight $red={view.interestBalance < 0} $type={true}>
      {getInterestBalance(view)}
    </TableCell>
  );

  const getFineBalanceCell = (view: ViewOccorrenceImp) => (
    <TableCell $isRight $red={(view.fineBalance || 0) < 0} $type={true}>
      {getFineBalance(view)}
    </TableCell>
  );

  const getTotalValueCell = (view: ViewOccorrenceImp) => (
    <TableCell $isRight $red={view.total < 0} $type={true}>
      {getTotalValue(view)}
    </TableCell>
  );

  const getArt356Cells = (view: ViewOccorrenceImp) => {
    return account.infos.type !== typeAccountCurrent.id ? (
      <Fragment>
        {getFineBalanceCell(view)}
        {getInterestBalanceCell(view)}
        {getTotalValueCell(view)}
      </Fragment>
    ) : (
      <Fragment />
    );
  };

  const getBody = () => (
    <tbody>
      {views.map((view: any) => {
        return (
          <TableLine key={v4()} $type={view.type}>
            {getNameCell(view)}
            {getStartDateCell(view)}
            {getEndDateCell(view)}
            {getValueCell(view)}
            {getBalanceCell(view)}
            {getArt356Cells(view)}
          </TableLine>
        );
      })}
    </tbody>
  );

  return (
    <Fragment>
      <Modal
        isOpen={visible}
        onClose={closeModal}
        onCancel={closeModal}
        onConfirm={closeModal}
        filename={account.current.name?.length ? account.current.name : 'Sem nome'}
        title={fileNamesCurrentAccountEnum.VIWES_LABEL}>
        <TableContainer id="viewer-table">
          {getHeader()}
          {getBody()}
        </TableContainer>
      </Modal>

      {isOpen && (
        <TableContainer style={{ visibility: 'collapse' }} id="viewer-table">
          {getHeader()}
          {getBody()}
        </TableContainer>
      )}
    </Fragment>
  );
};

export default ViewModal;
