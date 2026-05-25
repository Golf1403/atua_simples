import React, { Fragment, useCallback, useEffect } from 'react';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import { useFactors } from '@/hooks/factors';
import { useLoading } from '@/hooks/loading';
import { useNomenclatures } from '@/hooks/nomenclatures';

const Recalculate = ({ setIndexName }: { setIndexName: Function }) => {
  const { isLoading, openLoadingCurrentAccount, closeLoadingCurrentAccount, isLoadingCurrentAccount } = useLoading();
  const { allMemcalcs, setMemcalcs, memcalcs } = useFactors();
  const { author, account, setLayout, onCalc } = useSimpleUpdate() as any;
  const { nomenclatures } = useNomenclatures();

  const recalculate = useCallback(async () => {
    try {
      if (isLoading) return;
      openLoadingCurrentAccount();
      setLayout((layout: any) => ({ ...layout, footerButton: { ...layout.footerButton, isLoading: true } }));

      const memcalcs = allMemcalcs?.[account.current.indexId];
      setMemcalcs(memcalcs || []);

      const indexName = memcalcs[0].indicador.indnome || 'não selecionado';
      setIndexName(indexName);

      await onCalc({ origin: 'calc', nomenclatures, memcalcs });
      closeLoadingCurrentAccount();
    } catch (error) {
      closeLoadingCurrentAccount();
    }
  }, [setLayout, onCalc, author, isLoading, allMemcalcs, account.current, memcalcs]);

  useEffect(() => {
    if (isLoading) return;
    if (!account.current.indexId) return;

    recalculate();
  }, [
    isLoading,
    account.current.indexId,
    account.current.proRataOtn,
    account.current.proRataDay,
    account.current.positive,
    account.infos.type,
    allMemcalcs,
  ]);

  return <Fragment />;
};

export default Recalculate;
