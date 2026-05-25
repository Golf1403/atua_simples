import React, { useEffect, useState } from 'react';
import { labelsEnum } from '@/enums/labelsEnum';
import { Config, Container, FineContainer, InterestContainer, Modal } from './styles';
import CurrentInterestFineImp from '@/interfaces/calculations/CurrentInterestFineImp';
import { typeFine, typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import capitalizationOptions from '@/data/calculations/capitalizationOptions';
import CustomSelect from '@/components/CustomSelect';
import civilCodeOptionsCalc from '@/data/calculations/civilCodeOptions';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useFormikContext } from 'formik';
import { typeCompound } from '@/data/calculations/interestTypes';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import AdministrativeNatureFields from './AdministrativeNatureFields';
import PublicEmployeeFields from './PublicEmployeeFields';
import SavingsOnePerFields from './SavingsOnePerFields';
import SelectWhichPoupancaFields from './SelectWhichPoupancaFields';
import SelectIndexFields from './SelectIndexFields';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';
import ApplyOnFields from './ApplyOnFields';
import { typeNotApply, typeSelectIndex } from '@/data/calculations/civilCodeTypes';
import { getFieldName } from '@/lib/nomenclature';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import { useNomenclatures } from '@/hooks/nomenclatures';

export interface PropsImp {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onConfirm: () => void;
  onBlur?: () => void;
  interests: CurrentInterestFineImp[];
}
const InterestFineConfigModal = ({ interests, isOpen, onCancel, onClose, onConfirm, onBlur }: PropsImp) => {
  const { values, setFieldValue } = useFormikContext<CurrentInterestFineImp>();
  const [civilCodeOptions, setCivilCodeOptions] = useState<SelectOptionImp[]>([]);
  const { nomenclatures } = useNomenclatures();

  const handleCivilCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (values.type != typeInterest.id) return;

    const { value } = event.target;

    if (value === CivilCodeInterest.ONE_PERCENT)
      if (values.civilCodeDate === '01/05/2012') setFieldValue('civilCodeDate', '10/01/2003');

    if (value === CivilCodeInterest.ADMINISTRATIVE_NATURE) {
      setFieldValue('administrativeNatureFirstDate', '31/12/2002');
      setFieldValue('administrativeNatureSecondDate', '30/06/2009');
      setFieldValue('administrativeNatureThirdDate', '01/07/2009');
    }

    if (value === CivilCodeInterest.SAVINGS) setFieldValue('civilCodeDate', '01/05/2012');

    if (value === CivilCodeInterest.PUBLIC_EMPLOYEES) {
      setFieldValue('administrativeNatureFirstDate', '31/07/2001');
      setFieldValue('administrativeNatureSecondDate', '30/06/2009');
      setFieldValue('administrativeNatureThirdDate', '01/07/2009');
    }

    if (value === CivilCodeInterest.ADMINISTRATIVE_NATURE) setFieldValue('onInterestWithoutCorrection', true);
    else setFieldValue('onInterestWithoutCorrection', false);
  };

  useEffect(() => {
    const regex = new RegExp('Juros', 'gi');

    const newCivilCodeOptions = civilCodeOptionsCalc.map(civil => ({
      ...civil,
      label: civil.label.replace(regex, getFieldName(labelsEnum.INTEREST, nomenclatures)),
    }));

    setCivilCodeOptions(newCivilCodeOptions);
  }, [nomenclatures]);

  useEffect(() => {
    if (values.type != typeInterest.id) return;
    setFieldValue(
      'administrativeNatureThirdDate',
      moment(values.administrativeNatureSecondDate, dateFormatEnum.DEFAULT).add(1, 'day').format(dateFormatEnum.DEFAULT)
    );
  }, [values.type == typeInterest.id && values.administrativeNatureThirdDate]);

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`${labelsEnum.CONFIG} de ${
        values.type == typeInterest.id
          ? getFieldName(labelsEnum.INTEREST, nomenclatures)
          : getFieldName(labelsEnum.FINE, nomenclatures)
      }`}>
      <Container>
        {values.type == typeInterest.id && (
          <InterestContainer>
            <Config>
              <CustomSelect
                label="Capitalização"
                name="capitalization"
                options={capitalizationOptions}
                icon={IoMdArrowDropdown}
                disabled={values.description !== typeCompound.value}
              />

              <CustomSelect
                label="Novo código civil"
                name="civilCode"
                options={civilCodeOptions}
                onChange={handleCivilCodeChange}
                icon={IoMdArrowDropdown}
              />
              <AdministrativeNatureFields />
              <PublicEmployeeFields />
              <SavingsOnePerFields />
              <SelectWhichPoupancaFields />
              <SelectIndexFields />
            </Config>
            <ApplyOnFields />
          </InterestContainer>
        )}
        {values.type == typeFine.id && (
          <FineContainer>
            <Config>
              <CustomSelect
                label={labelsEnum.INDEX}
                name="civilCode"
                options={[typeNotApply, typeSelectIndex]}
                onChange={handleCivilCodeChange}
                icon={IoMdArrowDropdown}
              />
              <AdministrativeNatureFields />
              <PublicEmployeeFields />
              <SavingsOnePerFields />
              <SelectWhichPoupancaFields />
              <SelectIndexFields />
            </Config>
            <ApplyOnFields />
          </FineContainer>
        )}
      </Container>
    </Modal>
  );
};

export default InterestFineConfigModal;
