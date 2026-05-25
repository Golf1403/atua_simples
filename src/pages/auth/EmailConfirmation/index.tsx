import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import UserServices from '@/services/UserServices';
import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';
import { useAuth } from '@/hooks/auth';
import { useUser } from '@/hooks/user';
import logout from '@/services/http/logout';
import useQuery from '@/hooks/query';

const EmailConfirmation: React.FC = () => {
  const { isAuth } = useAuth();
  const alertMessage = alertMessages();
  const { user, setUser } = useUser();

  const userService = new UserServices();
  const { openLoading, closeLoading } = useLoading();

  const query = useQuery();
  const token = query.get('token');

  const updateUserByToken = async () => {
    try {
      openLoading();

      if (isAuth && token && typeof process.env.REACT_APP_ENCRYPTION_SECRET_KEY === 'string') {
        const descryptedToken = CryptoJS.DES.decrypt(token, process.env.REACT_APP_ENCRYPTION_SECRET_KEY + user.email);
        const expireDate = moment(descryptedToken.toString(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        const currentDate = moment(new Date());
        const isNotValidDate = currentDate.isSameOrAfter(expireDate);

        if (!isNotValidDate) {
          const userWithConfirmation = { ...user, isConfirmed: true };
          await userService.updateCompleteUser(userWithConfirmation);
          setUser(userWithConfirmation);
        }
      }
      closeLoading();
      logout();
    } catch (error) {
      alertMessage.error('Não foi possível confirmar o e-mail!');
    }
  };

  useEffect(() => {
    updateUserByToken();
  }, [query, isAuth]);

  return <></>;
};

export default EmailConfirmation;
