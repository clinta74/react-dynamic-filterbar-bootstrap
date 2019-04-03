import { FilterBar, Filters, ChangeFQLHander }  from './filter-bar';
import { Operations, Logics } from './enums';
import { GetDefaultFilterQueryHandler, RemoveFilterHandler } from './filter-bar/filter-bar';

export declare namespace FilterBars {
  type FilterUpdateHandler<Tobj> = (filterQuery: FilterQuery<Tobj>) => void;

  type FilterItem<Tobj> = {
    operation: Operations,
    value: (Tobj[keyof Tobj] | unknown),
  }

  type FitlerQueryField<Tobj> = (keyof Tobj) | string | (keyof Tobj)[] | string[];

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
  Operations,
  Logics,
  FilterBar,
  Filters,
  ChangeFQLHander,
  GetDefaultFilterQueryHandler,
  RemoveFilterHandler,
}

export default {
  FilterBar,
  Filters,
  Operations,
  Logics,
}