# Financiamento

Este documento registra o estado e as regras do modulo de Financiamento.

## Estado atual

O modulo possui tela, validacao, servico de calculo, tabela de parcelas, totalizadores e impressao.
A rota estava desativada apontando para a pagina `InContruction`.
Foi reativada para carregar `pages/calculations/Financing`.
Tambem foi corrigido o fluxo de rotas privadas para aguardar a verificacao de acesso antes de redirecionar para o login. Sem isso, abrir `/calculation/financing` diretamente em ambiente local podia cair no dashboard.
Os campos principais tambem foram desacoplados de um Formik vazio que existia ao redor da tela. Antes disso, varios inputs exibiam o valor digitado, mas o objeto enviado ao calculo permanecia com os valores iniciais.

## Rota

- Caminho: `/calculation/financing`
- Enum: `pathEnum.FINANCING`
- Tela: `src/pages/calculations/Financing`

## Campos da tela

- Tipo: modelo de financiamento. Opcoes atuais: Price, SAC, SACRE e Linear.
- Nome: identificacao do financiamento.
- Data: data inicial do financiamento. A tela bloqueia data anterior a 01/08/1994.
- Valor: valor principal financiado.
- Prazo: quantidade de parcelas.
- Carencia: periodo sem amortizacao, quando aplicavel.
- Juros: taxa de juros informada pelo usuario.
- Percentual negativo: permite considerar percentual negativo.
- Indice: indice de correcao usado no calculo.

## Calculo

O calculo real em producao continua sendo feito pelo servico `FinancingService`, que envia os dados para:

`POST /accounts/financing`

Para modernizacao e funcionamento local, foi criada a camada de dominio:

`src/domains/financing`

Essa camada contem funcoes puras de calculo local e testes automatizados. O servico usa essa camada quando o sistema esta em `localhost` sem token real, ou como contingencia em falha local de rede/autorizacao.

Primeiros modelos cobertos por testes:

- Price: prestacao fixa, amortizacao crescente e juros decrescentes.
- SAC: amortizacao fixa, prestacao decrescente e juros decrescentes.
- Carencia: parcelas dentro do periodo de carencia mantem amortizacao zerada.

O retorno esperado contem:

- parcelas calculadas;
- totais de amortizacao;
- correcao;
- parcelas;
- juros;
- soma final.

## Impressao

A impressao usa `PrintFinancing` e os servicos de impressao em `PrintServices/Financing`.

## Pontos para finalizacao

- Comparar o calculo local de Price e SAC com exemplos homologados do sistema antigo.
- Implementar e testar as regras especificas de SACRE e Linear.
- Revisar performance da tabela de parcelas para prazos grandes.
- Verificar layout responsivo.
- Verificar mensagens de erro, hoje algumas chamadas usam `alertMessage.error('')`.
- Confirmar se os indices usados no financiamento devem vir da mesma base atualizada dos demais calculos.
- Comentar no codigo as regras de negocio que forem confirmadas durante a estabilizacao.
