import { LogoutInfoModal } from '@/Routes/pages/auth';
import { webSocketMessageRouteEnum } from '@/enums/webSocketRouteEnum';

const logout = (code?: string, reload = true) => {
  if (code == 'ECONNABORTED') return;

  localStorage.removeItem('token');
  localStorage.removeItem('refresh-token');
  reload && history.go(0);
};

export const disconnectSession = (e: MessageEvent) => {
  const data = JSON.parse(e.data);
  if (data?.type?.includes(webSocketMessageRouteEnum.DISCONNECT_SESSION)) {
    history.pushState({}, '', `${LogoutInfoModal.path}?type=active`);
    logout();
  }
};

export default logout;
