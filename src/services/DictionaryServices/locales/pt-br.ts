import { errorsEnum, errorsTranslatePtBrEnum } from '@/enums/errorsEnum';
import indexesDateErrors from './indexesDateErrors';

interface ILanguage {
  [id: string]: string | string;
}

const PT_BR: ILanguage = {
  ...indexesDateErrors,
  '"indicadorIds" is not allowed to be empty': 'Por favor selecionar no mínimo 1 indicador',
  '"deadline" must be less than or equal to 420': 'Prazo tem que ser menor ou igual a 420 meses',
  '"password" is not allowed to be empty': 'A senha está vazia',
  'user not has permission': 'Usuário sem permissão',
  'Email or password are incorrect, please try again': 'Email ou senha incorretas, por favor tente novamente.',
  'users.email must be unique': 'Esse email já está cadastrado.',
  'password must be at least 6 characters': 'A senha deve ter no mínimo 6 caractéres.',
  'password must be at least 8 characters': 'A senha deve ter no mínimo 8 caractéres.',
  'email must be unique': 'Esse email já está cadastrado.',
  'Email must be unique': 'Esse email já está cadastrado.',
  'Username must be unique': 'Esse usuário já esta cadastrado.',
  'username must be unique': 'Esse usuário já esta cadastrado.',
  '"deadline" must be a number': 'Prazo tem que ser um número',
  '"costCenterId" is not allowed to be empty "name" is not allowed to be empty': 'Centro de custo não selecionado',
  'Not found user of request': 'Usuario da requisição não encontrado',
  'not found user of request': 'Usuario da requisição não encontrado',
  'TaxaData not found!':
    'É necessário cadastrar as informações de cobrança para essa ação. Para isso, acesse seu Perfil.',
  'user already connected, please disconnect and try again': 'usuário já conectado, desconecte e tente novamente.',
  '"phone2" length must be at least 13 characters long': 'O número de telefone fixo é inválido.',
  '"phone2" length must be less than or equal to 13 characters long': 'O número de telefone fixo é inválido.',
  '"phone1" length must be at least 11 characters long': 'O número de telefone celular é inválido.',
  '"phone1" length must be less than or equal to 11 characters long': 'O número de telefone celular é inválido.',
  'The installment value multiplied by installments plus incoming payment must be greater of the value purchase':
    'O valor da prestação multiplicado pelo total de prestações mais o valor de entrada deve ser maior que o valor de compra.',
  'Multiplying the installment by the installments value has must be equal to or greater than the capital':
    'Multiplicando o valor da prestação pelo total de prestações o resultado deve ser maior ou igual o capital',
  [`${errorsEnum.TAXDATA_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.TAXDATA_NOT_FOUND}`,
  [`${errorsEnum.INDEX_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.INDEX_NOT_FOUND}`,
  [`${errorsEnum.FACTOR_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.FACTOR_NOT_FOUND}`,
  [`${errorsEnum.FACTOR_DETAILED_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.FACTOR_DETAILED_NOT_FOUND}`,
  [`${errorsEnum.AUTHORS_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.AUTHORS_NOT_FOUND}`,
  [`${errorsEnum.DETAILED_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.DETAILED_NOT_FOUND}`,
  [`${errorsEnum.MEMCALC_NOT_FOUND}`]: `${errorsTranslatePtBrEnum.MEMCALC_NOT_FOUND}`,
};
export default PT_BR;
