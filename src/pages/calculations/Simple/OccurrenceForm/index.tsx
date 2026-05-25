import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import {
  OccurrenceTypes,
  typeExpense,
  typeinstallment,
  typeFee,
  typePayment,
  typeExpenseSection,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentOccurrenceImp from '@/interfaces/calculations/CurrentOccurrenceImp';
import { useFormikContext } from 'formik';
import {
  Name,
  Input,
  InputDateContainer,
  InputDate,
  InputContainer,
  OccurrenceAction,
  DescriptionContainer,
  ButtonAction,
  Tooltip,
  BackgroudContainer,
  CorrectedContainer,
  DetailFlag,
  IndexText,
  MainRow,
  OccurrenceCard,
  SubDateContainer,
  SubDescription,
  SubRow,
  SubValueContainer,
  TypeBadge,
} from '../OccurrenceList/styles';
import { currencyFormat, getCoin } from '@/utils/numberUtils';
import { labelsEnum } from '@/enums/labelsEnum';
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { typeCompensatory, typeCompound, typeDefault, typePeriod } from '@/data/calculations/interestTypes';
import { fineAmountType, finePercentageType } from '@/data/calculations/fineEntryTypes';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import InterestModal, { InterestModalValues } from './InterestModal';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import FineModal, { FineModalValues } from './FineModal';

const createDefaultInterest = (type: string) => ({
  type,
  periodicity: 'monthly',
  dateStart: moment().format(dateFormatEnum.DEFAULT),
  dateEnd: moment().format(dateFormatEnum.DEFAULT),
  percentage: type === typeDefault.id ? 0.5 : 1,
  capitalization: 'none',
  onTransitiveInterest: false,
  calculated: 0,
  calculatedInfo: {},
});

const createDefaultFine = () => ({
  type: finePercentageType.id,
  periodicity: 'monthly',
  dateStart: moment().format(dateFormatEnum.DEFAULT),
  dateEnd: moment().format(dateFormatEnum.DEFAULT),
  value: 0,
  percentage: 1,
  calculated: 0,
  onInstallmentsValue: false,
  onDefaultInterest: false,
  onCompoundInterest: false,
  onCompensatoryInterest: false,
  onInterestPeriod: false,
  calculatedInfo: {},
});

const OccurrenceForm = ({
  occurrenceIndex,
  authorIndex,
}: {
  occurrenceIndex: number;
  authorIndex: number;
}): JSX.Element => {
  const { values, setValues } = useFormikContext<CurrentOccurrenceImp>();
  const valuesRef = useRef(values);
  const occurrenceValues = values as any;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInterestModalOpen, setInterestModalOpen] = useState(false);
  const [isFineModalOpen, setFineModalOpen] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const { nomenclatures } = useNomenclatures();

  const { onDuplicateOccurrence, onRemoveOccurrence, setOccurrence, author } = useSimpleUpdate() as any;

  const handleDuplicateOccurrence = useCallback(() => {
    onDuplicateOccurrence({ authorIndex, occurrenceIndex });
  }, [authorIndex, occurrenceIndex, onDuplicateOccurrence]);

  const handleRemoveOccurrence = useCallback(() => {
    onRemoveOccurrence({ authorIndex, occurrenceIndex });
  }, [authorIndex, occurrenceIndex, onRemoveOccurrence]);

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
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    setOccurrence({ authorIndex, occurrence: values, occurrenceIndex });
  }, [authorIndex, occurrenceIndex, setOccurrence, values]);

  useEffect(() => {
    const occurrence = author.list[authorIndex]?.occurrences?.[occurrenceIndex];
    if (!occurrence || _.isEqual(occurrence, valuesRef.current)) return;
    setValues(occurrence);
  }, [author.list, authorIndex, occurrenceIndex, setValues]);

  const getDates = () => <InputDate id="date" className="date" name="date" />;

  const getValues = () => {
    return (
      <Input
        id={`${authorIndex}-${occurrenceIndex}-value`}
        prefix={values.date ? getCoin(values.date as string, 0) : undefined}
        name="value"
      />
    );
  };

  const getCorrectedValue = () => occurrenceValues.correctedValue || occurrenceValues.total || values.value || 0;

  const getActions = () => (
    <>
      <BackgroudContainer>
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

  const getDescription = () => <Input id="description" className="description" name="description" maxLength={20} />;

  const getInterestName = (type: string) => {
    switch (type) {
      case typeDefault.id:
        return 'Moratórios';
      case typeCompensatory.id:
        return 'Compensatórios';
      case typeCompound.id:
        return 'Compostos';
      case typePeriod.id:
        return 'Período';
      default:
        return 'Juros';
    }
  };

  const getFineName = (type: string) => {
    switch (type) {
      case finePercentageType.id:
        return 'Percentual';
      case fineAmountType.id:
        return 'Valor';
      default:
        return 'Multa';
    }
  };

  const formatMoney = (value?: number | string) => `R$${currencyFormat(Number(value) || 0)}`;

  const handleShowInterest = () => {
    setInterestModalOpen(true);
  };

  const getInterestModalInitialValues = (): InterestModalValues => {
    const interest = occurrenceValues.interests?.[0] || createDefaultInterest(typeDefault.id);
    return {
      type: interest.type || typeDefault.id,
      dateStart: interest.dateStart || values.date || moment().format(dateFormatEnum.DEFAULT),
      dateEnd: interest.dateEnd || values.date || moment().format(dateFormatEnum.DEFAULT),
      percentage: Number(interest.percentage) || 0,
      capitalization: interest.capitalization || 'monthly',
      civilCode: interest.civilCode || CivilCodeInterest.NOT_APPLY,
      onInstallmentsValue: interest.onInstallmentsValue ?? true,
      onDefaultInterest: Boolean(interest.onDefaultInterest),
      onCompensatoryInterest: Boolean(interest.onCompensatoryInterest),
      onCompoundInterest: Boolean(interest.onCompoundInterest),
      onInterestPeriod: Boolean(interest.onInterestPeriod),
      onInterestWithoutCorrection: Boolean(interest.onInterestWithoutCorrection),
    };
  };

  const handleConfirmInterest = (interest: InterestModalValues) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      interests: [
        {
          ...createDefaultInterest(interest.type),
          ...occurrenceValues.interests?.[0],
          type: interest.type,
          dateStart: interest.dateStart,
          dateEnd: interest.dateEnd,
          percentage: interest.percentage,
          capitalization: interest.capitalization,
          civilCode: interest.civilCode,
          onInstallmentsValue: interest.onInstallmentsValue,
          onDefaultInterest: interest.onDefaultInterest,
          onCompensatoryInterest: interest.onCompensatoryInterest,
          onCompoundInterest: interest.onCompoundInterest,
          onInterestPeriod: interest.onInterestPeriod,
          onInterestWithoutCorrection: interest.onInterestWithoutCorrection,
        },
      ],
    }));
    setInterestModalOpen(false);
  };

  const handleDuplicateInterest = (interestIndex: number) => {
    setValues((prevValues: any) => {
      const interests = [...(prevValues.interests || [])];
      const interest = interests[interestIndex];
      if (!interest) return prevValues;

      interests.splice(interestIndex + 1, 0, _.cloneDeep(interest));
      return { ...prevValues, interests };
    });
  };

  const handleRemoveInterest = (interestIndex: number) => {
    setValues((prevValues: any) => {
      const interests = [...(prevValues.interests || [])];
      interests.splice(interestIndex, 1);
      return { ...prevValues, interests };
    });
  };

  const handleDuplicateFine = (fineIndex: number) => {
    setValues((prevValues: any) => {
      const fines = [...(prevValues.fines || [])];
      const fine = fines[fineIndex];
      if (!fine) return prevValues;

      fines.splice(fineIndex + 1, 0, _.cloneDeep(fine));
      return { ...prevValues, fines };
    });
  };

  const handleRemoveFine = (fineIndex: number) => {
    setValues((prevValues: any) => {
      const fines = [...(prevValues.fines || [])];
      fines.splice(fineIndex, 1);
      return { ...prevValues, fines };
    });
  };

  const handleShowFine = () => {
    setFineModalOpen(true);
  };

  const getFineModalInitialValues = (): FineModalValues => {
    const fine = occurrenceValues.fines?.[0] || createDefaultFine();
    return {
      periodicity: fine.periodicity || 'monthly',
      dateStart: fine.dateStart || values.date || moment().format(dateFormatEnum.DEFAULT),
      dateEnd: fine.dateEnd || values.date || moment().format(dateFormatEnum.DEFAULT),
      type: fine.type || finePercentageType.id,
      percentage: Number(fine.percentage) || 0,
      value: Number(fine.value) || 0,
      onInstallmentsValue: fine.onInstallmentsValue ?? true,
      onDefaultInterest: Boolean(fine.onDefaultInterest),
      onCompensatoryInterest: Boolean(fine.onCompensatoryInterest),
      onCompoundInterest: Boolean(fine.onCompoundInterest),
      onInterestPeriod: Boolean(fine.onInterestPeriod),
    };
  };

  const handleConfirmFine = (fine: FineModalValues) => {
    setValues((prevValues: any) => ({
      ...prevValues,
      fines: [
        {
          ...createDefaultFine(),
          ...occurrenceValues.fines?.[0],
          type: fine.type,
          periodicity: fine.periodicity,
          dateStart: fine.dateStart,
          dateEnd: fine.dateEnd,
          percentage: fine.percentage,
          value: fine.value,
          onInstallmentsValue: fine.onInstallmentsValue,
          onDefaultInterest: fine.onDefaultInterest,
          onCompensatoryInterest: fine.onCompensatoryInterest,
          onCompoundInterest: fine.onCompoundInterest,
          onInterestPeriod: fine.onInterestPeriod,
        },
      ],
    }));
    setFineModalOpen(false);
  };

  const renderInterest = (interest: any, key: number) => (
    <SubRow key={`interest-${key}`}>
      <Name />
      <SubDescription>
        <span>Juros</span>
        <span>{getInterestName(interest.type)}</span>
      </SubDescription>
      <SubDateContainer>
        <span>{interest.dateStart || '-'}</span>
        <span>até</span>
        <span>{interest.dateEnd || '-'}</span>
      </SubDateContainer>
      <SubValueContainer>{currencyFormat(Number(interest.percentage) || 0)}% ao mês</SubValueContainer>
      <CorrectedContainer>{formatMoney(interest.calculated)}</CorrectedContainer>
      <OccurrenceAction>
        {getSubActions(
          () => handleDuplicateInterest(key),
          () => handleRemoveInterest(key)
        )}
      </OccurrenceAction>
    </SubRow>
  );

  const renderFine = (fine: any, key: number) => (
    <SubRow key={`fine-${key}`}>
      <Name />
      <SubDescription>
        <span>Multa</span>
        <span>{getFineName(fine.type)}</span>
      </SubDescription>
      <SubDateContainer>
        <span>{fine.dateStart || '-'}</span>
        <span>até</span>
        <span>{fine.dateEnd || '-'}</span>
      </SubDateContainer>
      <SubValueContainer>{currencyFormat(Number(fine.percentage || fine.value) || 0)}%</SubValueContainer>
      <CorrectedContainer>{formatMoney(fine.calculated)}</CorrectedContainer>
      <OccurrenceAction>
        {getSubActions(
          () => handleDuplicateFine(key),
          () => handleRemoveFine(key)
        )}
      </OccurrenceAction>
    </SubRow>
  );

  const getSubActions = (onDuplicate: () => void, onRemove: () => void) => (
    <BackgroudContainer>
      <ButtonAction type="button" onClick={onDuplicate}>
        <Tooltip withoutHoverColor={true} text={labelsEnum.DUPLICATE}>
          <FaRegCopy />
        </Tooltip>
      </ButtonAction>
      <ButtonAction type="button" onClick={onRemove}>
        <Tooltip withoutHoverColor={true} text={labelsEnum.DELETE}>
          <FaTrashAlt />
        </Tooltip>
      </ButtonAction>
    </BackgroudContainer>
  );

  return (
    <OccurrenceCard
      $colorType={values.type}
      $isActive={occurrenceValues.newestOccurrence}
      onFocusCapture={() => {
        if (!occurrenceValues.newestOccurrence) return;
        setValues((prevValues: any) => ({ ...prevValues, newestOccurrence: false }));
      }}>
      <MainRow key={occurrenceIndex}>
        <Name>
          <IndexText>{String(occurrenceIndex + 1).padStart(5, '0')}</IndexText>
        </Name>
        <DescriptionContainer>{getDescription()}</DescriptionContainer>
        <InputDateContainer>{getDates()}</InputDateContainer>
        <InputContainer>{getValues()}</InputContainer>
        <CorrectedContainer>
          {formatMoney(getCorrectedValue())}
          <DetailFlag>D</DetailFlag>
        </CorrectedContainer>
        <OccurrenceAction>
          {values.type === typeinstallment.id && (
            <TypeBadge type="button" onClick={handleShowFine}>
              Multa
            </TypeBadge>
          )}
          <TypeBadge type="button" onClick={handleShowInterest}>
            Juros
          </TypeBadge>
          {getActions()}
        </OccurrenceAction>
      </MainRow>
      {(occurrenceValues.interests || []).map(renderInterest)}
      {(occurrenceValues.fines || []).map(renderFine)}
      <InterestModal
        isOpen={isInterestModalOpen}
        initialValues={getInterestModalInitialValues()}
        onClose={() => setInterestModalOpen(false)}
        onConfirm={handleConfirmInterest}
      />
      <FineModal
        isOpen={isFineModalOpen}
        initialValues={getFineModalInitialValues()}
        onClose={() => setFineModalOpen(false)}
        onConfirm={handleConfirmFine}
      />
    </OccurrenceCard>
  );
};

export default OccurrenceForm;
