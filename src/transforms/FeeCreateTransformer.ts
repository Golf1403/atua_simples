import FeeImp from '@interfaces/calculations/FeeImp';

export default class FeeTransformer {
  public static output(authorId: string, accountId: string, fee: FeeImp) {
    return {
      accountId,
      authorId,
      date: fee.date,
      value: fee.value,
      percentage: fee.percentage,
      type: fee.type,
    };
  }
}
