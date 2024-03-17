import {
  type IFilterOptions,
  type IFilterQuery,
  type ISearchOptions,
  type ISearchQuery,
  type ISortOptions,
  type ISortQuery,
} from 'definitions/interfaces';

export interface IParsePageOptionsService {
  parseSearchOptions(options: ISearchQuery): ISearchOptions;

  parseFilterOptions(options: IFilterQuery): IFilterOptions;

  parseSortOptions(options: ISortQuery): ISortOptions;
}
