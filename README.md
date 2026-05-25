# SEI SPA

- Principal projeto da SEI que incorpora os demais microserviços.

## Config

- Node 14+
- Yarn

## Dependências

- Dependências necessários para o sei-spa funcionar:

  - [Sei Lib Commons](https://github.com/xl-solutions/sei-lib-commons)

- Dependendo do serviço que você precise atuar, será necessário baixar ele separadamente, os serviços disponíveis são:
  - [sei-ms-users](https://github.com/xl-solutions/sei-ms-users)
  - [sei-dashboard](https://github.com/xl-solutions/sei-dashboard)
  - [sei-ms-licenses](https://github.com/xl-solutions/sei-ms-licenses)
  - [sei-ms-accounts](https://github.com/xl-solutions/sei-ms-accounts)
  - [sei-ms-plans](https://github.com/xl-solutions/sei-ms-plans)
  - [sei-ms-print](https://github.com/xl-solutions/sei-ms-print)
  - [sei-lib-calc](https://github.com/xl-solutions/sei-lib-calc)
  - [sei-ms-tools](https://github.com/xl-solutions/sei-ms-tools)
  - [sei-ms-wrapper](https://github.com/xl-solutions/sei-ms-wrapper)

## Setup

- Instalar o node 14+ (Node 20+ recomendado)
- Clonar este projeto localmente `git clone git@github.com:xl-solutions/sei-spa.git`.
- Via terminal, entre na pasta do sei-spa e execute `yarn`, ele irá instalar todos os pacotes do projeto (pode levar alguns minutos).
- Para rodar o projeto localmente, execute `yarn start`
- Para testar, execute `yarn test`

## Setup com Docker

- Via terminal, entre na pasta do sei-spa e execute `sudo chmod +x run.sh`.
- Para criar o container do projeto, execute `sh run.sh --create`
- Para testar, execute `sh run.sh --test`

## Setup Docker Rootless
- Seguir a [documentação](https://docs.docker.com/engine/install/linux-postinstall/).

## Deployment

- Execute um dos comandos abaixo:
  - Produção: `yarn deploy`
  - Homologação: `yarn deploy-hml`

## Configurando env
- Fora da estrutura de pasta de projetos, crie uma pasta nova específica para conter as variáveis de ambiente.
- Nela terá que conter 3 arquivos, sendo eles: `.env.prod`, `.env.hml`, `.env.dev`
- Dentro de cada estrutura de variável de ambiente, terá suas variáveis preenchidas de acordo com seu ambiente e respeitando o `.env.example` que é padronizado e utilizado igualmente em todos os projetos.
- Após criada a pasta, criados os arquivos de ambiente, será necessário criar uma váriavel e exportar esse alias com o nome *MY_ENV_PATH* dentro da sua .bashrc ou .zshrc, conforme utilizado.
Exemplo: *export MY_ENV_PATH='home/usuario/environments'*

## Deployment com Docker

- Certifique-se se os credenciais aws estão no diretório '~/.aws/credentials'.
- Na sequência, execute os comandos abaixo:
  - Entre na pasta do sei-spa e execute `sudo chmod +x run.sh`.
    - Produção: `bash run.sh --deploy-prod`
    - Homologação: `bash run.sh --deploy-hml`
    - Desenvolvimento: `bash run.sh --deploy-dev`
