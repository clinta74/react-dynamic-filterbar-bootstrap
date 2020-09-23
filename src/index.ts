import { FilterBar, Filters, ChangeFQLHander }  from './filter-bar';
import { Operations, Logics, IOperationsObj } from './enums';
import { GetDefaultFilterQueryHandler, RemoveFilterHandler } from './filter-bar/filter-bar';
import { Iterator, Comparer } from './dataSource/comparers';
import { filterData } from './dataSource/filter-data';
import { numberComparer, stringComparer, dateComparer, dateTimeComparer }from './dataSource/comparers';

export declare namespace FilterBars {
  type FilterUpdateHandler<Tobj> = (filterQuery: FilterQuery<Tobj>) => void;
  type FilterItemValue<Tobj> = (Tobj[keyof Tobj] | unknown);
  
  type FilterItem<Tobj> = {
    operation: Operations,
    value: FilterItemValue<Tobj>,
  }

  type FitlerQueryField<Tobj> = (keyof Tobj) | string | (keyof Tobj)[] | string[];

  type FilterMapper<Tobj> = Partial<{[Key: string]: Comparer<any>}> | 
    Partial<{[Key in keyof Tobj]: Comparer<any>}>;

  type FilterQuery<Tobj> = {
    logic: Logics,
    field: FitlerQueryField<Tobj>,
    filterItems: FilterItem<Tobj>[],
  }

  type FilterQueryLanguage<Tobj> = {
    logic: Logics,
    filterQueries: FilterQuery<Tobj>[],
  }

  interface IGetDefaultFilterQuery<Tobj> {
    getDefaultFilterQuery?: GetDefaultFilterQueryHandler<Tobj>,
  }

  interface IDefaultFilterProps {
    getDefaultFilterQuery: () => void;
  }

  type FilterProps<Tobj, Props = {}> = {
    label: string;
    field: FitlerQueryField<Tobj>,
    labelClassName?: string,
    filterQuery?: FilterQuery<Tobj>,
    onFilterUpdate?: FilterUpdateHandler<Tobj>,
    shown?: boolean,
  } & Props & IGetDefaultFilterQuery<Tobj>;
}

export {
  numberComparer,
  stringComparer,
  dateComparer,
  dateTimeComparer,
  filterData,
  Iterator,
  Comparer,
  IOperationsObj,
  Operations,
  Logics,
  FilterBar,
  Filters,
  ChangeFQLHander,
  GetDefaultFilterQueryHandler,
  RemoveFilterHandler,
}

export default {
  numberComparer,
  stringComparer,
  dateComparer,
  dateTimeComparer,
  filterData,
  FilterBar,
  Filters,
  Operations,
  Logics,
}