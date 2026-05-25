export default interface FinancingImp {
  date: Date;
  deadline: number;
  interest: string;
  name: string;
  type: string;
  value: number;
  index?: string;
  shortage: number;
  positive: boolean;
}
