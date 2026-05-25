export interface IndexResponseImp {
  id: number;
  name: string;
  dateStart: string;
  dateEnd: string;
  costCenterId: string;
  costCenter: string;
  ind7028: number;
  ind4272: number;
  ind1014: number;
  ind8432: number;
  ind4480: number;
  ind0787: number;
  ind2187: number;
}

export interface IndexQueryRequestImp {
  unit?: 'v' | 'p' | 'c';
  inddisp?: string;
}
