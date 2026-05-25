import React, { useEffect } from 'react';
import { getFieldName } from '@lib/nomenclature';
import { useSelector } from 'react-redux';
import { ApplicationState } from '@store/index';
import { useFormikContext } from 'formik';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import useSimpleUpdate from '@/hooks/simpleUpdate';
import DefaultModal from '@/components/DefaultModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { Form, Input } from './styles';

const ModalEditAuthor = (): JSX.Element => {
  const {
    layout: {
      modalEditAuthor: { visible },
      authorRow: { authorIndex },
    },
    layout,
    setLayout,
    author,
  } = useSimpleUpdate() as any;

  const { nomenclatures } = useSelector((state: ApplicationState) => state.nomenclature);
  const { values, handleSubmit, setValues } = useFormikContext<CurrentAuthorImp>();

  const closeModal = async () => {
    setLayout({
      ...layout,
      modalEditAuthor: { ...layout.modalEditAuthor, visible: false },
    });
  };

  useEffect(() => {
    if (!author.list.length) return;
    if (!author.list[authorIndex]) return;
    setValues(author.list[authorIndex]);
    return () => {
      setValues(author.list[authorIndex]);
    };
  }, [authorIndex, author.list]);

  return (
    <DefaultModal
      isOpen={visible}
      isCloseOnConfirm={true}
      onClose={closeModal}
      onCancel={closeModal}
      onConfirm={handleSubmit}
      title={`Deseja ${labelsEnum.EDIT}?`}>
      <Form>
        <Input
          type="text"
          id="name"
          name="name"
          label={labelsEnum.NAME}
          value={values.name}
          placeholder={`Nome completo do ${getFieldName('Autor', nomenclatures)}`}
        />
      </Form>
    </DefaultModal>
  );
};

export default ModalEditAuthor;
