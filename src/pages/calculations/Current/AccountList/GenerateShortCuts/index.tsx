import React, { Fragment, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import useCurrentAccount, { initialFeeFines } from '@/hooks/currentAccount';
import { OccurrenceTypes } from '@/hooks/interfaces/CurrentAccountHookImp';
import { useToolbar } from '@/hooks/toolbar';
import { useNomenclatures } from '@/hooks/nomenclatures';

const GenerateShortCuts = ({ onShortcuts }: { onShortcuts: Function }): JSX.Element => {
  const history = useHistory();
  const toolbar = useToolbar();
  const { nomenclatures } = useNomenclatures();

  const { setLayout, author, onRegisterOccurrence, onRegisterExpense, setAuthor, authorIndex, setFeeFines } =
    useCurrentAccount();
  const addAuthor = () => setLayout(layout => ({ ...layout, modalAddAuthor: { visible: true } }));
  const addOccurrence = ({ type, isStart }: { type: OccurrenceTypes; isStart: boolean }) =>
    onRegisterOccurrence({ type, newestOccurrence: true, isStart });
  const addExpense = () => onRegisterExpense();
  const print = () => {
    toolbar.print && toolbar.print();
  };
  const viewer = () => {
    toolbar.view && toolbar.view(nomenclatures);
  };
  const deleteAll = () => {
    const currentAuthor = author.list.map((_author, index) => {
      if (index == authorIndex) {
        return {
          ..._author,
          occurrences: [],
          expenses: [],
          interestFines: [],
          occurrenceTotal: 0,
          expenseTotal: 0,
          view: [],
        };
      }
      return _author;
    });
    setAuthor({ list: currentAuthor, pagination: author.pagination });
    setFeeFines(initialFeeFines);
  };

  const keyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      onShortcuts({ event: e, history, addAuthor, addOccurrence, addExpense, print, viewer, deleteAll });
    },
    [author]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDownEvent);
    return () => {
      document.removeEventListener('keydown', keyDownEvent);
    };
  }, [author]);
  return <Fragment />;
};

export default GenerateShortCuts;
