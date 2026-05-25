import React, { useCallback, useEffect, useState } from 'react';

import {
  InterestFineAction,
  BackgroudContainer,
  BorderContainer,
  ButtonAction,
  DescriptionContainer,
  Form,
  Input,
  InputContainer,
  InputDate,
  InputDateContainer,
  Name,
  PeriodicityTaxContainer,
  Tooltip,
  ValuePercentContainer,
  VerticalLine,
} from '../InterestList/styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { Formik, useFormikContext } from 'formik';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { getCoin } from '@/utils/numberUtils';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import { InterestFineTypes, typeFine, typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import CustomSelect from '@/components/CustomSelect';
import { IoMdArrowDropdown } from 'react-icons/io';
import frequencyDaysOptions from '@/data/calculations/frequencyDaysOptions';
import { fineAmountType, finePercentageType } from '@/data/calculations/fineEntryTypes';
import InterestFineConfigModal from './ConfigModal';
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { useResource } from '@/hooks/resourses';
import { typeCompensatory, typeCompound, typeDefault, typePeriod } from '@/data/calculations/interestTypes';

import ISelectOption from '@interfaces/SelectOptionImp';
import fineEntryTypes from '@data/calculations/fineEntryTypes';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { typeSelectIndex } from '@/data/calculations/civilCodeTypes';

export const fineEntryTypeOptions: ISelectOption[] = fineEntryTypes.map(entry => {
  const option: ISelectOption = {
    id: entry.id,
    value: entry.id,
    label: entry.name,
  };
  return option;
});

export interface CalcSelectImp {}

const InterestForm = ({
  interestIndex,
  authorIndex,
}: {
  interestIndex: number;
  authorIndex: number;
}): JSX.Element => {
  const { values, setValues } = useFormikContext<CurrentInterestFineImp>() as any;
  const {
    isCanInterestConfig,
    isCanSelectPeriod,
    isCanSelectCompound,
    isCanSelectMoratory,
    isCanSelectCompensatory,
  } = useResource();
  const { onDuplicateInterestFine, onRemoveInterestFine, author, setInterestFine } = useSimpleUpdate() as any;
  const [isOpenConfig, setIsOpenConfig] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const [interestTypesOptions, setInterestTypesOptions] = useState<
    {
      id: string;
      label: string;
      value: string;
    }[]
  >([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const _compensatory = {
      id: typeCompensatory.id,
      label: getFieldName(typeCompensatory.name, nomenclatures),
      value: typeCompensatory.value,
    };
    const _period = {
      id: typePeriod.id,
      label: getFieldName(typePeriod.name, nomenclatures),
      value: typePeriod.value,
    };
    const _compound = {
      id: typeCompound.id,
      label: getFieldName(typeCompound.name, nomenclatures),
      value: typeCompound.value,
    };
    const _default = {
      id: typeDefault.id,
      label: getFieldName(typeDefault.name, nomenclatures),
      value: typeDefault.value,
    };

    const _interestTypesOptions = [];

    isCanSelectPeriod && _interestTypesOptions.push(_period);
    isCanSelectCompound && _interestTypesOptions.push(_compound);
    isCanSelectMoratory && _interestTypesOptions.push(_default);
    isCanSelectCompensatory && _interestTypesOptions.push(_compensatory);

    setInterestTypesOptions(_interestTypesOptions);
  }, [
    nomenclatures,
    isCanSelectPeriod,
    isCanSelectCompound,
    isCanSelectMoratory,
    isCanSelectCompensatory,
    setInterestTypesOptions,
  ]);

  const handleDuplicateInterestFine = useCallback(() => {
    onDuplicateInterestFine({ interestFineIndex: interestIndex });
  }, [interestIndex, author]);

  const handleRemoveInterestFine = useCallback(() => {
    onRemoveInterestFine({ interestFineIndex: interestIndex, authorIndex });
  }, [interestIndex, authorIndex, author]);

  const handleConfigInterestFine = useCallback(() => {
    setIsOpenConfig(true);
  }, [interestIndex, author]);

  const translateTypeName = (type: InterestFineTypes) => {
    switch (type) {
      case typeInterest.id:
        return getFieldName(typeInterest.label, nomenclatures);
      case typeFine.id:
        return getFieldName(typeFine.label, nomenclatures);
    }
  };

  useEffect(() => {
    setInterestFine({ interestFine: values, interestFineIndex: interestIndex });
  }, [values, interestIndex]);

  useEffect(() => {
    if (authorIndex == -1) return;
    setValues(author.list[authorIndex].interestFines[interestIndex]);
  }, [author.list[authorIndex].interestFines[interestIndex]]);

  return (
    <BorderContainer>
      <Form key={interestIndex}>
        <Name>
          <VerticalLine $colorType={values.type} />
          {translateTypeName(values.type)}
        </Name>
        <DescriptionContainer>
          <CustomSelect
            icon={IoMdArrowDropdown}
            id="description"
            name="description"
            className="description"
            disableSelectOption
            value={values.description}
            options={interestTypesOptions}
          />
        </DescriptionContainer>
        <InputDateContainer>
          <InputDate id="date-start" className="date-start" name="dateStart" value={values.dateStart || ''} />
          <InputDate id="date-end" className="date-end" name="dateEnd" value={values.dateEnd || ''} />
        </InputDateContainer>
        <InputContainer>
          <PeriodicityTaxContainer>
            <CustomSelect
              id="select-type"
              className="select-type"
              name="selectType"
              value={values.selectType || finePercentageType.id}
              options={fineEntryTypeOptions}
              disabled={true}
            />
            <CustomSelect
              disabled={
                values.onInterestWithoutCorrection
              }
              id="periodicity"
              className="periodicity"
              name="periodicity"
              options={frequencyDaysOptions}
            />
          </PeriodicityTaxContainer>
          <ValuePercentContainer>
            <Input
              id="value"
              className="value"
              prefix={values.selectType == fineAmountType.id ? `${getCoin(values.dateStart, 0)} ` : ''}
              suffix={values.selectType == finePercentageType.id ? ` %` : ''}
              precision={4}
              name="value"
              disabled={values.onInterestWithoutCorrection}
              value={values.value}
            />
          </ValuePercentContainer>
        </InputContainer>
        <InterestFineAction>
          <BackgroudContainer>
            {isCanInterestConfig && (
              <ButtonAction
                onClick={() => {
                  handleConfigInterestFine();
                }}>
                <Tooltip withoutHoverColor={true} text={labelsEnum.INTEREST_FINE_CONFIG}>
                  <FiSettings />
                </Tooltip>
              </ButtonAction>
            )}
            <ButtonAction
              onClick={() => {
                handleDuplicateInterestFine();
              }}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DUPLICATE} ${translateTypeName(values.type)}`}>
                <FaRegCopy />
              </Tooltip>
            </ButtonAction>
            <ButtonAction
              onClick={event => {
                if (event.ctrlKey || event.shiftKey) {
                  handleRemoveInterestFine();
                } else {
                  openModal();
                }
              }}>
              <Tooltip withoutHoverColor={true} text={`${labelsEnum.DELETE} ${translateTypeName(values.type)}`}>
                <FaTrashAlt />
              </Tooltip>
            </ButtonAction>
            <OcurrenceDeleteModal
              visible={isModalVisible}
              closeModal={closeModal}
              removeOcurrence={handleRemoveInterestFine}
            />
          </BackgroudContainer>
        </InterestFineAction>
      </Form>
      <InterestFineConfigModal
        interests={author.list[authorIndex].interestFines.filter(
          (interestFine: any) => interestFine.type == typeInterest.id
        )}
        isOpen={isOpenConfig}
        onCancel={() => {
          setIsOpenConfig(false);
        }}
        onClose={() => {
          setIsOpenConfig(false);
        }}
        onConfirm={() => {
          setIsOpenConfig(false);
        }}
      />
    </BorderContainer>
  );
};

export default InterestForm;
