import React from 'react';
import CustomSelect from '@/components/CustomSelect';
import {
  Button,
  ButtonContainer,
  Form,
  FormHeader,
  Input,
  InputContainer,
  JustifyCenter,
  SelectContainer,
} from '../styles';
import { labelsEnum } from '@/enums/labelsEnum';
import DefaultModal from '@/components/DefaultModal';
import { setCostCenterSelectOptions } from '@store/core/action';
import { useHistory } from 'react-router-dom';
import AccountServices from '@/services/AccountServices';
import { alertMessages } from '@/hooks/alertMessages';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { useLoading } from '@/hooks/loading';
import { useFormikContext } from 'formik';
import { useCore } from '@/hooks/core';
import NomenclatureImp from '@/interfaces/NomenclatureImp';
import NomenclaturesTable from '../Table';
import { MdEdit } from 'react-icons/md';
import { getFieldName } from '@/lib/nomenclature';
import http from '@/services/http';
import { CiUndo } from 'react-icons/ci';
import DefaultTooltip from '@/components/DefaultTooltip';
import { initialVisibleButtons, useToolbar } from '@/hooks/toolbar';
import { pathEnum } from '@/enums/pathEnum';

interface FormikProps extends NomenclatureImp {
  costCenterId: string;
  nomenclatureIndex: number;
  modal: boolean;
}
const NomenclatureForm = () => {
  const history = useHistory();
  const accountServices = new AccountServices();
  const alertMessage = alertMessages();
  const { getNomenclature } = useNomenclatures();
  const { setFieldValue, setValues, values } = useFormikContext<FormikProps>();
  const { openLoading, closeLoading } = useLoading();
  const { costCenters, setSelectedCostCenter, selectedCostCenter, costCenterSelectOptions } = useCore();
  const { nomenclatures, setTableData } = useNomenclatures();
  const toolbar = useToolbar();

  const onEdit = async (index: number) => {
    const currentNomenclature = nomenclatures[index];

    await setValues(values => ({
      costCenterId: values.costCenterId,
      nomenclatureIndex: index,
      modal: true,
      default_value: currentNomenclature.default_value,
      description: currentNomenclature.description,
      value: currentNomenclature.value || currentNomenclature.default_value,
      id: currentNomenclature.id,
    }));
  };

  const updateTableData = (nomenclatures: NomenclatureImp[], onEdit: (param: number) => void) => {
    const tableCells = NomenclaturesTable({ nomenclatures, onEdit });
    setTableData(tableCells);
  };

  const fetchNomenclatures = async (nomenclatures?: NomenclatureImp[]) => {
    try {
      alertMessage.warningWaiting('Carregando nomenclaturas');

      let newNomenclatures: NomenclatureImp[] = [];

      if (nomenclatures?.length) newNomenclatures = nomenclatures;
      else newNomenclatures = await getNomenclature(values.costCenterId);
      if (newNomenclatures.length) updateTableData(newNomenclatures, onEdit);

      alertMessage.successLoaded('Nomenclatura carregada com sucesso');
    } catch (error) {
      alertMessage.error('Houve um erro');
    }
  };

  const onConfirm = React.useCallback(async () => {
    try {
      openLoading();
      await setFieldValue('modal', false);
      const editedNomenclatures = nomenclatures;
      editedNomenclatures[values.nomenclatureIndex] = {
        default_value: values.default_value,
        description: values.description,
        value: values.value,
        id: values.id,
      };

      await accountServices.associateNomenclatures(values.costCenterId, editedNomenclatures);
      await fetchNomenclatures(editedNomenclatures);
      closeLoading();
    } catch (error) {
      closeLoading();
    }
  }, [values, nomenclatures]);

  React.useEffect(() => {
    if (costCenters && !costCenters.length) {
      history.goBack();
      return;
    }

    setFieldValue('costCenterId', costCenters[0].id);
    setCostCenterSelectOptions(costCenters);
  }, [costCenters]);

  React.useEffect(() => {
    if (!nomenclatures.length) return;
    updateTableData(nomenclatures, onEdit);
  }, [nomenclatures]);

  React.useEffect(() => {
    if (!costCenters.length) return;
    const isDiff = values.costCenterId != selectedCostCenter;
    if (isDiff) setFieldValue('costCenterId', costCenters[0].id);
  }, []);

  React.useEffect(() => {
    const isDiff = values.costCenterId != selectedCostCenter;
    if (isDiff) setSelectedCostCenter(values.costCenterId);
  }, [values.costCenterId]);

  React.useEffect(() => {
    toolbar.setType(pathEnum.NOMENCLATURE);

    toolbar.setVisibleButtons({
      ...initialVisibleButtons,
      reload: true,
    });

    toolbar.setVisible(true);

    toolbar.setNomenclatures(nomenclatures => ({
      ...nomenclatures,
      reload: async () => {
        try {
          openLoading();
          setFieldValue('modal', false);
          await http().post(`/accounts/nomenclatures/reset?costCenterId=${values.costCenterId}`);
          fetchNomenclatures();
          closeLoading();
        } catch (error) {
          closeLoading();
        }
      },
    }));

    return () => {
      toolbar.setVisible(false);
      toolbar.setType(undefined);
      toolbar.setCurrentAccount(undefined);
    };
  }, [values.costCenterId]);

  return (
    <Form>
      <FormHeader>
        <SelectContainer>
          <CustomSelect
            label={getFieldName(labelsEnum.COST_CENTER, nomenclatures)}
            name="costCenterId"
            options={costCenterSelectOptions}
          />
        </SelectContainer>
      </FormHeader>

      <DefaultModal
        title={labelsEnum.NOMENCLATURE_EDIT}
        isOpen={values.modal}
        onCancel={async () => await setFieldValue('modal', false)}
        onConfirm={async () => await onConfirm()}
        keyDownDependencies={[values, nomenclatures]}
        onClose={async () => await setFieldValue('modal', false)}>
        <JustifyCenter>
          <InputContainer>
            <Input icon={MdEdit} label="" name="value" type="text" />
          </InputContainer>
        </JustifyCenter>
      </DefaultModal>
    </Form>
  );
};
export default NomenclatureForm;
