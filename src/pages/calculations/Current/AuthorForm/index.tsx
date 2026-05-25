import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { useFormikContext } from 'formik';
import {
  AuthorAction,
  AuthorCount,
  AuthorListContainer,
  AuthorName,
  BackgroudContainer,
  ButtonAction,
  InputContainer,
  TabContainer,
  Tooltip,
  VerticalLine,
  Form,
} from '../AuthorList/styles';
import { FaEdit, FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { labelsEnum } from '@/enums/labelsEnum';
import useCurrentAccount from '@/hooks/currentAccount';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import { CalcClosedContent } from '../AccountForm/styles';
import Tab from './Tab';
import { IoIosAdd, IoMdArrowDropdown } from 'react-icons/io';
import OccurrenceList from '../OccurrenceList';
import {
  typeExpense,
  typeFee,
  typeFine,
  typeInterest,
  typePayment,
  typeinstallment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import InterestFineList from '../InterestFineList';
import CustomSelect from '@/components/CustomSelect';
import ExpenseList from '../ExpenseList';
import { useResource } from '@/hooks/resourses';
import OcurrenceDeleteModal from '@/components/OcurrenceDeleteModal';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { getFieldName } from '@/lib/nomenclature';

const AuthorForm = (): JSX.Element => {
  const {
    onDuplicateAuthor,
    onRemoveAuthor,
    layout: {
      authorRow: { authorIndex: authorSelected },
    },
    setLayout,
    author: stateAuthor,
    onRegisterOccurrence,
    onRegisterExpense,
    onRegisterInterestOrFine,
    help,
  } = useCurrentAccount();

  const { isCanExpense, isCanFee, isCanPayment, isCanInstallment, isCanFine, isCanInterest } = useResource();

  const { values, setFieldValue } = useFormikContext<CurrentAuthorImp & { authorIndex: number }>();
  const [interestFineDropDowns, setInterestFineDropDowns] = useState<
    {
      title: string;
      type: string;
      onClick: () => void;
    }[]
  >([]);

  const [occurrenceDropDowns, setOccurrenceDropDowns] = useState<
    {
      title: string;
      type: string;
      onClick: () => void;
    }[]
  >([]);

  const author = stateAuthor.list[authorSelected];

  const [isModalVisible, setModalVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDuplicateAuthor = useCallback(() => {
    onDuplicateAuthor({ authorIndex: values.authorIndex });
  }, [stateAuthor, values.authorIndex]);

  const handleAuthorRemove = useCallback(async () => {
    onRemoveAuthor({ authorIndex: values.authorIndex });
    await setFieldValue('authorIndex', 0);
  }, [stateAuthor, values.authorIndex]);

  const handleEditAuthor = useCallback(() => {
    setLayout(layout => ({
      ...layout,
      modalEditAuthor: { visible: true },
    }));
  }, [setLayout]);

  useEffect(() => {
    setFieldValue('name', author.name);
  }, []);

  useEffect(() => {
    setFieldValue('authorIndex', authorSelected);
  }, [authorSelected]);

  useEffect(() => {
    const interest = {
      title: getFieldName(labelsEnum.INTEREST, nomenclatures),
      type: typeInterest.id,
      onClick: () => {
        onRegisterInterestOrFine({ type: typeInterest.id });
      },
    };

    const fine = {
      title: getFieldName(labelsEnum.FINE, nomenclatures),
      type: typeFine.id,
      onClick: () => {
        onRegisterInterestOrFine({ type: typeFine.id });
      },
    };

    const _dropdowns = [];

    isCanInterest && _dropdowns.push(interest);
    isCanFine && _dropdowns.push(fine);

    setInterestFineDropDowns(_dropdowns);
  }, [nomenclatures, isCanFine, isCanInterest, onRegisterOccurrence]);

  useEffect(() => {
    const fee = {
      title: getFieldName(labelsEnum.FEE, nomenclatures),
      type: typeFee.id,
      onClick: () => {
        onRegisterOccurrence({ type: typeFee.id, newestOccurrence: true });
      },
    };
    const payment = {
      title: getFieldName(labelsEnum.PAYMENT, nomenclatures),
      type: typePayment.id,

      onClick: () => {
        onRegisterOccurrence({ type: typePayment.id, newestOccurrence: true });
      },
    };
    const expense = {
      title: getFieldName(labelsEnum.EXPENSE, nomenclatures),
      type: typeExpense.id,
      onClick: () => {
        onRegisterOccurrence({ type: typeExpense.id, newestOccurrence: true });
      },
    };
    const installment = {
      title: getFieldName(labelsEnum.INSTALLMENTS, nomenclatures),
      type: typeinstallment.id,
      onClick: () => {
        onRegisterOccurrence({ type: typeinstallment.id, newestOccurrence: true });
      },
    };

    const _dropdowns = [];

    isCanInstallment && _dropdowns.push(installment);
    isCanPayment && _dropdowns.push(payment);
    isCanExpense && _dropdowns.push(expense);
    isCanFee && _dropdowns.push(fee);

    setOccurrenceDropDowns(_dropdowns);
  }, [nomenclatures, isCanExpense, isCanInstallment, isCanPayment, isCanFee, onRegisterOccurrence]);

  const authorOptions = stateAuthor.list.map((author, key) => ({
    id: key,
    label: author.name,
    value: key,
  }));

  return (
    <Form
      onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
        if (e.target.name.includes('authorIndex'))
          setLayout(layout => ({
            ...layout,
            authorRow: {
              ...layout.authorRow,
              [e.target.name]: Number(e.target.value),
            },
          }));
      }}>
      <AuthorListContainer>
        <AuthorName>
          <VerticalLine />
          <AuthorCount>{Number(authorSelected) + 1}</AuthorCount>
          <InputContainer>
            <CustomSelect icon={IoMdArrowDropdown} name="authorIndex" value={authorSelected} options={authorOptions} />
          </InputContainer>
        </AuthorName>
        <AuthorAction>
          <BackgroudContainer>
            <ButtonAction onBlur={e => e.preventDefault()} onClick={handleEditAuthor}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.EDIT}  ${
                  author.name.length ? author.name : getFieldName(labelsEnum.AUTHOR, nomenclatures)
                }`}>
                <FaEdit />
              </Tooltip>
            </ButtonAction>
            <ButtonAction onClick={handleDuplicateAuthor}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DUPLICATE}  ${
                  author.name.length ? author.name : getFieldName(labelsEnum.AUTHOR, nomenclatures)
                }`}>
                <FaRegCopy />
              </Tooltip>
            </ButtonAction>
            <ButtonAction
              onClick={event => {
                if (event.ctrlKey || event.shiftKey) {
                  handleAuthorRemove();
                } else {
                  openModal();
                }
              }}>
              <Tooltip
                withoutHoverColor={true}
                text={`${labelsEnum.DELETE} ${
                  author.name.length ? author.name : getFieldName(labelsEnum.AUTHOR, nomenclatures)
                }`}>
                <FaTrashAlt />
              </Tooltip>
            </ButtonAction>
            <OcurrenceDeleteModal
              visible={isModalVisible}
              closeModal={closeModal}
              removeOcurrence={handleAuthorRemove}
            />
          </BackgroudContainer>
        </AuthorAction>
      </AuthorListContainer>

      {(isCanExpense || isCanInstallment || isCanPayment || isCanFee) && (
        <TabContainer $visibility={true}>
          <Tab
            helpLink={help?.occurrenceAdd.link}
            helpText={help?.occurrenceAdd.text}
            helpMinWidth={help?.occurrenceAdd.minWidth}
            visible={true}
            dropDownActions={occurrenceDropDowns}
            Icon={IoIosAdd}
            title={labelsEnum.OCCURRENCE_ADD}>
            <OccurrenceList />
          </Tab>
        </TabContainer>
      )}

      {(isCanInterest || isCanFine) && (
        <TabContainer $visibility={true}>
          <Tab
            helpLink={help?.interestFinesAdd.link}
            helpText={help?.interestFinesAdd.text}
            helpMinWidth={help?.interestFinesAdd.minWidth}
            dropDownActions={interestFineDropDowns}
            visible={true}
            Icon={IoIosAdd}
            title={`${labelsEnum.ADD} ${getFieldName(labelsEnum.INTEREST, nomenclatures)}/${getFieldName(
              labelsEnum.FINE,
              nomenclatures
            )}`}>
            <CalcClosedContent>{Number(authorSelected) == -1 ? <></> : <InterestFineList />}</CalcClosedContent>
          </Tab>
        </TabContainer>
      )}

      <TabContainer $visibility={true}>
        <Tab
          helpLink={help?.expenseAdd.link}
          helpText={help?.expenseAdd.text}
          helpMinWidth={help?.expenseAdd.minWidth}
          onClick={onRegisterExpense}
          visible={true}
          Icon={IoIosAdd}
          title={`${labelsEnum.ADD} ${getFieldName(labelsEnum.EXPENSE_SECTION, nomenclatures)}`}>
          <ExpenseList />
        </Tab>
      </TabContainer>
    </Form>
  );
};

export default AuthorForm;
