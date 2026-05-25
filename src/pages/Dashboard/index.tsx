import React, { Fragment, useEffect, useRef, useState } from 'react';
import LicenseServices from '@services/LicenseServices';
import { AWSS3 } from '@services/S3';
import ConfirmedModal from '@/components/ConfirmedModal';
import { useLoading } from '@/hooks/loading';
import { Container, Image } from './styles';
import { useToolbar } from '@/hooks/toolbar';
import { pathEnum } from '@/enums/pathEnum';
import MemCalcImp from '@/interfaces/MemCalcImp';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export interface MemcalcHasIndexImp {
  [type: number]: MemCalcImp[];
}

const Dashboard = (): JSX.Element => {
  const s3 = new AWSS3();
  const [config, setConfig] = useState<{ html: string | TrustedHTML; image: string; toggle: boolean; date?: number }>({
    html: '',
    image: '',
    toggle: true,
    date: moment.now(),
  });

  const { setVisible: setVisibleToolbar, ...toolbar } = useToolbar();
  const licenseServices = new LicenseServices();

  const { openLoading, closeLoading, isLoading } = useLoading();

  const getConfig = async () => {
    openLoading();
    let key = '';
    try {
      const licenseInfo = await licenseServices.getUserLicense();
      key = `plans/${licenseInfo.planId}/config.json`;
      const configuration = await s3.getValue(key);
      const BodyS3: any | undefined = configuration.Body;
      if (BodyS3) {
        const buffer = Buffer.from(BodyS3);
        const blob = new Blob([buffer], { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = function (event) {
          if (event?.target?.result) {
            const jsonData = JSON.parse(event.target.result as any);
            const date = moment(moment.now()).format(dateFormatEnum.AMERICAN_DATE);
            const payload = { ...jsonData, date };
            setConfig(payload);
            closeLoading();
          }
        };
        reader.readAsText(blob);
      }
    } catch (error) {
      closeLoading();
      console.log(error);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    toolbar.setType(pathEnum.DASHBOARD);
    setVisibleToolbar(true);

    return () => {
      setVisibleToolbar(false);
      toolbar.setType(undefined);
    };
  }, []);

  return (
    <Container>
      {isLoading ? (
        <Fragment />
      ) : !config.toggle ? (
        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: config.html }} />
      ) : (
        <Image $isLoading={isLoading} height={'100%'} width={'100%'} loading="eager" src={config.image} alt="Imagem" />
      )}
      <ConfirmedModal />
    </Container>
  );
};

export default Dashboard;
