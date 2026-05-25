export enum minimumWage {
  id = 'minimum-wage',
  name = 'Salário mínimo',
}

export enum selicEnum {
  id = 'selic',
  name = 'SELIC',
}

export enum cdiEnum {
  id = 'cdi',
  name = 'CDI',
}

export enum cubeprEnum {
  id = 'cube-pr',
  name = 'CUBE-PR',
}

export enum dolarcEnum {
  id = 'dolar-c',
  name = 'DOLAR-C',
}
const indexTypes = [
  selicEnum,
  cdiEnum,
  cubeprEnum,
  dolarcEnum,
  {
    id: 'dolar-v',
    name: 'DOLAR-V',
  },
  {
    id: 'fca',
    name: 'FCA',
  },
  {
    id: 'icv',
    name: 'ICV',
  },
  {
    id: 'igp-di',
    name: 'IGP-DI',
  },
  {
    id: 'igp-m',
    name: 'IGP-M',
  },
  {
    id: 'incc',
    name: 'INCC',
  },
  {
    id: 'inpc',
    name: 'INPC',
  },
  {
    id: 'ipca',
    name: 'IPCA',
  },
  {
    id: 'ipca-15',
    name: 'IPCA-15',
  },
  {
    id: 'ipca-e',
    name: 'IPCA-E',
  },
  {
    id: 'ipc-br',
    name: 'IPC-BR',
  },
  {
    id: 'ipc-fipe',
    name: 'IPC-FIPE',
  },
  {
    id: 'ipc-ibge',
    name: 'IPC-IBGE',
  },
  {
    id: 'ipc-m',
    name: 'IPC-M',
  },
  {
    id: 'ipc-r',
    name: 'IPC-R',
  },
  {
    id: 'average-inpc-igp-di',
    name: 'AVERAGE-INPC-IGP-DI',
  },
  {
    id: 'ortn',
    name: 'ORTN',
  },
];

export default indexTypes;
