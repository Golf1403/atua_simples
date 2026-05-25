import React, { Fragment, useCallback, useEffect, useState } from 'react';

import {
  FeeFineAction,
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
  FeeFineOptions,
} from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import { useFormikContext } from 'formik';
import { getCoin } from '@/utils/numberUtils';
import { FeeFineTypes, typeFeeArt, typeFineArt } from '@/hooks/interfaces/CurrentAccountHookImp';
import { DraggableProvided } from 'react-beautiful-dnd';
const { Draggable } = require('react-beautiful-dnd');
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';

import ISelectOption from '@interfaces/SelectOptionImp';
import fineEntryTypes from '@data/calculations/fineEntryTypes';
import CurrentFeeFineImp from '@/interfaces/calculations/CurrentFeeFineImp';
import CustomCheckbox from '@/components/CustomCheckbox';
import useCurrentAccount from '@/hooks/currentAccount';
import FeeFineService from '@/services/CalculationsServices/CurrentAccountService/FeeFineService';
import _ from 'lodash';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { getFieldName } from '@/lib/nomenclature';
import { useNomenclatures } from '@/hooks/nomenclatures';

export const fineEntryTypeOptions: ISelectOption[] = fineEntryTypes.map(entry => {
  const option: ISelectOption = {
    id: entry.id,
    value: entry.id,
    label: entry.name,
  };
  return option;
});

export interface CalcSelectImp {}

const FeeFinesForm = ({ feeFineIndex }: { feeFineIndex: number }): JSX.Element => {
  const { values } = useFormikContext<CurrentFeeFineImp>();
  const { feeFines, setFeeFines } = useCurrentAccount();
  const { nomenclatures } = useNomenclatures();
  const feeFineService = new FeeFineService();
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleRemoveFeeFines = () => {
    const _feeFines = feeFineService.delete({ feeFineIndex, feeFines });
    setFeeFines(_feeFines);
  };

  const translateTypeName = (type: FeeFineTypes) => {
    switch (type) {
      case typeFeeArt.id:
        return getFieldName(typeFeeArt.label, nomenclatures);
      case typeFineArt.id:
        return getFieldName(typeFineArt.label, nomenclatures);
    }
  };

  const onBlur = useCallback(() => {
    const _feeFines = _.cloneDeep(feeFines) as any;
    const newValues = values as any;

    if (
      newValues.afterTotal == _feeFines.list[feeFineIndex].afterTotal &&
      newValues.dateEnd == _feeFines.list[feeFineIndex].dateEnd &&
      newValues.description == _feeFines.list[feeFineIndex].description &&
      newValues.isCorrection == _feeFines.list[feeFineIndex].isCorrection &&
      newValues.tax == _feeFines.list[feeFineIndex].tax &&
      newValues.type == _feeFines.list[feeFineIndex].type &&
      newValues.value == _feeFines.list[feeFineIndex].value &&
      newValues?.dateStart == _feeFines.list[feeFineIndex]?.dateStart
    )
      return;

    _feeFines.list[feeFineIndex] = newValues;
    setFeeFines(_feeFines);
  }, [values, feeFines, setFeeFines, feeFineIndex]);

  return (
    <Draggable key={`item-${feeFineIndex}`} draggableId={`item-${feeFineIndex}`} index={feeFineIndex}>
      {(provider: DraggableProvided) => (
        <Fragment>
          <BorderContainer>
            <Form
              key={feeFineIndex}
              onBlur={onBlur}
              ref={provider.innerRef}
              {...provider.draggableProps}
              {...provider.dragHandleProps}>
              <Name>
                <VerticalLine $colorType={values.type} />
                {translateTypeName(values.type)}
              </Name>
              <DescriptionContainer>
                <Input id="description" className="description" name="description" value={values.description} />
              </DescriptionContainer>
              <InputDateContainer>
                {values.type != typeFineArt.id ? (
                  <InputDate id="date-start" className="date-start" name="dateStart" value={values.dateStart || ''} />
                ) : (
                  <Input reset />
                )}
                <InputDate id="date-end" className="date-end" name="dateEnd" value={values.dateEnd || ''} />
              </InputDateContainer>
              <InputContainer>
                <PeriodicityTaxContainer>
                  <Input reset />

                  <Input
                    id="tax"
                    className="tax"
                    prefix={''}
                    suffix={` %`}
                    precision={4}
                    name="tax"
                    value={values.tax}
                  />
                </PeriodicityTaxContainer>
                <ValuePercentContainer>
                  <Input
                    id="value"
                    className="value"
                    prefix={`${getCoin(values.type == typeFeeArt.id ? values.dateStart : values.dateEnd, 0)} `}
                    suffix={``}
                    precision={4}
                    name="value"
                    value={values.value}
                  />
                </ValuePercentContainer>
              </InputContainer>
              <FeeFineOptions>
                <BackgroudContainer align="center">
                  <CustomCheckbox name="afterTotal" label="Após o total" checked={values.afterTotal} />
                </BackgroudContainer>
              </FeeFineOptions>

              <FeeFineAction>
                <BackgroudContainer align="flex-end">
                  <ButtonAction
                    onClick={() => {
                      const _feeFines = feeFineService.duplicate({ feeFineIndex, feeFines });
                      setFeeFines(_feeFines);
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
                        handleRemoveFeeFines();
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
                    removeOcurrence={handleRemoveFeeFines}
                  />
                </BackgroudContainer>
              </FeeFineAction>
            </Form>
          </BorderContainer>
        </Fragment>
      )}
    </Draggable>
  );
};

export default FeeFinesForm;
