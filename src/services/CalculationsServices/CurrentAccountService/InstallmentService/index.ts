import CurrentOccurrenceImp from '@/interfaces/calculations/CurrentOccurrenceImp';
import MonetaryCorrectionService from '@/services/MonetaryCorrectionService';
import { AllMemcalcsImp } from '../AccountService';
import { initialAccount } from '@/hooks/currentAccount';
import { typeinstallment, typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import ViewOccorrenceImp from '@/interfaces/calculations/ViewOccorrenceImp';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';
interface CorrectionImp {
  indexId: number;
  from: string;
  updateTo: string;
  value: number;
}

export default class InstallmentService {
  protected total = 0;
  protected allMemcalcs: AllMemcalcsImp = {} as AllMemcalcsImp;
  protected views: ViewOccorrenceImp[] = [];
  protected indexId: number = -1;

  constructor(allMemcalcs: AllMemcalcsImp, indexId: number, views: ViewOccorrenceImp[]) {
    this.allMemcalcs = allMemcalcs;
    this.indexId = indexId;
    this.views = views;
  }

  protected correction(values: CorrectionImp) {
    const monetaryCorrectionService = new MonetaryCorrectionService();
    const memCalcs = this.allMemcalcs[values.indexId];

    const correction = monetaryCorrectionService.calculate({
      account: { ...initialAccount.current, indexId: values.indexId, updateTo: values.updateTo },
      date: values.from,
      value: values.value,
      memCalcs,
    });

    this.total += correction.value;
    return correction.value;
  }

  private filter() {
    return {
      installments: this.views.filter(occ => occ.type.includes(typeinstallment.id)),
      interests: this.views.filter(occ => occ.type === typeInterest.id),
    };
  }

  public calculate(occurrenceDate: string) {
    const { installments, interests } = this.filter();

    if (installments.length == 1) {
      const installment = installments[0];
      const interest = interests.filter(
        interest =>
          moment(interest.date, dateFormatEnum.DEFAULT).isSameOrAfter(
            moment(installment.date, dateFormatEnum.DEFAULT)
          ) &&
          moment(interest.dateEnd, dateFormatEnum.DEFAULT).isSameOrBefore(
            moment(occurrenceDate, dateFormatEnum.DEFAULT)
          )
      );

      if (installment.date && occurrenceDate)
        this.correction({
          from: installment.date,
          updateTo: occurrenceDate,
          indexId: this.indexId,
          value: installment.value,
        });

      for (let index = 0; index < interest.length; index++) {
        const element = interest[index];
      }

      return this.total;
    }

    for (let key = 0; key < installments.length - 1; key++) {
      const installment = installments[key];
      const nextInstallment = installments[key + 1];
      const interest = interests.filter(
        interest =>
          moment(interest.date, dateFormatEnum.DEFAULT).isSameOrAfter(
            moment(installment.date, dateFormatEnum.DEFAULT)
          ) &&
          moment(interest.dateEnd, dateFormatEnum.DEFAULT).isSameOrBefore(
            moment(nextInstallment.date, dateFormatEnum.DEFAULT)
          )
      );

      if (installment.date && nextInstallment.date)
        this.correction({
          from: installment.date,
          updateTo: nextInstallment.date,
          indexId: this.indexId,
          value: installment.value,
        });

      for (let index = 0; index < interest.length; index++) {
        const element = interest[index];
      }
    }

    return this.total;
  }
}
