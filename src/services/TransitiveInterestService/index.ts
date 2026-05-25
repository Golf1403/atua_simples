import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import { typeNotApply } from '@data/calculations/civilCodeTypes';
import CivilCodeInterest from '../../enums/CivilCodeInterest';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import AdministrativeNature from './AdministrativeNature';
import OnePercent from './OnePercent';
import PublicEmployees from './PublicEmployees';
import Savings from './Savings';
import SelectIndex from './SelectIndex';
import MemCalcImp from '@/interfaces/MemCalcImp';
import LawImp from '@/interfaces/Law';
import Law from './Law';

export default class TransitiveInterestService {
  public run({
    interest,
    interestIndexes,
    interestIndexesFromLaw,
    allMemcalcs,
    proRataDay,
  }: {
    interest: MonetaryInterestImp;
    interestIndexes: InterestIndexesImp;
    interestIndexesFromLaw: LawImp[];
    allMemcalcs?: {
      [key: number]: MemCalcImp[];
    };
    proRataDay?: boolean;
  }) {
    const isTransitive = interest.civilCode !== typeNotApply.id;
    if (isTransitive)
      switch (interest.civilCode?.trim()) {
        case CivilCodeInterest.SELECT_INDEX: {
          const selectIndex = new SelectIndex();
          if (!allMemcalcs) throw 'not fount allMemcalcs';
          return selectIndex.run(interest, allMemcalcs, proRataDay);
        }
        case CivilCodeInterest.ONE_PERCENT: {
          const onePercent = new OnePercent();
          return onePercent.run(interest, proRataDay);
        }
        case CivilCodeInterest.ADMINISTRATIVE_NATURE: {
          const administrativeNature = new AdministrativeNature();
          return administrativeNature.run(interest, interestIndexes, proRataDay);
        }
        case CivilCodeInterest.PUBLIC_EMPLOYEES: {
          const publicEmployees = new PublicEmployees();
          return publicEmployees.run(interest, interestIndexes, proRataDay);
        }
        case CivilCodeInterest.SAVINGS: {
          const savings = new Savings();
          return savings.run(interest, interestIndexes, proRataDay);
        }
        case CivilCodeInterest.MONTHLY_BEFORE_LAW: {
          const law = new Law({
            data: interestIndexesFromLaw,
            from: interest.dateStart,
            updateTo: interest.dateEnd,
            onePercentFromProRataDay: false,
            tax: interest.percentage,
            value: interest.calculatedInfo.value,
          });
          return law.run();
        }
        case CivilCodeInterest.PRO_RATA_DAY_BEFORE_LAW: {
          const law = new Law({
            data: interestIndexesFromLaw,
            from: interest.dateStart,
            updateTo: interest.dateEnd,
            onePercentFromProRataDay: true,
            tax: interest.percentage,
            value: interest.calculatedInfo.value,
          });
          return law.run();
        }
      }
  }
}
