import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { Formik } from 'formik';
import { AuthorAction, AuthorCount, AuthorName, HeaderContainer, LabelName } from './styles';
import { labelsEnum } from '@/enums/labelsEnum';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import AuthorForm from '../AuthorForm';

const initialCurrentAuthor = { name: '' };

const AuthorList = (): JSX.Element => {
  const {
    author,
    layout: {
      authorRow: { authorIndex },
    },
    setLayout,
  } = useSimpleUpdate() as any;

  useEffect(() => {
    return () => {
      setLayout((layout: any) => ({ ...layout, authorRow: { ...layout.authorRow, authorIndex: 0 } }));
    };
  }, []);

  if (!author.list.length) return <Fragment />;
  if (!author.list[authorIndex]) return <Fragment />;

  return (
    <Fragment>
      <HeaderContainer>
        <AuthorCount />
        <AuthorName>
          <LabelName>{labelsEnum.NAME}</LabelName>
        </AuthorName>
        <AuthorAction>
          <label>{labelsEnum.ACTIONS}</label>
        </AuthorAction>
      </HeaderContainer>

      <Formik initialValues={{ ...initialCurrentAuthor, authorIndex }} onSubmit={() => {}}>
        <AuthorForm />
      </Formik>
    </Fragment>
  );
};

export default AuthorList;
