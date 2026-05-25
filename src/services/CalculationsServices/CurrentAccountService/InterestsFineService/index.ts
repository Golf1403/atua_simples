import _ from 'lodash';
import moment, { Moment } from 'moment';
import CurrentInterestFineImp from '@interfaces/calculations/CurrentInterestFineImp';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import {
  CurrentAuthorTypes,
  InterestFineTypes,
  initialInterest,
  initialFine,
  typeFine,
  typeInterest,
  typeInterestCorrection,
  OccurrenceTypes,
  typeInterestCorrectionSuspend,
  typeFineCorrection,
  typeinstallment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import AccountImp from '@interfaces/AccountImp';
import MemCalcImp from '@interfaces/MemCalcImp';
import CalculateInterest, { CalculateInterestImp } from '../../../InterestService';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import {
  InterestTypes,
  InterestTypesWithPeriodAndFine,
  typeCompensatory,
  typeCompound,
  typeDefault,
} from '@data/calculations/interestTypes';
import { getCoin, roundNumber } from '../../../../utils/numberUtils';
import { PercentageOrFixedType, fineAmountType, finePercentageType } from '@data/calculations/fineEntryTypes';
import MonetaryCorrectionService from '../../../MonetaryCorrectionService';
import { MonetaryCorrectionCalculateImp } from '@interfaces/calculations/CorrectionImp';
import { CurrentTypes, typeAccountCurrent } from '@/data/calculations/currentTypes';
import ViewOccorrenceImp, { SummaryImp } from '@interfaces/calculations/ViewOccorrenceImp';
import MonetaryFineImp, { PeriodImp } from '@/interfaces/calculations/MonetaryFineImp';
import { valueWithCurrency } from '@lib/currency';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { reorderItemsByIndex } from '@/lib/utils';
import { formatPeriodPercentage } from '@services/InterestService/CalculateSimpleInterest';
import { frequencyDayDaily } from '@/data/calculations/frequencyDaysTypes';
import TransitiveInterestService from '@/services/TransitiveInterestService';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import { getCapitalization, getPeriodicity } from '@/utils/getTimeByRange';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import {
  typeMonthlyBeforeLaw,
  typeNotApply,
  typeOnePercent,
  typeProRataDayBeforeLaw,
} from '@/data/calculations/civilCodeTypes';
import { doConversion } from '@/utils/conversionHelper';
import { labelsEnum } from '@/enums/labelsEnum';
import LawImp from '@/interfaces/Law';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { getFieldName } from '@/lib/nomenclature';
import INomenclature from '@/interfaces/NomenclatureImp';

export type CreateResponseImp = CurrentAuthorImp[];

export interface CreateImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  updateTo: string;
  type: InterestFineTypes;
}

export type DeleteResponseImp = CurrentAuthorImp[];

export interface DeleteImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  interestFineIndex: number;
}

export type DuplicateResponseImp = CurrentAuthorImp[];

export interface CalculateImp {
  balance: number;
  correctionFromOccurrence: number;
  interestTotal: number;
  interestFineApplyByDate: Map<string, Array<string>>;
  views: ViewOccorrenceImp[];
  account: AccountImp;
  interestFineList: CurrentInterestFineImp[];
  summary: SummaryImp[];
  occurrence: {
    currentDate: Moment;
    nextDate: Moment;
    value: number;
    type: OccurrenceTypes;
  };
  type: CurrentTypes;
  isFirstOccurrence: boolean;
  isLastOccurrence: boolean;
  allMemcalcs: {
    [key: number]: MemCalcImp[];
  };
  isTest?: boolean;
  memCalcs: MemCalcImp[];
  interestIndexes: InterestIndexesImp;
  interestIndexesFromLaw: LawImp[];
  nomenclatures: INomenclature[];
}

export interface DuplicateImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  interestFineIndex: number;
}

export interface DateStartImp {
  date: string | null;
  currentOccurrenceDate: Moment;
  updateTo: string;
  isDaily?: boolean;
  isFirstOccurrence?: boolean;
}

export interface DateEndImp {
  date: string | null;
  nextOccurrenceDate: Moment;
  updateTo: string;
  isDaily?: boolean;
  isLastOccurrence?: boolean;
}

export default class InterestsFineService {
  protected views: ViewOccorrenceImp[] = [];
  protected interestFineApplyByDate: Map<string, Array<string>> = new Map();
  protected balance = 0;
  protected fineTotal = 0;
  protected interestTotal = 0;
  protected defaultTotal = 0;
  protected compensatoryTotal = 0;
  protected compoundTotal = 0;
  protected wasApllied = new Map<string, boolean>();
  protected appliedTo = 0;
  protected calculateInterest = new CalculateInterest();
  protected monetaryCorrectionService = new MonetaryCorrectionService();

  constructor(views?: ViewOccorrenceImp[]) {
    if (views) this.views = views;
  }

  public definePriorities(interestFines: CurrentInterestFineImp[]) {
    function compareDates(interestFine1: CurrentInterestFineImp, interestFine2: CurrentInterestFineImp) {
      const dataA = moment(interestFine1.dateStart, dateFormatEnum.DEFAULT);
      const dataB = moment(interestFine2.dateStart, dateFormatEnum.DEFAULT);

      if (dataA.isSame(dataB)) return 0;
      if (dataA.isBefore(dataB)) return -1;

      return 1;
    }

    return interestFines.sort(compareDates);
  }

  private getDateStart = ({
    currentOccurrenceDate,
    date,
    updateTo,
    isDaily = false,
    isFirstOccurrence,
  }: DateStartImp) => {
    const interestFineDateStart = moment(date || updateTo, dateFormatEnum.DEFAULT);

    if (interestFineDateStart.isSameOrAfter(currentOccurrenceDate) || isFirstOccurrence)
      return interestFineDateStart.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
    return currentOccurrenceDate.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
  };

  private getDateEnd = ({ date, nextOccurrenceDate, updateTo, isDaily, isLastOccurrence }: DateEndImp) => {
    const interestFineDateEnd = moment(date || updateTo, dateFormatEnum.DEFAULT);

    if (interestFineDateEnd.isSameOrBefore(nextOccurrenceDate) || isLastOccurrence)
      return interestFineDateEnd.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
    else return nextOccurrenceDate.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
  };

  public orderByDate({
    author,
    authorIndex,
    endIndex,
    startIndex,
  }: {
    author: CurrentAuthorTypes;
    authorIndex: number;
    startIndex: number;
    endIndex: number;
  }) {
    if (!author.list.length) throw 'not found author list';

    const currentAuthor = _.cloneDeep(author) as CurrentAuthorTypes;
    const authorList = currentAuthor.list[authorIndex];
    const interestFines = authorList.interestFines;

    const initialOccurrence = interestFines[startIndex];
    const finalOccurrence = interestFines[endIndex];

    const initialDate = moment(initialOccurrence.dateStart, dateFormatEnum.DEFAULT);
    const finalDate = moment(finalOccurrence.dateStart, dateFormatEnum.DEFAULT);

    if (initialDate.isSame(finalDate)) {
      const reorderedOccurrences: CurrentInterestFineImp[] = reorderItemsByIndex(interestFines, startIndex, endIndex);
      authorList.interestFines = reorderedOccurrences;
    }

    return currentAuthor;
  }

  public order(
    interestFines: CurrentInterestFineImp[],
    currentOccurrenceDate: Moment,
    nextOccurrenceDate: Moment,
    changeUpdateTo?: boolean,
    lastUpdateTo?: string,
    updateTo?: string,
    occurrenceIsInstallment?: boolean,
    changeInstallmentDate?: boolean,
    lastInstallmentDate?: string,
    occurrenceDate?: string,
    isDaily?: boolean
  ) {
    const format = isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY;
    const isSameDate = currentOccurrenceDate.format(format) == nextOccurrenceDate.format(format);

    const interestFinesFiltered = interestFines.filter(interestFine => {
      const hasChangeDateEnd =
        changeUpdateTo &&
        moment(interestFine.dateEnd, dateFormatEnum.DEFAULT).isSame(moment(lastUpdateTo, dateFormatEnum.DEFAULT));

      if (hasChangeDateEnd) interestFine.dateEnd = updateTo || interestFine.dateEnd;

      const hasChangeDateStart =
        changeInstallmentDate &&
        moment(interestFine.dateStart, dateFormatEnum.DEFAULT).isSame(
          moment(lastInstallmentDate, dateFormatEnum.DEFAULT)
        );

      if (hasChangeDateStart) interestFine.dateStart = occurrenceDate || interestFine.dateStart;

      const dateStart = moment(interestFine.dateStart, dateFormatEnum.DEFAULT);
      const dateEnd = moment(interestFine.dateEnd, dateFormatEnum.DEFAULT);

      const dateEndIsBetweenToOccurrence =
        dateEnd.isSameOrAfter(currentOccurrenceDate) && dateEnd.isSameOrBefore(nextOccurrenceDate);

      const dateStartIsBetweenToOccurrence =
        dateStart.isSameOrAfter(currentOccurrenceDate) && dateStart.isSameOrBefore(nextOccurrenceDate);

      const currentOccurrenceIsBetweenToInterestFine =
        currentOccurrenceDate.isSameOrAfter(dateStart) && currentOccurrenceDate.isSameOrBefore(dateEnd);

      const nextOccurrenceIsBetweenToInterestFine =
        nextOccurrenceDate.isSameOrAfter(dateStart) && nextOccurrenceDate.isSameOrBefore(dateEnd);

      return (
        !isSameDate &&
        (dateEndIsBetweenToOccurrence ||
          dateStartIsBetweenToOccurrence ||
          currentOccurrenceIsBetweenToInterestFine ||
          nextOccurrenceIsBetweenToInterestFine)
      );
    });

    return this.definePriorities(interestFinesFiltered);
  }
  public orderAuthors(author: CurrentAuthorTypes) {
    const newAuthor: CurrentAuthorTypes = _.cloneDeep(author);
    const newAuthorList = author.list.map(author => {
      const interestFineList = this.definePriorities(author.interestFines);
      return { ...author, interestFines: interestFineList };
    });

    newAuthor.list = newAuthorList;

    return newAuthor;
  }

  private getInterestTotalByType = (payloadView: ViewOccorrenceImp, description: InterestTypes) => {
    switch (description) {
      case typeDefault.id:
        this.defaultTotal += payloadView.value;
        payloadView.defaultTotal = this.defaultTotal;
        break;
      case typeCompensatory.id:
        this.compensatoryTotal += payloadView.value;
        payloadView.compensatoryTotal = this.compensatoryTotal;
        break;
      case typeCompound.id:
        this.compoundTotal += payloadView.value;
        payloadView.compoundTotal = this.compoundTotal;
        break;
    }

    this.views.push(payloadView);
  };

  private generateTransitiveInterestDescription({
    interestFine,
    isFine,
    isLawType,
    result,
    periods,
    view,
  }: {
    interestFine: any;
    isFine: boolean;
    isLawType: boolean;
    result: number;
    periods?: PeriodImp[];
    view: ViewOccorrenceImp;
  }) {
    const getFirstDesc = (period: PeriodImp) => {
      const fromIsBeforeLaw = moment(period.from, dateFormatEnum.DEFAULT).isBefore(
        moment('30/08/2024', dateFormatEnum.DEFAULT)
      );

      const percentage = `${formatPeriodPercentage(interestFine.value || 0)}%`;
      const periodicity =
        interestFine.civilCode == typeOnePercent.id || (isLawType && fromIsBeforeLaw)
          ? getPeriodicity(interestFine.periodicity)
          : '';

      if (isLawType && fromIsBeforeLaw)
        return `${percentage} ${periodicity} (de ${period.from} a ${period.to}) = ${period.percentage}% \n`;

      return `(${capitalizeFirstLetter(period.nomenclature)} ${periodicity} de ${period.from} a ${period.to}) = ${
        period.percentage
      }% \n`;
    };

    const getSecoundDesc = (period: PeriodImp) => {
      const currencyEnd = getCoin(interestFine.dateEnd, 0);
      const currency = getCoin(period.to, 0);
      const appliedTo = valueWithCurrency(currency, this.appliedTo);
      const resultInterest = valueWithCurrency(currencyEnd, this.interestTotal + result);
      const resultFine = valueWithCurrency(currencyEnd, this.balance + result);
      const nomenclature = capitalizeFirstLetter(period.nomenclature);
      return `(${nomenclature} = ${period.percentage}%) sobre ${appliedTo} = ${valueWithCurrency(currency, result)} ${
        !isFine
          ? `somado ao juros anterior ${valueWithCurrency(view.currency, view.interestBalance)}`
          : `somado ao principal anterior ${valueWithCurrency(view.currency, view.balance)}`
      } = ${isFine ? resultFine : resultInterest} \n`;
    };

    let description = '';

    periods?.forEach((period, index) => {
      if (index != periods?.length - 1) description += getFirstDesc(period);
      else description += getSecoundDesc(period);
    });

    return description;
  }

  private generatePercentageFineDescription = ({
    interestFine,
    result: interestResult,
    totalPercentage,
    view,
  }: {
    interestFine: CurrentInterestFineImp;
    totalPercentage: number;
    result: number;
    view: ViewOccorrenceImp;
  }) => {
    const currencyEnd = getCoin(interestFine.dateEnd, 0);
    const percentage = `${formatPeriodPercentage(interestFine.value || 0)}%`;
    const periodicity = getPeriodicity(interestFine.periodicity);
    const capitalization =
      interestFine.type == typeInterest.id && interestFine.description == typeCompound.id
        ? `${getCapitalization(interestFine.capitalization)}`
        : '';
    const percentageTotal = `${formatPeriodPercentage(totalPercentage || 0)}%`;
    const result = valueWithCurrency(currencyEnd, view.total + interestResult);
    const detail = `somado ao total anterior ${valueWithCurrency(view.currency, view.total)} = ${result}`;
    const appliedToBalanceFormated = valueWithCurrency(currencyEnd, interestResult);
    const appliedTo = valueWithCurrency(view.currencyBalance || view.currency, this.appliedTo);

    return `${percentage} ${periodicity} ${capitalization} = ${percentageTotal} sobre ${appliedTo} = ${appliedToBalanceFormated} ${detail}`;
  };

  private generateAmountFineDescription = ({
    interestFine,
    result: interestResult,
    totalValue,
    view,
  }: {
    interestFine: any;
    totalValue: number;
    result: number;
    view: ViewOccorrenceImp;
  }) => {
    const currencyStart = getCoin(interestFine.dateStart, 0);
    const currencyEnd = getCoin(interestFine.dateEnd, 0);
    const value = valueWithCurrency(currencyStart, interestFine.value || 0);
    const periodicity = getPeriodicity(interestFine.periodicity);
    const valueTotal = valueWithCurrency(currencyEnd, totalValue || 0);
    const result = valueWithCurrency(currencyEnd, this.balance + interestResult);
    const detail = `somado ao principal anterior  ${valueWithCurrency(view.currency, view.balance)} = ${result}`;

    return `(${value} ${periodicity} de ${interestFine.dateStart} a ${interestFine.dateEnd}) = ${valueTotal} ${detail}`;
  };

  private generatePercentageInterestDescription = ({
    interestFine,
    result: interestResult,
    totalPercentage,
    isInterestType,
    view,
  }: {
    interestFine: any;
    isInterestType: boolean;
    totalPercentage: number;
    result: number;
    view: ViewOccorrenceImp;
  }) => {
    if (!isInterestType) return '';

    const currencyEnd = getCoin(interestFine.dateEnd, 0);
    const percentage = `${formatPeriodPercentage(interestFine.value || 0)}%`;
    const periodicity = getPeriodicity(interestFine.periodicity);
    const capitalization =
      interestFine.description == typeCompound.id ? `${getCapitalization(interestFine.capitalization)}` : '';
    const percentageTotal = `${formatPeriodPercentage(totalPercentage || 0)}%`;
    const result = valueWithCurrency(currencyEnd, this.interestTotal + interestResult);
    const detail = `somado ao saldo do juros anterior ${valueWithCurrency(
      view.currency,
      view.interestBalance
    )} = ${result}`;

    const appliedTo = valueWithCurrency(view.currencyBalance || view.currency, this.appliedTo);
    const appliedToBalanceFormated = valueWithCurrency(currencyEnd, interestResult);

    return `${percentage} ${periodicity} ${capitalization} = ${percentageTotal} sobre ${appliedTo} = ${appliedToBalanceFormated} ${detail}`;
  };

  public generateDescription = ({
    interestFine,
    result,
    totalPercentage,
    periods,
    totalValue,
    appliedTo,
  }: {
    interestFine: CurrentInterestFineImp;
    totalPercentage: number;
    totalValue: number;
    result: number;
    periods: PeriodImp[];
    appliedTo?: number;
  }) => {
    const isInterestType = interestFine.type == typeInterest.id;
    const type: PercentageOrFixedType | InterestTypes = isInterestType
      ? (interestFine.description as InterestTypes)
      : interestFine.selectType;
    const isFineType = interestFine.type == typeFine.id;
    const isFineAmountType = type == fineAmountType.id && isFineType;
    const isFinePercentageType = type == finePercentageType.id && isFineType;
    const lawTypes = [typeMonthlyBeforeLaw.id, typeProRataDayBeforeLaw.id];
    const isLawType = lawTypes.includes(interestFine.civilCode as CivilCodeInterest);

    const lastView = this.views[this.views.length - 1];
    const isApply = interestFine.civilCode != typeNotApply.id;

    if (isApply) {
      if (isInterestType)
        return this.generateTransitiveInterestDescription({
          interestFine,
          isFine: false,
          isLawType,
          periods,
          result,
          view: lastView,
        });

      return this.generateTransitiveInterestDescription({
        interestFine,
        isFine: true,
        isLawType,
        periods,
        result,
        view: lastView,
      });
    }

    if (isFinePercentageType) {
      this.appliedTo = appliedTo || lastView.balance || 0;
      return this.generatePercentageFineDescription({
        interestFine,
        totalPercentage,
        result,
        view: lastView,
      });
    }

    if (isFineAmountType)
      return this.generateAmountFineDescription({
        interestFine,
        totalValue,
        result,
        view: lastView,
      });

    this.appliedTo = appliedTo || lastView.balance || 0;
    return this.generatePercentageInterestDescription({
      interestFine,
      totalPercentage,
      isInterestType,
      result,
      view: lastView,
    });
  };

  public async calculate({
    interestFineApplyByDate,
    account,
    balance,
    views,
    allMemcalcs,
    summary,
    interestFineList,
    interestTotal,
    type: currentAccountType,
    occurrence: { currentDate, nextDate, type: occurrenceType },
    isFirstOccurrence,
    correctionFromOccurrence,
    isLastOccurrence,
    memCalcs,
    isTest,
    interestIndexes,
    interestIndexesFromLaw,
    nomenclatures,
  }: CalculateImp) {
    console.info(`calculate_interest_and_fine_${currentAccountType}`);

    const transitiveInterestService = new TransitiveInterestService();

    this.interestFineApplyByDate = interestFineApplyByDate;
    this.views = views;
    this.balance = balance;
    this.interestTotal = interestTotal;
    let correction;

    this.wasApllied.set(typeInterest.id, false);
    this.wasApllied.set(typeFine.id, false);
    const isInstallmentType = occurrenceType.includes(typeinstallment.id);

    for (let interestFineIndex = 0; interestFineIndex < interestFineList.length; interestFineIndex++) {
      const interestFine = interestFineList[interestFineIndex];
      if (!interestFine.civilCode?.length) interestFine.civilCode = typeNotApply.id;
      const newInterest = initialInterest;

      const isInterestType = interestFine.type == typeInterest.id;
      const isFineType = interestFine.type == typeFine.id;
      const type: PercentageOrFixedType | InterestTypes = isInterestType
        ? (interestFine.description as InterestTypes)
        : interestFine.selectType;

      const calculatedInfo: CalculateInterestImp = {
        ...newInterest.calculatedInfo,
        value: this.balance,
      };

      let appliedToBalance = 0;

      const isDayPeriodicity =
        interestFine.periodicity == frequencyDayDaily.value ||
        account.proRataDay ||
        [CivilCodeInterest.MONTHLY_BEFORE_LAW, CivilCodeInterest.PRO_RATA_DAY_BEFORE_LAW].includes(
          interestFine.civilCode
        );

      const dateStart = this.getDateStart({
        date: interestFine.dateStart,
        currentOccurrenceDate: currentDate,
        updateTo: account.updateTo,
        isDaily: isDayPeriodicity,
        isFirstOccurrence,
      });

      const dateEnd = this.getDateEnd({
        isDaily: isDayPeriodicity,
        date: interestFine.dateEnd,
        nextOccurrenceDate: nextDate,
        updateTo: account.updateTo,
        isLastOccurrence,
      });

      const diffMonth = (
        !account.proRataDay
          ? moment(interestFine.dateEnd, dateFormatEnum.DEFAULT).add(1, 'month')
          : moment(interestFine.dateEnd, dateFormatEnum.DEFAULT)
      ).diff(moment(dateStart, dateFormatEnum.DEFAULT), 'month');

      const year = Number((diffMonth / 12).toFixed(2));

      summary.push({ date: dateEnd, desc: typeInterest.label, from: typeInterest.id, year });

      const payload: MonetaryInterestImp | MonetaryFineImp = {
        ...newInterest,
        type,
        dateEnd,
        dateStart,
        formula: interestFine.formula,
        index: interestFine.index,
        calculatedInfo,
        percentage: interestFine.value,
        capitalization: interestFine.type == typeInterest.id ? interestFine.capitalization : 'none',
        periodicity: interestFine.periodicity,
        poupancaType: interestFine.type == typeInterest.id ? interestFine.poupancaType : undefined,
        civilCode: interestFine.civilCode,
        civilCodeDate: interestFine.civilCodeDate,
        administrativeNatureFirstDate:
          interestFine.type == typeInterest.id ? interestFine.administrativeNatureFirstDate : undefined,
        administrativeNatureSecondDate:
          interestFine.type == typeInterest.id ? interestFine.administrativeNatureSecondDate : undefined,
        administrativeNatureThirdDate:
          interestFine.type == typeInterest.id ? interestFine.administrativeNatureThirdDate : undefined,
        onCompensatoryInterest: interestFine.onCompensatoryInterest,
        onInterestWithoutCorrection: interestFine.type == typeInterest.id && interestFine.onInterestWithoutCorrection,
        onCompoundInterest: interestFine.onCompoundInterest,
        onDefaultInterest: interestFine.onDefaultInterest,
        onInstallmentsValue: interestFine.onInstallmentsValue,
        onInterestPeriod: interestFine.onInterestPeriod,
      };

      let notApply = false;
      const transitive = interestIndexes
        ? await transitiveInterestService.run({
            interest: payload,
            interestIndexes,
            allMemcalcs,
            interestIndexesFromLaw,
            proRataDay: account.proRataDay,
          })
        : undefined;

      if (transitive) payload.percentage = 1;

      const defaultInstallmentInterest: CalculateInterestImp = this.calculateInterest.run(
        payload,
        transitive,
        account.proRataDay
      );

      if (
        moment(dateStart, dateFormatEnum.DEFAULT).isAfter(moment(dateEnd, dateFormatEnum.DEFAULT)) ||
        moment(dateEnd, dateFormatEnum.DEFAULT).isBefore(moment(dateStart, dateFormatEnum.DEFAULT))
      )
        notApply = true;

      const typesAppied = this.interestFineApplyByDate.get(`${dateStart}_${dateEnd}`) || [];
      const applyByPercentage = (value: number) => {
        this.appliedTo = value;
        return value * (defaultInstallmentInterest.totalPercentage / 100);
      };

      const applyByAmount = () => defaultInstallmentInterest.result;
      notApply = notApply && typesAppied.includes(interestFine.type);

      if (!notApply) {
        switch (interestFine.type) {
          case typeInterest.id: {
            appliedToBalance = applyByPercentage(this.balance);
            break;
          }
          case typeFine.id: {
            switch (type) {
              case fineAmountType.id:
                appliedToBalance = applyByAmount();
                break;
              case finePercentageType.id:
                appliedToBalance = applyByPercentage(this.balance);
                break;
            }
            break;
          }
        }

        this.interestFineApplyByDate.delete(`${dateStart}_${dateEnd}`);
        this.interestFineApplyByDate.set(`${dateStart}_${dateEnd}`, typesAppied.concat(interestFine.type));
      }

      const isCorrection = interestFine.isCorrection;
      const wasApllied = this.wasApllied.get(interestFine.type);
      const isCorrectionAndDateStartDiffDateEnd =
        !wasApllied && correctionFromOccurrence && isCorrection && dateStart != dateEnd;

      if (!notApply) {
        const currentDescription = this.generateDescription({
          interestFine: { ...interestFine, dateEnd, dateStart },
          periods: transitive?.periods || [],
          result: appliedToBalance,
          totalPercentage: defaultInstallmentInterest.totalPercentage,
          totalValue: defaultInstallmentInterest.result,
        });
        const currency = getCoin(dateEnd, 0);

        switch (currentAccountType) {
          case typeAccountCurrent.id: {
            this.balance += appliedToBalance;
            const payloadView: ViewOccorrenceImp = {
              updateSince: null,
              balance: this.balance,
              date: payload.dateStart,
              dateEnd: payload.dateEnd,
              description: interestFine.description,
              currency,
              tax: null,
              type: interestFine.type,
              selectType: interestFine.description as InterestTypesWithPeriodAndFine,
              isCorrection,
              extraDescription: currentDescription,
              interestBalance: this.interestTotal,
              total: this.balance + this.fineTotal + this.interestTotal,
              fineBalance: this.fineTotal,
              value: appliedToBalance,
              correctedFrom: occurrenceType,
            };
            payloadView.value && this.getInterestTotalByType(payloadView, interestFine.description as InterestTypes);
            this.balance += this.interestTotal;
            break;
          }
          default: {
            this.balance = roundNumber(this.balance);
            let interestBalanceCorrection = 0;

            if (isCorrectionAndDateStartDiffDateEnd) {
              this.wasApllied.set(interestFine.type, true);

              interestBalanceCorrection = isInterestType ? this.interestTotal : this.fineTotal;

              const currentCorrectionPayload: MonetaryCorrectionCalculateImp = {
                account: { ...account, updateTo: dateEnd || account.updateTo },
                date: payload.dateStart,
                value: interestBalanceCorrection,
                memCalcs,
                isTest,
              };

              correction = await this.monetaryCorrectionService.calculate(currentCorrectionPayload);

              currentCorrectionPayload.value = doConversion(
                currentCorrectionPayload.value,
                payload.dateStart,
                dateEnd || account.updateTo
              );

              const correctionValue = correction.value ? correction.value - currentCorrectionPayload.value : 0;
              if (isInterestType) {
                this.interestTotal = doConversion(this.interestTotal, payload.dateStart, dateEnd || account.updateTo);
                this.interestTotal += correctionValue;
              }

              if (isFineType) {
                this.fineTotal = doConversion(this.fineTotal, payload.dateStart, dateEnd || account.updateTo);
                this.fineTotal += correctionValue;
              }

              const currency = getCoin(dateEnd, 0);

              const generateDetail = () => {
                const currencyEnd = getCoin(payload.dateEnd, 0);
                const lastView = this.views[this.views.length - 1];

                if (isInterestType) {
                  const result = valueWithCurrency(currencyEnd, this.interestTotal);

                  const detail = `que somado ao saldo do ${getFieldName(
                    labelsEnum.INTEREST,
                    nomenclatures
                  )} anterior  ${valueWithCurrency(lastView.currency, lastView.interestBalance)} = ${result}`;

                  return detail;
                }

                const result = valueWithCurrency(currencyEnd, this.fineTotal);

                const detail = `que somado ao saldo da ${getFieldName(
                  labelsEnum.FINE,
                  nomenclatures
                )} anterior  ${valueWithCurrency(lastView.currency, lastView?.fineBalance || 0)} = ${result}`;

                return detail;
              };

              const payloadView: ViewOccorrenceImp = {
                updateSince: null,
                balance: this.balance,
                date: payload.dateStart,
                dateEnd: payload.dateEnd,
                description: interestFine.description,
                extraDescription: ` ${labelsEnum.MONETARY_CORRECTION} ${
                  isInterestType ? labelsEnum.APPLY_INTEREST_BALANCE : labelsEnum.APPLY_FINE_BALANCE
                } ${valueWithCurrency(currency, interestBalanceCorrection)} = ${valueWithCurrency(
                  currency,
                  correctionValue
                )} ${generateDetail()}`,
                tax: null,
                currency: getCoin(dateEnd, 0),
                type: isInterestType ? typeInterestCorrection.id : typeFineCorrection.id,
                value: correctionValue,
                isCorrection,
                fineBalance: this.fineTotal,
                interestBalance: this.interestTotal,
                total: this.balance + this.interestTotal + this.fineTotal,
                correctedFrom: occurrenceType,
              };

              payloadView.value && this.getInterestTotalByType(payloadView, interestFine.description as InterestTypes);
            }

            const _currentDescription = this.generateDescription({
              interestFine: { ...interestFine, dateEnd, dateStart },
              periods: transitive?.periods || [],
              result: appliedToBalance,
              totalPercentage: defaultInstallmentInterest.totalPercentage,
              totalValue: defaultInstallmentInterest.result,
            });

            const isFineInstallmentType = isFineType && isInstallmentType;
            if (isFineInstallmentType) this.fineTotal += isFineType ? appliedToBalance : 0;

            this.interestTotal += isInterestType ? appliedToBalance : 0;

            const payloadView: ViewOccorrenceImp = {
              updateSince: null,
              balance: this.balance,
              date: payload.dateStart,
              dateEnd: payload.dateEnd,
              description: interestFine.description,
              extraDescription: _currentDescription,
              tax: null,
              currency: getCoin(dateEnd, 0),
              type: interestFine.type,
              selectType: interestFine.description as InterestTypesWithPeriodAndFine,
              isCorrection,
              value: appliedToBalance,
              interestBalance: this.interestTotal,
              fineBalance: this.fineTotal,
              total: this.balance + this.interestTotal + this.fineTotal,
              correctedFrom: occurrenceType,
            };

            const emptyCorrectionView: ViewOccorrenceImp = {
              updateSince: null,
              balance: this.balance,
              date: payload.dateStart,
              dateEnd: payload.dateEnd,
              description: '',
              extraDescription: `A correção não foi aplicada no período de ${payload.dateStart} à ${
                payload.dateEnd
              } devido a utilização do ${_currentDescription
                .split('=')[0]
                .trim()
                .replace(/^\(/, '')
                .toUpperCase()} (Sem Correção)`,
              tax: null,
              currency: getCoin(dateEnd, 0),
              type: typeInterestCorrectionSuspend.id,
              selectType: interestFine.description as InterestTypesWithPeriodAndFine,
              isCorrection,
              value: 0,
              interestBalance: 0,
              fineBalance: this.fineTotal,
              total: this.balance + this.interestTotal + this.fineTotal - appliedToBalance,
              correctedFrom: occurrenceType,
            };

            payload.onInterestWithoutCorrection &&
              this.getInterestTotalByType(emptyCorrectionView, interestFine.description as InterestTypes);

            const isShowPayloadView = isFineInstallmentType || isInterestType;
            if (isShowPayloadView)
              payloadView.value && this.getInterestTotalByType(payloadView, interestFine.description as InterestTypes);

            break;
          }
        }

        this.interestFineApplyByDate.delete(`${dateStart}_${dateEnd}`);
        this.interestFineApplyByDate.set(`${dateStart}_${dateEnd}`, typesAppied.concat(JSON.stringify(interestFine)));
      }
    }

    return {
      views: this.views,
      balanceTotal: this.balance,
      interestTotal: this.interestTotal,
      total: this.balance + this.interestTotal,
      fineTotal: this.fineTotal,
      defaultTotal: this.defaultTotal,
      compensatoryTotal: this.compensatoryTotal,
      compoundTotal: this.compoundTotal,
      interestFineApplyByDate,
    };
  }

  public errorType(type: number) {
    switch (type) {
      case 100:
        return 'occurrence not found';
      case 101:
        return 'smaller date not found';
      default:
        return '';
    }
  }

  public translateErrorType(type: string) {
    switch (type) {
      case 'occurrence not found':
        return 'Não existe ocorrência';
      case 'smaller date not found':
        return 'Menor data não encontrada';
      default:
        return '';
    }
  }

  public create({ authorList, authorIndex, type, updateTo }: CreateImp): CreateResponseImp {
    const newAuthorList = Array.from(authorList);
    const interestFines = newAuthorList[authorIndex].interestFines;
    const occurrences = authorList[authorIndex]?.occurrences.sort((occ, occ2) =>
      Number(moment(occ.date, dateFormatEnum.DEFAULT).isAfter(moment(occ2.date, dateFormatEnum.DEFAULT)))
    );

    let smallerDate = occurrences[0].date;
    if (!newAuthorList[authorIndex].occurrences.length) throw 100;
    if (!smallerDate) smallerDate = '01/01/2000';

    const interestFine: CurrentInterestFineImp =
      type == typeFine.id
        ? { ...initialFine, dateStart: smallerDate, dateEnd: updateTo, type }
        : { ...initialInterest, type, dateStart: smallerDate, dateEnd: updateTo };

    interestFines.unshift(_.cloneDeep(interestFine));
    newAuthorList[authorIndex].occurrenceTotal = 0;

    return newAuthorList;
  }

  public delete({ authorList, authorIndex, interestFineIndex }: DeleteImp): DeleteResponseImp {
    const newAuthorList = Array.from(authorList);
    newAuthorList[authorIndex].interestFines.splice(interestFineIndex, 1);
    newAuthorList[authorIndex].occurrenceTotal = 0;
    return newAuthorList;
  }

  public duplicate({ authorList, authorIndex, interestFineIndex }: DuplicateImp): DuplicateResponseImp {
    const newAuthorList = Array.from(authorList);
    const interestFine: CurrentInterestFineImp = newAuthorList[authorIndex].interestFines[interestFineIndex];
    newAuthorList[authorIndex].interestFines.push(_.assign({}, _.cloneDeep(interestFine)));
    newAuthorList[authorIndex].occurrenceTotal = 0;

    return newAuthorList;
  }
}
