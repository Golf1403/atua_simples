import React, { Fragment, useEffect, useState } from 'react';
import { useLoading } from '@/hooks/loading';
import SEILoading from '../SEILoading';
import { timeoutEnum } from '@/enums/TimeoutEnum';

const OverlayLoading = () => {
  const { isLoading, isLoadingMessage, isLoadingCurrentAccount } = useLoading();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timout = setTimeout(() => {
        setLoading(false);
      }, timeoutEnum.HALF_SECONDS);

      return () => {
        clearInterval(timout);
      };
    }
    setLoading(true);
  }, [isLoading]);

  return <Fragment>{(isLoadingCurrentAccount || loading) && <SEILoading message={isLoadingMessage} />}</Fragment>;
};

export default OverlayLoading;
