import React from 'react';
import DefaultModal from '../DefaultModal';
import DefaultInput from '../DefaultInput';
import { InputContainer, RowContainer } from './styles';
import CustomSelect from '../CustomSelect';
import { IoMdArrowDropdown } from 'react-icons/io';
import SelectOptionImp from '@/interfaces/SelectOptionImp';

const stateOptions: SelectOptionImp[] = [
  {
    id: 'AC',
    value: 'AC',
    label: 'Acre',
  },
  {
    id: 'AL',
    value: 'AL',
    label: 'Alagoas',
  },
  {
    id: 'AM',
    value: 'AM',
    label: 'Amazonas',
  },
  {
    id: 'AP',
    value: 'AP',
    label: 'Amapá',
  },
  {
    id: 'BA',
    value: 'BA',
    label: 'Bahia',
  },
  {
    id: 'CE',
    value: 'CE',
    label: 'Ceará',
  },
  {
    id: 'DF',
    value: 'DF',
    label: 'Distrito Federal',
  },
  {
    id: 'ES',
    value: 'ES',
    label: 'Espírito Santo',
  },
  {
    id: 'GO',
    value: 'GO',
    label: 'Goiás',
  },
  {
    id: 'MA',
    value: 'MA',
    label: 'Maranhão',
  },
  {
    id: 'MG',
    value: 'MG',
    label: 'Minas Gerais',
  },
  {
    id: 'MS',
    value: 'MS',
    label: 'Mato Grosso do Sul',
  },
  {
    id: 'MT',
    value: 'MT',
    label: 'Mato Grosso',
  },
  {
    id: 'PA',
    value: 'PA',
    label: 'Pará',
  },
  {
    id: 'PB',
    value: 'PB',
    label: 'Paraíba',
  },
  {
    id: 'PE',
    value: 'PE',
    label: 'Pernambuco',
  },
  {
    id: 'PI',
    value: 'PI',
    label: 'Piauí',
  },
  {
    id: 'PR',
    value: 'PR',
    label: 'Paraná',
  },
  {
    id: 'RJ',
    value: 'RJ',
    label: 'Rio de Janeiro',
  },
  {
    id: 'RN',
    value: 'RN',
    label: 'Rio Grande do Norte',
  },
  {
    id: 'RO',
    value: 'RO',
    label: 'Rondônia',
  },
  {
    id: 'RR',
    value: 'RR',
    label: 'Roraima',
  },
  {
    id: 'RS',
    value: 'RS',
    label: 'Rio Grande do Sul',
  },
  {
    id: 'SC',
    value: 'SC',
    label: 'Santa Catarina',
  },
  {
    id: 'SE',
    value: 'SE',
    label: 'Sergipe',
  },
  {
    id: 'SP',
    value: 'SP',
    label: 'São Paulo',
  },
  {
    id: 'TO',
    value: 'TO',
    label: 'Tocantins',
  },
];

export default function TaxDataModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const maskCPF = (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const maskPhone = (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');

  const maskCEP = (value: string) => value.replace(/\D/g, '').replace(/(\d{5})(\d{3})$/, '$1-$2');
  const maskRG = (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      title="Cadastro de Endereço">
      <RowContainer>
        <InputContainer>
          <CustomSelect icon={IoMdArrowDropdown} name="taxdata.state" options={stateOptions} />
        </InputContainer>
        <InputContainer>
          <CustomSelect
            icon={IoMdArrowDropdown}
            name="taxdata.country"
            options={[{ id: 'BR', label: 'Brasil', value: 'BR' }]}
          />
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <DefaultInput maskFn={maskRG} placeholder="IE/RG" maxLength={12} name="taxdata.ieRg" />
        </InputContainer>
        <InputContainer>
          <DefaultInput maskFn={maskCPF} placeholder="CPF" maxLength={14} name="taxdata.document" />
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <DefaultInput maskFn={maskCEP} placeholder="CEP" maxLength={9} name="taxdata.zipcode" />
        </InputContainer>
        <InputContainer>
          <DefaultInput placeholder="Rua" maxLength={50} name="taxdata.street" />
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <DefaultInput type="number" placeholder="Número" maxLength={5} name="taxdata.number" />
        </InputContainer>
        <InputContainer>
          <DefaultInput placeholder="Bairro" maxLength={50} name="taxdata.neighborhood" />
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <DefaultInput placeholder="Complemento" maxLength={50} name="taxdata.complement" />
        </InputContainer>
        <InputContainer>
          <DefaultInput placeholder="Cidade" name="taxdata.city" />
        </InputContainer>
      </RowContainer>
      <RowContainer>
        <InputContainer>
          <DefaultInput maskFn={maskPhone} placeholder="Telefone 1" maxLength={15} name="taxdata.phone1" />
        </InputContainer>
        <InputContainer>
          <DefaultInput maskFn={maskPhone} placeholder="Telefone 2" maxLength={15} name="taxdata.phone2" />
        </InputContainer>
      </RowContainer>
    </DefaultModal>
  );
}
