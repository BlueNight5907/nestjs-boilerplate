import { Operator, Order } from 'definitions/enums';
import {
  type IFilterOptions,
  type IFilterQuery,
  type ISearchOptions,
  type ISearchQuery,
  type ISortOptions,
  type ISortQuery,
} from 'definitions/interfaces';
import { isNil } from 'lodash';

import { InvalidPageOptionsException } from './exceptions';
import { type IParsePageOptionsService } from './IParsePageOptionsService';

export class ParsePageOptionsService implements IParsePageOptionsService {
  parseSearchOptions(options: ISearchQuery): ISearchOptions {
    const { search, searchBy } = options;
    const result: ISearchOptions = { search: [] };

    if (!search && !searchBy) {
      return result;
    }

    if (isNil(search) || isNil(searchBy)) {
      throw new InvalidPageOptionsException(
        `search=${search}&searchBy=${searchBy}`,
      );
    }

    const searchFields = searchBy.split(',');

    for (const field of searchFields) {
      result.search.push([field, search]);
    }

    return result;
  }

  parseFilterOptions(options: IFilterQuery): IFilterOptions {
    const { filter } = options;
    const result: IFilterOptions = { filter: [] };
    const error = new InvalidPageOptionsException(`filter=${filter}`);

    if (!filter) {
      return result;
    }

    const filterItems = filter.split(',');

    for (const filterItem of filterItems) {
      const [field, valueAndOperator] = filterItem.split(':');

      if (!valueAndOperator) {
        throw error;
      }

      const [value, operator] = valueAndOperator.split('|');

      if (!operator || !Operator[operator]) {
        throw error;
      }

      result.filter.push([field, value, operator as Operator]);
    }

    return result;
  }

  parseSortOptions(options: ISortQuery): ISortOptions {
    const { sort } = options;
    const result: ISortOptions = { sort: [] };

    if (!sort) {
      return result;
    }

    const sortItems = sort.split(',');

    for (const sortItem of sortItems) {
      const [field, order] = sortItem.split(':');

      if (!order || !Order[order]) {
        throw new InvalidPageOptionsException(`sort=${sort}`);
      }

      result.sort.push([field, order as Order]);
    }

    return result;
  }
}
