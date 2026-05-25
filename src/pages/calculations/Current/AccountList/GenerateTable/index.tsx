import React, { Fragment, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { DataTableCellImp } from '@interfaces/DataTableImp';
import { FaEdit, FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { useFormikContext } from 'formik';
import moment from 'moment';
import Tooltip from '@/components/DefaultTooltip';
import { validateDate } from '@/utils/validateDate';

import useCurrentAccount from '@/hooks/currentAccount';
import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';
import { Button, Container, Modal, ModalContainer } from './styles';
import { CurrentAccoutImp } from '@/interfaces/SimpleAccountImp';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import { editCurrentAccountPage, newCurrentAccountPage } from '@/Routes/pages/calculations';
import { useHistory } from 'react-router-dom';
import worker_script from '@/workersweb/compress';
import AccountImp from '@/interfaces/AccountImp';
import AccountServices from '@/services/AccountServices';
import { messagesEnum } from '@/enums/messagesEnum';
import { alertMessages } from '@/hooks/alertMessages';

const GenerateTable = (): JSX.Element => {
  const {
    account: { list },
    newAccount,
    listAccountsByTypeId,
    setAccount,
  } = useCurrentAccount();
  const accountServices = new AccountServices();

  const { costCenters } = useCore();
  const { values, setFieldValue } = useFormikContext<{
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
  const [accountName, setAccountName] = useState<undefined | string>();
  const history = useHistory();
  const isOpen = typeof accountName == 'string';

  const handleReloadConfirmModal = async (isReload?: boolean) => {
    try {
      if (values.newAccount) {
        newAccount();
        history.push(newCurrentAccountPage.path, { force: true, isCharged: true, reset: true });
        return;
      }

      if (values.reload || isReload) {
        await reload();
        await setFieldValue('loading', false);
        return;
      }
    } catch (error) {
      console.log('error');
    }
  };

  const handleDuplicateAccount = useCallback(async (accountId: string) => {
    try {
      await setFieldValue('loading', true);

      const currentAccount = await accountServices.showAccount(accountId);
      saveNewAccount(currentAccount);
    } catch (error) {
      await setFieldValue('loading', false);
    }
  }, []);

  const handleEditAccount = useCallback(
    (accountId: string) => {
      const editPath = editCurrentAccountPage.path.split(':')[0];
      history.push(`${editPath}${accountId}`);
    },
    [history]
  );

  const handleDeleteAccount = useCallback(
    async (accountId: string) => {
      try {
        await setFieldValue('loading', true);

        const account = list.find(account => account.id == accountId);
        if (!account) return;

        setAccountName(`${account.name},${account.id}`);

        await setFieldValue('loading', false);
      } catch (error) {
        setAccountName(undefined);
        await setFieldValue('loading', false);
      }
    },
    [list]
  );

  const saveNewAccount = useCallback((account: AccountImp) => {
    delete account.id;

    const compressed = account.data ? account.data : '';
    const worker = new Worker(worker_script);

    worker.postMessage({ type: 'decompress', data: compressed });
    worker.addEventListener('message', async function (event) {
      if (event.data.type === 'decompressed') {
        try {
          await setFieldValue('loading', true);
          const dataBase64decompressed = event.data.data;
          console.info(`${(Buffer.byteLength(event.data.data) / 1000000).toFixed(2)} mb`);

          if (dataBase64decompressed?.length) {
            delete account.data;
            const data: CurrentAccoutImp = JSON.parse(dataBase64decompressed);
            await accountServices.saveAccount({ ...data, account });
          }
        } catch (error) {
          console.info('erro_to_decompress');
        }
      }

      await setFieldValue('loading', false);
      await handleReloadConfirmModal(true);
      worker.terminate();
    });
  }, []);

  const generateTable = useCallback(() => {
    if (!costCenters) return;

    const dataTable = list.map(accountOfList => {
      const currentAccount = {} as DataTableCellImp;

      const createdAt = `${accountOfList.createdAt}`;
      const updateTo = `${accountOfList.updateTo}`;

      const createAtFormated = validateDate(createdAt);
      const updateToFormated = validateDate(updateTo);

      if (!createAtFormated) {
        const dateCreatedAt = moment(createdAt, 'YYYY-MM-DD').format(dateFormatEnum.DEFAULT);
        currentAccount.createdAt = dateCreatedAt;
      }

      currentAccount.name = accountOfList.name;
      currentAccount.recordId = accountOfList.recordId;
      currentAccount.courtId = accountOfList.courtId;
      currentAccount.defendantId = accountOfList.defendantId;

      if (!updateToFormated) {
        const dateUpdateTo = moment(updateTo, 'YYYY-MM-DD').format(dateFormatEnum.DEFAULT);
        currentAccount.updateTo = dateUpdateTo;
      }

      costCenters.map(costCenter => {
        if (accountOfList.costCenterId === costCenter.id) currentAccount.costCenterName = costCenter.name;
        return costCenter;
      });

      currentAccount.actions = (
        <Container>
          <Button onClick={() => accountOfList.id && handleEditAccount(accountOfList.id)} type="button">
            <Tooltip text={labelsEnum.ACCOUNT_EDIT}>
              <FaEdit />
            </Tooltip>
          </Button>
          <Button onClick={() => accountOfList.id && handleDuplicateAccount(accountOfList.id)} type="button">
            <Tooltip text={labelsEnum.ACCOUNT_DUPLICATE}>
              <FaRegCopy />
            </Tooltip>
          </Button>
          <Button onClick={() => accountOfList.id && handleDeleteAccount(accountOfList.id)} type="button">
            <Tooltip text={labelsEnum.ACCOUNT_DELETE}>
              <FaTrashAlt />
            </Tooltip>
          </Button>
        </Container>
      );
      return currentAccount;
    });

    setFieldValue('data', dataTable);
  }, [list, costCenters]);

  const closeModal = useCallback(() => {
    setAccountName(undefined);
  }, []);
  const alertMessage = alertMessages();

  const confirmModal = useCallback(async () => {
    try {
      if (list && isOpen) {
        const accountId = accountName.split(',')[1];
        const deleted = await accountServices.deleteAccount(accountId);
        const newAccounts = list.filter(item => item.id !== deleted.id);
        setFieldValue('data', newAccounts);
        setAccount(account => ({ ...account, list: newAccounts }));
        await reload();
      }
    } catch (error) {
      alertMessage.error(error.msg || messagesEnum.ACCOUNT_DELETE_ERROR);
    }
  }, [isOpen, list, alertMessage]);

  const reload = () => listAccountsByTypeId({ page: 1, paginate: values.pagination, search: '' });

  useEffect(() => {
    generateTable();
  }, [list]);

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        onCancel={closeModal}
        onClose={closeModal}
        onConfirm={confirmModal}
        title="Deseja deletar a conta?">
        <ModalContainer>
          <p>{accountName?.split(',')[0]}</p>
        </ModalContainer>
      </Modal>
    </Fragment>
  );
};

export default GenerateTable;
