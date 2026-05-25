import MemCalcImp from '@/interfaces/MemCalcImp';
import moment from 'moment';

export function filterMemCalcsByDateRange(dateStart: string, dateEnd: string, memCalcs: MemCalcImp[]): MemCalcImp[] {
  function dateCompare(param1: { date: string }, param2: { date: string }) {
    const dateA = moment(param1.date).utc();
    const dateB = moment(param2.date).utc();

    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
  }

  const filteredMemCalcs = memCalcs
    .map((memCalc: MemCalcImp) => {
      const filteredIndicadorDado = memCalc.indicadorDado
        ?.filter(indicadorDado => {
          const indicadorDate = moment(indicadorDado.inadata).utc();
          const _dateStart = moment(dateStart).utc();
          const _dateEnd = moment(dateEnd).utc();
          const mecStart = moment(memCalc.mecstarta).utc();

          return (
            indicadorDate.isSameOrAfter(mecStart) &&
            indicadorDate.isSameOrAfter(_dateStart) &&
            indicadorDate.isBefore(_dateEnd)
          );
        })
        .sort((a, b) => dateCompare({ date: a.inadata }, { date: b.inadata }));

      return {
        ...memCalc,
        indicadorDado: filteredIndicadorDado,
      };
    })
    .filter((memCalc: MemCalcImp) => memCalc.indicadorDado?.length || 0 > 0);

  return filteredMemCalcs;
}
