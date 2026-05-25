import React, { useState, useEffect, Fragment } from 'react';
const { Document, Page } = require('react-pdf');
import TermsServices from '@services/TermsServices';
import { setError } from '@store/core/action';
import { getErrorMessage } from '@services/http';
import { alertMessages } from '@/hooks/alertMessages';
import DefaultModal from '../DefaultModal';
import moment, { now } from 'moment';
import { useUser } from '@/hooks/user';
import { AWSS3 } from '@/services/S3';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { convertBase64ToBlob } from '@/utils/convertBase64ToBlob';
import { LogoutInfoModal } from '@/Routes/pages/auth';
import logout from '@/services/http/logout';
import { Container } from './styles';
import { timeoutEnum } from '@/enums/TimeoutEnum';

const UseTermsDocument = ({
  config,
}: {
  config: {
    createdAt: string;
    version: number;
    pdf: string;
  };
}): JSX.Element => {
  const [numPages, setNumPages] = useState<null | number>(null);

  const onDocumentLoadSuccess = ({ numPages: _numPages }: { numPages: number }) => {
    setNumPages(_numPages);
  };

  function revokeURL(pdf: string) {
    const blob = convertBase64ToBlob(pdf);
    const urlBlob = URL.createObjectURL(blob);

    const win = window.open(urlBlob, '_blank');
    if (win)
      win.onload = function () {
        URL.revokeObjectURL(urlBlob);
      };
  }

  return (
    <Document
      className={'use-terms-container'}
      file={config.pdf}
      renderMode="svg"
      externalLinkTarget="_blank"
      onLoadSuccess={onDocumentLoadSuccess}>
      <Page pageNumber={1} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p>Página 1 de {numPages}</p>
          <p style={{ fontWeight: 'bold', cursor: 'pointer', color: 'blue' }} onClick={() => revokeURL(config.pdf)}>
            Leia mais
          </p>
        </div>
        <p style={{ fontWeight: 'bold' }}>V{config.version}.0</p>
      </div>
    </Document>
  );
};

const ModalUseTerms = ({
  setIsAccordingTerm,
}: {
  setIsAccordingTerm: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const s3 = new AWSS3();
  const alertMessage = alertMessages();
  const termsService = new TermsServices();
  const [activeModal, setActiveModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<{ createdAt: string; version: number; pdf: string; date: string }>(() => {
    const defaultConfig = {
      createdAt: '',
      version: -1,
      pdf: '',
      date: moment(moment.now()).subtract(1, 'day').format(dateFormatEnum.AMERICAN_DATE),
    };

    const configString = localStorage.getItem('termConfig');
    if (!configString) return defaultConfig;

    const jsonData = JSON.parse(configString);
    const config = { ...jsonData, date: moment(moment.now()).format(dateFormatEnum.AMERICAN_DATE) };

    return config;
  });

  const { user } = useUser();

  const handleConfirm = async () => {
    try {
      const newUser = { ...user, acording: true };
      const ip = await termsService.getUserIp();

      const newTerm = {
        acording: true,
        acordingTime: now(),
        version: `${config.version}`,
        userId: newUser.id,
        ip,
      };

      await termsService.createTerm(newTerm);

      alertMessage.success(`Termo confirmado com sucesso!`);
    } catch (error) {
      setError({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      alertMessage.error('Ocorreu um erro, tente novamente!');
    } finally {
      setTimeout(() => {
        location.reload();
      }, timeoutEnum.THREE_SECONDS);
    }
  };

  const cancelModal = () => {
    logout(undefined, false);
    history.pushState({}, '', `${LogoutInfoModal.path}?type=term_recused`);
    localStorage.removeItem('termConfig');
    location.reload();
    return;
  };

  const compareVersions = async (payload: any) => {
    const lastVersion = await termsService.getCurrentVersion();
    if (payload.version == -1) {
      alertMessage.error('Não foi possível carregar os termos, favor contatar o suporte');
      setTimeout(() => {
        logout(undefined, true);
      }, timeoutEnum.THREE_SECONDS);
      return;
    }
    const numberVersion = Number(lastVersion?.version);
    const isSameVersion = numberVersion == payload.version;
    const isDiff = !isSameVersion || !lastVersion?.version?.length;
    setActiveModal(isDiff);
    setIsAccordingTerm(isDiff);
    setLoading(false);
  };

  const getConfig = async () => {
    let key = '';
    try {
      const date = moment(moment.now()).format(dateFormatEnum.AMERICAN_DATE);
      if (moment(config.date).isSameOrAfter(moment(date))) return;

      key = `terms/config.json`;
      const configuration = await s3.getValue(key);
      const BodyS3: any | undefined = configuration.Body;
      if (BodyS3) {
        const blob = new Blob([new Uint8Array(BodyS3)], { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = async function (event) {
          if (event?.target?.result) {
            const jsonData = JSON.parse(event.target.result as any);
            const date = moment(moment.now()).format(dateFormatEnum.AMERICAN_DATE);
            const payload = { ...jsonData, date };
            localStorage.setItem('termConfig', JSON.stringify(payload));
            setConfig(payload);
            await compareVersions(payload);
          }
        };
        reader.readAsText(blob);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  if (!config.pdf.length) return <Fragment />;

  return (
    <>
      {!loading ? (
        <DefaultModal
          isOpen={activeModal}
          onCancel={cancelModal}
          onClose={() => {}}
          onConfirm={handleConfirm}
          title="Confirmar termos de uso">
          <Container>
            <UseTermsDocument config={config} />
          </Container>
        </DefaultModal>
      ) : (
        <Fragment />
      )}
    </>
  );
};

export default ModalUseTerms;
