import React, { useEffect } from 'react';
import { getFieldName } from '@lib/nomenclature';
import { useSelector } from 'react-redux';
import { ApplicationState } from '@store/index';
import { useFormikContext } from 'formik';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import useCurrentAccount, { initialCurrentAuthor } from '@/hooks/currentAccount';
import DefaultModal from '@/components/DefaultModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { Form, Input } from './styles';

const ModalAddAuthor = (): JSX.Element => {
  const {
    layout: {
      modalAddAuthor: { visible },
    },
    layout,
    setLayout,
    author,
  } = useCurrentAccount();

  const { nomenclatures } = useSelector((state: ApplicationState) => state.nomenclature);
  const { values, handleSubmit, setValues } = useFormikContext<CurrentAuthorImp>();

  const closeModal = async () => {
    setLayout({
      ...layout,
      modalAddAuthor: { ...layout.modalAddAuthor, visible: false },
    });
  };

  useEffect(() => {
    setValues(initialCurrentAuthor);
    return () => {
      setValues(initialCurrentAuthor);
    };
  }, []);

  return (
    <DefaultModal
      isOpen={visible}
      onClose={closeModal}
      onCancel={closeModal}
      onConfirm={handleSubmit}
      title={`Deseja ${labelsEnum.ADD}?`}>
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

export default ModalAddAuthor;
