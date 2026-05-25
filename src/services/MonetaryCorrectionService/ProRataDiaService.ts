import 'moment/locale/pt-br';
import { AdministrativeNatureCorrectionImp } from '@/interfaces/calculations/MonetaryCorrectionParamsImp';
import MemCalcImp from '@/interfaces/MemCalcImp';
import AccountImp from '@/interfaces/AccountImp';
import PurgeItemImp from '@/interfaces/calculations/PurgeItemImp';
import { currencyValue } from '@/enums/CurrencyValue';
import { getCoin } from '@/utils/numberUtils';
import moment, { Moment, months } from 'moment';
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

export default class ProRataDiaService {
  protected account?: AccountImp;
  protected dateStart: Moment = moment('1964-01-01');
  protected dateEnd: Moment = moment();
  protected lastValueUsed = 0;
  protected lastFactorCapitalized = 10000;
  protected detailedMap = new Map<string, string>();
  protected coinConversions: number[] = [];
  protected administrativeNatureCorrection: AdministrativeNatureCorrectionImp[] = [];
  protected convertedValue = 0;
  protected factorTotal = 10000;
  protected purgesApplied: PurgeItemImp[] = [];
  protected purgesCalculated: PurgeItemImp[] = [];

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
  }: {
    memCalcs: MemCalcImp[];
    currentMemCalcIndex: number;
    indicadorDadoMap: Map<string, number>;
  }) {
    const dateStartOneDay = moment(this.dateStart?.format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);
    const dateEndOneDay = moment(this.dateEnd?.format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);

    const memCalc = memCalcs[currentMemCalcIndex];
    const mecNome = memCalc.mecnome;

    const { indicadorDado: currentIndicadorDado } = memCalc;
    if (!currentIndicadorDado) return;

    const currentIndicadorDadoLenght = currentIndicadorDado.length;
    let dateEndIsSameCurrentDate = false;
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

      const nextDate = moment(currentDate.format('YYYY-MM-01')).add(1, 'month');
      const detailConversion = this.doConversion(nextDate.format('YYYY-MM-01'));

      const isExistDetail = detailConversion !== 1;
      if (isExistDetail) this.coinConversions.push(detailConversion);

      const lastValue = this.factorTotal;

      let newInaPercentual = inapercentual;

      const daysInMonth = currentDate.daysInMonth();

      const currentDateSymbol = currentDate.format(dateFormatEnum.DEFAULT);
      let currentDateSymbolDetailed = currentDate.format(dateFormatEnum.DEFAULT);

      const proRataDayFormat = this.account?.proRataDay ? dateFormatEnum.DEFAULT : dateFormatEnum.MONTH_AND_YEAR;

      const percentage = inapercentual / 100;
      if (dateStartOneDay.isSame(currentDate)) {
        const fatProRata = Math.pow(1 + percentage, 1 / daysInMonth);
        const startDay = Number(this.dateStart.format('DD'));
        newInaPercentual = (Math.pow(fatProRata, this.dateStart?.daysInMonth() - (startDay - 1)) - 1) * 100;
        currentDateSymbolDetailed = this.dateStart.format(proRataDayFormat);
      }

      const isSameEndDate = dateEndOneDay.isSame(currentDate);
      if (isSameEndDate) {
        dateEndIsSameCurrentDate = true;
        const isCalcOnePercent = this.account?.onePercentSelic;
        const fatProRata = Math.pow(1 + (isCalcOnePercent ? 1 / 100 : percentage), 1 / daysInMonth);
        let endDay = Number(this.dateEnd.format('DD'));

        if (this.dateEnd.format(dateFormatEnum.MONTH_AND_YEAR) == this.dateStart.format(dateFormatEnum.MONTH_AND_YEAR))
          endDay -= Number(this.dateStart.format('DD')) - 1;

        for (let index = 0; index < this.administrativeNatureCorrection.length; index++) {
          const element = this.administrativeNatureCorrection[index];

          const isWithoutCorrection = element?.isWithoutCorrection;
          if (isWithoutCorrection) {
            const selicEnd = moment(element.selicEndDate).utc();
            const isBetweenSelicRange =
              selicEnd.isSameOrAfter(this.dateStart) &&
              selicEnd.isSameOrBefore(this.dateEnd) &&
              this.dateEnd.format(dateFormatEnum.MONTH_AND_YEAR) == selicEnd.format(dateFormatEnum.MONTH_AND_YEAR);

            if (isBetweenSelicRange) endDay -= Number(selicEnd.format('DD')) - 1;
          }
        }

        newInaPercentual = (Math.pow(fatProRata, endDay - 1) - 1) * 100;
        currentDateSymbolDetailed = this.dateEnd.format(proRataDayFormat);
      }

      this.factorTotal *= (1 + newInaPercentual / 100) / detailConversion;

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

          const isBetweenSelicRange =
            currentDate.isSameOrAfter(selicStart) &&
            currentDate.isSameOrBefore(selicEnd) &&
            selicEnd.isSameOrAfter(this.dateStart) &&
            this.dateEnd.isSameOrBefore(selicEnd);

          if (isBetweenSelicRange) this.factorTotal = lastValue;
        }
      }

      indicadorDadoMap.set(currentDateSymbol, this.factorTotal);

      this.detailedMap.set(
        currentDateSymbolDetailed,
        JSON.stringify({
          coin: getCoin(currentDateSymbolDetailed, 0),
          conversion: detailConversion,
          index: isSameEndDate && this.account?.onePercentSelic ? '1%' : currentIndicator.inanome,
          indexUsed: currentIndicator.inaid,
          value: this.factorTotal,
        })
      );

      const isCalcOnePercent =
        currentIndicadorDadoIndex == currentIndicadorDadoLenght - 1 &&
        !dateEndIsSameCurrentDate &&
        this.account?.onePercentSelic;

      if (isCalcOnePercent) {
        const currentPercentage = 1 / 100;
        const dateEndSymbol = this.dateEnd.format(dateFormatEnum.ONE_DAY);
        const dateEndSymbolDetailed = this.dateEnd.format(dateFormatEnum.DEFAULT);

        const fatProRata = Math.pow(1 + currentPercentage, 1 / daysInMonth);
        const endDay = Number(this.dateEnd.format('DD'));
        newInaPercentual = (Math.pow(fatProRata, endDay - 1) - 1) * 100;
        currentDateSymbolDetailed = this.dateEnd.format(proRataDayFormat);
        this.factorTotal *= (1 + newInaPercentual / 100) / detailConversion;

        indicadorDadoMap.set(dateEndSymbol, this.factorTotal);
        this.detailedMap.set(
          dateEndSymbolDetailed,
          JSON.stringify({
            coin: getCoin(dateEndSymbol, 0),
            factor: this.factorTotal,
            conversion: detailConversion,
            index: '1%',
            indexUsed: currentIndicator.inaid,
            value: this.factorTotal,
          })
        );
      }
    }
    return;
  }

  public calculateFactors(params: MonetaryCorrectionCalculateImp): CalculateResponseImp {
    let factorTotal = 10000;

    if (params.administrativeNatureCorrection)
      this.administrativeNatureCorrection = params.administrativeNatureCorrection;

    this.account = params.account;

    const indicadorDado: [string, number][] = [];
    const indicadorDadoMap = new Map<string, number>();

    const dateStartMoment = moment(params.date, dateFormatEnum.DEFAULT);
    const dateEndMoment = moment(params.account.updateTo, dateFormatEnum.DEFAULT);

    const dateStart = dateStartMoment.format(dateFormatEnum.AMERICAN_DATE);
    const dateEnd = dateEndMoment.format(dateFormatEnum.AMERICAN_DATE);

    this.dateStart = dateStartMoment;
    this.dateEnd = dateEndMoment;

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
        indicadorDado.push([monthSymbol, factorTotal]);
        this.detailedMap.set(
          monthSymbol,
          JSON.stringify({
            coin: getCoin(monthSymbol, 0),
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
      moment(dateEnd).format('YYYY-MM-DD'),
      params.memCalcs
    );

    this.factorTotal = 10000;

    for (let currentMemCalcIndex = 0; currentMemCalcIndex < memCalcsFiltered?.length; currentMemCalcIndex++) {
      this.calculateMemCalc({
        memCalcs: memCalcsFiltered,
        currentMemCalcIndex,
        indicadorDadoMap,
      });
    }

    return {
      indicadorDado: Array.from(indicadorDadoMap),
      detailed: Array.from(this.detailedMap),
    };
  }
}
