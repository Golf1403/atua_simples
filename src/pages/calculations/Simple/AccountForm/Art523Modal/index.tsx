import React from 'react';
import DefaultModal from '@/components/DefaultModal';
import DefaultInput from '@/components/DefaultInput';
import CustomCheckbox from '@/components/CustomCheckbox';
import { styled } from 'styled-components';
import { colorblack, colorgray80, colorstategray, colorwhite, fontsm, fontxs, rem } from '@/styles/global';
import { Formik, useFormikContext } from 'formik';

const Section = styled.div`
  border: 1px solid ${colorgray80};
  margin-top: ${rem(18)};
  padding: ${rem(18)} ${rem(10)} ${rem(10)};
  position: relative;
`;

const SectionTitle = styled.strong`
  background: ${colorwhite};
  color: ${colorblack};
  font-size: ${fontsm};
  left: ${rem(8)};
  padding: 0 ${rem(4)};
  position: absolute;
  top: ${rem(-9)};
`;

const PercentField = styled.div`
  max-width: ${rem(110)};
  margin-bottom: ${rem(10)};
`;

const ApplyLabel = styled.p`
  color: ${colorstategray};
  font-size: ${fontxs};
  margin-bottom: ${rem(8)};
  text-transform: uppercase;
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(${rem(180)}, 1fr));
  gap: ${rem(12)} ${rem(34)};

  .checkbox-container {
    min-height: ${rem(18)};
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

interface Art523ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialValues = {
  finePercent: 10,
  applyFine: {
    installments: true,
    expenses: true,
    interest: true,
    deductPayments: true,
    installmentFines: true,
    discriminateBase: false,
    fees: true,
  },
  feePercent: 10,
  applyFee: {
    installments: true,
    fees: true,
    interest: true,
    expenses: true,
    installmentFines: true,
    art523: false,
  },
};

interface Art523CheckboxProps {
  label: string;
  name: string;
}

const Art523Checkbox = ({ label, name }: Art523CheckboxProps): JSX.Element => {
  const { setFieldValue, values } = useFormikContext<any>();
  const checked = name.split('.').reduce((acc, key) => acc?.[key], values);

  return (
    <CustomCheckbox
      label={label}
      name={name}
      checked={Boolean(checked)}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFieldValue(name, event.target.checked)}
    />
  );
};

const Art523Modal = ({ isOpen, onClose }: Art523ModalProps): JSX.Element => (
  <Formik initialValues={initialValues} onSubmit={() => {}}>
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onClose}
      title="Multa conforme Artigo 523">
      <Section>
        <SectionTitle>Multa</SectionTitle>
        <PercentField>
          <DefaultInput label="% MULTA" name="finePercent" type="number" />
        </PercentField>
        <ApplyLabel>Aplicar sobre</ApplyLabel>
        <CheckboxGrid>
          <Art523Checkbox label="Total das Parcelas" name="applyFine.installments" />
          <Art523Checkbox label="Total das Despesas" name="applyFine.expenses" />
          <Art523Checkbox label="Total dos Juros" name="applyFine.interest" />
          <Art523Checkbox label="Deduzir pagamentos" name="applyFine.deductPayments" />
          <Art523Checkbox label="Total das Multas das Parcelas" name="applyFine.installmentFines" />
          <Art523Checkbox label="Discriminar valor base" name="applyFine.discriminateBase" />
          <Art523Checkbox label="Total das Honorários" name="applyFine.fees" />
        </CheckboxGrid>
      </Section>
      <Section>
        <SectionTitle>Honorários</SectionTitle>
        <PercentField>
          <DefaultInput label="% HONORÁRIOS" name="feePercent" type="number" />
        </PercentField>
        <ApplyLabel>Aplicar sobre</ApplyLabel>
        <CheckboxGrid>
          <Art523Checkbox label="Total das Parcelas" name="applyFee.installments" />
          <Art523Checkbox label="Total das Honorários" name="applyFee.fees" />
          <Art523Checkbox label="Total dos Juros" name="applyFee.interest" />
          <Art523Checkbox label="Total das Despesas" name="applyFee.expenses" />
          <Art523Checkbox label="Total das Multas das Parcelas" name="applyFee.installmentFines" />
          <Art523Checkbox label="Multa Artigo 523" name="applyFee.art523" />
        </CheckboxGrid>
      </Section>
    </DefaultModal>
  </Formik>
);

export default Art523Modal;
