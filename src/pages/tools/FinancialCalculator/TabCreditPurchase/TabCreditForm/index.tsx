import React, { useEffect } from 'react';
import CreditPurchaseService from '@services/ToolsServices/CreditPurchaseService';

import { alertMessages } from '@/hooks/alertMessages';

import { useLoading } from '@/hooks/loading';
import { Form, Input, InputContainer } from './styles';
import { DefaultResultImp } from '@/components/DefaultResult';
import { useFormikContext } from 'formik';
import IDummyObject from '@/interfaces/IDummyObject';
import { errorsEnum } from '@/enums/errorsEnum';
import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';

const maxLength = 23;

const TabCreditForm = (): JSX.Element => {
  const { values } = useFormikContext<IDummyObject>();
  const alertMessage = alertMessages();
  const { setResults } = useCore();

  const creditPurchaseService = new CreditPurchaseService();

  const { closeLoading, openLoading } = useLoading();

  const fetchData = async () => {
    try {
      openLoading();
      if (values.capital && values.installments && values.installmentsValue && values.incomingPayment) {
        const body = {
          capital: String(values.capital),
          installments: String(values.installments),
          installmentsValue: String(values.installmentsValue),
          incomingPayment: String(values.incomingPayment),
        };

        const result = await creditPurchaseService.creditPurchase(body);
        const newResults: DefaultResultImp[] = [];

        newResults.push({
          title: labelsEnum.INTEREST_TAX,
          suffix: ' %',
          result: result.tax,
        });
        newResults.push({
          title: labelsEnum.AMOUNT,
          result: Number(result.amount.replaceAll(',', '.')),
          currency: 'R$ ',
        });

        newResults.push({
          result: Number(result.installmentsTotal) ? Number(result.installmentsTotal) : '0',
          title: labelsEnum.PURCHASE_TOTAL,
          currency: 'R$ ',
        });

        setResults(newResults);
      }
      closeLoading();
    } catch (error) {
      let errorMessage: string = typeof error === 'string' ? error : error?.msg || '';
      if (error.validationErrors?.entranceData) errorMessage = error.validationErrors.entranceData;
      alertMessage.atentionError(String(errorMessage) || errorsEnum.DEFAULT);
      closeLoading();
    }
  };

  const onKeyDownHandler = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      fetchData();
    }
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
          label={labelsEnum.INPUT_VALUE}
          name="incomingPayment"
          id="incomingPayment"
          prefix={'R$ '}
          value={values['incomingPayment']}
          maxLength={maxLength}
          onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'capital')}
          tabIndex={3}
        />

        <Input
          label={labelsEnum.PURCHASE_PRICE}
          name="capital"
          id="capital"
          prefix={'R$ '}
          maxLength={maxLength}
          value={values['capital']}
          tabIndex={1}
          onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'installmentsValue')}
        />
      </InputContainer>

      <InputContainer>
        <Input
          label={labelsEnum.PURCHASE_VALUE}
          name="installmentsValue"
          id="installmentsValue"
          prefix={'R$ '}
          value={values['installmentsValue']}
          onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'installments')}
          maxLength={maxLength}
          tabIndex={2}
        />
        <Input
          label={labelsEnum.PURCHASE_NUMBER}
          name="installments"
          id="installments"
          value={values['installments']}
          onKeyDown={(event: React.KeyboardEvent) => onPressEnterDateField(event, 'incomingPayment')}
          precision={0}
          maxLength={maxLength}
          tabIndex={4}
        />
      </InputContainer>
    </Form>
  );
};
export default TabCreditForm;
