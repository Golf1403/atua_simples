import moment from 'moment';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import IDummyObject from '@/interfaces/IDummyObject';
import jwt_decode from 'jwt-decode';
import { AuthActionTypes } from '@/store/auth/types';
import { useUser } from './user';
import { Ability } from '@casl/ability';
import getTokens from '@/services/http/getTokens';

type AuthType = {
  isAuth: boolean;
};

const AuthContext = createContext<AuthType>({
  isAuth: false,
});

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(false);
  const { setUser } = useUser();

  const setUserAbility = (decodedToken: { user: IDummyObject }) => {
    const { user } = decodedToken;
    const abilities = user.resources?.map((resource: IDummyObject) => {
      if (resource.aclConfig) {
        const aclConfig = JSON.parse(resource.aclConfig);
        let aclConfigResponse = aclConfig;
        if (resource.limit)
          aclConfigResponse = {
            ...aclConfigResponse,
            conditions: { ...aclConfigResponse.conditions, limit: resource.limit },
          };
        if (resource.limitText)
          aclConfigResponse = {
            ...aclConfigResponse,
            conditions: { ...aclConfigResponse.conditions, limitText: resource.limitText },
          };

        if (aclConfigResponse) return aclConfigResponse;
      }

      return { action: 'none', subject: 'none' };
    });
    const ability = new Ability(abilities);
    dispatch({ type: AuthActionTypes.SET_ABILITY, payload: ability });
  };

  const checkAccess = async () => {
    // DEV: bypass auth on localhost for UI testing
    if (window.location.hostname === 'localhost') {
      const ability = new Ability([
        { action: 'manage', subject: 'all' },
        { action: 'view', subject: 'ArticleApply' },
      ]);
      dispatch({ type: AuthActionTypes.SET_ABILITY, payload: ability });
      setUser({
        id: 'dev',
        firstName: 'Dev',
        lastName: 'User',
        email: 'dev@localhost',
        licenseId: 'dev',
        isAdmUser: true,
        master: true,
        group: 'admin',
        costCenters: [],
      });
      setIsAuth(true);
      return;
    }

    const { refreshToken, token } = getTokens();
    if (!token || !refreshToken) return;

    const decodedToken = jwt_decode<any>(token as string);
    try {
      const now = moment(new Date()).utc();
      const expireTime = moment.unix(decodedToken.exp).utc();

      if (now.isAfter(expireTime)) throw 'is expired';
      setUser(decodedToken.user);
      setUserAbility(decodedToken);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthType => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return auth;
};
