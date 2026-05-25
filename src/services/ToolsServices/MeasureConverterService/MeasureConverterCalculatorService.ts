import { Area, Distance, Types, Weight } from '../../../enums/MeasureEnum';
import MeasureConverterImp, { CalculatorImp } from '@interfaces/MeasureConverterImp';
import TemperatureConverterService from '../TemperatureConverterService';

export default class MeasureConverterCalculatorService implements CalculatorImp {
  protected type: string;
  protected from: string;
  protected to: string;
  protected value: number;

  private precision = 18;
  private result = '0';

  private temperatureConverter: TemperatureConverterService;

  constructor(body: MeasureConverterImp) {
    this.type = body.type;
    this.from = body.from;
    this.to = body.to;
    this.value = body.value;
    this.temperatureConverter = new TemperatureConverterService(body);
  }

  public calculate() {
    switch (this.type) {
      case Types.Distance:
        this.convert(Distance);
        break;
      case Types.Weight:
        this.convert(Weight);
        break;
      case Types.Area:
        this.convert(Area);
        break;
      case Types.Temperature:
        this.result = this.temperatureConverter.calculate().toString();
        break;
      default:
        throw new Error(`Type must be Distance, Weight, Area or Temperature`);
    }

    return {
      from: this.from,
      result: this.result,
      to: this.to,
      type: this.type,
      value: this.value,
    };
  }

  private convert(enumType: object) {
    try {
      // @ts-ignore
      const from = enumType[this.from].valueOf();
      // @ts-ignore
      const to = enumType[this.to].valueOf();
      this.result = parseFloat(((from / to) * this.value).toFixed(this.precision)).toString();
    } catch (err) {
      throw new Error(`Type of unit inserted not found`);
    }
  }
}
