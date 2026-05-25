import 'moment/locale/pt-br';
import { AdministrativeNatureCorrectionImp } from '@/interfaces/calculations/MonetaryCorrectionParamsImp';
import MemCalcImp from '@/interfaces/MemCalcImp';
import AccountImp from '@/interfaces/AccountImp';
import PurgeItemImp from '@/interfaces/calculations/PurgeItemImp';
import { currencyValue } from '@/enums/CurrencyValue';
import IDummyObject from '@/interfaces/IDummyObject';
import { getCoin } from '@/utils/numberUtils';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { filterMemCalcsByDateRange } from '@/utils/filterMemCalcsByDateRange';
import { MonetaryCorrectionCalculateImp } from '@/interfaces/calculations/CorrectionImp';

interface CalculateResponseImp {
  indicadorDado: [string, number][];
  detailed: [string, string][];
}

export interface GetFactorsResponseImp {
  indicadorDado: [string, number][];
  detailed: [string, string][];
}

export interface IRecalculate {
  date: Date;
  account: AccountImp;
  value: number;
  detailed: boolean;
  memCalcs: MemCalcImp[];
  administrativeNatureCorrection?: AdministrativeNatureCorrectionImp;
}

export default class BaseService {
  protected account?: AccountImp;
  protected lastValueUsed = 0;
  protected lastFactorCapitalized = 10000;
  protected detailedMap = new Map<string, string>();
  protected coinConversions: number[] = [];
  protected administrativeNatureCorrection: AdministrativeNatureCorrectionImp[] = [];
  protected convertedValue = 0;
  protected factorTotal = 10000;
  protected purgesApplied: PurgeItemImp[] = [];
  protected purgesCalculated: PurgeItemImp[] = [];
  protected dateEnd: moment.Moment = moment();
  private doConversion(dateToConversion: string) {
    const conversionsDate = [
      {
        date: moment('1942-11-01', 'YYYY-MM-DD'),
        value: currencyValue.DEFAULT,
      },
      {
        date: moment('1967-02-01', 'YYYY-MM-DD'),
        value: currencyValue.DEFAULT,
      },
      {
        date: moment('1986-03-01', 'YYYY-MM-DD'),
        value: currencyValue.DEFAULT,
      },
      {
        date: moment('1989-01-01', 'YYYY-MM-DD'),
        value: currencyValue.DEFAULT,
      },
      {
        date: moment('1993-08-01', 'YYYY-MM-DD'),
        value: currencyValue.DEFAULT,
      },
      {
        date: moment('1994-07-01', 'YYYY-MM-DD'),
        value: currencyValue.CRUZEIRO_REAL,
      },
    ];
    const converted = conversionsDate.find(conversion =>
      moment(dateToConversion, 'YYYY-MM-DD').isSame(conversion.date)
    );

    if (!converted) return 1;

    this.convertedValue /= converted.value;

    return converted.value;
  }

  protected getWitchCacheName(account: AccountImp) {
    let initialString = `@indicator_${account.indexId}@`;

    if (account.positive) initialString = `${initialString}positive@`;
    else initialString = `${initialString}negative@`;
    if (account.proRataDay) initialString = `${initialString}pro_rata_day@`;
    else if (account.proRataOtn) initialString = `${initialString}pro_rata_otn@`;

    return initialString;
  }

  private applyPurges(date: moment.Moment, mecList: MemCalcImp[], mecIndex: number) {
    const purge = this.purgesApplied.find(purgeApplied => moment(purgeApplied.date).isSame(date));
    if (!purge) return;

    if (moment(date).isSame(moment('1991-02-01')) && mecList[mecIndex].mecunidade === 'V') return null;

    return purge;
  }

  private calculateMemCalc({
    memCalcs,
    currentMemCalcIndex,
    indicadorDadoMap,
    accPercent,
  }: {
    memCalcs: MemCalcImp[];
    currentMemCalcIndex: number;
    indicadorDadoMap: Map<string, number>;
    accPercent: number;
  }) {
    const memCalc = memCalcs[currentMemCalcIndex];
    const mecNome = memCalc.mecnome;
    const mecFormula = memCalc.mecformula;

    const { indicadorDado: currentIndicadorDado } = memCalc;
    if (!currentIndicadorDado) throw 'not found indicadorDado';

    const currentIndicadorDadoLenght = currentIndicadorDado.length;

    const isFirstIteration = currentMemCalcIndex === 0;
    if (isFirstIteration) {
      const indicator = currentIndicadorDado[currentMemCalcIndex];
      if (!indicator) throw new Error('not found indicator');
      const firstIndicatorDate = moment(indicator.inadata).format(dateFormatEnum.ONE_DAY);
      const firstIndicatorDateDetailed = moment(indicator.inadata).format(
        this.account?.proRataDay ? dateFormatEnum.ONE_DAY : dateFormatEnum.MONTH_AND_YEAR
      );

      indicadorDadoMap.set(firstIndicatorDate, this.factorTotal);
      this.detailedMap.set(
        firstIndicatorDateDetailed,
        JSON.stringify({
          coin: getCoin(firstIndicatorDateDetailed, 0),
          factor: this.factorTotal,
          conversion: 1,
          index: indicator.inanome,
          indexUsed: indicator.inaid,
          value: this.factorTotal,
        })
      );
    }

    const ONE_NUMBER = 1;
    let nextDateIsSameDateEnd = false;
    let lastDateSymbol = moment(currentIndicadorDado[0].inadata).utc().format(dateFormatEnum.ONE_DAY);

    for (
      let currentIndicadorDadoIndex = 0;
      currentIndicadorDadoIndex < currentIndicadorDadoLenght;
      currentIndicadorDadoIndex++
    ) {
      const currentIndicator = currentIndicadorDado[currentIndicadorDadoIndex];

      const currentDate: moment.Moment = moment(currentIndicator.inadata).utc();

      let inapercentual = Number(Number(currentIndicator.inapercentual).toFixed(4));

      const inadataString: string = currentDate.format('YYYY-MM-DD');
      const isExistPurge = this.purgesApplied?.length;
      const isOnlyPositive = this.account?.positive && inapercentual < 0;
      if (isOnlyPositive) inapercentual = 0;

      if (isExistPurge) {
        const exp = this.applyPurges(moment(inadataString, 'YYYY-MM-DD').utc(), memCalcs, currentMemCalcIndex);

        if (exp) {
          this.purgesCalculated.push(exp);
          inapercentual = Number(exp.value);
        }

        const isProRataOtn =
          !this.account?.proRataOtn && mecNome === 'OTN' && !currentDate.isAfter(moment('1987-02-01', 'YYYY-MM-DD'));

        if (isOnlyPositive || isProRataOtn) inapercentual = 0;
      }

      const nextDate = moment(currentIndicator.inadata).add(1, 'month').utc();

      const detailConversion = this.doConversion(nextDate.format('YYYY-MM-01'));

      const isExistDetail = detailConversion !== 1;
      if (isExistDetail) this.coinConversions.push(detailConversion);

      const lastValue = this.factorTotal;

      switch (mecFormula) {
        case 'S': {
          accPercent = accPercent + Number(inapercentual.toFixed(2));
          this.factorTotal = this.lastFactorCapitalized * (ONE_NUMBER + accPercent / 100);
          this.factorTotal = this.factorTotal / detailConversion;
          break;
        }

        default: {
          const lastDate: moment.Moment = moment(currentIndicadorDado[currentIndicadorDadoLenght - 1].inadata).utc();
          nextDateIsSameDateEnd =
            nextDateIsSameDateEnd ||
            currentDate.format(dateFormatEnum.ONE_DAY).includes(lastDate.format(dateFormatEnum.ONE_DAY));

          const currentPercentage = inapercentual / 100;
          const currentFactor = currentPercentage + ONE_NUMBER;
          this.factorTotal = (currentFactor * lastValue) / detailConversion;
          this.lastFactorCapitalized = this.factorTotal;

          break;
        }
      }

      const nextDateSymbol = nextDate.format(dateFormatEnum.ONE_DAY);
      const currentDateSymbolDetailed = currentDate.format(dateFormatEnum.MONTH_AND_YEAR);

      for (let index = 0; index < this.administrativeNatureCorrection.length; index++) {
        const element = this.administrativeNatureCorrection[index];

        const isWithoutCorrection = element?.isWithoutCorrection;

        if (isWithoutCorrection) {
          console.warn('is_without_correction');
          const selicStart = moment(
            moment(element.selicStartDate).utc().format(dateFormatEnum.ONE_DAY),
            dateFormatEnum.ONE_DAY
          );
          const selicEnd = moment(
            moment(element.selicEndDate).utc().format(dateFormatEnum.ONE_DAY),
            dateFormatEnum.ONE_DAY
          );

          const isBetweenSelicRange = currentDate.isSameOrAfter(selicStart) && currentDate.isSameOrBefore(selicEnd);
          if (isBetweenSelicRange) this.factorTotal = lastValue;
        }
      }

      lastDateSymbol = nextDateSymbol;

      indicadorDadoMap.set(nextDateSymbol, this.factorTotal);
      this.detailedMap.set(
        currentDateSymbolDetailed,
        JSON.stringify({
          coin: getCoin(nextDateSymbol, 0),
          factor: this.factorTotal,
          conversion: detailConversion,
          index: this.account?.onePercentSelic && nextDateIsSameDateEnd ? '1%' : currentIndicator.inanome,
          indexUsed: currentIndicator.inaid,
          value: this.factorTotal,
        })
      );
    }

    const onePercentSelic = this.account?.onePercentSelic;

    if (onePercentSelic) {
      console.warn('one_percent');
      const currentPercentage = 1 / 100;
      const currentFactor = currentPercentage + ONE_NUMBER;
      const lastDateSymbolDetailed = moment(lastDateSymbol, dateFormatEnum.DEFAULT).format(
        dateFormatEnum.MONTH_AND_YEAR
      );

      this.factorTotal = (currentFactor * this.factorTotal) / 1;

      indicadorDadoMap.set(lastDateSymbol, this.factorTotal);
      this.detailedMap.set(
        lastDateSymbolDetailed,
        JSON.stringify({
          coin: getCoin(lastDateSymbol, 0),
          factor: this.factorTotal,
          conversion: 1,
          index: '1%',
          indexUsed: currentIndicadorDado[currentIndicadorDadoLenght - 1].inaid,
          value: this.factorTotal,
        })
      );
    }

    return;
  }

  public calculateFactors(params: MonetaryCorrectionCalculateImp): CalculateResponseImp {
    const accPercent = 0;
    let factorTotal = 10000;

    if (params.administrativeNatureCorrection)
      this.administrativeNatureCorrection = params.administrativeNatureCorrection;

    this.account = params.account;
    this.dateEnd = moment(this.account?.updateTo, dateFormatEnum.DEFAULT);
    const dateEnd = this.dateEnd.format(dateFormatEnum.AMERICAN_DATE);

    const indicadorDado: [string, number][] = [];
    const indicadorDadoMap = new Map<string, number>();

    const dateStart = moment(params.date, dateFormatEnum.DEFAULT).format(dateFormatEnum.AMERICAN_DATE);

    const isWithoutCorrection = params.account?.indexId === -1;

    if (isWithoutCorrection || !params.memCalcs.length) {
      const a = moment(dateStart).utc();
      const dateMonth = moment(dateEnd || new Date())
        .utc()
        .format('YYYY-MM-01');
      const b = moment(dateMonth).utc();

      for (let mounth = a; mounth.isBefore(b); mounth.add(1, 'month')) {
        const inadataString: string = mounth.format('YYYY-MM-01');
        const detailConversion = this.doConversion(inadataString);
        factorTotal = factorTotal / detailConversion;

        const monthSymbol = mounth.format(dateFormatEnum.ONE_DAY);
        const monthSymbolDetailed = mounth.format(
          this.account?.proRataDay ? dateFormatEnum.ONE_DAY : dateFormatEnum.MONTH_AND_YEAR
        );
        indicadorDado.push([monthSymbol, factorTotal]);
        this.detailedMap.set(
          monthSymbolDetailed,
          JSON.stringify({
            coin: getCoin(monthSymbolDetailed, 0),
            factor: 0,
            conversion: detailConversion,
            index: 'Sem Correção',
            indexUsed: -1,
            value: factorTotal,
          })
        );
      }
      return { indicadorDado, detailed: Array.from(this.detailedMap) };
    }

    if (!params.memCalcs.length) throw new Error('not found memCalc');
    if (this.account?.purges?.length) this.purgesApplied = this.account.purges;

    const memCalcsFiltered = filterMemCalcsByDateRange(
      moment(dateStart).format('YYYY-MM-01'),
      moment(dateEnd).format('YYYY-MM-01'),
      params.memCalcs
    );

    for (let currentMemCalcIndex = 0; currentMemCalcIndex < memCalcsFiltered?.length; currentMemCalcIndex++) {
      this.calculateMemCalc({
        memCalcs: memCalcsFiltered,
        currentMemCalcIndex,
        indicadorDadoMap,
        accPercent,
      });
    }
    return {
      indicadorDado: Array.from(indicadorDadoMap),
      detailed: Array.from(this.detailedMap),
    };
  }
}
