import { MsTypesImp } from '@interfaces/MsTypesImp';

export function getMsToBeUsed(type?: MsTypesImp) {
  switch (type) {
    case 'dashboard':
      return process.env.REACT_APP_DEV_DASHBOARD_URL;
    case 'print':
      return process.env.REACT_APP_DEV_PRINT_URL;
    case 'users':
      return process.env.REACT_APP_DEV_USERS_URL;
    case 'accounts':
      return process.env.REACT_APP_DEV_ACCOUNTS_URL;
    case 'calcs':
      return process.env.REACT_APP_DEV_CALCS_URL;
    case 'licenses':
      return process.env.REACT_APP_DEV_LICENSES_URL;
    case 'plans':
      return process.env.REACT_APP_DEV_PLANS_URL;
    case 'tools':
      return process.env.REACT_APP_DEV_TOOLS_URL;
    default:
      return process.env.REACT_APP_API_BASE_URL;
  }
}
