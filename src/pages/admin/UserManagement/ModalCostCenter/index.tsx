import React, { useEffect, useRef, useState } from 'react';
import SystemModal from '@components/SystemModal';
import CostCenterImp from '@interfaces/costCenters/CostCenterImp';
import CustomSelect from '@components/CustomSelect';
import UserServices from '@services/UserServices';
import ISelectOption from '@interfaces/SelectOptionImp';
import AccountServices from '@services/AccountServices';
import IAccessProfileResponse from '@interfaces/serviceResponses/AccessProfileResponseImp';

import costCenterSchema from '../../../../validators/costCenterSchema';

import { useFormik, useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { setCostCenters, setCostCenterSelectOptions, setError, setProfiles } from '@store/core/action';

import { IError } from '@store/core/types';
import { alertMessages } from '@/hooks/alertMessages';
import { useCore } from '@/hooks/core';
import DefaultModal from '@/components/DefaultModal';
import { labelsEnum } from '@/enums/labelsEnum';
import { Container, Form } from './styles';
import IDummyObject from '@/interfaces/IDummyObject';

interface IProps {
  modalIsOpen: boolean;
  onAdd: Function;
  costCenterId: string | null;
  onCancel: Function;
  setCostCenterId: Function;
}

const initialValues = {
  costCenterId: '',
  profileId: '',
};

const CustomForm = ({ modalIsOpen, onAdd, onCancel, setCostCenterId, costCenterId = null }: IProps) => {
  const dispatch = useDispatch();
  const alertMessage = alertMessages();

  const accountServices = new AccountServices();
  const userServices = new UserServices();
  const isFirstState = useRef(true);
  const { values, setFieldValue } = useFormikContext<IDummyObject>();
  const { profiles: profileListState, costCenterSelectOptions, costCenters } = useCore();

  const [profileOptions, setProfileOptions] = useState<ISelectOption[]>([]);
  const [costCenterItems, setCostCenterItems] = useState<ISelectOption[]>([]);

  const handleSubmit = async () => {
    try {
      const costCenter = costCenterId
        ? costCenterItems.find(costCenter => costCenter.value === costCenterId)
        : costCenterItems.find(costCenter => costCenter.value === values.costCenterId);

      const profile = profileOptions.find(profile => profile.id === values.profileId);

      const selectedCostCenter = {
        ...values,
        costCenterName: costCenter ? costCenter.label : '',
        profileName: profile ? profile.label : '',
      };
      onAdd(selectedCostCenter);
      setCostCenterId && setCostCenterId(null);
    } catch (error) {
      alertMessage.error(error?.msg || 'Erro ao adicionar centro de custo');
    }
  };

  const getProfileOptions = (profile: IAccessProfileResponse) => {
    const option: ISelectOption = {
      label: profile.name,
      value: profile.id,
      id: profile.id,
    };
    return option;
  };
  const noCostCenter: ISelectOption = {
    id: 'noCostCenter',
    label: 'Nenhum encontrado',
    value: '',
  };
  const getCostCenters = async () => {
    let costCentersResponse: CostCenterImp[] = [] as CostCenterImp[];
    try {
      costCentersResponse = await accountServices.listCostCenter();

      dispatch(setCostCenters(costCentersResponse));
      dispatch(setCostCenterSelectOptions(costCentersResponse));
    } catch (error) {
      dispatch(setError(error as IError));
      setCostCenterItems([noCostCenter]);
    }
  };
  const onCancelClick = () => {
    setCostCenterId(null);
    onCancel();
  };
  const getProfiles = async () => {
    const profiles = await userServices.listAccessProfiles();
    const options = profiles.map(getProfileOptions);
    dispatch(setProfiles(profiles));
    setProfileOptions(options);
  };

  useEffect(() => {
    if (isFirstState && !profileListState?.length) {
      isFirstState.current = false;
      getProfiles();
      return;
    }
    if (!profileListState?.length) return;

    const options = profileListState.map(getProfileOptions);
    setProfileOptions(options);
  }, [isFirstState, profileListState]);

  useEffect(() => {
    setCostCenterItems(costCenterSelectOptions);
  }, [costCenterSelectOptions]);

  useEffect(() => {
    if (!costCenters) getCostCenters();
  }, [costCenters]);

  return (
    <DefaultModal
      isOpen={modalIsOpen}
      onCancel={onCancelClick}
      onClose={onCancelClick}
      onConfirm={handleSubmit}
      title={labelsEnum.COST_CENTER}>
      <Form>
        <CustomSelect
          id="costCenter"
          label={labelsEnum.COST_CENTER}
          name="costCenterId"
          value={values.costCenterId}
          options={costCenterId ? costCenterItems.filter(val => val.value === values.costCenterId) : costCenterItems}
        />
        <CustomSelect
          id="profileId"
          label={labelsEnum.PROFILE}
          name="profileId"
          value={values.profileId}
          options={profileOptions}
        />
      </Form>
    </DefaultModal>
  );
};
const ModalCostCenter = (props: IProps): JSX.Element => {
  return (
    <Container initialValues={initialValues} onSubmit={() => {}}>
      <CustomForm {...props} />
    </Container>
  );
};

export default ModalCostCenter;
