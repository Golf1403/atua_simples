export default interface PaymentMethodResponseImp {
  paymentMethod: 'cc' | 'bb';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  brand?: string;
}
