import AccountImp from '@/interfaces/AccountImp';

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
export type CurrentFormRowImp = Omit<
  AccountImp,
  | 'id'
  | 'accountTypeId'
  | 'costCenterName'
  | 'date'
  | 'data'
  | 'recordId'
  | 'courtId'
  | 'observation'
  | 'defendantId'
  | 'positive'
  | 'proRataDay'
  | 'proRataOtn'
  | 'indexId'
  | 'purges'
  | 'createdAt'
  | 'updateAt'
>;
export type CurrentFormRow2Imp = Omit<
  AccountImp,
  | 'id'
  | 'accountTypeId'
  | 'costCenterId'
  | 'costCenterName'
  | 'name'
  | 'date'
  | 'data'
  | 'recordId'
  | 'courtId'
  | 'observation'
  | 'defendantId'
  | 'updateTo'
  | 'purges'
  | 'createdAt'
  | 'updateAt'
>;
export type CurrentFormRow3Imp = Omit<
  AccountImp,
  | ' id'
  | 'accountTypeId'
  | 'costCenterId'
  | 'costCenterName'
  | 'name'
  | 'proRataDay'
  | 'proRataOtn'
  | 'date'
  | 'data'
  | 'indexId'
  | 'updateTo'
  | 'purges'
  | 'positive'
  | 'defendantId'
  | 'observation'
  | 'createdAt'
  | 'updateAt'
>;
export type CurrentFormRow4Imp = Omit<
  AccountImp,
  | ' id'
  | 'accountTypeId'
  | 'costCenterId'
  | 'costCenterName'
  | 'name'
  | 'proRataDay'
  | 'proRataOtn'
  | 'date'
  | 'data'
  | 'indexId'
  | 'updateTo'
  | 'purges'
  | 'courtId'
  | 'recordId'
  | 'positive'
  | 'createdAt'
  | 'updateAt'
>;
