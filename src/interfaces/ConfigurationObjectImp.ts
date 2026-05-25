import { CurrentTypes } from '@/data/calculations/currentTypes';
import PositionEnum from '@/enums/PositionEnum';
import IDummyObject from './IDummyObject';

export interface PrintConfigImp {
  userId: string | number;
  configuration: string;
  costCenterId?: string;
}
export type ImageAlignImp = PositionEnum.LEFT | PositionEnum.CENTER | PositionEnum.RIGHT;

export interface ConfigurationObjectImp {
  imageAlign: ImageAlignImp;
  signature: boolean;
  costCenterId: string;
  type: CurrentTypes;
  judgeCheck: boolean;
  detailment: 'none' | 'normal' | 'complete';
  header: {
    header1: { value: string; config?: IDummyObject };
    header2: { value: string; config?: IDummyObject };
    header3: { value: string; config?: IDummyObject };
    header4: { value: string; config?: IDummyObject };
  };
  signatures: {
    signature1: string;
    signature2: string;
    signature3: string;
  };
  numberOfPage: boolean;
  calculationMemory: boolean;
  observations: boolean;
  format: string;
  legibility: string;
  letterhead: boolean;
  centimeters: number;
  content: number;
  details: boolean;
  imageKey?: string;
}
