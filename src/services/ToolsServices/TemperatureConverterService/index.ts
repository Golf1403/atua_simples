import MeasureConverterImp from '@interfaces/MeasureConverterImp';
import { Temperature, TemperatureTypes } from '../../../enums/MeasureEnum';

export default class TemperatureConverterService {
  private from: string;
  private to: string;
  private value: number;

  constructor(data: MeasureConverterImp) {
    this.from = data.from;
    this.to = data.to;
    this.value = data.value;
  }

  public calculate() {
    if (this.from === this.to) return this.value;

    switch (this.from) {
      case TemperatureTypes.Celsius:
        return this.to === TemperatureTypes.Fahrenheit ? this.celciusToFahrenheit() : this.celciusToKelvin();
      case TemperatureTypes.Fahrenheit:
        return this.to === TemperatureTypes.Celsius ? this.fahrenheitToCelsius() : this.fahrenheitToKelvin();
      case TemperatureTypes.Kelvin:
        return this.to === TemperatureTypes.Celsius ? this.KelvinToCelsius() : this.KelvinToFahrenheit();
      default:
        throw new Error(`TemperatureTypes must be Celsius, Fahrenheit or Kelvin`);
    }
  }

  private celciusToFahrenheit() {
    return this.value * (9 / 5) + 32;
  }
  private celciusToKelvin() {
    return this.value + Temperature.Kelvin;
  }

  private fahrenheitToCelsius() {
    return ((this.value - 32) * 5) / 9;
  }
  private fahrenheitToKelvin() {
    return this.fahrenheitToCelsius() + Temperature.Kelvin;
  }

  private KelvinToCelsius() {
    return this.value - Temperature.Kelvin;
  }
  private KelvinToFahrenheit() {
    return (this.value - Temperature.Kelvin) * (9 / 5) + 32;
  }
}
