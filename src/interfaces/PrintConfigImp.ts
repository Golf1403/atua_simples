export default interface PrintConfigImp {
  costCenterId?: string;
  imageAlign?: string;
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  signature: boolean;
  signature1: string;
  signature2: string;
  signature3: string;
  format: string;
  legibility: string;
  accountName: boolean;
  numberOfPage: boolean;
  calculationMemory: boolean;
  observations: boolean;
  titleDescription: boolean;
  judgeCheck: boolean;
  installments: boolean;
  letterhead: boolean;
  centimeters: number;
  content: number;
  imageKey?: string;
}
