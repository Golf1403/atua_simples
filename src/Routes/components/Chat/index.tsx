import React, { useEffect } from 'react';

import { FC, PropsWithChildren } from 'react';
import { ApplicationState } from '@store/index';
import { useSelector } from 'react-redux';
import { useLoading } from '@/hooks/loading';
import { useAuth } from '@/hooks/auth';

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P = {}> = FC<PropsWithChildren<P>>;

const Chat: FCC<{}> = () => {
  const { isLoading } = useLoading();
  const { isAuth } = useAuth();

  const { ability } = useSelector((state: ApplicationState) => state.auth);

  const ifCanAddHelp = () => {
    const isShowHelp = ability.can('view', 'Help');
    const _divChat = document.querySelector('[data-b24-crm-button-cont]');

    if (isAuth && isShowHelp) {
      if (_divChat) {
        _divChat.classList.remove('b24-widget-button-hidden');
        _divChat.classList.add('b24-widget-button-visible');
        return;
      }
      const _script = document.createElement('script');
      const _root = document.getElementById('root');
      _script.src = 'https://cdn.bitrix24.com/b20650911/crm/site_button/loader_1_zo429j.js?27653395';
      _script.async = true;
      if (_root) _root.appendChild(_script);
      return;
    }

    if (!_divChat) return;
    _divChat.classList.remove('b24-widget-button-visible');
    _divChat.classList.add('b24-widget-button-hidden');
  };

  useEffect(() => {
    if (isLoading) return;
    ifCanAddHelp();
  }, [isLoading, isAuth, ability]);

  return <></>;
};

export default Chat;
