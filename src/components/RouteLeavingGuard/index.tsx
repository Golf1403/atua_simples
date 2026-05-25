import React, { useEffect, useState } from 'react';
import { Location } from 'history';
import { useHistory } from 'react-router-dom';
const { Prompt } = require('react-router-dom');

import DefaultModal from '../DefaultModal';
import useCurrentAccount, {
  initialAccount,
  initialAuthor,
  initialFeeFines,
  initialLayout,
} from '@/hooks/currentAccount';
import { Container, ContentModal, Message } from './styles';
import _ from 'lodash';

interface Props {
  message: string;
  saveBeforeLeave?: Function;
}
const RouteLeavingGuard = ({ message, saveBeforeLeave }: Props) => {
  const history = useHistory();

  const [locationState, setLocationState] = useState<{ force?: boolean; reset?: boolean }>({
    force: false,
    reset: false,
  });
  const { setAccount, setReset, setAuthor, setLayout, setFeeFines } = useCurrentAccount();

  const [modalVisible, setModalVisible] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [confirmedNavigate, setConfirmedNavigate] = useState(false);

  const cancelModal = () => {
    setLastPath(path);
    setConfirmedNavigate(true);
  };

  const closeModal = () => {
    locationState?.force ? setLastPath(path) : setLastPath(null);
    setConfirmedNavigate(Boolean(locationState?.force));
    setModalVisible(false);
  };

  const handleConfirmNavigationClick = async () => {
    if (saveBeforeLeave) await saveBeforeLeave();
    setLastPath(path);
    setConfirmedNavigate(true);
    setModalVisible(false);
  };

  const handleMessage = (location: Location) => {
    setPath(location.pathname);
    setLocationState(location.state as any);
    if (!location.pathname.includes('/edit')) {
      setModalVisible(true);
      return confirmedNavigate ? true : false;
    }

    return true;
  };

  const getAccounts = async () => {
    if (lastPath && confirmedNavigate) {
      console.info('on_navigate', lastPath);
      setReset(true);
      setLastPath(null);
      setConfirmedNavigate(false);
      setModalVisible(false);
      history.push(lastPath);
    }
  };

  useEffect(() => {
    getAccounts();
  }, [lastPath, confirmedNavigate]);

  useEffect(() => {
    if (locationState?.reset && path && path.includes('current-account') && confirmedNavigate) {
      setAccount(_account => ({ ...initialAccount, list: _account.list }));
      setAuthor(_.cloneDeep(initialAuthor));
      setLayout(_.cloneDeep(initialLayout));
      setFeeFines(_.cloneDeep(initialFeeFines));
    }
  }, [locationState?.reset, path, confirmedNavigate]);

  useEffect(() => {
    if (locationState?.force) {
      setLastPath(path);
      setConfirmedNavigate(true);
    }
  }, [locationState?.force, path]);

  return (
    <Container>
      <Prompt when={true} message={handleMessage} />

      <DefaultModal
        title="Confirmação"
        onConfirm={handleConfirmNavigationClick}
        isOpen={modalVisible}
        onCancel={cancelModal}
        onClose={closeModal}>
        <ContentModal>
          <Message>{message}</Message>
        </ContentModal>
      </DefaultModal>
    </Container>
  );
};

export default RouteLeavingGuard;
