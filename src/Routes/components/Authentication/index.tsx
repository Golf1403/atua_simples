import React, { useEffect, useRef, useState } from 'react';
import { JWTDecodedImp } from '@interfaces/auth/JWTDecodedImp';
import jwt_decode from 'jwt-decode';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import { pathEnum } from '@/enums/pathEnum';
import InactivityModal from '@/components/InactivityModal';
import { useAuth } from '@/hooks/auth';
import { useFactors } from '@/hooks/factors';
import { useCore } from '@/hooks/core';
import { LogoutInfoModal } from '@/Routes/pages/auth';
import logout, { disconnectSession } from '@/services/http/logout';
import { useWebSocket } from '@/hooks/websocket';
import { webSocketMessageRouteEnum } from '@/enums/webSocketRouteEnum';
import login from '@/services/http/login';
import getTokens from '@/services/http/getTokens';
import { useToolbar } from '@/hooks/toolbar';
import { useNomenclatures } from '@/hooks/nomenclatures';
import moment from 'moment';

const Authentication = ({ children: Children }: { children: JSX.Element }) => {
  const { loadIndexes } = useFactors();
  const { loadCostCenters } = useCore();
  const socket = useWebSocket();

  const { isAuth } = useAuth();
  const toolbar = useToolbar();

  const isFirstInit = useRef<null | boolean>(true);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  const [inactivityVisible, setInactivityVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const refreshToken = async () => {
    const { refreshToken: token } = getTokens();
    if (!token) return;

    socket?.sendJsonMessage({ type: webSocketMessageRouteEnum.REFRESH_SESSION, data: { token } });
    const websocket = socket?.getWebSocket();

    if (websocket?.onmessage)
      websocket.onmessage = (e: MessageEvent) => {
        const payload = JSON.parse(e.data);
        login(payload);
        disconnectSession(e);
      };
  };

  const checkRefreshToken = async () => {
    try {
      const { token } = getTokens();
      if (!token) return;
      const decoded: JWTDecodedImp = jwt_decode(token);
      const nowUTC = getNowUTC();
      const expUTC = moment.unix(decoded.exp).utc();
      const fiveMinBeforeExpiring = expUTC.subtract(10, 'minutes');

      const isExpired = fiveMinBeforeExpiring.isSameOrBefore(nowUTC);
      if (isExpired) {
        console.info('expired_session');
        await refreshToken();
      }
    } catch (error) {
      console.error('error_to_refresh_token');
    }
  };

  const getExpireTimeUTC = () => {
    const expireTime = localStorage.getItem('expireTime');
    const expireTimeDateUTC = moment(expireTime).utc();
    return expireTimeDateUTC;
  };

  const setExpireTime = (amount: number = 30, unit: moment.unitOfTime.DurationConstructor = 'm') => {
    const newExpireTime = moment(moment.now()).add(amount, unit).utc().format();
    localStorage.setItem('expireTime', String(newExpireTime));
  };

  const savePathSwitch = async (pathname: string) => {
    switch (pathname) {
      case pathEnum.CURRENT_ACCOUNT:
        toolbar.save && toolbar.save();
        break;
      case pathEnum.SIMPLE_UPDATE:
        break;
      case pathEnum.AUTOMATED_UPDATE:
        break;
      case pathEnum.FINANCING:
        break;
    }
  };

  const pathChecker = async (pathname: string) => {
    const pathList = [pathEnum.CURRENT_ACCOUNT, pathEnum.AUTOMATED_UPDATE, pathEnum.FINANCING, pathEnum.SIMPLE_UPDATE];
    pathList.forEach(async element => {
      if (pathname.includes(element)) {
        return await savePathSwitch(element);
      }
    });
  };

  const convertToUTC = (date: moment.MomentInput) => {
    return moment(date).utc();
  };
  const getNowUTC = () => {
    const nowUTC = moment(moment.now()).format();
    return convertToUTC(nowUTC);
  };

  const checkForInactivity = async () => {
    const expireTimeUTC = getExpireTimeUTC();
    const nowUTC = getNowUTC();
    if (expireTimeUTC.isBefore(nowUTC))
      toolbar.calculator && toolbar.calculator(nomenclatures) && setInactivityVisible(true);
  };

  const updateExpireTime = () => {
    setExpireTime();
  };

  const onStayConnected = async () => {
    setExpireTime();
    await refreshToken();
  };

  const closeInactivityModal = () => {
    setInactivityVisible(false);
    intervalRef.current = checkInativityInterval();
  };

  const onInactivityLimit = async () => {
    const path = location.pathname;
    await pathChecker(path);

    setTimeout(async () => {
      history.pushState({}, '', `${LogoutInfoModal.path}?type=inactive`);
      logout();
    }, timeoutEnum.DEFAULT_TIMEOUT);
  };

  useEffect(() => {
    if (!isAuth) return;
    setExpireTime();
    window.addEventListener('click', updateExpireTime);
    window.addEventListener('keypress', updateExpireTime);
    window.addEventListener('scroll', updateExpireTime);
    window.addEventListener('mousemove', updateExpireTime);

    return () => {
      window.removeEventListener('click', updateExpireTime);
      window.removeEventListener('keypress', updateExpireTime);
      window.removeEventListener('scroll', updateExpireTime);
      window.removeEventListener('mousemove', updateExpireTime);
    };
  }, [isAuth]);

  const checkInativityInterval = () =>
    setInterval(() => {
      checkForInactivity();
    }, timeoutEnum.ONE_MINUTES);

  useEffect(() => {
    if (!isAuth) return;

    intervalRef.current = checkInativityInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuth]);

  useEffect(() => {
    if (inactivityVisible && intervalRef.current) {
      clearInterval(intervalRef.current);
      return;
    }
  }, [inactivityVisible]);

  useEffect(() => {
    if (!isAuth) return;
    const interval = setInterval(() => {
      checkRefreshToken();
    }, timeoutEnum.ONE_MINUTES);

    return () => clearInterval(interval);
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth || !isFirstInit.current) return;

    isFirstInit.current = false;
    loadCostCenters();
    loadIndexes();
  }, [isAuth]);

  return (
    <>
      <InactivityModal
        visible={inactivityVisible}
        closeModal={closeInactivityModal}
        onStayConnected={onStayConnected}
        onLimit={onInactivityLimit}
      />
      {Children}
    </>
  );
};

export default Authentication;
