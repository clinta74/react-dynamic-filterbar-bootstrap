import { FilterBar, Filters, ChangeFQLHander }  from './filter-bar';
import { Operations, Logics } from './enums';

export declare namespace FilterBars {
  type FilterUpdateHandler<Tobj> = (filterQuery: FilterBars.FilterQuery<Tobj>) => void;

  type FilterItem<Tobj> = {
    operation: Operations,
    value: (Tobj[keyof Tobj] | unknown),
  }

  type FitlerQueryField<Tobj> = (keyof Tobj) | string;

  type FilterQuery<Tobj> = {
    logic: Logics,
    field: FitlerQueryField<Tobj>,
    filterItems: FilterItem<Tobj>[],
  }

  type FilterQueryLanguage<Tobj> = {
    logic: Logics,
    filterQueries: FilterQuery<Tobj>[],
  }

  type GetDefaultFilterQueryHandler<Tobj> = (field: FitlerQueryField<Tobj>) => FilterQuery<Tobj>;

  type FilterProps<Tobj, Props = {}> = {
    label: string;
    field: (keyof Tobj) | string,
    getDefaultFilterQuery?: GetDefaultFilterQueryHandler<Tobj>,
    filterQuery?: FilterQuery<Tobj>,
    onFilterUpdate?: FilterUpdateHandler<Tobj>
  } & Props;
}

export {
  Operations,
  Logics,
  FilterBar,
  Filters,
  ChangeFQLHander,
}

export default {
  FilterBar,
  Filters,
  Operations,
  Logics,
}