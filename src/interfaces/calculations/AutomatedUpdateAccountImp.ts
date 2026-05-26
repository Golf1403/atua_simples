export interface AutomatedUpdateAccountingPartImp {
  // Identificador do autor/parte contábil retornado pelo microserviço.
  id?: string;
  // Nome do autor/parte que participa do cálculo automatizado.
  name?: string;
  // Parcelas vinculadas ao autor/parte.
  installments?: unknown[];
  // Pagamentos vinculados ao autor/parte.
  payments?: unknown[];
}

export interface AutomatedUpdateExpenseImp {
  // Identificador da despesa.
  id?: string;
  // Descrição exibida na linha de despesa.
  description?: string;
  // Data usada para atualizar a despesa.
  date?: string | Date;
  // Valor original da despesa.
  value?: number;
}

export interface AutomatedUpdateFeeImp {
  // Identificador dos honorários.
  id?: string;
  // Descrição exibida na linha de honorários.
  description?: string;
  // Data usada para atualizar os honorários.
  date?: string | Date;
  // Percentual aplicado quando os honorários são calculados por percentual.
  percentage?: number;
  // Valor original ou calculado dos honorários.
  value?: number;
}

export default interface AutomatedUpdateAccountImp {
  // Identificador principal da conta de atualização automatizada.
  id?: string;
  // Centro de custo usado para permissões, nomenclaturas e agrupamento do cálculo.
  costCenterId: string;
  // Nome do cálculo exibido na listagem.
  name?: string;
  // Data final até onde os valores serão atualizados.
  updateUntil?: string | Date;
  // Configuração de deflação selecionada para o cálculo.
  deflation: string;
  // Expurgos aplicados ao cálculo, quando houver.
  purges?: string;
  // Indica se o cálculo usa pró-rata dia.
  proDIA?: boolean;
  // Indica se o cálculo usa pró-rata OTN.
  proOTN?: boolean;
  // Vara judicial informada nos dados do cálculo.
  vara?: string;
  // Número dos autos informado nos dados do cálculo.
  autos?: string;
  // Réu informado nos dados do cálculo.
  defendant?: string;
  // Observações livres do cálculo.
  observation?: string;
  // Índice financeiro usado na correção monetária.
  indexId: number;
  // Define se deve aplicar a regra de 1% com SELIC.
  onePercentSelic: boolean;
  // Autores/partes do cálculo e suas ocorrências.
  accountingParts?: AutomatedUpdateAccountingPartImp[];
  // Despesas lançadas no cálculo.
  expenses?: AutomatedUpdateExpenseImp[];
  // Honorários lançados no cálculo.
  fees?: AutomatedUpdateFeeImp[];
  // Data de criação do registro.
  createdAt?: string | Date;
}
