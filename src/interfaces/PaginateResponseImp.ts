export default interface PaginateResponseImp {
  current: number;
  pages: number;
  total: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
