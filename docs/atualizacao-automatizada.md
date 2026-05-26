# Atualizacao Automatizada

Este documento registra a integracao local do modulo de Atualizacao Automatizada.

## Microsservicos

- `I:\sei-calculos\sei-ms-automated-update`: API NestJS local com DynamoDB local.
- `I:\sei-calculos\sei-ms-automated-update-dev-handler`: variante serverless para ambiente dev.

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

## Observacoes

- A rota `/calculation/automated-update` ainda aponta para a tela em construcao no SPA.
- O proximo passo e criar a tela/lista/formulario consumindo `AutomatedUpdateService`.
- A API local foi ajustada para aceitar CORS de `http://localhost:3000`.
