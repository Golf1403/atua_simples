import PaymentImp from '@interfaces/calculations/PaymentImp';

export default class PaymentTransformer {
  public static output(authorId: string, payment: PaymentImp) {
    return {
      authorId,
      date: payment.date,
      description: payment.description,
      value: payment.value,
    };
  }
}
