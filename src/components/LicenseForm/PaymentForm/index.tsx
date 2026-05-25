import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import {
  Form,
  Footer,
  FooterContainer,
  NextContainer,
  BackContainer,
  ColumnContainer,
  RowContainer,
  InputContainer,
  Description,
} from './styles';
import DefaultInput from '../../DefaultInput';
import CustomSelect from '../../CustomSelect';
import { valueWithCurrency } from '@/lib/currency';
import { ButtonActionDefault } from '@/styles/global';
import { labelsEnum } from '@/enums/labelsEnum';
import logout from '@/services/http/logout';
import TaxDataModal from '../../TaxDataModal';

const PaymentForm = () => {
  const { values, handleSubmit } = useFormikContext<any>();
  const [isOpenAdressModal, setIsOpenAdressModal] = useState(false);

  const finishSignature = async () => {
    setIsOpenAdressModal(false);
    handleSubmit();
  };

  const handleBack = () => logout();

  const maskCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  const maskHolderName = (value: string) => value.replace(/[^A-Za-z\s]/g, '');
  const maskExpMonth = (value: string) => value.replace(/\D/g, '').slice(0, 2);
  const maskExpYear = (value: string) => value.replace(/\D/g, '').slice(0, 4);
  const maskCVV = (value: string) => value.replace(/\D/g, '').slice(0, 3);

  return (
    <Form>
      <h3>Dados do Pagamento</h3>

      <RowContainer>
        <InputContainer>
          <CustomSelect
            id="payment_method"
            label="Método de Pagamento *"
            name="payment_method"
            placeholder="Selecione o Método de Pagamento"
            options={[
              { id: 'credit_card', label: 'Cartão de Crédito', value: 'credit_card' },
              { id: 'boleto', label: 'Boleto', value: 'boleto' },
              { id: 'pix', label: 'Pix', value: 'pix' },
            ]}
          />
        </InputContainer>
        <InputContainer>
          <DefaultInput id="email" name="customer.email" type="text" disabled label="E-mail *" />
        </InputContainer>
      </RowContainer>

      <div>
        {values.payment_method === 'credit_card' && (
          <>
            <RowContainer>
              <InputContainer>
                <DefaultInput
                  id="card.number"
                  maskFn={maskCardNumber}
                  name="card.number"
                  type="text"
                  maxLength={19}
                  max={19}
                  label="Número do Cartão *"
                />
              </InputContainer>

              <InputContainer>
                <DefaultInput
                  maskFn={maskHolderName}
                  id="card.holderName"
                  name="card.holderName"
                  type="text"
                  label="Nome no Cartão *"
                />
              </InputContainer>
            </RowContainer>

            <RowContainer>
              <InputContainer inputLength={200}>
                <DefaultInput
                  maskFn={maskExpMonth}
                  id="card.expMonth"
                  placeholder="MM"
                  name="card.expMonth"
                  maxLength={18}
                  max={18}
                  type="text"
                  label="Mês de Expiração *"
                />
              </InputContainer>

              <InputContainer inputLength={200}>
                <DefaultInput
                  maskFn={maskExpYear}
                  id="card.expYear"
                  placeholder="YYYY"
                  name="card.expYear"
                  type="text"
                  label="Ano de Expiração *"
                />
              </InputContainer>

              <InputContainer inputLength={200}>
                <DefaultInput
                  maskFn={maskCVV}
                  id="card.cvv"
                  placeholder="CVV"
                  name="card.cvv"
                  type="text"
                  label="CVV *"
                />
              </InputContainer>
            </RowContainer>
          </>
        )}
      </div>

      <h3>Descrição da assinatura:</h3>

      <ColumnContainer>
        <Description>{values.metadata.item_assinado}</Description>

        {values.items.map((item: any, id: number) => {
          return (
            <ColumnContainer key={id}>
              <Description textIndent={120}>
                {item.description}: {item.quantity} x {valueWithCurrency('R$ ', item.pricing_scheme.price)}
              </Description>
            </ColumnContainer>
          );
        })}
      </ColumnContainer>

      <FooterContainer>
        <Footer>
          <BackContainer>
            <ButtonActionDefault type="button" onClick={handleBack}>
              {labelsEnum.BACK}
            </ButtonActionDefault>
          </BackContainer>
          <NextContainer>
            <ButtonActionDefault
              onClick={event => {
                event.preventDefault();
                setIsOpenAdressModal(true);
              }}
              type="button">
              {labelsEnum.NEXT}
            </ButtonActionDefault>
          </NextContainer>
        </Footer>
      </FooterContainer>

      <TaxDataModal
        onConfirm={finishSignature}
        isOpen={isOpenAdressModal}
        onClose={() => {
          setIsOpenAdressModal(false);
        }}
      />
    </Form>
  );
};
export default PaymentForm;
