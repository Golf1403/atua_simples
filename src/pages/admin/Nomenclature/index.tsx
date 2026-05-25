import React, { Fragment } from 'react';
import DataTable from '@components/DataTable';
import { useCore } from '@/hooks/core';
import { Container } from './styles';
import { tableColumns } from './Table';
import { labelsEnum } from '@/enums/labelsEnum';
import { useNomenclatures } from '@/hooks/nomenclatures';
import NomenclatureForm from './NomenclatureForm';

const initialValues = {
  default_value: '',
  description: '',
  value: '',
  nomenclatureIndex: '',
  costCenterId: '',
  modal: false,
};

const Nomenclature = () => {
  const { setSidebar } = useCore();
  const { tableData } = useNomenclatures();

  React.useEffect(() => {
    setSidebar(sidebar => ({ ...sidebar, title: labelsEnum.NOMENCLATURES }));
    return () => setSidebar(sidebar => ({ ...sidebar, title: null }));
  }, []);

  return (
    <Fragment>
      <Container initialValues={initialValues} onSubmit={() => {}}>
        <NomenclatureForm />
      </Container>

      <DataTable numberOfSkeletons={3} lines={8} columns={tableColumns} data={tableData} />
    </Fragment>
  );
};

export default Nomenclature;
