import { addMethod, StringSchema, string } from 'yup';
import * as yup from 'yup';
import { cpf, cnpj } from 'cpf-cnpj-validator';

import billingSchema from '../billingSchema';

function validateCpfCnpj(this: StringSchema, message: string) {
  return this.test('validateCpfCnpj', message, function (value) {
    const { path, createError } = this;
    return cpf.isValid(value, true) || cnpj.isValid(value, true) || createError({ path, message });
  });
}

addMethod(string, 'validateCpfCnpj', validateCpfCnpj);

const personTypeRequired = {
  is: (val: string) => val === 'pj',
  then: yup.string().required(`Campo 'Inscrição estadual' é obrigatório`),
  otherwise: yup.string().notRequired(),
};

export default billingSchema.shape({
  personType: yup.string().required(`Campo 'Tipo' é obrigatório`),
  companyName: yup.string().required(`Campo 'Nome da empresa' é obrigatório`),
  companyStateId: yup.string().notRequired().when('personType', personTypeRequired),
  documentNumber: yup.string().validateCpfCnpj('Número inválido').required(`Obrigatório`),

  country: yup.string().required(`Campo 'País' é obrigatório`),
  zipCode: yup.string().required(`Campo 'CEP' é obrigatório`),
  street: yup.string().required(`Campo 'Logradouro' é obrigatório`),
  number: yup.string().required(`Campo 'Número' é obrigatório`),
  streetLineTwo: yup.string(),
  state: yup.string().required(`Campo 'Estado' é obrigatório`),
  city: yup.string().required(`Campo 'Cidade' é obrigatório`),

  phoneOne: yup.string().required(`Campo 'Telefone 1' é obrigatório`),
  phoneTwo: yup.string(),

  knowAs: yup.string(),
});
