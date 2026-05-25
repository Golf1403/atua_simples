import _ from 'lodash';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { typeAttorneys } from '@data/calculations/feeTypes';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import OccurrenceService from '@services/CalculationsServices/CurrentAccountService/OccurrenceService';
import {
  initialFeeOccurrence,
  initialInstallmentOccurrence,
  typeFee,
  typeinstallment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import moment from 'moment';
import { initialCurrentAuthor } from '@/hooks/currentAccount';

describe('Occurrence', () => {
  const occurrenceService = new OccurrenceService();
  const updateTo = '01/01/2021';

  test('the intallment occurrence must be created successfully', () => {
    const authorList: CurrentAuthorImp[] = [_.cloneDeep(initialCurrentAuthor)];
    const authorIndex = 0;
    const type = typeinstallment.id;

    const newAuthorList = occurrenceService.create({
      authorList,
      authorIndex,
      type,
      updateTo,
      newestOccurrence: false,
    });

    expect(newAuthorList[authorIndex].occurrences.length).toBe(1);
    expect(newAuthorList[authorIndex].occurrences[0].type).toBe(typeinstallment.id);
    expect(newAuthorList[authorIndex].occurrences[0].date).toBe(updateTo);
    expect(newAuthorList[authorIndex].occurrences[0].priority).toBe(0);
    expect(newAuthorList[authorIndex].occurrences[0].tax).toBe(null);
    expect(newAuthorList[authorIndex].occurrences[0].updateSince).toBe(null);
    expect(newAuthorList[authorIndex].occurrences[0].value).toBe(0);
  });

  test('the fee must occurrence be created successfully', () => {
    const authorList: CurrentAuthorImp[] = [_.cloneDeep(initialCurrentAuthor)];
    const authorIndex = 0;
    const type = typeFee.id;

    const newAuthorList = occurrenceService.create({
      authorList,
      authorIndex,
      type,
      updateTo,
      newestOccurrence: false,
    });
    expect(newAuthorList[authorIndex].occurrences.length).toBe(1);
    expect(newAuthorList[authorIndex].occurrences[0].type).toBe(typeFee.id);

    if (newAuthorList[authorIndex].occurrences[0].type == typeFee.id) {
      expect(newAuthorList[authorIndex].occurrences[0].date).toBe(updateTo);
      expect(newAuthorList[authorIndex].occurrences[0].priority).toBe(1);
      expect(newAuthorList[authorIndex].occurrences[0].tax).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[0].updateSince).toBe(updateTo);
      expect(newAuthorList[authorIndex].occurrences[0].value).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[0].calculated).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[0].order).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[0].tax).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[0].newCpc).toBe(false);
      expect(newAuthorList[authorIndex].occurrences[0].selectType).toBe(typeAttorneys.id);
    }
  });

  test('the fee must occurrence be duplicate successfully', () => {
    const feeOccurrence = _.cloneDeep(initialFeeOccurrence);
    const authorList: CurrentAuthorImp[] = [{ ..._.cloneDeep(initialCurrentAuthor), occurrences: [feeOccurrence] }];
    const authorIndex = 0;
    const occurrenceIndex = 0;

    const newAuthorList = occurrenceService.duplicate({ authorList: authorList, authorIndex, occurrenceIndex });
    expect(newAuthorList[authorIndex].occurrences.length).toBe(2);
    expect(newAuthorList[authorIndex].occurrences[1].type).toBe(typeFee.id);

    if (newAuthorList[authorIndex].occurrences[1].type == typeFee.id) {
      expect(newAuthorList[authorIndex].occurrences[1].date).toBe(
        moment(newAuthorList[authorIndex].occurrences[0].date, dateFormatEnum.DEFAULT)
          .add(1, 'M')
          .format(dateFormatEnum.DEFAULT)
      );
      expect(newAuthorList[authorIndex].occurrences[1].priority).toBe(1);
      expect(newAuthorList[authorIndex].occurrences[1].tax).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[1].updateSince).toBe(null);
      expect(newAuthorList[authorIndex].occurrences[1].value).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[1].calculated).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[1].order).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[1].newCpc).toBe(false);
      expect(newAuthorList[authorIndex].occurrences[1].selectType).toBe(typeAttorneys.id);
    }
  });
  test('the installment must occurrence be duplicate successfully', () => {
    const installmentOccurrence = _.cloneDeep(initialInstallmentOccurrence);
    const authorList: CurrentAuthorImp[] = [
      { ..._.cloneDeep(initialCurrentAuthor), occurrences: [installmentOccurrence] },
    ];
    const authorIndex = 0;
    const occurrenceIndex = 0;

    const newAuthorList = occurrenceService.duplicate({ authorList: authorList, authorIndex, occurrenceIndex });
    expect(newAuthorList[authorIndex].occurrences.length).toBe(2);

    if (newAuthorList[authorIndex].occurrences[1].type == typeinstallment.id) {
      expect(newAuthorList[authorIndex].occurrences[1].date).toBe(
        moment(newAuthorList[authorIndex].occurrences[0].date, dateFormatEnum.DEFAULT)
          .add(1, 'M')
          .format(dateFormatEnum.DEFAULT)
      );
      expect(newAuthorList[authorIndex].occurrences[1].priority).toBe(0);
      expect(newAuthorList[authorIndex].occurrences[1].tax).toBe(null);
      expect(newAuthorList[authorIndex].occurrences[1].updateSince).toBe(null);
      expect(newAuthorList[authorIndex].occurrences[1].value).toBe(0);
    }
  });
});
