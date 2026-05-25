export default interface PaymentDataImp {
  paymentMethod: 'cc' | 'bb' | '';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  brand?: string;
}
