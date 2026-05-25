import React, { useState, useEffect } from 'react';
import CapitalizationService from '@/services/ToolsServices/CapitalizationService';
import IDummyObject from '@/interfaces/IDummyObject';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { Container, Form, Input, InputContainer } from './styles';
import { useFormikContext } from 'formik';
import { DefaultResultImp } from '@/components/DefaultResult';
import { replaceCurrencyString } from '@/lib/utils';
import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';
import { FaEdit } from 'react-icons/fa';

const CustomForm = (): JSX.Element => {
  const { values } = useFormikContext<IDummyObject>();

  const { openLoading, closeLoading } = useLoading();
  const capitalizationService = new CapitalizationService();
  const alertMessage = alertMessages();
  const { setResults } = useCore();

  const [fieldTax, setFieldTax] = useState(true);
  const [countField, setCountField] = useState(0);
  const [fieldAmount, setFieldAmount] = useState(true);
  const [fieldCapital, setFieldCapital] = useState(true);
  const [fieldInstallments, setFieldInstallments] = useState(true);
  const [fieldInstallmentsValue, setFieldInstallmentsValue] = useState(true);

  useEffect(() => {
    let count = 0;

    if (values.amount) count++;

    if (values.installmentsValue) count++;

    if (values.installments) count++;

    if (values.capital) count++;

    if (values.tax) count++;

    setCountField(count);
  }, [values]);

  useEffect(() => {
    !values.amount && countField == 3 ? setFieldAmount(true) : setFieldAmount(false);
    !values.installmentsValue && countField == 3 ? setFieldInstallmentsValue(true) : setFieldInstallmentsValue(false);
    !values.installments && countField == 3 ? setFieldInstallments(true) : setFieldInstallments(false);
    !values.capital && countField == 3 ? setFieldCapital(true) : setFieldCapital(false);
    !values.tax && countField == 3 ? setFieldTax(true) : setFieldTax(false);
  }, [countField, values]);

  const checkIfShow = (field: string) => {
    return !values[field] ? true : false;
  };

  const fetchData = async () => {
    if (countField !== 3) return;

    try {
      openLoading();

      const body = {
        capital: values.capital,
        installments: values.installments,
        installmentsValue: values.installmentsValue,
        amount: values.amount,
        tax: values.tax,
      };
      const result = await capitalizationService.run(body);

      const newResults: DefaultResultImp[] = [];

      if (checkIfShow('amount'))
        newResults.push({
          result: Number(replaceCurrencyString(result.amount)) ? Number(replaceCurrencyString(result.amount)) : '0',
          title: labelsEnum.AMOUNT,
          currency: 'R$ ',
        });

      if (checkIfShow('installmentsValue'))
        newResults.push({
          result: Number(replaceCurrencyString(result.installmentsValue))
            ? Number(replaceCurrencyString(result.installmentsValue))
            : '0',
          title: labelsEnum.PURCHASE_VALUE,
          currency: 'R$ ',
        });

      if (checkIfShow('installments'))
        newResults.push({
          result: Number(replaceCurrencyString(result.installments)) ? result.installments : '0',
          title: labelsEnum.PURCHASE_NUMBER,
        });

      if (checkIfShow('capital'))
        newResults.push({
          result: Number(replaceCurrencyString(result.capital)) ? Number(replaceCurrencyString(result.capital)) : '0',
          title: labelsEnum.CAPITAL,
          currency: 'R$ ',
        });

      if (checkIfShow('tax'))
        newResults.push({
          result: Number(replaceCurrencyString(result.tax)) ? result.tax : '0',
          title: labelsEnum.INTEREST_TAX,
          suffix: ' %',
        });

      if (checkIfShow('installmentsTotal'))
        newResults.push({
          result: Number(replaceCurrencyString(result.installmentsTotal))
            ? Number(replaceCurrencyString(result.installmentsTotal))
            : '0',
          title: labelsEnum.PURCHASE_TOTAL,
          currency: 'R$ ',
        });

      setResults(newResults);

      closeLoading();
    } catch (error) {
      let errorMessage: string = typeof error === 'string' ? error : error?.msg || '';
      if (error.validationErrors?.installmentValue) {
        errorMessage = error.validationErrors.installmentValue;
      }

      closeLoading();
      alertMessage.warning(errorMessage);
    }
  };

  const onKeyDownHandler = (e: any) => {
    if (e.keyCode === 13) fetchData();
  };

  const onPressEnterDateField = (event: React.KeyboardEvent, nextInputId: string) => {
    event.persist();
    const target: any = event?.target;
    const form = target?.form;
    if (!form) return;
    const pressTab = event.keyCode === 9;
    if (!pressTab) return;
    event.preventDefault();
    if (form.elements[nextInputId]) {
      if (target?.blur) target.blur();
      if (form.elements[nextInputId]?.focus) form.elements[nextInputId].focus();
    }
  };

  return (
    <Form onKeyDown={onKeyDownHandler}>
      <InputContainer>
        <Input
          label={labelsEnum.CAPITAL}
          name="capital"
          id="capital"
          prefix={'R$ '}
          value={values.capital}
          disabled={fieldCapital}
        />
        <Input
          label={labelsEnum.AMOUNT}
          name="amount"
          id="amount"
          prefix={'R$ '}
          value={values.amount}
          disabled={fieldAmount}
        />
      </InputContainer>
      <InputContainer>
        <Input
          type="number"
          label={labelsEnum.PURCHASE_NUMBER}
          name="installments"
          id="installments"
          value={values.installments}
          disabled={fieldInstallments}
        />
        <Input
          label={labelsEnum.INTEREST_TAX}
          name="tax"
          id="tax"
          suffix={' %'}
          precision={4}
          value={values.tax}
          disabled={fieldTax}
        />
        <Input
          label={labelsEnum.PURCHASE_VALUE}
          name="installmentsValue"
          id="installmentsValue"
          prefix={'R$ '}
          disabled={fieldInstallmentsValue}
          value={values.installmentsValue}
          onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'capital')}
        />
      </InputContainer>
    </Form>
  );
};
const TabAmortization = (): JSX.Element => {
  const { setResults: setResults } = useCore();

  useEffect(() => {
    setResults([]);
    return () => {
      setResults([]);
    };
  }, []);

  return (
    <Container
      initialValues={{
        capital: 0,
        amount: 0,
        installments: 0,
        tax: 0,
        installmentsValue: 0,
      }}
      onSubmit={() => {}}>
      <CustomForm />
    </Container>
  );
};

export default TabAmortization;
