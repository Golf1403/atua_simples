import React, { createContext, useContext, useState } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { ApplicationState } from '@/store';
import { Ability, AbilityTuple, MongoQueryOperators, Subject } from '@casl/ability';

interface ResourceHookImp {
  ability: Ability<
    AbilityTuple<string, Subject>,
    Record<
      string | number | symbol,
      string | number | boolean | Record<string | number | symbol, any> | MongoQueryOperators | null | undefined
    >
  >;
  isCanInterestConfig: boolean;
  isCanInterestPeriodicity: boolean;
  isCanSelectCompensatory: boolean;
  isCanSelectMoratory: boolean;
  isCanSelectPeriod: boolean;
  isCanSelectCompound: boolean;
  isCanInterest: boolean;
  isCanFeeCpc: boolean;
  isCanInstallmentDetail: boolean;
  isCanInstallment: boolean;
  isCanPayment: boolean;
  isCanFine: boolean;
  isCanProRataOtn: boolean;
  isCanProRataDay: boolean;
  isCanSaveAccount: boolean;
  isCanPurge: boolean;
  isCanOnlyPositiveIndex: boolean;
  isCanFineConfig: boolean;
  isCanExpense: boolean;
  isCanFee: boolean;
  isCanPrintHeader: boolean;
  calculationPeriodConditions?: { limit: number; limitText: string };
  costCenterConditions?: { limit: number; limitText: string };
  userRegisterConditions?: { limit: number; limitText: string };
  printHeaderConditions?: { limit: number; limitText: string };
  art523Conditions?: { limit: number; limitText: string };
  accountConditions?: { limit: number; limitText: string };
  authorsConditions?: { limit: number; limitText: string };
}

export type ConditionsImp = { limit: number; limitText: string };

const ResourceHookContext = createContext<ResourceHookImp | null>(null);

export const ResourceHookProvider = ({ children: Children }: { children: React.ReactElement }) => {
  const { ability } = useSelector((state: ApplicationState) => state.auth);

  const authorsConditions = ability.rules.find((rule: any) => rule.subject === 'Authors' && rule.action === 'add')
    ?.conditions as ConditionsImp;

  const calculationPeriodConditions = ability.rules.find(
    (rule: any) => rule.subject === 'CalculationPeriod' && rule.action === 'add'
  )?.conditions as ConditionsImp;

  const costCenterConditions = ability.rules.find(
    (rule: any) => rule.subject === 'CostCenter' && rule.action === 'view'
  )?.conditions as ConditionsImp;

  const userRegisterConditions = ability.rules.find(
    (rule: any) => rule.subject === 'UserRegister' && rule.action === 'view'
  )?.conditions as ConditionsImp;

  const printHeaderConditions = ability.rules.find(
    (rule: any) => rule.subject === 'PrintHeader' && rule.action === 'add'
  )?.conditions as ConditionsImp;

  const art523Conditions = ability.rules.find((rule: any) => rule.subject === 'Art523' && rule.action === 'add')
    ?.conditions as ConditionsImp;

  const accountConditions = ability.rules.find((rule: any) => rule.subject === 'Account' && rule.action === 'add')
    ?.conditions as ConditionsImp;

  const isCanFineConfig = ability.can('config', 'Fine');
  const isCanInterestConfig = ability.can('config', 'Interest');
  const isCanInterestPeriodicity = ability.can('add', 'InterestPeriodicity');
  const isCanSelectCompensatory = ability.can('add', 'CompensatoryInterest');
  const isCanSelectMoratory = ability.can('add', 'MoratoryInterest');
  const isCanSelectPeriod = ability.can('add', 'PeriodInterest');
  const isCanSelectCompound = ability.can('add', 'CompoundInterest');
  const isCanFeeCpc = ability.can('add', 'FeeCpc');
  const isCanInstallmentDetail = ability.can('add', 'InstallmentDetail');
  const isCanInstallment = ability.can('add', 'Installment');
  const isCanFine = ability.can('add', 'Fine');
  const isCanProRataOtn = ability.can('add', 'ProRataOtn');
  const isCanProRataDay = ability.can('add', 'ProRataDay');
  const isCanSaveAccount = ability.can('save', 'Account');
  const isCanPurge = ability.can('add', 'Purge');
  const isCanOnlyPositiveIndex = ability.can('add', 'OnlyPositiveIndex');
  const isCanExpense = ability.can('add', 'Expense');
  const isCanFee = ability.can('add', 'Fee');
  const isCanPayment = ability.can('add', 'Payment');
  const isCanPrintHeader = ability.can('add', 'PrintHeader');
  const isCanInterest = isCanSelectCompensatory || isCanSelectMoratory || isCanSelectCompound || isCanSelectPeriod;

  return (
    <ResourceHookContext.Provider
      value={{
        ability,
        isCanExpense,
        isCanFineConfig,
        isCanFee,
        isCanInstallment,
        isCanFeeCpc,
        isCanPayment,
        isCanFine,
        isCanInstallmentDetail,
        isCanInterest,
        isCanInterestConfig,
        isCanInterestPeriodicity,
        isCanOnlyPositiveIndex,
        isCanPrintHeader,
        isCanProRataDay,
        isCanProRataOtn,
        isCanPurge,
        isCanSaveAccount,
        isCanSelectCompensatory,
        isCanSelectCompound,
        isCanSelectMoratory,
        isCanSelectPeriod,
        accountConditions,
        art523Conditions,
        calculationPeriodConditions,
        costCenterConditions,
        printHeaderConditions,
        userRegisterConditions,
        authorsConditions,
      }}>
      {Children}
    </ResourceHookContext.Provider>
  );
};

export const useResource = (): ResourceHookImp => {
  const resource = useContext(ResourceHookContext);

  if (!resource) {
    throw new Error('useResource deve ser usado dentro de um ResourceHookProvider');
  }

  return resource;
};
