import { get } from 'lodash';
import { Logics, Comparer } from "..";
import { FilterBars } from '..';

function handleFilterItems<Tobj> (logic: Logics, field: FilterBars.FitlerQueryField<Tobj>, filterItems: FilterBars.FilterItem<Tobj>[], mapper: any) {
  const arrayFn = logic === Logics.OR ? Array.prototype.some : Array.prototype.every;

  return (item: Tobj) => arrayFn.call(filterItems, (filterItem: FilterBars.FilterItem<Tobj>) => {
    return mapper[field][filterItem.operation](get(item, field), filterItem.value);
  });
}

// TODO: Add a function for handling fields that are arrays
function handleFilterFields<Tobj> (filterQuery: FilterBars.FilterQuery<Tobj>, mapper: any, item: Tobj) {
  const { field } = filterQuery;

  if(Array.isArray(field)) {
      return field.some((_field: FilterBars.FitlerQueryField<Tobj>) => {
        return handleFilterItems(filterQuery.logic, _field, filterQuery.filterItems, mapper)(item);
    })
  }

  return handleFilterItems(filterQuery.logic, filterQuery.field, filterQuery.filterItems, mapper)(item);
}

function handleFilterQueries<Tobj>(filterQueries: FilterBars.FilterQuery<Tobj>[], logic: Logics, mapper: any) {
  const arrayFn = logic === Logics.OR ? Array.prototype.some : Array.prototype.every;
  return (item: Tobj) => arrayFn.call(filterQueries, (filterQuery: FilterBars.FilterQuery<Tobj>) => {
    return handleFilterFields(filterQuery, mapper, item);
  });
}

export function filterData<Tobj>(items: Tobj[], mapper: any, fql: FilterBars.FilterQueryLanguage<Tobj>) {
  const iterator = handleFilterQueries(fql.filterQueries, fql.logic, mapper);
  return items.filter(item => iterator(item))
}

