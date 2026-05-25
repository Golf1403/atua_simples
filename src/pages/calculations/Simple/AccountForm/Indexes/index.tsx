import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { useFactors } from '@/hooks/factors';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import IndexesService from '@/services/IndexesService';
import IndicatorService from '@/services/ToolsServices/IndicatorService';
import moment from 'moment';
import React, { Fragment, useEffect } from 'react';

const Indexes = () => {
  const indexesService = new IndexesService();
  const { setInterestIndexesFromLaw, setInterestIndexes } = useFactors();

  const getInterestIndexes = async () => {
    console.info('fetch_interest_indexes');
    try {
      let interestIndexes = null;
      const interestindexes = localStorage.getItem('interestindexes');
      const date = moment(new Date());
      if (interestindexes) {
        interestIndexes = JSON.parse(interestindexes) as InterestIndexesImp;
        setInterestIndexes(interestIndexes);
      }
      const expDate = localStorage.getItem('interestindexes_exp');
      const isExpirated = moment(expDate, dateFormatEnum.DEFAULT).isSameOrAfter(date);

      const { isReset } = await indexesService.resetTransitiveIndex('get');

      if (!interestIndexes || isExpirated || isReset) {
        interestIndexes = await indexesService.getTransitiveInterestWithOutSelectIndex();
        setInterestIndexes(interestIndexes);

        const exp = date.add(1, 'day');
        localStorage.setItem('interestindexes', JSON.stringify(interestIndexes));
        localStorage.setItem('interestindexes_exp', exp.format(dateFormatEnum.DEFAULT));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIndexValuesFromLaw = async () => {
    try {
      const indicatorService = new IndicatorService();
      const data = await indicatorService.fetchIndicatorsFromLaw({
        law: 1,
        dateStart: moment('2024-07-01').toDate(),
        dateEnd: moment().toDate(),
      });
      setInterestIndexesFromLaw(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIndexes = async () => {
    try {
      await Promise.all([fetchIndexValuesFromLaw(), getInterestIndexes()]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  return <Fragment />;
};

export default Indexes;
