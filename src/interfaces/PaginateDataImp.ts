export default interface PaginateDataImp {
  page: number;
  search: string;
  orderBy: string;
  order: 'asc' | 'desc';
}
