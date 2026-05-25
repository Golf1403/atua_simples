/// <reference types="react-scripts" />

interface Window {
  INITIAL_REDUX_STATE: any;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_ENV: 'dev' | 'prod';
    readonly REACT_APP_IS_NEW_VERSION: string;
    readonly REACT_APP_MS_USERS_WEBSOCKET_URI: string;
    readonly REACT_APP_API_BASE_URL: string;
    readonly REACT_APP_DEV_PLANS_URL: string;
    readonly REACT_APP_DEV_LICENSES_URL: string;
    readonly REACT_APP_DEV_ACCOUNTS_URL: string;
    readonly REACT_APP_DEV_TOOLS_URL: string;
    readonly REACT_APP_DEV_USERS_URL: string;
    readonly REACT_APP_DEV_PRINT_URL: string;
    readonly REACT_APP_DEV_DASHBOARD_URL: string;
    readonly REACT_APP_ENCRYPTION_SECRET_KEY: string;
  }
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.png';

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    super();
    constructor();
  }
  export default WebpackWorker;
}
