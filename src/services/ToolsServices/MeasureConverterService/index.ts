import { IMeasureConverter } from '@interfaces/tools/measureConverter/IMeasureConverter';
import MeasureConverterCalculatorService from './MeasureConverterCalculatorService';

class MeasureConverterService {
  run = (data: IMeasureConverter) => {
    const { from, to, type, value } = data;

    const body = { from, to, value: Number(value), type };

    const measureService = new MeasureConverterCalculatorService(body);
    const response = measureService.calculate();

    return response;
  };
}

export default MeasureConverterService;
