import React, { useState, useEffect } from 'react';
import CustomSelect from '@components/CustomSelect';
import SelectOptionImp from '@interfaces/SelectOptionImp';
import MeasureConverterService from '@services/ToolsServices/MeasureConverterService';
import IDummyObject from '@/interfaces/IDummyObject';

import { IMeasureConverter } from '@interfaces/tools/measureConverter/IMeasureConverter';
import { types, distanceTypes, areaTypes, temperatureTypes, weightTypes } from './measureList';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { Container, Form, Input, Separator } from './styles';
import { FaEdit, FaExchangeAlt } from 'react-icons/fa';
import { rem } from '@/styles/global';
import { useFormikContext } from 'formik';
import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';
import { IoMdArrowDropdown } from 'react-icons/io';

const measuresEmptyList: SelectOptionImp[] = [];
const initialValues = {
  quantity: 0,
  fromMeasure: distanceTypes[0].value,
  toMeasure: distanceTypes[1].value,
  type: types[0].value,
};

const CustomForm = (): JSX.Element => {
  const alertMessage = alertMessages();
  const measureConverterService = new MeasureConverterService();

  const { values, setValues, setFieldValue } = useFormikContext<IDummyObject>();
  const { setResults } = useCore();

  const [measuresList, setMeasureList] = useState(measuresEmptyList);
  const { openLoading, closeLoading } = useLoading();

  useEffect(() => {
    switch (values.type) {
      case 'Distance':
        setValues(values => ({
          ...values,
          fromMeasure: distanceTypes[0].value,
          toMeasure: distanceTypes[1].value,
          quantity: 0,
        }));
        setMeasureList(distanceTypes);
        break;
      case 'Area':
        setValues(values => ({
          ...values,
          fromMeasure: areaTypes[0].value,
          toMeasure: areaTypes[1].value,
          quantity: 0,
        }));
        setMeasureList(areaTypes);
        break;
      case 'Temperature':
        setValues(values => ({
          ...values,
          fromMeasure: temperatureTypes[0].value,
          toMeasure: temperatureTypes[1].value,
          quantity: 0,
        }));
        setMeasureList(temperatureTypes);
        break;
      case 'Weight':
        setValues(values => ({
          ...values,
          fromMeasure: weightTypes[0].value,
          toMeasure: weightTypes[1].value,
          quantity: 0,
        }));
        setMeasureList(weightTypes);
        break;
      default:
        setMeasureList([]);
    }
  }, [values.type]);

  const fetchData = async (props: IMeasureConverter) => {
    try {
      openLoading();
      const convertedMeasure = measureConverterService.run(props);
      const result = Number(convertedMeasure.result).toFixed(4);

      setResults([{ result }]);
      closeLoading();
    } catch (error) {
      alertMessage.atentionError(String(error.message));
    } finally {
      closeLoading();
    }
  };

  const changeTypes = async () => {
    const auxMeasure = values.fromMeasure;
    const auxToMeasure = values.toMeasure;
    await setFieldValue('fromMeasure', auxToMeasure);
    setFieldValue('toMeasure', auxMeasure);
    setResults([]);
  };

  const handleKeyDown = (e: any) => {
    if (!values.quantity && !values.fromMeasure && !values.toMeasure) return;

    fetchData({
      from: values.fromMeasure,
      to: values.toMeasure,
      value: values.quantity,
      type: values.type,
    });
  };

  useEffect(() => {
    setValues(initialValues);
    setResults([]);
    return () => {
      setValues(initialValues);
      setResults([]);
    };
  }, []);

  return (
    <Form onKeyDown={handleKeyDown}>
      <Separator>
        <CustomSelect
          id="measure"
          label={labelsEnum.MEASURE}
          name="type"
          value={values.type}
          options={types}
          icon={IoMdArrowDropdown}
        />

        <CustomSelect
          id="from-measure"
          label={labelsEnum.UNITY}
          name="fromMeasure"
          options={measuresList}
          value={values.fromMeasure}
          icon={IoMdArrowDropdown}
        />

        <Input
          precision={2}
          prefix=" "
          label={labelsEnum.QUANTITY}
          name="quantity"
          id="quantity"
          maxLength={25}
          value={values.quantity}
        />
      </Separator>

      <Separator>
        <FaExchangeAlt size={rem(32)} onClick={changeTypes} />
      </Separator>

      <Separator>
        <CustomSelect
          id="to-currency"
          label={labelsEnum.TYPE}
          name="toMeasure"
          options={measuresList}
          value={values.toMeasure}
          icon={IoMdArrowDropdown}
        />
      </Separator>
    </Form>
  );
};
const TabMeasure = (): JSX.Element => {
  return (
    <Container initialValues={initialValues} onSubmit={() => {}}>
      <CustomForm />
    </Container>
  );
};

export default TabMeasure;
