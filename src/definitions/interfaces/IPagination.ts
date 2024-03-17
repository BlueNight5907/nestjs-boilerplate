import { type Operator, type Order } from 'definitions/enums';

export interface ISearchQuery {
  search?: string;
  searchBy?: string;
}

export interface IFilterQuery {
  filter?: string;
}

export interface ISortQuery {
  sort?: string;
}

export interface ISearchOptions {
  search: Array<[field: string, value: string]>;
}

export interface ISortOptions {
  sort: Array<[field: string, order: Order]>;
}

export interface IFilterOptions {
  filter: Array<[field: string, value: string, operator: Operator]>;
}

export interface IPageOptions {
  page: number;
  take: number;
  skip: number;
}
