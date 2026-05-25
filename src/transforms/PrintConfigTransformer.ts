import PrintConfigImp from '@interfaces/PrintConfigImp';
import PrintFinancingConfigImp from '@interfaces/PrintFinancingConfigImp';

export default class PrintConfigTransformer {
  public static output(config: PrintConfigImp) {
    return {
      configuration: {
        costCenterId: config.costCenterId || null,
        imageAlign: config.imageAlign,
        header: {
          header1: config.header1,
          header2: config.header2,
          header3: config.header3,
          header4: config.header4,
        },
        signature: config.signature,
        signatures: {
          signature1: config.signature1,
          signature2: config.signature2,
          signature3: config.signature3,
        },
        accountName: config.accountName,
        numberOfPage: config.numberOfPage,
        calculationMemory: config.calculationMemory,
        observations: config.observations,
        titleDescription: config.titleDescription,
        judgeCheck: config.judgeCheck,
        installments: config.installments,
        format: config.format,
        legibility: config.legibility,
        letterhead: config.letterhead,
        centimeters: config.centimeters,
        content: config.content,
        imageKey: config.imageKey,
      },
    };
  }
  public static financingOutput(config: PrintFinancingConfigImp) {
    return {
      configuration: {
        imageAlign: config.imageAlign,
        signature: config.signature,
        signatures: {
          signature1: config.signature1,
        },
        numberOfPage: config.numberOfPage,
        format: config.format,
        letterhead: config.letterhead,
        centimeters: config.centimeters,
        imageKey: config.imageKey,
      },
    };
  }
}
