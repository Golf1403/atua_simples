import SimpleInstallmentImp from '@interfaces/calculations/SimpleInstallmentImp';

export default class InstallmentTransformer {
  public static output(authorId: string, installment: SimpleInstallmentImp) {
    return {
      authorId,
      date: installment.date,
      description: installment.description,
      value: installment.value,
      detailed: installment.detailed ? 1 : 0,
    };
  }
}
