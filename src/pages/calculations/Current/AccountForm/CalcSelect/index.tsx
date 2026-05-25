import React, { useCallback, useEffect } from 'react';

export type CurrentTypes = 'art354' | 'current-account' | 'proportional';

export const typeArt354 = {
  id: 'art354' as CurrentTypes,
  value: 'art354' as CurrentTypes,
  label: 'Art. 354',
};
export const typeAccountCurrent = {
  id: 'current-account' as CurrentTypes,
  value: 'current-account' as CurrentTypes,
  label: 'Conta Corrente',
};
export const typeProportional = {
  id: 'proportional' as CurrentTypes,
  value: 'proportional' as CurrentTypes,
  label: 'Proporcional',
};

import useCurrentAccount from '@/hooks/currentAccount';
import FormGroupRadio from '@/components/FormGroupRadio';
import { useFormikContext } from 'formik';
import { Container, TooltipTContainer } from './styles';

export interface CalcSelectImp {}
const CalcSelect = (): JSX.Element => {
  const { setAccount, account } = useCurrentAccount();

  const { values, setFieldValue } = useFormikContext<{ type: CurrentTypes }>();

  const handleBoxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if ([typeAccountCurrent.id, typeArt354.id, typeProportional.id].includes(e.target.value as CurrentTypes))
      await setFieldValue('type', e.target.value);
  };
  const renderOptions = useCallback(
    () => [
      {
        ...typeArt354,
        name: typeArt354.label,
        checked: values.type === typeArt354.id,
        tooltipText: translateAccountTypeInfo(typeArt354.id),
      },
      {
        ...typeAccountCurrent,
        name: typeAccountCurrent.label,
        checked: values.type === typeAccountCurrent.id,
        tooltipText: translateAccountTypeInfo(typeAccountCurrent.id),
      },
      {
        ...typeProportional,
        name: typeProportional.label,
        checked: values.type === typeProportional.id,
        tooltipText: translateAccountTypeInfo(typeProportional.id),
      },
    ],
    [values.type]
  );

  const translateAccountTypeInfo = useCallback((type: string) => {
    switch (type) {
      case typeArt354.id:
        return 'Os pagamentos irão amortizar primeiramente os juros, por esse motivo são calculados separado do seu próprio saldo';
      case typeAccountCurrent.id:
        return 'Os pagamentos irão incidir sobre o saldo';
      case typeProportional.id:
        return 'A amortização é realizada dentro de uma proporcionalidade entre o Saldo das ocorrências e o Saldo dos Juros';
    }
    return '';
  }, []);

  useEffect(() => {
    if ([typeAccountCurrent.id, typeArt354.id, typeProportional.id].includes(account.infos.type)) {
      setFieldValue('type', account.infos.type);
      return;
    }

    return () => {
      setFieldValue('type', typeArt354.id);
    };
  }, [account.infos.type]);

  return (
    <TooltipTContainer>
      <Container
        onBlur={() => {
          setFieldValue('type', account.infos.type);
        }}
        onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
          setAccount(account => ({ ...account, infos: { ...account.infos, type: e.target.value } }));
        }}>
        {[typeAccountCurrent.id, typeArt354.id, typeProportional.id].includes(values.type) && (
          <FormGroupRadio
            disabled={false}
            name={typeAccountCurrent.label}
            options={renderOptions()}
            onChange={handleBoxChange}
          />
        )}
      </Container>
    </TooltipTContainer>
  );
};

export default CalcSelect;
