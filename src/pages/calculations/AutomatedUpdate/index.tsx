import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { FaCalculator, FaRedoAlt, FaTrash } from 'react-icons/fa';
import AutomatedUpdateAccountImp from '@/interfaces/calculations/AutomatedUpdateAccountImp';
import AutomatedUpdateService from '@/services/CalculationsServices/AutomatedUpdateService';
import { alertMessages } from '@/hooks/alertMessages';
import { useCore } from '@/hooks/core';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { labelsEnum } from '@/enums/labelsEnum';
import { ActionButton, Actions, Container, EmptyState, Header, Table, Toolbar } from './styles';

const automatedUpdateService = new AutomatedUpdateService();

const formatDate = (date?: string | Date): string => {
  if (!date) return '-';
  return moment(date).isValid() ? moment(date).format(dateFormatEnum.DEFAULT) : '-';
};

const AutomatedUpdate = (): JSX.Element => {
  const alertMessage = alertMessages();
  const { setSidebar } = useCore();
  const [accounts, setAccounts] = useState<AutomatedUpdateAccountImp[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await automatedUpdateService.listAccounts();
      setAccounts(result);
    } catch (error) {
      alertMessage.error(error?.msg || 'Erro ao carregar atualização automatizada');
    } finally {
      setLoading(false);
    }
  }, [alertMessage]);

  const calculateAccount = async (account: AutomatedUpdateAccountImp) => {
    if (!account.id) return;
    setLoading(true);
    try {
      await automatedUpdateService.calculateAccount(account.id);
      alertMessage.success('Cálculo executado com sucesso');
      await loadAccounts();
    } catch (error) {
      alertMessage.error(error?.msg || 'Erro ao calcular atualização automatizada');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (account: AutomatedUpdateAccountImp) => {
    if (!account.id) return;
    setLoading(true);
    try {
      await automatedUpdateService.deleteAccount(account.id);
      alertMessage.sucessDeleted();
      await loadAccounts();
    } catch (error) {
      alertMessage.error(error?.msg || 'Erro ao excluir atualização automatizada');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.AUTOMATED_UPDATE }));
    loadAccounts();
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, [loadAccounts, setSidebar]);

  return (
    <Container>
      <Header>
        <h1>Atualização Automatizada</h1>
        <Toolbar>
          <button type="button" onClick={loadAccounts} disabled={loading}>
            <FaRedoAlt />
            Atualizar
          </button>
        </Toolbar>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Centro de custo</th>
            <th>Índice</th>
            <th>Atualizar até</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.name || '-'}</td>
              <td>{account.costCenterId || '-'}</td>
              <td>{account.indexId || '-'}</td>
              <td>{formatDate(account.updateUntil)}</td>
              <td>{formatDate(account.createdAt)}</td>
              <td>
                <Actions>
                  <ActionButton
                    type="button"
                    title="Calcular"
                    aria-label="Calcular"
                    onClick={() => calculateAccount(account)}
                    disabled={loading}>
                    <FaCalculator />
                  </ActionButton>
                  <ActionButton
                    type="button"
                    title="Excluir"
                    aria-label="Excluir"
                    onClick={() => deleteAccount(account)}
                    disabled={loading}>
                    <FaTrash />
                  </ActionButton>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {!loading && !accounts.length && <EmptyState>Nenhum cálculo de atualização automatizada encontrado.</EmptyState>}
      {loading && <EmptyState>Carregando atualização automatizada...</EmptyState>}
    </Container>
  );
};

export default AutomatedUpdate;
