import React, { createContext, useContext, useEffect, useState } from 'react';
import UserTransformer from '@/transforms/UserTransformer';

type UserType = {
  user: UserImp;
  setUser: (user: UserImp) => void;
};

const initialUser: UserImp = {
  id: '',
  firstName: '',
  licenseId: '',
  master: false,
  lastName: '',
  password: '',
  createdAt: '',
  isAdmUser: false,
  updatedAt: '',
  email: '',
  costCenters: [],
  group: 'guest',
};

const UserContext = createContext<UserType>({
  user: initialUser,
  setUser: () => {},
});

export interface UserImp {
  readonly id: string;
  readonly firstName: string;
  readonly isAdmUser: boolean;
  readonly licenseId: string;
  readonly master?: boolean;
  readonly lastName: string;
  readonly createdAt?: string;
  readonly password?: string;
  readonly updatedAt?: string;
  readonly redirectToPayment?: boolean;
  readonly group?: string;
  readonly email: string;
  readonly costCenters: string[];
  readonly isConfirmed?: boolean;
}

export const UserProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, _setUser] = useState<UserImp>(initialUser);
  const setUser = (_user: UserImp) => {
    _setUser(lastUser =>
      UserTransformer.output({
        ...lastUser,
        ..._user,
      })
    );
  };

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserType => {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }

  return user;
};
