import React, { useEffect, useState } from 'react';
import menuList from './menuList';
import { ApplicationState } from '@store/index';
import { useSelector } from 'react-redux';
import SaveBeforeLogoutModal from '@/components/SaveBeforeLogoutModal';
import { Container, Content, Header } from './style';
import Menu from './Menu';
import { useCore } from '@/hooks/core';
import logout from '@/services/http/logout';

const SideBar = (): JSX.Element => {
  const {
    sidebar: { visible },
  } = useCore();

  const { account } = useSelector((state: ApplicationState) => state.simple);
  const [display, setDisplay] = useState('flex');
  const [saveBeforeLogoutVisible, setSaveBeforeLogoutVisible] = useState<boolean>(false);

  const logOut = async (isSave = false): Promise<void> => {
    const isExistAccount = account.id?.trim().length == 36;
    if (isSave && isExistAccount) setSaveBeforeLogoutVisible(false);
    logout();
  };

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => setDisplay('none'), 1000);
      return () => {
        setDisplay('flex');
        clearInterval(timeout);
      };
    }
  }, [visible]);

  return (
    <Container>
      <Content $display={display} $open={visible}>
        <Menu data={menuList} />

        <SaveBeforeLogoutModal
          visible={saveBeforeLogoutVisible}
          closeModal={() => {
            setSaveBeforeLogoutVisible(false);
            logOut();
          }}
          onConfirm={() => logOut(true)}
        />
      </Content>
    </Container>
  );
};

export default SideBar;
