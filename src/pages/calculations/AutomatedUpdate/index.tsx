import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { FaCalculator, FaCopy, FaPlus, FaRedoAlt, FaSave, FaTrash } from 'react-icons/fa';
import AutomatedUpdateAccountImp from '@/interfaces/calculations/AutomatedUpdateAccountImp';
import AutomatedUpdateService from '@/services/CalculationsServices/AutomatedUpdateService';
import { alertMessages } from '@/hooks/alertMessages';
import { useCore } from '@/hooks/core';
import { useFactors } from '@/hooks/factors';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { labelsEnum } from '@/enums/labelsEnum';
import {
  ActionButton,
  Actions,
  CheckboxLabel,
  Container,
  EmptyState,
  Field,
  FormGrid,
  Header,
  InlineActions,
  Panel,
  PanelTitle,
  RowGrid,
  Section,
  SectionHeader,
  Table,
  Toolbar,
  TotalBar,
} from './styles';

type EntryKind = 'Parcela' | 'Pagamento';

interface AutomatedEntry {
  id: string;
  kind: EntryKind;
  description: string;
  since: string;
  until: string;
  value: string;
}

interface AutomatedAuthorForm {
  id: string;
  name: string;
  entries: AutomatedEntry[];
}

interface AutomatedExpenseForm {
  id: string;
  description: string;
  date: string;
  value: string;
  article523: boolean;
}

interface AutomatedFeeForm {
  id: string;
  description: string;
  date: string;
  value: string;
  newCpc: boolean;
}

interface AutomatedFormState {
  id?: string;
  costCenterId: string;
  name: string;
  updateUntil: string;
  deflation: string;
  purges: string;
  proDIA: boolean;
  proOTN: boolean;
  vara: string;
  autos: string;
  defendant: string;
  observation: string;
  indexId: string;
  onePercentSelic: boolean;
  authors: AutomatedAuthorForm[];
  expenses: AutomatedExpenseForm[];
  fees: AutomatedFeeForm[];
}

const automatedUpdateService = new AutomatedUpdateService();

const today = () => moment().format('YYYY-MM-DD');
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const emptyEntry = (kind: EntryKind): AutomatedEntry => ({
  id: newId(),
  kind,
  description: kind,
  since: today(),
  until: today(),
  value: '0,00',
});

const emptyAuthor = (): AutomatedAuthorForm => ({
  id: newId(),
  name: '',
  entries: [],
});

const emptyExpense = (): AutomatedExpenseForm => ({
  id: newId(),
  description: 'Despesa',
  date: today(),
  value: '0,00',
  article523: false,
});

const emptyFee = (): AutomatedFeeForm => ({
  id: newId(),
  description: 'Honorarios',
  date: today(),
  value: '0,00',
  newCpc: false,
});

const initialForm = (costCenterId = '', indexId = ''): AutomatedFormState => ({
  costCenterId,
  name: 'Novo cálculo automatizado',
  updateUntil: today(),
  deflation: 'Aceitar negativos',
  purges: '',
  proDIA: false,
  proOTN: false,
  vara: '',
  autos: '',
  defendant: '',
  observation: '',
  indexId,
  onePercentSelic: false,
  authors: [emptyAuthor()],
  expenses: [],
  fees: [],
});

const formatDate = (date?: string | Date): string => {
  if (!date) return '-';
  return moment(date).isValid() ? moment(date).format(dateFormatEnum.DEFAULT) : '-';
};

const asDateInput = (date?: string | Date) => {
  if (!date) return today();
  return moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : today();
};

const toNumber = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return Number(normalized) || 0;
};

const toMoneyInput = (value: number | string | undefined): string => {
  const numericValue = typeof value === 'string' ? toNumber(value) : value || 0;
  return numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const toCurrency = (value: number): string => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const AutomatedUpdate = (): JSX.Element => {
  const alertMessage = alertMessages();
  const {
    costCenters,
    costCenterSelectOptions,
    loadCostCenters,
    selectedCostCenter,
    setSelectedCostCenter,
    setSidebar,
  } = useCore();
  const { getIndexes, indexesOptions } = useFactors();
  const [accounts, setAccounts] = useState<AutomatedUpdateAccountImp[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AutomatedFormState>(initialForm());

  const costCenterOptions = useMemo(
    () =>
      costCenterSelectOptions.length ? costCenterSelectOptions : [{ id: 'default', label: 'Padrão', value: 'default' }],
    [costCenterSelectOptions]
  );

  const indexOptions = useMemo(() => {
    const options = indexesOptions.length
      ? indexesOptions
      : getIndexes().map(index => ({ id: index.id, label: index.name, value: index.id }));

    const filteredOptions = options.filter(option => String(option.value) !== '-1');

    // Fallback local para permitir o cadastro quando o ambiente dev nao autentica no servico de indices.
    return filteredOptions.length
      ? filteredOptions
      : [
          { id: 48, label: 'CDI', value: 48 },
          { id: 49, label: 'SELIC', value: 49 },
          { id: 50, label: 'Salário mínimo', value: 50 },
        ];
  }, [getIndexes, indexesOptions]);

  const totals = useMemo(() => {
    const entriesTotal = form.authors.reduce(
      (sum, author) => sum + author.entries.reduce((entrySum, entry) => entrySum + toNumber(entry.value), 0),
      0
    );
    const expensesTotal = form.expenses.reduce((sum, expense) => sum + toNumber(expense.value), 0);
    const feesTotal = form.fees.reduce((sum, fee) => sum + toNumber(fee.value), 0);

    return {
      entriesTotal,
      expensesTotal,
      feesTotal,
      total: entriesTotal + expensesTotal + feesTotal,
    };
  }, [form.authors, form.expenses, form.fees]);

  const setField = <K extends keyof AutomatedFormState>(field: K, value: AutomatedFormState[K]) => {
    setForm(current => ({ ...current, [field]: value }));
  };

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

  const resetForm = useCallback(() => {
    const costCenterId = selectedCostCenter || costCenters[0]?.id || String(costCenterOptions[0]?.value || '');
    const indexId = indexOptions[0]?.value ? String(indexOptions[0].value) : '';
    setForm(initialForm(costCenterId, indexId));
  }, [costCenterOptions, costCenters, indexOptions, selectedCostCenter]);

  const mapAccountToForm = (account: AutomatedUpdateAccountImp): AutomatedFormState => ({
    id: account.id,
    costCenterId: account.costCenterId || '',
    name: account.name || '',
    updateUntil: asDateInput(account.updateUntil),
    deflation: account.deflation || 'Aceitar negativos',
    purges: account.purges || '',
    proDIA: !!account.proDIA,
    proOTN: !!account.proOTN,
    vara: account.vara || '',
    autos: account.autos || '',
    defendant: account.defendant || '',
    observation: account.observation || '',
    indexId: account.indexId ? String(account.indexId) : '',
    onePercentSelic: !!account.onePercentSelic,
    authors: (account.accountingParts || []).map(part => ({
      id: part.id || newId(),
      name: part.name || '',
      entries: [
        ...((part.installments as AutomatedEntry[] | undefined) || []).map(item => ({
          id: item.id || newId(),
          kind: 'Parcela' as EntryKind,
          description: item.description || 'Parcela',
          since: asDateInput(item.since),
          until: asDateInput(item.until),
          value: toMoneyInput(item.value),
        })),
        ...((part.payments as AutomatedEntry[] | undefined) || []).map(item => ({
          id: item.id || newId(),
          kind: 'Pagamento' as EntryKind,
          description: item.description || 'Pagamento',
          since: asDateInput(item.since),
          until: asDateInput(item.until),
          value: toMoneyInput(item.value),
        })),
      ],
    })),
    expenses: (account.expenses || []).map(expense => ({
      id: expense.id || newId(),
      description: expense.description || 'Despesa',
      date: asDateInput(expense.date),
      value: toMoneyInput(expense.value),
      article523: !!expense.article523,
    })),
    fees: (account.fees || []).map(fee => ({
      id: fee.id || newId(),
      description: fee.description || 'Honorarios',
      date: asDateInput(fee.updateSince || fee.date),
      value: toMoneyInput(fee.value),
      newCpc: !!fee.newCpc,
    })),
  });

  const buildPayload = (): AutomatedUpdateAccountImp => ({
    id: form.id,
    costCenterId: form.costCenterId,
    name: form.name,
    updateUntil: form.updateUntil,
    deflation: form.deflation,
    purges: form.purges,
    proDIA: form.proDIA,
    proOTN: form.proOTN,
    vara: form.vara,
    autos: form.autos,
    defendant: form.defendant,
    observation: form.observation,
    indexId: Number(form.indexId || 0),
    onePercentSelic: form.onePercentSelic,
    // Autores carregam as ocorrencias automatizadas que o microservico calcula.
    accountingParts: form.authors.map(author => ({
      id: author.id.includes('-') ? undefined : author.id,
      name: author.name,
      installments: author.entries
        .filter(entry => entry.kind === 'Parcela')
        .map((entry, position) => ({
          type: 'installment',
          since: entry.since,
          until: entry.until,
          value: toNumber(entry.value),
          updatedValue: 0,
          description: entry.description,
          items: [],
          position,
        })),
      payments: author.entries
        .filter(entry => entry.kind === 'Pagamento')
        .map((entry, position) => ({
          type: 'payment',
          since: entry.since,
          until: entry.until,
          value: toNumber(entry.value),
          updatedValue: 0,
          description: entry.description,
          items: [],
          position,
        })),
    })),
    // Despesas e honorarios ficam fora do autor, conforme contrato do servico.
    expenses: form.expenses.map((expense, position) => ({
      id: expense.id.includes('-') ? undefined : expense.id,
      description: expense.description,
      date: expense.date,
      value: toNumber(expense.value),
      article523: expense.article523,
      position,
    })),
    fees: form.fees.map((fee, position) => ({
      id: fee.id.includes('-') ? undefined : fee.id,
      description: fee.description,
      value: toNumber(fee.value),
      newCpc: fee.newCpc,
      updateSince: fee.date,
      position,
    })),
  });

  const saveAccount = async () => {
    if (!form.costCenterId || !form.indexId) {
      alertMessage.error('Informe o centro de custo e o índice.');
      return;
    }

    setLoading(true);
    try {
      const savedAccount = await automatedUpdateService.saveAccount(buildPayload());
      alertMessage.success('Atualização automatizada salva com sucesso');
      setForm(mapAccountToForm(savedAccount));
      await loadAccounts();
    } catch (error) {
      alertMessage.error(error?.msg || 'Erro ao salvar atualização automatizada');
    } finally {
      setLoading(false);
    }
  };

  const calculateAccount = async (accountId?: string) => {
    if (!accountId) return;
    setLoading(true);
    try {
      await automatedUpdateService.calculateAccount(accountId);
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
      if (form.id === account.id) resetForm();
    } catch (error) {
      alertMessage.error(error?.msg || 'Erro ao excluir atualização automatizada');
    } finally {
      setLoading(false);
    }
  };

  const updateAuthor = (authorId: string, patch: Partial<AutomatedAuthorForm>) => {
    setForm(current => ({
      ...current,
      authors: current.authors.map(author => (author.id === authorId ? { ...author, ...patch } : author)),
    }));
  };

  const updateEntry = (authorId: string, entryId: string, patch: Partial<AutomatedEntry>) => {
    setForm(current => ({
      ...current,
      authors: current.authors.map(author =>
        author.id === authorId
          ? {
              ...author,
              entries: author.entries.map(entry => (entry.id === entryId ? { ...entry, ...patch } : entry)),
            }
          : author
      ),
    }));
  };

  const removeEntry = (authorId: string, entryId: string) => {
    setForm(current => ({
      ...current,
      authors: current.authors.map(author =>
        author.id === authorId ? { ...author, entries: author.entries.filter(entry => entry.id !== entryId) } : author
      ),
    }));
  };

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.AUTOMATED_UPDATE }));
    loadAccounts();
    loadCostCenters();
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
    // A carga inicial deve rodar apenas na abertura da tela; os loaders alteram contextos globais e mudam de identidade.
  }, []);

  useEffect(() => {
    if (!form.costCenterId && (selectedCostCenter || costCenterOptions[0]?.value)) {
      setField('costCenterId', selectedCostCenter || String(costCenterOptions[0].value));
    }
  }, [costCenterOptions, form.costCenterId, selectedCostCenter]);

  useEffect(() => {
    if (!form.indexId && indexOptions[0]?.value) setField('indexId', String(indexOptions[0].value));
  }, [form.indexId, indexOptions]);

  return (
    <Container>
      <Header>
        <h1>Atualização Automatizada</h1>
        <Toolbar>
          <button type="button" onClick={resetForm} disabled={loading}>
            <FaPlus />
            Novo
          </button>
          <button type="button" onClick={saveAccount} disabled={loading}>
            <FaSave />
            Salvar
          </button>
          <button type="button" onClick={() => calculateAccount(form.id)} disabled={loading || !form.id}>
            <FaCalculator />
            Calcular
          </button>
          <button type="button" onClick={loadAccounts} disabled={loading}>
            <FaRedoAlt />
            Atualizar
          </button>
        </Toolbar>
      </Header>

      <Panel>
        <PanelTitle>Dados do cálculo</PanelTitle>
        <FormGrid>
          <Field>
            <span>Centro de custo</span>
            <select
              value={form.costCenterId}
              onChange={event => {
                setSelectedCostCenter(event.target.value);
                setField('costCenterId', event.target.value);
              }}>
              <option value="">Selecione...</option>
              {costCenterOptions.map(option => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field className="wide">
            <span>Cálculo</span>
            <input value={form.name} onChange={event => setField('name', event.target.value)} />
          </Field>
          <Field>
            <span>Atualizar até</span>
            <input
              type="date"
              value={form.updateUntil}
              onChange={event => setField('updateUntil', event.target.value)}
            />
          </Field>
          <Field>
            <span>Índice</span>
            <select value={form.indexId} onChange={event => setField('indexId', event.target.value)}>
              <option value="">Selecione...</option>
              {indexOptions.map(option => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <span>Deflação</span>
            <select value={form.deflation} onChange={event => setField('deflation', event.target.value)}>
              <option value="Aceitar negativos">Aceitar negativos</option>
              <option value="Zerar negativos">Zerar negativos</option>
            </select>
          </Field>
          <Field>
            <span>Expurgos</span>
            <input value={form.purges} onChange={event => setField('purges', event.target.value)} />
          </Field>
          <Field>
            <span>Pró-rata</span>
            <div className="checks">
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={form.proDIA}
                  onChange={event => setField('proDIA', event.target.checked)}
                />
                DIA
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={form.proOTN}
                  onChange={event => setField('proOTN', event.target.checked)}
                />
                OTN
              </CheckboxLabel>
            </div>
          </Field>
          <Field>
            <span>Vara</span>
            <input value={form.vara} onChange={event => setField('vara', event.target.value)} />
          </Field>
          <Field>
            <span>Autos</span>
            <input value={form.autos} onChange={event => setField('autos', event.target.value)} />
          </Field>
          <Field>
            <span>Réu</span>
            <input value={form.defendant} onChange={event => setField('defendant', event.target.value)} />
          </Field>
          <Field>
            <span>Observação</span>
            <input value={form.observation} onChange={event => setField('observation', event.target.value)} />
          </Field>
        </FormGrid>
      </Panel>

      <Section>
        <SectionHeader>
          <button type="button" onClick={() => setField('authors', [...form.authors, emptyAuthor()])}>
            <FaPlus />
            Incluir Autor
          </button>
          <strong>Total das parcelas e pagamentos {toCurrency(totals.entriesTotal)}</strong>
        </SectionHeader>
        {form.authors.map((author, authorIndex) => (
          <Panel key={author.id}>
            <RowGrid className="author">
              <span>{String(authorIndex + 1).padStart(2, '0')}</span>
              <input
                value={author.name}
                placeholder="Nome do autor"
                onChange={event => updateAuthor(author.id, { name: event.target.value })}
              />
              <InlineActions>
                <ActionButton
                  type="button"
                  onClick={() => setField('authors', [...form.authors, { ...author, id: newId() }])}
                  title="Duplicar autor">
                  <FaCopy />
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() =>
                    setField(
                      'authors',
                      form.authors.filter(item => item.id !== author.id)
                    )
                  }
                  title="Excluir autor">
                  <FaTrash />
                </ActionButton>
              </InlineActions>
            </RowGrid>
            <SectionHeader className="sub">
              <div>
                <button
                  type="button"
                  onClick={() => updateAuthor(author.id, { entries: [...author.entries, emptyEntry('Parcela')] })}>
                  <FaPlus />
                  Parcela
                </button>
                <button
                  type="button"
                  onClick={() => updateAuthor(author.id, { entries: [...author.entries, emptyEntry('Pagamento')] })}>
                  <FaPlus />
                  Pagamento
                </button>
              </div>
            </SectionHeader>
            {!!author.entries.length && (
              <Table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>De</th>
                    <th>Até</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {author.entries.map(entry => (
                    <tr key={entry.id}>
                      <td>{entry.kind}</td>
                      <td>
                        <input
                          value={entry.description}
                          onChange={event => updateEntry(author.id, entry.id, { description: event.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={entry.since}
                          onChange={event => updateEntry(author.id, entry.id, { since: event.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={entry.until}
                          onChange={event => updateEntry(author.id, entry.id, { until: event.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={entry.value}
                          onChange={event => updateEntry(author.id, entry.id, { value: event.target.value })}
                        />
                      </td>
                      <td>
                        <Actions>
                          <ActionButton type="button" onClick={() => removeEntry(author.id, entry.id)} title="Excluir">
                            <FaTrash />
                          </ActionButton>
                        </Actions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Panel>
        ))}
      </Section>

      <Section>
        <SectionHeader>
          <button type="button" onClick={() => setField('expenses', [...form.expenses, emptyExpense()])}>
            <FaPlus />
            Incluir Despesas
          </button>
          <strong>Total das despesas {toCurrency(totals.expensesTotal)}</strong>
        </SectionHeader>
        {!!form.expenses.length && (
          <Table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Art. 523</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {form.expenses.map(expense => (
                <tr key={expense.id}>
                  <td>
                    <input
                      value={expense.description}
                      onChange={event =>
                        setField(
                          'expenses',
                          form.expenses.map(item =>
                            item.id === expense.id ? { ...item, description: event.target.value } : item
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={expense.date}
                      onChange={event =>
                        setField(
                          'expenses',
                          form.expenses.map(item =>
                            item.id === expense.id ? { ...item, date: event.target.value } : item
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={expense.value}
                      onChange={event =>
                        setField(
                          'expenses',
                          form.expenses.map(item =>
                            item.id === expense.id ? { ...item, value: event.target.value } : item
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={expense.article523}
                      onChange={event =>
                        setField(
                          'expenses',
                          form.expenses.map(item =>
                            item.id === expense.id ? { ...item, article523: event.target.checked } : item
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <Actions>
                      <ActionButton
                        type="button"
                        onClick={() =>
                          setField(
                            'expenses',
                            form.expenses.filter(item => item.id !== expense.id)
                          )
                        }
                        title="Excluir">
                        <FaTrash />
                      </ActionButton>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <button type="button" onClick={() => setField('fees', [...form.fees, emptyFee()])}>
            <FaPlus />
            Incluir Honorários
          </button>
          <strong>Total dos honorários {toCurrency(totals.feesTotal)}</strong>
        </SectionHeader>
        {!!form.fees.length && (
          <Table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Data</th>
                <th>Valor</th>
                <th>CPC</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {form.fees.map(fee => (
                <tr key={fee.id}>
                  <td>
                    <input
                      value={fee.description}
                      onChange={event =>
                        setField(
                          'fees',
                          form.fees.map(item =>
                            item.id === fee.id ? { ...item, description: event.target.value } : item
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={fee.date}
                      onChange={event =>
                        setField(
                          'fees',
                          form.fees.map(item => (item.id === fee.id ? { ...item, date: event.target.value } : item))
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={fee.value}
                      onChange={event =>
                        setField(
                          'fees',
                          form.fees.map(item => (item.id === fee.id ? { ...item, value: event.target.value } : item))
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={fee.newCpc}
                      onChange={event =>
                        setField(
                          'fees',
                          form.fees.map(item => (item.id === fee.id ? { ...item, newCpc: event.target.checked } : item))
                        )
                      }
                    />
                  </td>
                  <td>
                    <Actions>
                      <ActionButton
                        type="button"
                        onClick={() =>
                          setField(
                            'fees',
                            form.fees.filter(item => item.id !== fee.id)
                          )
                        }
                        title="Excluir">
                        <FaTrash />
                      </ActionButton>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>

      <TotalBar>
        <span>Total do cálculo de atualização automatizada</span>
        <strong>{toCurrency(totals.total)}</strong>
      </TotalBar>

      <Section>
        <SectionHeader>
          <button type="button" onClick={loadAccounts}>
            <FaRedoAlt />
            Cálculos salvos
          </button>
        </SectionHeader>
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
                <td>
                  {costCenters.find(costCenter => costCenter.id === account.costCenterId)?.name ||
                    account.costCenterId ||
                    '-'}
                </td>
                <td>
                  {indexOptions.find(index => Number(index.value) === Number(account.indexId))?.label ||
                    account.indexId ||
                    '-'}
                </td>
                <td>{formatDate(account.updateUntil)}</td>
                <td>{formatDate(account.createdAt)}</td>
                <td>
                  <Actions>
                    <ActionButton
                      type="button"
                      title="Editar"
                      onClick={() => setForm(mapAccountToForm(account))}
                      disabled={loading}>
                      <FaCopy />
                    </ActionButton>
                    <ActionButton
                      type="button"
                      title="Calcular"
                      onClick={() => calculateAccount(account.id)}
                      disabled={loading}>
                      <FaCalculator />
                    </ActionButton>
                    <ActionButton
                      type="button"
                      title="Excluir"
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

        {!loading && !accounts.length && (
          <EmptyState>Nenhum cálculo de atualização automatizada encontrado.</EmptyState>
        )}
        {loading && <EmptyState>Carregando atualização automatizada...</EmptyState>}
      </Section>
    </Container>
  );
};

export default AutomatedUpdate;
