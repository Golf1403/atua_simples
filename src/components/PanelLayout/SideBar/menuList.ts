import { labelsEnum } from '@/enums/labelsEnum';
import { AsideMenuSectionImp } from '@interfaces/AsideMenuLinkImp';

import { FaMoneyCheckAlt, FaHammer } from 'react-icons/fa';

const menuList: AsideMenuSectionImp[] = [
  {
    title: 'Cálculos',
    slug: 'calculation',
    icon: FaMoneyCheckAlt,
    groups: ['owner', 'admin', 'user'],
    pages: [
      {
        pageUrl: '/calculation/bank-account',
        pageName: 'Conta Corrente',
        group: 'calculation',
        groups: ['owner', 'admin'],
        action: '',
        subject: '',
      },
      {
        pageUrl: '/calculation/simple-update',
        action: 'view',
        subject: 'SimpleCalculation',
        pageName: 'Atualização Simples',
        group: 'calculation',
        groups: ['owner', 'admin', 'user'],
      },
      {
        pageUrl: '/calculation/automated-update',
        pageName: 'Atualização Automatizada',
        group: 'calculation',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'AutomatedCalculation',
      },
      {
        pageUrl: '/calculation/current-account',
        pageName: 'Conta Corrente art. 354',
        group: 'calculation',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'CurrentAccountCalculation',
      },
      {
        pageUrl: '/calculation/financing',
        pageName: 'Financiamento',
        group: 'calculation',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'FinancingCalculation',
      },
    ],
  },
  {
    title: 'Ferramentas',
    slug: 'panel-tools',
    icon: FaHammer,
    groups: ['owner', 'admin', 'user'],
    pages: [
      {
        pageUrl: '/indicators',
        pageName: 'Indicadores',
        group: 'panel-tools',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'IndicatorTool',
      },
      {
        pageUrl: '/converter',
        pageName: labelsEnum.CONVERTER,
        group: 'panel-tools',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'CurrencyConverterTool',
      },
      {
        pageUrl: '/calculator/financial',
        pageName: 'Calculadora Financeira',
        group: 'panel-tools',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'FinancingCalculatorTool',
      },
      {
        pageUrl: '/retroactor',
        pageName: 'Retroator',
        group: 'panel-tools',
        groups: ['owner', 'admin', 'user'],
        action: 'view',
        subject: 'RetroactorTool',
      },
    ],
  },
  {
    title: 'Administração',
    slug: 'admin',
    groups: ['owner', 'admin'],
    pages: [
      {
        pageUrl: '/admin/users',
        pageName: 'Gerenciar usuários',
        group: 'admin',
        groups: ['owner', 'admin'],
        action: 'view',
        subject: 'UserRegister',
      },
      {
        pageUrl: '/admin/cost-center',
        pageName: 'Centro de custos',
        group: 'calculation',
        groups: ['owner', 'admin'],
        action: 'view',
        subject: 'CostCenter',
      },
      {
        pageUrl: '/admin/nomenclature',
        pageName: 'Nomenclatura',
        group: 'calculation',
        groups: ['owner', 'admin'],
        action: 'view',
        subject: 'Nomenclature',
      },
    ],
  },
];

export default menuList;
