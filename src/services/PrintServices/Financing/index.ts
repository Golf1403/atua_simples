import { getErrorMessage } from '@/services/http';
import BasePrint from '../Base';
import moment from 'moment';
import PrintConfigTransformer from '@/transforms/PrintConfigTransformer';
import PrintFinancingConfigImp from '@/interfaces/PrintFinancingConfigImp';
import { dateFormatEnum } from '@/enums/DateFormatEnum';

export default class FinancingPrint extends BasePrint {
  public saveFinancingConfig = (config: PrintFinancingConfigImp) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const body = PrintConfigTransformer.financingOutput(config);
        const response = await this.axios.post('/print-financing/config', body);
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public printFinancing = (printConfig: PrintFinancingConfigImp, financing: any) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { configuration } = PrintConfigTransformer.financingOutput(printConfig);
        const body = {
          ...financing,
          date: moment(financing.date, dateFormatEnum.DEFAULT).toDate(),
          data: financing.data,
          configuration,
        };

        const response = await this.axios.post('/print-financing/financing', body);
        if (printConfig.format === 'PDF') {
          const buffer = Buffer.from(response.data, 'base64');
          const blob = new Blob([buffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url);
        }
        if (printConfig.format === 'DOC') {
          const url = `data:application/doc;base64,${response.data}`;
          const link = document.createElement('a');
          link.href = url;
          link.download = 'file.docx';
          link.click();
        }
        resolve();
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
}
