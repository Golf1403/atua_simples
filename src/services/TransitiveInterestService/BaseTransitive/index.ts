import InterestService, { CalculateInterestImp, TransitiveImp } from '../../InterestService';
import { poupancaNovaType, poupancaNovaWithSelicType, poupancaType } from '@data/calculations/poupancaTypes';
import IDummyObject from '@interfaces/IDummyObject';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import moment from 'moment';
import IndicadorDadoHasMemTabImp from '@interfaces/IndicadorDadoHasMemTabImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import { IndicadorDadoImp } from '@interfaces/IndicadorDadoImp';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export interface ICalculatedCounpondInterest {
  interest: MonetaryInterestImp;
  transitive?: TransitiveImp;
  proRataDay?: boolean;
  composition?: boolean;
}

export default class BaseTransitive {
  private getSelicIndexByRange(
    interest: MonetaryInterestImp,
    interestIndexes: InterestIndexesImp,
    proRataDay?: boolean
  ) {
    const selicList: IDummyObject[] = [];

    const {
      administrativeNatureFirstDateAddOneDay,
      dateStartInterestOneDay,
      administrativeNatureSecondDateOneDay,
      dateEndInterestOneDay,
    } = this.initializeInterest(interest);

    for (const selic of interestIndexes.selic) {
      const selicDate = moment(moment(selic.date).utc().format('YYYY-MM-01'));

      if (
        selicDate.isSameOrAfter(administrativeNatureFirstDateAddOneDay) &&
        selicDate.isSameOrAfter(dateStartInterestOneDay) &&
        selicDate[proRataDay ? 'isSameOrBefore' : 'isBefore'](dateEndInterestOneDay) &&
        selicDate.isSameOrBefore(administrativeNatureSecondDateOneDay)
      )
        selicList.push(selic);
    }

    return { selicList };
  }

  private getPoupIndexByRange(
    interest: MonetaryInterestImp,
    interestIndexes: InterestIndexesImp,
    proRataDay?: boolean
  ) {
    const savingsList = [];
    const newSavingsList = [];

    const { dateStartInterest, administrativeNatureThirdDateOneDay, dateEndInterest } =
      this.initializeInterest(interest);
    switch (interest.poupancaType) {
      case poupancaType.value: {
        for (const saving of interestIndexes.savings) {
          const savingsDate = moment(saving.date, 'YYYY-MM-DD');

          if (
            savingsDate.isSameOrAfter(administrativeNatureThirdDateOneDay) &&
            savingsDate.isSameOrAfter(dateStartInterest) &&
            savingsDate[proRataDay ? 'isSameOrBefore' : 'isBefore'](dateEndInterest)
          )
            savingsList.push(saving);
        }
        break;
        break;
      }
      case poupancaNovaType.value: {
        for (const newSaving of interestIndexes.newSavings) {
          const savingsDate = moment(newSaving.date, 'YYYY-MM-DD');

          if (
            savingsDate.isSameOrAfter(administrativeNatureThirdDateOneDay) &&
            savingsDate.isSameOrAfter(dateStartInterest) &&
            savingsDate.isBefore(dateEndInterest)
          )
            newSavingsList.push(newSaving);
        }
        break;
      }
    }

    return { savingsList, newSavingsList };
  }

  private getAnyIndexByRange(interest: MonetaryInterestImp, indicator?: IndicadorDadoImp[]) {
    const indicatorList: IndicadorDadoImp[] = [];

    const { dateStartInterestOneDay, dateEndInterestOneDay } = this.initializeInterest(interest);

    if (indicator)
      for (const index of indicator) {
        const indexDate = moment(index.inadata, 'YYYY-MM-DD');

        if (indexDate.isSameOrAfter(dateStartInterestOneDay) && indexDate.isBefore(dateEndInterestOneDay))
          indicatorList.push(index);
      }

    return { indicatorList };
  }

  private getIndexByRange(
    interest: MonetaryInterestImp,
    interestIndexes: InterestIndexesImp,
    indicator?: IndicadorDadoImp[],
    proRataDay?: boolean
  ) {
    const payload: {
      indicatorList: IndicadorDadoImp[];
      newSavingsList: IDummyObject[];
      savingsList: IDummyObject[];
      selicList: IDummyObject[];
    } = {
      indicatorList: [],
      newSavingsList: [],
      savingsList: [],
      selicList: [],
    };

    if (indicator) {
      const { indicatorList: _indicatorList } = this.getAnyIndexByRange(interest, indicator);

      payload.indicatorList = _indicatorList;
      return payload;
    }

    const initialInterestIndexes: InterestIndexesImp = {
      selic: [],
      savings: [],
      tr: [],
      newSavings: [],
      newSavingsDaily: [],
    };

    const result: InterestIndexesImp = interestIndexes || initialInterestIndexes;

    const { selicList: _selicList } = this.getSelicIndexByRange(interest, result, proRataDay);
    const { newSavingsList: _newSavingsList, savingsList: _savingsList } = this.getPoupIndexByRange(
      interest,
      result,
      proRataDay
    );

    payload.newSavingsList = _newSavingsList;
    payload.selicList = _selicList;
    payload.savingsList = _savingsList;

    return payload;
  }

  public initializeInterest(interest: MonetaryInterestImp) {
    const newSavingsDateOneDay = moment(moment('01/06/2012', dateFormatEnum.DEFAULT).format('YYYY-MM-01'));
    const dateStartInterest = moment(interest.dateStart, dateFormatEnum.DEFAULT);
    const civilCodeDateOneDay = moment(moment(interest.civilCodeDate, dateFormatEnum.DEFAULT).format('YYYY-MM-01'));
    const civilCodeDate = moment(moment(interest.civilCodeDate, dateFormatEnum.DEFAULT).format('YYYY-MM-DD'));
    const dateStartInterestAddOneDay = moment(moment(interest.dateStart, dateFormatEnum.DEFAULT).add(1, 'day'));
    const dateStartInterestOneDay = moment(moment(interest.dateStart, dateFormatEnum.DEFAULT).format('YYYY-MM-01'));
    const dateEndInterest = moment(interest.dateEnd, dateFormatEnum.DEFAULT);
    const dateEndInterestOneDay = moment(moment(interest.dateEnd, dateFormatEnum.DEFAULT).format('YYYY-MM-01'));
    const dateEndInterestAddOneDay = moment(moment(interest.dateEnd, dateFormatEnum.DEFAULT).add(1, 'day'));
    const administrativeNatureFirstDate = moment(
      moment(interest.administrativeNatureFirstDate, dateFormatEnum.DEFAULT).format('YYYY-MM-DD')
    );
    const administrativeNatureFirstDateOneDay = moment(
      moment(interest.administrativeNatureFirstDate, dateFormatEnum.DEFAULT).format('YYYY-MM-01')
    );
    const administrativeNatureFirstDateAddOneDay = moment(
      moment(interest.administrativeNatureFirstDate, dateFormatEnum.DEFAULT).add(1, 'day')
    );
    const administrativeNatureSecondDateAddOneDay = moment(
      moment(interest.administrativeNatureSecondDate, dateFormatEnum.DEFAULT).add(1, 'day')
    );
    const administrativeNatureSecondDate = moment(
      moment(interest.administrativeNatureSecondDate, dateFormatEnum.DEFAULT).format('YYYY-MM-DD')
    );
    const administrativeNatureSecondDateOneDay = moment(
      moment(interest.administrativeNatureSecondDate, dateFormatEnum.DEFAULT).format('YYYY-MM-01')
    );
    const administrativeNatureThirdDate = moment(
      moment(interest.administrativeNatureThirdDate, dateFormatEnum.DEFAULT)
    );
    const administrativeNatureThirdDateOneDay = moment(
      moment(interest.administrativeNatureThirdDate, dateFormatEnum.DEFAULT).format('YYYY-MM-01')
    );
    return {
      newSavingsDateOneDay,
      dateStartInterest,
      dateStartInterestAddOneDay,
      dateEndInterestAddOneDay,
      dateStartInterestOneDay,
      administrativeNatureThirdDateOneDay,
      administrativeNatureThirdDate,
      administrativeNatureSecondDateOneDay,
      administrativeNatureSecondDate,
      administrativeNatureSecondDateAddOneDay,
      administrativeNatureFirstDateAddOneDay,
      administrativeNatureFirstDateOneDay,
      administrativeNatureFirstDate,
      dateEndInterestOneDay,
      civilCodeDateOneDay,
      civilCodeDate,
      dateEndInterest,
    };
  }

  public calculateInterest(payload: ICalculatedCounpondInterest): number {
    const { interest, transitive } = payload;

    const interestResponse: CalculateInterestImp = new InterestService().run(
      interest,
      transitive,
      payload.proRataDay,
      payload.composition
    );

    return interestResponse.totalPercentage;
  }

  public capitalizedIndexes(
    interest: MonetaryInterestImp,
    interestIndexes: InterestIndexesImp,
    indicator?: IndicadorDadoHasMemTabImp[]
  ) {
    let capitalizedSelic = 0;
    let capitalizedSavings = 0;
    let capitalizedByIndicator = 1;
    if (indicator) {
      const { indicatorList } = this.getIndexByRange(interest, interestIndexes, indicator);

      for (let i = 0; i < indicatorList.length; i++) {
        const saving = indicatorList[i];
        const indexPercentual = Number(saving.inapercentual);

        capitalizedByIndicator *= indexPercentual / 100 + 1;
      }
      capitalizedByIndicator = capitalizedByIndicator - 1 < 0 ? 0 : (capitalizedByIndicator - 1) * 100;

      return {
        capitalizedByIndicator,
        capitalizedSelic,
        capitalizedSavings,
      };
    }

    let isCalculated = 0;
    const { selicList, newSavingsList, savingsList } = this.getIndexByRange(interest, interestIndexes);

    for (let i = 0; i < selicList.length; i++) {
      const selicPercentual = Number(selicList[i].percentual);
      if (i === 0) capitalizedSelic = selicPercentual / 100 + 1;
      if (i > 0) capitalizedSelic *= selicPercentual / 100 + 1;
      isCalculated = 1;
    }

    if (selicList.length) capitalizedSelic = capitalizedSelic - 1 < 0 ? 0 : (capitalizedSelic - 1) * 100;

    switch (interest.poupancaType) {
      case poupancaType.value: {
        for (let i = 0; i < savingsList.length; i++) {
          const savingPercentual = Number(savingsList[i].percentual);

          if (i === 0) capitalizedSavings = savingPercentual / 100 + 1;
          if (i > 0) capitalizedSavings *= savingPercentual / 100 + 1;
          isCalculated = 1;
        }
        break;
      }
      case poupancaNovaType.value: {
        if (newSavingsList.length) {
          const firstNewSaving = newSavingsList[0];
          const firstNewSavingDate = moment(firstNewSaving.date, 'YYYY-MM-DD');

          const lastNewSaving = newSavingsList[newSavingsList.length - 1];
          const lastNewSavingDate = moment(lastNewSaving.date, 'YYYY-MM-DD');

          const daysTotal = newSavingsList.length;
          const monthsTotal = lastNewSavingDate.diff(firstNewSavingDate, 'months') + 1;

          const daysOverMonth = daysTotal / monthsTotal;

          for (let i = 0; i < newSavingsList.length; i++) {
            const saving = newSavingsList[i];
            const savingPercentual = Number(saving.percentual) / daysOverMonth;
            const firstElement = i === 0;
            const afterOfFirstElement = i > 0;

            if (firstElement)
              if (capitalizedSavings) capitalizedSavings *= savingPercentual / 100 + 1;
              else capitalizedSavings = savingPercentual / 100 + 1;

            if (afterOfFirstElement) capitalizedSavings *= savingPercentual / 100 + 1;
            isCalculated = 1;
          }
        }
        break;
      }
      case poupancaNovaWithSelicType.value: {
        const { dateEndInterest, dateStartInterest } = this.initializeInterest(interest);

        const trList = [];
        const savings = [];
        const dateNcc = moment('01/05/2012', dateFormatEnum.DEFAULT);

        const initialInterestIndexes: InterestIndexesImp = {
          selic: [],
          savings: [],
          tr: [],
          newSavings: [],
          newSavingsDaily: [],
        };

        const result = interestIndexes || initialInterestIndexes;

        for (const newSaving of result.newSavingsDaily) {
          const newSavingsDate = moment(newSaving.date, 'YYYY-MM-DD');

          if (
            newSavingsDate.isBefore(dateEndInterest) &&
            newSavingsDate.isSameOrAfter(dateNcc) &&
            newSavingsDate.isSameOrAfter(dateStartInterest)
          )
            newSavingsList.push(newSaving);
        }
        for (const tr of result.tr) {
          const trDate = moment(tr.date, 'YYYY-MM-DD');
          if (
            trDate.isSameOrAfter(dateNcc) &&
            trDate.isSameOrAfter(dateStartInterest) &&
            trDate.isBefore(dateEndInterest)
          )
            trList.push(tr);
        }

        let trIndex = 0;

        for (let i = 0; i < newSavingsList.length; i++) {
          const savingPercentual = Number(newSavingsList[i].percentual) / 100;
          const dateSaving = moment(newSavingsList[i].date, 'YYYY-MM-DD');
          const tr = trList[trIndex];
          if (tr) {
            const dateTr = moment(tr.date, 'YYYY-MM-DD');
            const trPercentual = Number(tr.percentual) / 100;
            const isSameDate = dateTr.isSame(dateSaving);

            if (isSameDate) {
              const roundFourDecimalCase = 10000;
              const percentageTotal = ((savingPercentual + 1) / (trPercentual + 1) - 1) * 100;
              const diff = Math.round(percentageTotal * roundFourDecimalCase) / roundFourDecimalCase;

              savings.push(diff);

              const diffPercentual = diff / 100;
              const diffPercentualPlusOne = diffPercentual + 1;

              if (capitalizedSavings) capitalizedSavings = capitalizedSavings * diffPercentualPlusOne;
              else capitalizedSavings = diff ? diffPercentualPlusOne : capitalizedSavings;

              trIndex++;
              isCalculated = 1;
            }
            if (trIndex === trList.length) break;
          }
        }

        break;
      }
    }
    if (isCalculated) capitalizedSavings = capitalizedSavings - 1 < 0 ? 0 : (capitalizedSavings - 1) * 100;
    else capitalizedSavings = 0;

    return {
      capitalizedSelic,
      capitalizedSavings,
      capitalizedByIndicator,
    };
  }
  private accumulatedProRataByIndicator(
    interest: MonetaryInterestImp,
    indicator: IndicadorDadoHasMemTabImp[],
    proRataDay?: boolean
  ) {
    let accumulated = 0;
    const initialDate = moment(interest.dateStart, dateFormatEnum.DEFAULT);
    const endDate = moment(interest.dateEnd, dateFormatEnum.DEFAULT);
    const initialDateOneDay = moment(initialDate.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY);
    const endDateOneDay = moment(endDate.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY);
    const dateStartIsSameDateEnd = initialDateOneDay.isSame(endDateOneDay);

    for (let i = 0; i < indicator.length; i++) {
      const index = indicator[i];
      const percent = Number(index.inapercentual);
      const currentDate = moment(index.inadata).utc();
      const currentDateOneDay = moment(currentDate.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY);

      const currentDateIsSamedateStartInterest = initialDateOneDay.isSame(currentDateOneDay);
      const currentDateIsSamedateEndInterest = endDateOneDay.isSame(currentDateOneDay);

      if (proRataDay) {
        if ((currentDateIsSamedateStartInterest && dateStartIsSameDateEnd) || currentDateIsSamedateEndInterest) {
          const day = Number(endDate.format('DD'));
          const daysInMonth = endDateOneDay.daysInMonth();
          accumulated += (day - 1) * (percent / daysInMonth);
        } else if (currentDateIsSamedateStartInterest) {
          const day = Number(initialDate.format('DD'));
          const daysInMonth = initialDateOneDay.daysInMonth();
          const diffOfDays = daysInMonth - day + 1;
          accumulated += diffOfDays * (percent / daysInMonth);
        } else {
          accumulated += percent;
        }
      } else {
        accumulated += percent;
      }
    }
    return accumulated;
  }

  private accumulatedProRata(interest: MonetaryInterestImp, indicator: any, proRataDay?: boolean) {
    let accumulated = 0;
    const initialDate = moment(interest.dateStart, dateFormatEnum.DEFAULT);
    const endDate = moment(interest.dateEnd, dateFormatEnum.DEFAULT);
    const initialDateOneDay = moment(initialDate.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY);
    const endDateOneDay = moment(endDate.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY);
    const dateStartIsSameDateEnd = initialDateOneDay.isSame(endDateOneDay);

    for (let i = 0; i < indicator.length; i++) {
      const index = indicator[i];
      const currentDate = moment(index.date).utc();
      const currentDateOneDay = moment(currentDate.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY);
      const percent = Number(index.percentual);
      const currentDateIsSamedateStartInterest = initialDateOneDay.isSame(currentDateOneDay);
      const currentDateIsSamedateEndInterest = endDateOneDay.isSame(currentDateOneDay);

      if (proRataDay) {
        if ((currentDateIsSamedateStartInterest && dateStartIsSameDateEnd) || currentDateIsSamedateEndInterest) {
          const day = Number(endDate.format('DD'));
          const daysInMonth = endDateOneDay.daysInMonth();
          accumulated += (day - 1) * (percent / daysInMonth);
        } else if (currentDateIsSamedateStartInterest) {
          const day = Number(initialDate.format('DD'));
          const daysInMonth = initialDateOneDay.daysInMonth();
          const diffOfDays = daysInMonth - day + 1;
          accumulated += diffOfDays * (percent / daysInMonth);
        } else {
          accumulated += percent;
        }
      } else {
        accumulated += percent;
      }
    }
    return accumulated;
  }

  public accumulatedIndexes(
    interest: MonetaryInterestImp,
    interestIndexes: InterestIndexesImp,
    indicator?: IndicadorDadoHasMemTabImp[],
    proRataDay?: boolean
  ) {
    let accumulatedSavings = 0;
    let accumulatedSelic = 0;
    let accumulatedByIndicator = 0;

    if (indicator) {
      if (proRataDay) {
        const accumulated = this.accumulatedProRataByIndicator(interest, indicator, proRataDay);
        accumulatedByIndicator += accumulated;
      } else {
        for (let i = 0; i < indicator.length; i++) {
          const saving = indicator[i];
          const indexPercentual = Number(saving.inapercentual);
          accumulatedByIndicator += indexPercentual;
        }
      }

      accumulatedSelic = Math.round(accumulatedSelic * 10000) / 10000;
      accumulatedByIndicator = Math.round(accumulatedByIndicator * 10000) / 10000;
      accumulatedSelic = Math.round(accumulatedSavings * 10000) / 10000;
      return {
        accumulatedByIndicator,
        accumulatedSelic,
        accumulatedSavings,
      };
    }

    const { selicList, newSavingsList, savingsList } = this.getIndexByRange(
      interest,
      interestIndexes,
      undefined,
      proRataDay
    );

    const accSelic = this.accumulatedProRata(interest, selicList, proRataDay);
    accumulatedSelic += accSelic;

    switch (interest.poupancaType) {
      case poupancaType.id: {
        const accSavings = this.accumulatedProRata(interest, savingsList, proRataDay);
        accumulatedSavings += accSavings;
        break;
      }
      case poupancaNovaType.id: {
        const accSavings = this.accumulatedProRata(interest, newSavingsList, proRataDay);
        accumulatedSavings += accSavings;
        break;
      }
      case poupancaNovaWithSelicType.value: {
        const { dateStartInterest, dateEndInterest } = this.initializeInterest(interest);
        const trList = [];
        const dateNcc = moment('01/05/2012', dateFormatEnum.DEFAULT);
        const { dateStartInterestOneDay, dateEndInterestOneDay } = this.initializeInterest(interest);

        const dateStartIsSameDateEnd = dateStartInterestOneDay.isSame(dateEndInterestOneDay);
        const initialInterestIndexes: InterestIndexesImp = {
          selic: [],
          savings: [],
          tr: [],
          newSavings: [],
          newSavingsDaily: [],
        };

        const result = interestIndexes || initialInterestIndexes;

        for (const newSaving of result.newSavings) {
          const newSavingsDate = moment(newSaving.date, 'YYYY-MM-DD');

          if (
            newSavingsDate.isSameOrAfter(dateNcc) &&
            newSavingsDate.isSameOrAfter(dateStartInterest) &&
            newSavingsDate.isBefore(dateEndInterest)
          )
            newSavingsList.push(newSaving);
        }

        for (const tr of result.tr) {
          const trDate = moment(tr.date, 'YYYY-MM-DD');
          if (
            trDate.isSameOrAfter(dateNcc) &&
            trDate.isSameOrAfter(dateStartInterest) &&
            trDate.isBefore(dateEndInterest)
          )
            trList.push(tr);
        }

        let trIndex = 0;
        for (let i = 0; i < newSavingsList.length; i++) {
          const savingPercentual = Number(newSavingsList[i].percentual) / 100;
          const dateSaving = moment(newSavingsList[i].date, 'YYYY-MM-DD');
          const tr = trList[trIndex];
          if (tr) {
            const dateTr = moment(tr.date, 'YYYY-MM-DD');
            const isSameDate = dateTr.isSame(dateSaving);

            const trPercentual = Number(tr.percentual) / 100;

            if (isSameDate) {
              const roundFourDecimalCase = 10000;
              const percentageTotal = ((savingPercentual + 1) / (trPercentual + 1) - 1) * 100;
              const diff = Math.round(percentageTotal * roundFourDecimalCase) / roundFourDecimalCase;
              const dateTrIsSamedateStartInterest = dateStartInterestOneDay.isSame(dateTr);
              const dateTrIsSamedateEndInterest = dateEndInterestOneDay.isSame(dateTr);

              if ((dateTrIsSamedateStartInterest && dateStartIsSameDateEnd) || dateTrIsSamedateEndInterest) {
                const day = Number(dateEndInterest.format('DD'));
                const daysInMonth = dateEndInterest.daysInMonth();
                accumulatedSavings += (day - 1) * (diff / daysInMonth);
              } else if (proRataDay && dateTrIsSamedateStartInterest) {
                const day = Number(dateStartInterest.format('DD'));
                const daysInMonth = dateStartInterestOneDay.daysInMonth();
                const diffOfDays = daysInMonth - day + 1;
                accumulatedSavings += diffOfDays * (diff / daysInMonth);
              } else {
                accumulatedSavings += diff;
              }

              trIndex++;
            }
            if (trIndex === trList.length) break;
          }
        }

        break;
      }
    }

    accumulatedSelic = Math.round(accumulatedSelic * 10000) / 10000;
    accumulatedByIndicator = Math.round(accumulatedByIndicator * 10000) / 10000;
    accumulatedSavings = Math.round(accumulatedSavings * 10000) / 10000;

    return {
      accumulatedSavings,
      accumulatedSelic,
      accumulatedByIndicator,
    };
  }
}
