import { get } from 'lodash';
import { Logics } from "..";
import { FilterBars } from '..';

/**
 * Filter by filter items.
 * @param logic 
 * @param field 
 * @param filterItems 
 * @param mapper 
 */
function handleFilterItems<Tobj> (logic: Logics, field: FilterBars.FitlerQueryField<Tobj>, filterItems: FilterBars.FilterItem<Tobj>[], mapper: any) {
  const arrayFn = logic === Logics.OR ? Array.prototype.some : Array.prototype.every;

  return (item: Tobj) => arrayFn.call(filterItems, (filterItem: FilterBars.FilterItem<Tobj>) => {
    
    // If the value is empty don't filter it out.
    switch(typeof filterItem.value) {
      case 'string':
        if (filterItem.value.trim().length === 0) return true;
        break;
      default:
        if (!!filterItem.value) return true;
        break;
    }    
    return mapper[field][filterItem.operation](get(item, field), filterItem.value);
  });
}

function handleFilterFields<Tobj> (filterQuery: FilterBars.FilterQuery<Tobj>, mapper: any, item: Tobj) {
  const { field, filterItems, logic } = filterQuery;

  // If there are no filterItems don't filter anything out so that blank UI doesn't cause it to filter.
  if (filterItems && filterItems.length === 0) return true;

  if(Array.isArray(field)) {
      return field.some((_field: FilterBars.FitlerQueryField<Tobj>) => {
        return handleFilterItems(filterQuery.logic, _field, filterQuery.filterItems, mapper)(item);
    })
  }

  return handleFilterItems(logic, field, filterItems, mapper)(item);
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

