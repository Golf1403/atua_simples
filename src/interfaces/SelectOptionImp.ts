export default interface SelectOptionImp {
  id: number | string;
  value: string | number;
  label: string;
  selected?: boolean;
  checked?: boolean;
  disp?: string | null;
}

export interface OptionImp {
  id: string;
  name: string;
  disp?: string | null;
}
