import _ from 'lodash';

import MonetaryCorrectionService from '../../../MonetaryCorrectionService';
import { AllMemcalcsImp, calcPercentage } from '../AccountService';
import CalculateInterest, { CalculateInterestImp } from '@/services/InterestService';
import TransitiveInterestService from '@/services/TransitiveInterestService';
import { initialAccount } from '@/hooks/currentAccount';
import MonetaryInterestImp from '@/interfaces/calculations/MonetaryInterestImp';
import { initialInterest } from '@/services/TransitiveInterestService/Savings';
import { InterestTypesWithPeriodAndFine, typeDefault } from '@/data/calculations/interestTypes';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import ViewOccorrenceImp from '@/interfaces/calculations/ViewOccorrenceImp';
import { getCoin } from '@/utils/numberUtils';
import { typeCorrection, typeFeeQC, typeFeeSM, typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import { valueWithCurrency } from '@/lib/currency';
import InterestsFineService from '../InterestsFineService';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import MemCalcImp from '@/interfaces/MemCalcImp';
import INomenclature from '@/interfaces/NomenclatureImp';
import { getFieldName } from '@/lib/nomenclature';
import { labelsEnum } from '@/enums/labelsEnum';
import { CurrentTypes } from '@/data/calculations/currentTypes';
import Decimal from 'decimal.js';
import LawImp from '@/interfaces/Law';
import { doConversion } from '@/utils/conversionHelper';

export interface CorrectionImp {
  indexId: number;
  from: string;
  updateTo: string;
  value: number;
  proRataDay: boolean;
}
export default class FeeNewCpcService {
  protected interest = initialInterest;
  protected total = 0;
  protected views: ViewOccorrenceImp[] = [];
  protected balance = 0;
  protected interestTotal = 0;
  protected interestResult: CalculateInterestImp = {} as CalculateInterestImp;
  protected indexName = '';
  protected nomenclatures: INomenclature[] = [];
  protected type?: CurrentTypes;
  protected interestIndexesFromLaw: LawImp[] = [];

  constructor({
    balance,
    interestTotal,
    nomenclatures,
    views,
    type,
    interestIndexesFromLaw,
  }: {
    type: CurrentTypes;
    views?: ViewOccorrenceImp[];
    balance?: number;
    interestTotal?: number;
    nomenclatures?: INomenclature[];
    interestIndexesFromLaw: LawImp[];
  }) {
    this.interestIndexesFromLaw = interestIndexesFromLaw;
    if (views) this.views = views;
    if (balance) this.balance = balance;
    if (type) this.type = type;
    if (interestTotal) {
      this.interestTotal = interestTotal;
      if (type.includes('current-account')) this.balance += interestTotal;
    }
    if (nomenclatures) this.nomenclatures = nomenclatures;
  }
  public correction(values: CorrectionImp, allMemcalcs: AllMemcalcsImp) {
    const monetaryCorrectionService = new MonetaryCorrectionService();
    const memCalcs = allMemcalcs[values.indexId] || [[]];
    this.indexName = memCalcs[0].indicador.indnome || 'não selecionado';

    const correction = monetaryCorrectionService.calculate({
      account: {
        ...initialAccount.current,
        indexId: values.indexId,
        updateTo: values.updateTo,
        proRataDay: values.proRataDay,
      },
      date: values.from,
      value: values.value,
      memCalcs,
    });

    this.total += correction.value - values.value;
    return correction.value;
  }

  private detailsquantiacerta(
    interest: MonetaryInterestImp,
    correction: CorrectionImp,
    correctionValue: number,
    viewDescription: string
  ) {
    const feeView: ViewOccorrenceImp = {
      balance: this.balance,
      updateSince: correction.from,
      dateEnd: correction.updateTo,
      date: correction.from,
      description: viewDescription,
      currency: getCoin(correction.updateTo, 0),
      tax: null,
      type: typeFeeQC.id,
      selectType: interest.type,
      isCorrection: false,
      interestBalance: 0,
      value: this.total,
      total: this.balance + this.interestTotal,
    };

    const mainValue = doConversion(correction.value, correction.from, correction.updateTo);

    this.balance += correctionValue;
    const currency = getCoin(correction.from, 0);
    const currencyEnd = getCoin(correction.updateTo, 0);

    let extraDescription = '';
    const percentage = calcPercentage(correctionValue, correctionValue - mainValue);

    if (correctionValue) {
      extraDescription += `${typeCorrection.label} - (${this.indexName} - ${percentage}%) sobre ${valueWithCurrency(
        currency,
        correction.value
      )} = ${valueWithCurrency(currencyEnd, correctionValue)}\n`;
    }

    this.views.push(feeView);

    const interestsFineService = new InterestsFineService(this.views);
    const description = interestsFineService.generateDescription({
      interestFine: {
        dateEnd: interest.dateEnd,
        dateStart: interest.dateStart,
        formula: interest.formula,
        index: interest.index,
        calculatedInfo: interest.calculatedInfo,
        percentage: interest.percentage,
        capitalization: interest.capitalization,
        periodicity: 'month',
        poupancaType: interest.poupancaType,
        civilCode: interest.civilCode,
        civilCodeDate: interest.civilCodeDate,
        administrativeNatureFirstDate: interest.administrativeNatureFirstDate,
        administrativeNatureSecondDate: interest.administrativeNatureSecondDate,
        administrativeNatureThirdDate: interest.administrativeNatureThirdDate,
        onCompensatoryInterest: interest.onCompensatoryInterest,
        onInterestWithoutCorrection: interest.onInterestWithoutCorrection,
        onCompoundInterest: interest.onCompoundInterest,
        onDefaultInterest: interest.onDefaultInterest,
        onInstallmentsValue: interest.onInstallmentsValue,
        onInterestPeriod: interest.onInterestPeriod,
        type: typeInterest.id,
        description: interest.type as InterestTypesWithPeriodAndFine,
        calculated: interest.calculated,
        onTransitiveInterest: true,
        selectType: 'percentage',
        tax: interest.percentage,
        value: interest.percentage,
      },
      periods: this.interestResult.periods,
      result: this.interestResult.result,
      totalPercentage: this.interestResult.totalPercentage,
      totalValue: this.interestResult.value,
      appliedTo: correctionValue,
    });

    this.balance += this.interestResult.result;

    if (this.interestResult.result) {
      extraDescription += `${typeInterest.label} - ${description} \n`;
    }

    feeView.balance = this.balance;
    feeView.interestBalance = this.interestTotal;
    feeView.extraDescription = extraDescription;
    feeView.total = this.balance + this.interestTotal;

    if (feeView.value) {
      this.views.pop();
      this.views.push(feeView);
    }
  }

  public quantiacerta(
    interestParam: MonetaryInterestImp,
    interestIndexes: InterestIndexesImp,
    allMemcalcs: AllMemcalcsImp,
    correction: CorrectionImp,
    description: string
  ) {
    const correctionValue = this.correction(correction, allMemcalcs);

    const calculateInterest = new CalculateInterest();
    const transitiveInterestService = new TransitiveInterestService();
    const mainValue = correction.value;
    const interest: MonetaryInterestImp = {
      ...this.interest,
      type: typeDefault.id,
      dateEnd: interestParam.dateEnd,
      dateStart: interestParam.dateStart,
      formula: interestParam.formula,
      index: interestParam.index,
      percentage: interestParam.percentage,
      calculatedInfo: {
        ...interestParam.calculatedInfo,
        value: this.total + mainValue,
      },
      capitalization: interestParam.capitalization,
      periodicity: interestParam.periodicity,
      poupancaType: interestParam.poupancaType,
      civilCode: interestParam.civilCode,
      civilCodeDate: interestParam.civilCodeDate,
      administrativeNatureFirstDate: interestParam.administrativeNatureFirstDate,
      administrativeNatureSecondDate: interestParam.administrativeNatureSecondDate,
      administrativeNatureThirdDate: interestParam.administrativeNatureThirdDate,
      onCompensatoryInterest: interestParam.onCompensatoryInterest,
      onInterestWithoutCorrection: interestParam.onInterestWithoutCorrection,
      onCompoundInterest: interestParam.onCompoundInterest,
      onDefaultInterest: interestParam.onDefaultInterest,
      onInstallmentsValue: interestParam.onInstallmentsValue,
      onInterestPeriod: interestParam.onInterestPeriod,
    };

    const transitive = interestIndexes
      ? transitiveInterestService.run({
          interest,
          interestIndexes,
          allMemcalcs,
          interestIndexesFromLaw: this.interestIndexesFromLaw,
        })
      : undefined;

    if (transitive) interest.percentage = 1;
    const interestResult = calculateInterest.run(interest, transitive);
    this.interestResult = interestResult;
    this.total += interestResult.result;
    this.total += mainValue;

    if (this.type?.includes('current-account')) this.balance += interestResult.result;

    this.detailsquantiacerta(interestParam, correction, correctionValue, description);

    return { total: this.total, balance: this.balance, interestTotal: this.interestTotal };
  }
  private getMinimumWage = (memCalcs: MemCalcImp[], date: string) => {
    const inavalor = memCalcs[0].indicadorDado?.find(indicator =>
      moment(indicator.inadata).utc().isSame(moment(date, dateFormatEnum.DEFAULT))
    )?.inavalor;
    return inavalor || 0;
  };
  private lines: { [key: string]: number | string }[] = [
    {
      desc0: `${getFieldName(labelsEnum.TO, this.nomenclatures)} 200 Salários (10% - 20%)`,
      valueBase0: 0,
      tax0: 0,
      valueByTax0: 120,
      minValue: 1,
      maxValue: 200,
      minPercentage: 10,
      maxPercentage: 20,
    },
    {
      desc1: `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 200 ${getFieldName(
        labelsEnum.TO,
        this.nomenclatures
      )} 2.000 Salários (8% - 10%)`,
      valueBase1: 0,
      tax1: 0,
      valueByTax1: 0,
      minValue: 200,
      maxValue: 2000,
      minPercentage: 8,
      maxPercentage: 10,
    },
    {
      desc2: `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 2.000 ${getFieldName(
        labelsEnum.TO,
        this.nomenclatures
      )} 20.000 Salários (5% - 8%)`,
      valueBase2: 0,
      tax2: 0,
      valueByTax2: 120,
      minValue: 2000,
      maxValue: 20000,
      minPercentage: 5,
      maxPercentage: 8,
    },
    {
      desc3: `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 20.000 ${getFieldName(
        labelsEnum.TO,
        this.nomenclatures
      )} 100.000 Salários (3% - 5%)`,
      valueBase3: 0,
      tax3: 0,
      valueByTax3: 120,
      minValue: 20000,
      maxValue: 100000,
      minPercentage: 3,
      maxPercentage: 5,
    },
    {
      desc4: `acima ${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 100.000 Salários (1% - 3%)`,
      valueBase4: 0,
      tax4: 0,
      valueByTax4: 120,
      minValue: 100000,
      maxValue: 99999999999999,
      minPercentage: 1,
      maxPercentage: 3,
    },
  ];

  public salariominimo(
    values: {
      tax0: number;
      tax1: number;
      tax2: number;
      tax3: number;
      tax4: number;
      valueBase0: number;
      valueBase1: number;
      valueBase2: number;
      valueBase3: number;
      valueBase4: number;
      valueSM: number;
      indexId: number;
      isCalc: boolean;
      feePercentageRanges: any[];
      total: number;
      date: string;
    },
    memCalcs: MemCalcImp[]
  ) {
    const feePercentageRanges: any[] = Array.from(
      this.lines.map(line => ({
        ...line,
        desc0: `${getFieldName(labelsEnum.TO, this.nomenclatures)} 200 Salários (10% - 20%)`,
        desc1: `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 200 ${getFieldName(
          labelsEnum.TO,
          this.nomenclatures
        )} 2.000 Salários (8% - 10%)`,
        desc2: `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 2.000 ${getFieldName(
          labelsEnum.TO,
          this.nomenclatures
        )} 20.000 Salários (5% - 8%)`,
        desc3: `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 20.000 ${getFieldName(
          labelsEnum.TO,
          this.nomenclatures
        )} 100.000 Salários (3% - 5%)`,
        desc4: `acima ${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} 100.000 Salários (1% - 3%)`,
      }))
    );

    if (!values.isCalc)
      return {
        feePercentageRanges,
        qtdSalary: 0,
        minimumWage: 0,
        balance: this.balance,
        interestTotal: this.interestTotal,
      };

    const minimumWage = this.getMinimumWage(
      memCalcs,
      moment(values.date, dateFormatEnum.DEFAULT).format(dateFormatEnum.ONE_DAY)
    );

    const qtdSalaryResult = Number((values.valueSM / minimumWage).toFixed(2));
    let valueBase = Number(qtdSalaryResult * minimumWage);
    if (valueBase > values.valueSM) valueBase = values.valueSM;

    for (const range in this.lines) {
      const maxValue = Number(feePercentageRanges[range]['maxValue']);

      const qtdSalary = Number(new Decimal(valueBase).div(new Decimal(minimumWage)).toString());
      if (qtdSalary >= maxValue) {
        const value = Number(new Decimal(maxValue).times(new Decimal(minimumWage)).toString());
        feePercentageRanges[range][`valueBase${range}`] = value;
        valueBase -= value;
      } else {
        feePercentageRanges[range][`valueBase${range}`] = valueBase;
        valueBase = 0;
      }
    }

    const _feePercentageRanges = _.cloneDeep(feePercentageRanges);
    for (const range in _feePercentageRanges) {
      const percentage = Number((values as any)[`tax${range}`]);
      const valueBase = Number(_feePercentageRanges[range][`valueBase${range}`]);
      const maxPercentage = Number(_feePercentageRanges[range]['maxPercentage']);
      const minPercentage = Number(_feePercentageRanges[range]['minPercentage']);

      if (percentage >= minPercentage && percentage <= maxPercentage) {
        const total = valueBase * (percentage / 100);
        _feePercentageRanges[range].total = total;
      } else {
        _feePercentageRanges[range].total = 0;
      }
      _feePercentageRanges[range][`tax${range}`] = percentage;
    }

    this.detailsalariominimo(values, _feePercentageRanges, qtdSalaryResult);

    return {
      feePercentageRanges: _feePercentageRanges,
      qtdSalary: qtdSalaryResult,
      minimumWage,
      balance: this.balance,
      interestTotal: this.interestTotal,
    };
  }

  public calculateTotal = (feePercentageRanges: any[]) => {
    const salarioMinimo: number = feePercentageRanges.reduce((acc: any, line: any) => acc + Number(line[`total`]), 0);
    return salarioMinimo;
  };

  public detailsalariominimo(
    values: {
      tax0: number;
      tax1: number;
      tax2: number;
      tax3: number;
      tax4: number;
      valueBase0: number;
      valueBase1: number;
      valueBase2: number;
      valueBase3: number;
      valueBase4: number;
      valueSM: number;
      indexId: number;
      isCalc: boolean;
      feePercentageRanges: any[];
      total: number;
      date: string;
    },
    feePercentageRanges: any[],
    qtdSalary: number
  ) {
    const currency = getCoin(String(values.date), 0);

    const valueSMFormat = valueWithCurrency(currency, values.valueSM);
    let extraDescription = `${getFieldName(labelsEnum.DATE, this.nomenclatures)} Condenação: ${
      values.date
    } ${getFieldName(labelsEnum.VALUE, this.nomenclatures)}: ${valueSMFormat} ( Qtde. Sal. = ${qtdSalary.toFixed(
      2
    )}) \n`;

    for (const range in feePercentageRanges) {
      const total = feePercentageRanges[range].total;
      const valueBase = feePercentageRanges[range][`valueBase${range}`];
      if (total)
        if (Number(range) == 4) {
          extraDescription += `acima ${getFieldName(
            labelsEnum.FROM,
            this.nomenclatures
          ).toLowerCase()} 100.000 Salários (${feePercentageRanges[range][`tax${range}`].toFixed(
            4
          )} %}) = ${valueWithCurrency(currency, total)}) \n`;
        } else {
          extraDescription += `${getFieldName(labelsEnum.FROM, this.nomenclatures).toLowerCase()} ${
            feePercentageRanges[range].minValue
          } ${getFieldName(labelsEnum.TO, this.nomenclatures)} ${
            feePercentageRanges[range].maxValue
          } Sal.Min.- ${valueWithCurrency(currency, valueBase)} (${feePercentageRanges[range][`tax${range}`].toFixed(
            4
          )} % = ${valueWithCurrency(currency, total)}) \n`;
        }
    }

    const total = this.calculateTotal(feePercentageRanges);

    extraDescription += `${getFieldName(labelsEnum.TOTAL, this.nomenclatures)} do salário mínimo = ${valueWithCurrency(
      currency,
      total
    )}`;

    this.balance += total;

    const payloadView: ViewOccorrenceImp = {
      balance: this.balance,
      updateSince: values.date,
      date: values.date,
      currency: getCoin(values.date, 0),
      description: '',
      tax: null,
      type: typeFeeSM.id,
      isWithoutCorrection: false,
      value: total,
      total: this.balance + this.interestTotal,
      interestBalance: this.interestTotal,
      extraDescription,
    };

    payloadView.value && this.views.push(payloadView);
  }
}
