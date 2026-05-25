import { typeCapitalized, typeSummed } from '@data/calculations/nccRulesOptions';
import IndicadorDadoHasMemTabImp from '@interfaces/IndicadorDadoHasMemTabImp';
import MemCalcImp from '@interfaces/MemCalcImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import moment from 'moment';
import BaseTransitive from '../BaseTransitive';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { formatPeriodPercentage, formatResult } from '@/services/InterestService/CalculateSimpleInterest';
import { filterMemCalcsByDateRange } from '@/utils/filterMemCalcsByDateRange';

export default class SelectIndex extends BaseTransitive {
  constructor() {
    super();
  }
  private getIndicadordado(
    interest: MonetaryInterestImp,
    allMemcalcs: {
      [key: number]: MemCalcImp[];
    }
  ) {
    const memCalcs = allMemcalcs?.[Number(interest.index)];
    const memCalcsFiltered = filterMemCalcsByDateRange(
      moment(
        moment(interest.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.ONE_DAY),
        dateFormatEnum.ONE_DAY
      ).format(dateFormatEnum.AMERICAN_DATE),
      moment(interest.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.AMERICAN_DATE),
      memCalcs
    );

    const indicadorDado: IndicadorDadoHasMemTabImp[] = [];

    let name = '';
    for (let index = 0; index < memCalcsFiltered.length; index++) {
      const element = memCalcsFiltered[index];

      if (element.indicadorDado) indicadorDado.push(...element.indicadorDado);
      name = element.indicador.indnome;
    }

    return { indicadorDado, name };
  }

  private capitalized(
    interest: MonetaryInterestImp,
    allMemcalcs: {
      [key: number]: MemCalcImp[];
    }
  ) {
    try {
      const { indicadorDado, name } = this.getIndicadordado(interest, allMemcalcs);
      const { dateStartInterest, dateEndInterest } = this.initializeInterest(interest);
      const { capitalizedByIndicator } = this.capitalizedIndexes(interest, {} as InterestIndexesImp, indicadorDado);

      const indexTotal = capitalizedByIndicator || 0;

      const time = ((indexTotal ? indexTotal / 100 + 1 : 1) - 1) * 100;

      const periods = [];

      periods.push({
        from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
        to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(time),
        nomenclature: `${name.toLowerCase()} capitalizado(a)`,
        calculated: formatResult(time),
      });

      return {
        time,
        percentage: {
          savings: 0,
          selic: 0,
          pointFive: 0,
          one: 0,
        },
        periods,
      };
    } catch (error) {
      throw error;
    }
  }

  private summed(
    interest: MonetaryInterestImp,
    allMemcalcs: {
      [key: number]: MemCalcImp[];
    },
    proRataDay?: boolean
  ) {
    try {
      const { indicadorDado, name } = this.getIndicadordado(interest, allMemcalcs);
      const { dateStartInterest, dateEndInterest } = this.initializeInterest(interest);
      const { accumulatedByIndicator } = this.accumulatedIndexes(
        interest,
        {} as InterestIndexesImp,
        indicadorDado,
        proRataDay
      );
      const time = accumulatedByIndicator || 0;

      const periods = [];

      periods.push({
        from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
        to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(time),
        nomenclature: `${name.toLowerCase()} somado(a)`,
        calculated: formatResult(time),
      });

      return {
        time,
        percentage: {
          savings: 0,
          selic: 0,
          pointFive: 0,
          one: 0,
        },
        periods,
      };
    } catch (error) {
      throw error;
    }
  }

  public run(
    interest: MonetaryInterestImp,
    allMemcalcs: {
      [key: number]: MemCalcImp[];
    },
    proRataDay?: boolean
  ) {
    try {
      const { indicadorDado, name } = this.getIndicadordado(interest, allMemcalcs);
      const lastIndex = indicadorDado[indicadorDado.length - 1];

      const dateEnd = moment(interest.dateEnd, dateFormatEnum.DEFAULT);
      if (lastIndex) {
        const lastDate = moment(
          moment(lastIndex.inadata).add(1, 'day').format(dateFormatEnum.MONTH_AND_YEAR),
          dateFormatEnum.DEFAULT
        ).utc();

        if (
          moment(dateEnd.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR).isAfter(
            moment(lastDate.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR)
          )
        )
          throw `Dados do '${name.toUpperCase()}' disponíveis somente até ${lastDate
            .format(dateFormatEnum.MONTH_AND_YEAR_EXTENSE)
            .toUpperCase()}`;
      }

      const initerestMenu = () => {
        switch (interest.formula) {
          case typeCapitalized.value:
            return this.capitalized(interest, allMemcalcs);
          case typeSummed.value:
            return this.summed(interest, allMemcalcs, proRataDay);
          default:
            return this.summed(interest, allMemcalcs, proRataDay);
        }
      };

      const response = initerestMenu();

      return response;
    } catch (error) {
      throw error;
    }
  }
}
