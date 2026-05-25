import _ from 'lodash';
import AccountImp from '@interfaces/AccountImp';
import MemCalcImp from '@interfaces/MemCalcImp';
import { MonetaryCorrectionCalculateImp } from '@interfaces/calculations/CorrectionImp';
import ViewOccorrenceImp, { ViewType } from '@interfaces/calculations/ViewOccorrenceImp';
import { Moment } from 'moment';
import { getCoin, roundNumber } from '../../../../utils/numberUtils';
import MonetaryCorrectionService from '../../../MonetaryCorrectionService';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { doConversion } from '@/utils/conversionHelper';
import { AdministrativeNatureCorrectionImp } from '@/interfaces/calculations/MonetaryCorrectionParamsImp';

export interface ApplyMonetaryCorrectionToBalanceImp {
  balance: number;
  account: AccountImp;
  administrativeNatureCorrection?: AdministrativeNatureCorrectionImp[];
  isExpense?: boolean;
  dates: {
    currentDate: Moment;
    nextDate: Moment;
  };
  correctedFrom: ViewType;
  isTest?: boolean;
  memCalcs: MemCalcImp[];
}

export default class CurrentMonetaryCorrectionService {
  protected views: ViewOccorrenceImp[] = [];
  protected balanceTotal = 0;
  protected interestTotal = 0;

  public async calculate({
    account,
    dates: { currentDate, nextDate },
    balance,
    isTest,
    memCalcs,
    administrativeNatureCorrection,
  }: ApplyMonetaryCorrectionToBalanceImp): Promise<{
    currency: string;
    correctionValue: number;
    balanceTotal: number;
    details: [string, string][];
  }> {
    try {
      this.balanceTotal = balance;
      console.info('calculate_monetary_correction');
      const monetaryCorrectionService = new MonetaryCorrectionService();
      let details: [string, string][] = [];

      const currentOccurrenceFormat = currentDate.format('MM/YYYY');
      const nextOccurrenceFormat = nextDate.format('MM/YYYY');

      const currentDateSymbol = currentDate.format(dateFormatEnum.DEFAULT);
      const nextDateSymbol = nextDate.format(dateFormatEnum.DEFAULT);

      const currencyCurrentDate = getCoin(currentDateSymbol, 0);
      const currency = getCoin(nextDateSymbol, 0);

      let correctionValue = 0;
      const currentDateIsAfterToNextDate = currentDate.isSameOrAfter(nextDate);
      const isProRataDay = account.proRataDay && nextDate.isAfter(currentDate);

      if (currentOccurrenceFormat != nextOccurrenceFormat || isProRataDay) {
        let correction;

        const currentCorrectionPayload: MonetaryCorrectionCalculateImp = {
          date: currentDateSymbol,
          value: this.balanceTotal,
          administrativeNatureCorrection,
          isTest,
          account: { ...account, updateTo: nextDateSymbol },
          memCalcs,
        };

        const currentOccurrenceMonth = currentDate.format('MM');
        const currentOccurrenceYear = currentDate.format('YYYY');
        const nextOccurrenceMonth = nextDate.format('MM');
        const nextOccurrenceYear = nextDate.format('YYYY');

        const isEqualMonthAndYear =
          currentOccurrenceMonth == nextOccurrenceMonth && currentOccurrenceYear == nextOccurrenceYear;

        if (!isEqualMonthAndYear || isProRataDay) {
          correction = await monetaryCorrectionService.calculate(currentCorrectionPayload);
          details = correction.details || [];
          correctionValue = correction.value;
        }

        if (currentDateIsAfterToNextDate)
          return { currency, correctionValue, balanceTotal: this.balanceTotal, details };

        const balanceAccordingMemCalc = doConversion(
          this.balanceTotal,
          currentCorrectionPayload.date,
          currentCorrectionPayload.account.updateTo
        );

        const isEqualCurrency = currency === currencyCurrentDate;
        correctionValue = correctionValue - (!isEqualCurrency ? balanceAccordingMemCalc : this.balanceTotal);

        if (!isEqualCurrency)
          this.balanceTotal = doConversion(
            this.balanceTotal,
            currentCorrectionPayload.date,
            currentCorrectionPayload.account.updateTo
          );

        this.balanceTotal += correctionValue;
      }

      return { currency, correctionValue: roundNumber(correctionValue), balanceTotal: this.balanceTotal, details };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
