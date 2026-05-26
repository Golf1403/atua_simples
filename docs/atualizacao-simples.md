# Atualizacao Simples

Este documento registra as decisoes e regras implementadas na tela de Atualizacao Simples.

## Objetivo

A Atualizacao Simples calcula o valor atualizado de um processo judicial com um ou mais autores.
Cada autor pode possuir ocorrencias, despesas e honorarios. O total do calculo representa a soma de todos os autores.

## Campos principais

- Centro de custo: identifica a classificacao financeira do calculo.
- Calculo: nome livre usado para identificar o calculo.
- Atualizar ate: data final usada na correcao monetaria. Em novo calculo, inicia com a data do dia.
- Indice: indice financeiro aplicado na correcao monetaria.
- Deflacao: define se valores negativos do indice serao aceitos.
- Expurgos: reservado para configuracoes de expurgos.
- Pro rata: define se a correcao sera proporcional ao dia.
- Vara, autos, reu e observacao: dados informativos do processo.

## Autores

O processo pode ter varios autores.
Cada autor possui sua propria lista de ocorrencias, despesas e honorarios.
O total do autor resume apenas os itens daquele autor.
O total geral do calculo soma todos os autores.

## Ocorrencias

As ocorrencias podem ser:

- Parcela: valor positivo devido ao autor.
- Pagamento: valor abatido do total do autor.

Ao adicionar ou duplicar uma ocorrencia, a nova linha recebe destaque visual temporario:

- Parcela: cinza.
- Pagamento: vermelho.

O destaque some quando o usuario edita a linha ou cria outro item.

## Juros e multa

Juros e multa ficam vinculados a uma ocorrencia.
Os botoes aparecem junto da linha principal da ocorrencia.
As linhas detalhadas de juros e multa so aparecem quando o usuario abre a configuracao correspondente.

## Despesas

Despesas sao valores somados ao total do autor.
Ao criar uma despesa, a linha recebe destaque amarelo temporario.
O Art. 523 na despesa e apenas um checkbox informativo de aplicacao.
A configuracao do Art. 523 fica na secao propria do Art. 523.

## Honorarios

Honorarios sao valores somados ao total do autor.
Ao criar honorarios, a linha recebe destaque verde temporario.
A engrenagem abre as configuracoes especificas de honorarios.

## Art. 523

O Art. 523 possui uma secao propria com checkbox e texto clicavel.
Ao clicar, abre o modal de configuracao da multa e dos honorarios conforme Art. 523.

## Indices e memoria de calculo

O calculo deve usar indices atualizados do banco pela rota:

`/financial-index/memcalc`

Em ambiente local, existe um fallback em `public/memcalcs.json`.
Esse fallback nao deve ser usado quando estiver defasado em relacao a data de "Atualizar ate".
Se a API nao responder e o fallback nao cobrir a data final, o sistema bloqueia o calculo para evitar resultado incorreto.

## Calculo

A tela de Atualizacao Simples reaproveita o motor de calculo da Conta Corrente.
Antes de enviar dados ao motor, valores formatados em moeda e percentual sao convertidos para numero puro.
Depois do retorno do motor, os valores calculados sao reaplicados nas linhas da tela:

- ocorrencias;
- despesas;
- honorarios;
- totais por autor;
- total geral do calculo.

## Pratica de documentacao

Novas regras de negocio devem ser registradas neste documento ou em arquivo equivalente dentro de `docs`.
No codigo, comentarios devem explicar campos, transformacoes e decisoes de negocio que nao sejam obvias.
Evitar comentarios que apenas repitam o que o codigo ja diz.
