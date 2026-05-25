import React, { Fragment, useEffect, useRef } from 'react';
import _ from 'lodash';

import useCurrentAccount from '@/hooks/currentAccount';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import { newCurrentAccountPage } from '@/Routes/pages/calculations';
import { useHistory } from 'react-router-dom';
import { initialVisibleButtons, useToolbar } from '@/hooks/toolbar';
import { pathEnum } from '@/enums/pathEnum';
import { useFormikContext } from 'formik';
import { Input } from './styles';
import { alertMessages } from '@/hooks/alertMessages';
import worker_script from '@/workersweb/compress';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { ApplicationState } from '@/store';
import AccountServices from '@/services/AccountServices';
import { CurrentAccoutImp } from '@/interfaces/SimpleAccountImp';
import { useLoading } from '@/hooks/loading';
import { useCore } from '@/hooks/core';

const GenerateToolbar = (): JSX.Element => {
  const { listAccountsByTypeId, newAccount } = useCurrentAccount();
  const toolbar = useToolbar();
  const history = useHistory();
  const calcImputRef: any = useRef(null);
  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const accountServices = new AccountServices();
  const alertMessage = alertMessages();
  const { openLoading, closeLoading } = useLoading();
  const { costCenters } = useCore();

  const { setFieldValue, values } = useFormikContext<{
    modal: {
      visible: boolean;
      message: string;
    };
    reload: boolean;
    newAccount: boolean;
    loading: boolean;
    pagination: PaginateResponseImp;
    data: never[];
  }>();

  const getAccounts = async () => {
    try {
      await setFieldValue('loading', true);
      const paginate = {
        current: 1,
        pages: 1,
        total: 1,
        order: values.pagination.order,
        orderBy: values.pagination.orderBy,
      };
      const response = await listAccountsByTypeId({ page: values.pagination.current, paginate, search: '' });
      await setFieldValue('pagination', response.pagination);
      await setFieldValue('loading', false);
    } catch (error) {
      console.log('error');
    }
  };
  useEffect(() => {
    toolbar.setType(pathEnum.CURRENT_ACCOUNT);

    toolbar.setCurrentAccount(state => ({
      ...state,
      new: () => {
        newAccount();
        history.push(newCurrentAccountPage.path, { force: true, isCharged: true, reset: true });
      },
      reload: async () => {
        getAccounts();
      },
      importCalc: () => {
        calcImputRef.current?.click();
      },
    }));

    toolbar.setVisibleButtons({ ...initialVisibleButtons, new: true, reload: true, import: true });

    toolbar.setVisible(true);

    return () => {
      toolbar.setVisible(false);
      toolbar.setType(undefined);
      toolbar.setCurrentAccount(undefined);
    };
  }, []);

  function arrayBufferToBinaryString(buffer: ArrayBuffer) {
    const uint8Array = new Uint8Array(buffer);

    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }

    return binaryString;
  }

  const onCalcChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event?.preventDefault();

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.name.includes('.sei')) return alertMessage.error('Arquivo não compatível com o sistema');
      const buffer = await file.arrayBuffer();

      const binary = arrayBufferToBinaryString(buffer);

      const worker = new Worker(worker_script);
      worker.postMessage({ type: 'decompress', data: binary });

      worker.addEventListener('message', async event => {
        const decData = CryptoJS.enc.Base64.parse(event.data.data).toString(CryptoJS.enc.Utf8);
        const dataString = CryptoJS.AES.decrypt(decData, process.env.REACT_APP_ENCRYPTION_SECRET_KEY).toString(
          CryptoJS.enc.Utf8
        );

        const dataObj = JSON.parse(dataString);

        const isValid = dataObj.rules.reduce((a: boolean, b: any) => {
          const isFound = ability.rules.find((role: any) => role.action == b.action && role.subject == b.subject);

          return a && !!isFound;
        }, true);

        if (!isValid) return alertMessage.error('Seu plano atual não é compatível com esse cálculo!');

        const payload: CurrentAccoutImp = {
          account: dataObj.account,
          authors: dataObj.authors,
          feeFines: dataObj.feeFines,
          type: dataObj.type,
        };

        const costCenter = costCenters.find(costCenter => costCenter.name.includes('Padrão'));

        try {
          openLoading();
          if (!costCenter) throw 'not found cost center';
          payload.account.costCenterId = costCenter.id;

          await accountServices.saveAccount(payload);
          await getAccounts();

          if (calcImputRef?.current?.value) calcImputRef.current.value = '';
          alertMessage.success('Cálculo importado com sucesso!');
          closeLoading();
        } catch (error) {
          closeLoading();
        }

        return;
      });
    }
  };

  return <Input ref={calcImputRef} accept=".sei" type="file" id="file" name="myCalc" onChange={onCalcChange} />;
};

export default GenerateToolbar;
