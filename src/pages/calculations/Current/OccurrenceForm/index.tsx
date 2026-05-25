import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import useCurrentAccount from '@/hooks/currentAccount';
import {
  OccurrenceTypes,
  typeExpense,
  typeinstallment,
  typeFee,
  typePayment,
  typeExpenseSection,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentOccurrenceImp, {
  CurrentFeeOccorrenceImp,
  CurrentInstallmentOccorrenceImp,
} from '@/interfaces/calculations/CurrentOccurrenceImp';
import { useFormikContext } from 'formik';
import {
  Name,
  Input,
  InputDateContainer,
  InputDate,
  InputContainer,
  OccurrenceAction,
  Form,
  DescriptionContainer,
  ButtonAction,
  Tooltip,
  VerticalLine,
  BackgroudContainer,
  BorderContainer,
} from '../OccurrenceList/styles';
import { getCoin } from '@/utils/numberUtils';
import CustomCheckbox from '@/components/CustomCheckbox';
import { labelsEnum } from '@/enums/labelsEnum';
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';
const { Draggable } = require('react-beautiful-dnd');
import OccurrenceService from '@/services/CalculationsServices/CurrentAccountService/OccurrenceService';
import _, { cloneDeep } from 'lodash';
import { validDateIndexes, validateDate } from '@/utils/validateDate';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import InstallmentDateModal from './InstallmentDateModal';
import { useCore } from '@/hooks/core';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import FeeNewCpcModal from '../FeeNewCpcModal';
import { FiSettings } from 'react-icons/fi';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { DraggableProvided } from 'react-beautiful-dnd';
import ViewOccorrenceImp from '@/interfaces/calculations/ViewOccorrenceImp';
import { alertMessages } from '@/hooks/alertMessages';
import { useFactors } from '@/hooks/factors';

const OccurrenceForm = ({
  occurrenceIndex,
  authorIndex,
}: {
  occurrenceIndex: number;
  authorIndex: number;
}): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<CurrentOccurrenceImp>();
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const targetRef = useRef<HTMLElement | null>(null);
  const { nomenclatures } = useNomenclatures();

  const {
    onDuplicateOccurrence,
    onRemoveOccurrence,
    setOccurrence,
    toggleInstallmentDateModal,
    setLastInstallmentDate,
    setAuthorIndex,
    setInstallmentDate,
    author,
    account,
    feeFines,
    installmentDate,
    lastInstallmentDate,
    lastUpdateTo,
    updateTo,
  } = useCurrentAccount();
  const { allMemcalcs, memcalcs: memCalcs, interestIndexesFromLaw, interestIndexes } = useFactors();

  const { validateCalculationPeriod } = useCore();

  const handleDuplicateOccurrence = useCallback(() => {
    onDuplicateOccurrence({ occurrenceIndex });
  }, [occurrenceIndex, author]);

  const handleRemoveOccurrence = useCallback(() => {
    onRemoveOccurrence({ occurrenceIndex });
  }, [occurrenceIndex, author]);

  const translateTypeName = (type: OccurrenceTypes) => {
    switch (type) {
      case typeinstallment.id:
        return getFieldName(typeinstallment.label, nomenclatures);
      case typePayment.id:
        return getFieldName(typePayment.label, nomenclatures);
      case typeFee.id:
        return getFieldName(typeFee.label, nomenclatures);
      case typeExpense.id:
        return getFieldName(typeExpense.label, nomenclatures);
      case typeExpenseSection.id:
        return getFieldName(typeExpenseSection.label, nomenclatures);
    }
  };

  useEffect(() => {
    setOccurrence({ occurrence: values, occurrenceIndex });
  }, [values, occurrenceIndex]);

  useEffect(() => {
    const occurrence = author.list[authorIndex].occurrences[occurrenceIndex];
    setValues(occurrence);
  }, [author.list[authorIndex].occurrences[occurrenceIndex]]);

  const getDates = () => (
    <>
      {values.type == typeFee.id ? (
        <InputDate id="update-since-date" name="updateSince" disabled={values.isFeeCpc} className="update-since" />
      ) : (
        <Input reset className="update-since" />
      )}
      <InputDate
        onChange={(value: string) => {
          try {
            const isValidRegex = validateDate(value);

            const date = moment(value, dateFormatEnum.DEFAULT);
            const isValid = date.isValid();
            if (!isValidRegex) return;

            const { type } = validDateIndexes(value, dateFormatEnum.DEFAULT);

            if (type.includes('warning')) {
              setFieldValue('date', values.date);
              return;
            }

            if (!isValid) return;
            if (!values.type.includes(typeinstallment.id)) return;
            validateCalculationPeriod(value);
            const isExistInterestFine = author.list.reduce((a, b) => a && !!b.interestFines.length, true);
            if (!isExistInterestFine) return;
            toggleInstallmentDateModal(true);
            values.date && setLastInstallmentDate(values.date);
            setAuthorIndex(authorIndex);
            setInstallmentDate(value);
          } catch (error) {
            console.log(error);
          }
        }}
        disabled={values.type == typeFee.id && values.isFeeCpc}
        id="date"
        className="date"
        name="date"
      />
    </>
  );

  const getValues = () => {
    const isDisabled = Boolean(values.type == typeFee.id && (values.isCalcByInstallment || values.isFeeCpc));
    const handleDoubleClick = async () => {
      await Promise.all([
        setFieldValue('isFeeCpc', false),
        setFieldValue('isCalcByInstallment', false),
        setFieldValue('updateSince', values.date),
      ]);
    };
    return (
      <>
        {values.type == typeFee.id ? (
          <Input id="tax" suffix=" %" className="tax" name="tax" />
        ) : (
          <Input disabled={isDisabled} reset className="tax" />
        )}
        <Input
          readOnly={isDisabled}
          onDoubleClick={handleDoubleClick}
          id={`${authorIndex}-${occurrenceIndex}-value`}
          prefix={values.date ? getCoin(values.date, 0) : undefined}
          name="value"
        />
      </>
    );
  };

  const getActions = () => (
    <>
      <BackgroudContainer>
        <div>
          {values.type == typeinstallment.id ? (
            values.isWithoutCorrection ? (
              <Tooltip withoutHoverColor={true} text={`${`${labelsEnum.WITHOUT} ${labelsEnum.CORRECTION}`}`}>
                <CustomCheckbox
                  name="isWithoutCorrection"
                  checked={values.isWithoutCorrection}
                  onChange={() => {
                    if ('isWithoutCorrection' in values) {
                      setValues(prevValues => ({
                        ...prevValues,
                        isWithoutCorrection: !(prevValues as CurrentInstallmentOccorrenceImp).isWithoutCorrection,
                      }));
                    }
                  }}></CustomCheckbox>
              </Tooltip>
            ) : (
              <Tooltip
                withoutHoverColor={true}
                text={`${'Marque esta opção para não aplicar correção monetária nesta parcela'}`}>
                <CustomCheckbox
                  name="isWithoutCorrection"
                  checked={values.isWithoutCorrection}
                  onChange={() => {
                    if ('isWithoutCorrection' in values) {
                      setValues(prevValues => ({
                        ...prevValues,
                        isWithoutCorrection: !(prevValues as CurrentInstallmentOccorrenceImp).isWithoutCorrection,
                      }));
                    }
                  }}></CustomCheckbox>
              </Tooltip>
            )
          ) : (
            <Fragment />
          )}
        </div>
        {values.type.includes(typeFee.id) ? (
          <ButtonAction
            onClick={async () => {
              await setFieldValue('isOpenFeeConfig', true);
            }}>
            <Tooltip withoutHoverColor={true} text={labelsEnum.INTEREST_FINE_CONFIG}>
              <FiSettings />
            </Tooltip>
          </ButtonAction>
        ) : (
          <Fragment />
        )}
        <ButtonAction
          id="duplicate-action"
          onClick={() => {
            handleDuplicateOccurrence();
          }}>
          <Tooltip withoutHoverColor={true} text={`${labelsEnum.DUPLICATE} ${translateTypeName(values.type)}`}>
            <FaRegCopy />
          </Tooltip>
        </ButtonAction>
        <ButtonAction
          onClick={event => {
            if (event.ctrlKey || event.shiftKey) {
              handleRemoveOccurrence();
              return;
            }
            openModal();
          }}>
          <Tooltip withoutHoverColor={true} text={`${labelsEnum.DELETE} ${translateTypeName(values.type)}`}>
            <FaTrashAlt />
          </Tooltip>
        </ButtonAction>
        <OcurrenceDeleteModal
          visible={isModalVisible}
          closeModal={closeModal}
          removeOcurrence={handleRemoveOccurrence}
        />
      </BackgroudContainer>
    </>
  );

  const getDescription = () => <Input id="description" className="description" name="description" />;

  const getNames = () => (
    <>
      <VerticalLine $colorType={values.type} />
      {translateTypeName(values.type)}
    </>
  );

  const onKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key == 'Enter') {
      e.preventDefault();

      const form = targetRef.current?.getElementsByTagName('form');

      const dateField = Array.from((form as any)[0]).find(element => {
        return (element as any).id.includes(id);
      });
      (dateField as any).focus();
    }
  };

  const alertMessage = alertMessages();

  const onCalcByInstallment = async () => {
    console.info('on_calc_fee');
    const worker = new Worker(
      new URL(
        '../../../../workersweb/RecalculateAccountWorker',
        'file:///sei-spa/src/pages/calculations/Current/OccurrenceForm/index.tsx'
      )
    );

    const newAuthor = cloneDeep(author);

    const element = newAuthor.list[authorIndex];
    element.expenses = [];
    element.occurrences = element.occurrences.filter(
      (occurrence, index) =>
        occurrence.type == typeinstallment.id &&
        moment(occurrence.date, dateFormatEnum.DEFAULT).isSameOrBefore(moment(values.date, dateFormatEnum.DEFAULT)) &&
        index < occurrenceIndex
    );

    worker.postMessage({
      type: 'recalculate',
      data: {
        author: newAuthor,
        account: {
          ...account,
          current: { ...account.current, updateTo: values.date || account.current.updateTo },
        },
        changeUpdateTo: false,
        lastUpdateTo,
        updateTo,
        feeFines,
        allMemcalcs,
        changeInstallmentDate: false,
        lastInstallmentDate,
        occurrenceDate: installmentDate,
        authorIndex,
        memCalcs: memCalcs,
        type: 'calc',
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
        const { views } = message.data;
        const [view] = views.filter((view: ViewOccorrenceImp) => view.type == typeTotal.id);
        values.type == typeFee.id && (await setFieldValue('value', view.balance));
      } catch (error) {
        console.log(error);
      }
    });
  };

  const calculateByInstallment = async () =>
    values.type == typeFee.id && values.isCalcByInstallment && !values.isFeeCpc && (await onCalcByInstallment());

  useEffect(() => {
    calculateByInstallment();
  }, [
    (values as CurrentFeeOccorrenceImp).isCalcByInstallment,
    (values as CurrentFeeOccorrenceImp).isFeeCpc,
    values.type,
  ]);

  return (
    <Draggable
      key={`item-${authorIndex}-${occurrenceIndex}`}
      draggableId={`item-${authorIndex}-${occurrenceIndex}`}
      index={occurrenceIndex}>
      {(provider: DraggableProvided) => (
        <BorderContainer
          ref={el => {
            targetRef.current = el;
            return provider.innerRef(el);
          }}
          $colorType={
            author.list[authorIndex].occurrences[occurrenceIndex].newestOccurrence
              ? author.list[authorIndex].occurrences[occurrenceIndex].type
              : undefined
          }>
          <Form key={occurrenceIndex} {...provider.draggableProps} {...provider.dragHandleProps}>
            <Name>{getNames()}</Name>
            <DescriptionContainer onKeyDown={e => onKeyDown(e, 'date')}>{getDescription()}</DescriptionContainer>
            <InputDateContainer onKeyDown={e => onKeyDown(e, 'value')}>{getDates()}</InputDateContainer>
            <InputContainer onKeyDown={e => onKeyDown(e, 'duplicate-action')}>{getValues()}</InputContainer>
            <OccurrenceAction>{getActions()}</OccurrenceAction>
            <InstallmentDateModal />
          </Form>
          <FeeNewCpcModal nomenclatures={nomenclatures} />
        </BorderContainer>
      )}
    </Draggable>
  );
};

export default OccurrenceForm;
