import { MyData } from "./app/components/app";
import { valueContainerCSS } from "react-select/lib/components/containers";
import moment from 'moment';
import { get, noop } from 'lodash';
import { IOperationsObj, Logics } from "../src";
import { FilterBars } from '../src';
import { any, bool } from "prop-types";

type Iterator<T> = (item: T, value: T) => boolean;
type OpObj = {
  test: string,
  test2: string,
}
type Comparer<T> = Partial<{
  [Key in keyof IOperationsObj]: Iterator<T>
}>

/** Returns true if item matches amount provided. */
const numberCompare:Comparer<number>  = {
  CONTAINS: (selection: number, iteration: number) => selection === Number(iteration),
  LT: (selection: number, iteration: number) => selection < iteration,
  GT: (selection: number, iteration: number) => selection < iteration,
  NEQ: (selection: number, iteration: number) => selection !== iteration, 
  GTE: (selection: number, iteration: number) => selection >= iteration,
  LTE: (selection: number, iteration: number) => selection <= iteration, 
}

/** Returns true if item contains one of the provided colors. */
const matchColors = (colors:string[], item:MyData) => {
  const singleColor = item.colors;
  return colors.map(c => c.toLowerCase()).includes(singleColor);
};

const dateCompareIterator = {
  LTE: (item: string, value: string) => moment(item).isBefore(value),
  GTE: (item: string, value:string) => moment(item).isAfter(value)
}

/** Returns true if strings are equal. Ignores case sensitivity. */
const compareInsensitive = (a:string, b:string) => (a.toLowerCase()).includes(b.toLowerCase());

let stringIterator = {
  CONTAINS: (item: string, value: string) => item.toLowerCase().includes(value.toLowerCase()),
  EQ: (item: string, value: string) => item.toLowerCase() === value.toLowerCase(),
  STARTS: (item: string, value: string) => item.toLowerCase().startsWith(value.toLowerCase()),
  ENDS: (item: string, value: string) => item.toLowerCase().endsWith(value.toLowerCase()),
}

export const fieldToIteratorMapper = {
  name: stringIterator,
  comment: stringIterator,
  amount: numberCompare,
  birthday: dateCompareIterator,
  colors: matchColors,
}

function handleFilterItems<Tobj> (params: FilterBars.FilterQuery<Tobj>, mapper: any) {
  const { logic, field, filterItems } = params;
  const arrayFn = logic === Logics.OR ? Array.prototype.some : Array.prototype.every;

  return (item: Tobj) => arrayFn.call(filterItems, (filterItem: FilterBars.FilterItem<Tobj>) => {
    return mapper[field][filterItem.operation](get(item, field), filterItem.value);
  });
}

// TODO: Add a function for handling fields that are arrays

function handleFilterQueries<Tobj>(filterQueries: FilterBars.FilterQuery<Tobj>[], logic: Logics, mapper: any) {
  const arrayFn = logic === Logics.OR ? Array.prototype.some : Array.prototype.every;
  return (item: Tobj) => arrayFn.call(filterQueries, (filterQuery: FilterBars.FilterQuery<Tobj>) => {
    return handleFilterItems(filterQuery, mapper)(item);
  });
}

export function filterIt<Tobj>(items: Tobj[], mapper: any, fql: FilterBars.FilterQueryLanguage<Tobj>) {
  const iterator = handleFilterQueries(fql.filterQueries, fql.logic, mapper);
  return items.filter(item => iterator(item))
}

