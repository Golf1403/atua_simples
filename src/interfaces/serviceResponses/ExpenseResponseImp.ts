import MonetaryInterestResponseImp from './MonetaryInterestResponseImp';
import MonetaryFineResponseImp from './MonetaryFineResponseImp';

export default interface ExpenseResponseImp {
  id: string;
  description: string;
  date: string;
  value: string;
  order: string;
  correction: string;
  article_523: string;
  interests: MonetaryInterestResponseImp[];
  fines: MonetaryFineResponseImp[];
  correctedValue: number;
}
