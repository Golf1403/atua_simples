import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { CurrentInterestRestImp } from '@/interfaces/calculations/CurrentInterestFineImp';
import moment from 'moment';

export const getSelicStartDate = (interestFine: CurrentInterestRestImp, isDaily?: boolean) => {
  return interestFine.civilCode == CivilCodeInterest.SELECT_INDEX
    ? moment(
        moment(interestFine.dateStart, dateFormatEnum.DEFAULT).format(
          isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY
        ),
        dateFormatEnum.DEFAULT
      ).format(dateFormatEnum.AMERICAN_DATE)
    : moment(
        moment(interestFine.administrativeNatureFirstDate, dateFormatEnum.DEFAULT)
          .add(1, 'day')
          .format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY),
        dateFormatEnum.DEFAULT
      ).format(dateFormatEnum.AMERICAN_DATE);
};

export const getSelicEndDate = (interestFine: CurrentInterestRestImp, isDaily?: boolean) => {
  return interestFine.civilCode == CivilCodeInterest.SELECT_INDEX
    ? moment(
        moment(interestFine.dateEnd, dateFormatEnum.DEFAULT).format(
          isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY
        ),
        dateFormatEnum.DEFAULT
      ).format(dateFormatEnum.AMERICAN_DATE)
    : moment(
        moment(interestFine.administrativeNatureSecondDate, dateFormatEnum.DEFAULT).format(
          isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY
        ),
        dateFormatEnum.DEFAULT
      ).format(dateFormatEnum.AMERICAN_DATE);
};
