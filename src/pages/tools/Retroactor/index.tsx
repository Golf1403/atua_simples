import React, { useEffect } from 'react';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { Formik } from 'formik';
import { useCore } from '@/hooks/core';
import { labelsEnum } from '@/enums/labelsEnum';
import { RetroactorForm } from './components/RetroactorForm';

const Retroactor = (): JSX.Element => {
  const { setSidebar } = useCore();

  useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.RETROACTOR }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  const initialValues = {
    fromCurrency: '',
    result: 0,
    capital: 0,
    dateStart: moment(new Date()).format(dateFormatEnum.DEFAULT),
    dateEnd: moment(new Date()).subtract(1, 'year').format(dateFormatEnum.DEFAULT),
  };

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <RetroactorForm />
    </Formik>
  );
};

export default Retroactor;
