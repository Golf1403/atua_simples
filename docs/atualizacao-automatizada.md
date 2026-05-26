# Atualizacao Automatizada

Este documento registra a integracao local do modulo de Atualizacao Automatizada.

## Microsservicos

- `I:\sei-calculos\sei-ms-automated-update`: API NestJS local com DynamoDB local.
- `I:\sei-calculos\sei-ms-automated-update-dev-handler`: variante serverless para ambiente dev.
- `I:\sei-calculos\sei-ms-print-financing-hml-automatedPrint`: Lambda de impressao HML com endpoint de impressao automatizada.

## API local

O servico local sobe em `http://localhost:3003` e usa DynamoDB local em `http://localhost:8000`.

Comando principal:

```bash
npm run start:local
```

Esse comando inicia o Dynalite, cria as tabelas locais e sobe o NestJS em modo watch.

## Endpoints principais

- `GET /health`: verifica se o servico esta respondendo.
- `GET /v1/automated-update-accounts`: lista calculos.
- `POST /v1/automated-update-accounts`: cria calculo.
- `GET /v1/automated-update-accounts/:id`: consulta calculo.
- `PUT /v1/automated-update-accounts/:id`: atualiza calculo.
- `DELETE /v1/automated-update-accounts/:id`: remove calculo.
- `GET /v1/automated-update-accounts/:id/calculation`: executa o calculo.

## Integracao no SPA

Foi criado `AutomatedUpdateService` em:

`src/services/CalculationsServices/AutomatedUpdateService`

O servico usa o tipo `automatedUpdate` em `getMsToBeUsed`. Em ambiente local, a URL preferencial vem de:

`REACT_APP_DEV_AUTOMATED_UPDATE_URL=http://localhost:3003`

Se a variavel nao existir e o SPA estiver em `localhost`, o fallback usa `http://localhost:3003`.

Fora de `localhost`, o fallback aponta para o handler remoto em:

`REACT_APP_API_BASE_URL/automated-update`

## Tela do SPA

A rota `/calculation/automated-update` carrega a tela `src/pages/calculations/AutomatedUpdate`.

Ela possui os blocos principais do calculo:

- Dados do calculo: centro de custo, nome, data final de atualizacao, indice, deflacao, expurgos, pro-rata, vara, autos, reu e observacao.
- Autores: cada autor pode receber ocorrencias de Parcela e Pagamento.
- Despesas: despesas independentes do autor, com opcao de Art. 523.
- Honorarios: honorarios independentes do autor, com opcao de novo CPC.
- Total geral: soma local dos valores informados na tela, antes do calculo definitivo do microservico.
- Calculos salvos: listagem dos registros existentes, com acoes de editar, calcular e excluir.

O front monta o payload conforme o contrato do microservico:

- `accountingParts[].installments`: ocorrencias do tipo Parcela.
- `accountingParts[].payments`: ocorrencias do tipo Pagamento.
- `expenses`: despesas do calculo.
- `fees`: honorarios do calculo.

Quando o ambiente local nao consegue autenticar no servico de indices, a tela usa uma lista minima de apoio (`CDI`, `SELIC`, `Salario minimo`) para permitir o trabalho local sem travar o formulario.

## Persistencia no SPA

O `POST /v1/automated-update-accounts` pode responder apenas a conta principal. Por isso, depois de criar ou atualizar, o SPA chama `GET /v1/automated-update-accounts/:id` para recompor autores, parcelas, despesas e honorarios salvos.

Ao editar um item pela lista de calculos salvos, a tela tambem usa o `GET /:id` antes de preencher o formulario. Isso evita editar com dados parciais da listagem.

## Impressao automatizada

A pasta `sei-ms-print-financing-hml-automatedPrint` confirma o endpoint:

- `POST /print-financing/automated`
- `GET /print-financing/automated`

O payload validado pelo servico de impressao usa:

- `configuration`: configuracao de impressao.
- `infos.account`: dados principais do calculo.
- `infos.authors`: autores com `installments`, `payments`, `expenses`, `fees` e totais.

Essa estrutura sera a base para integrar o botao de impressao da Atualizacao Automatizada quando a tela passar a manter o resultado calculado completo.

## Observacoes

- A API local foi ajustada para aceitar CORS de `http://localhost:3000`.
- A implementacao antiga completa da tela nao foi encontrada no `sei-spa` local nem em `I:\sei-calculos - Copia`; nessas bases a rota ainda apontava para `InContruction`.
