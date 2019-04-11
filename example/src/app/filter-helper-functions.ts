import { MyData } from "./components/app";
import { valueContainerCSS } from "react-select/lib/components/containers";
import moment from 'moment';
import { get, noop } from 'lodash';
import { IOperationsObj, Logics } from "../../../src";
import { FilterBars } from '../../../src';
import { any, bool } from "prop-types";

/** Returns true if item contains amount provided. */
// const matchAmount = (amount:Object, item:MyData) => numberCompare[amount.operation](Number(amount.value), Number(item.amount));
type Iterator<T> = (item: T, value: T) => boolean;
type OpObj = {
  test: string,
  test2: string,
}
type Comparer<T> = Partial<{
  [Key in keyof IOperationsObj]: Iterator<T>
}>
const numberCompare:Comparer<number>  = {
  CONTAINS: (selection: number, iteration: number) => selection === Number(iteration),
  LT: (selection: number, iteration: number) => selection < iteration,
  GT: (selection: number, iteration: number) => selection < iteration,
  NEQ: (selection: number, iteration: number) => selection !== iteration, 
  GTE: (selection: number, iteration: number) => selection >= iteration,
  LTE: (selection: number, iteration: number) => selection <= iteration,
  // NOOP: noop(), 
}

/** Returns true if item contains one of the provided colors. */
const matchColors = (colors:string[], item:MyData) => {
  const singleColor = item.colors;
  return colors.map(c => c.toLowerCase()).includes(singleColor);
};

/** Calls dateCompareIterator based on filter query or queries selected */
//  const matchBirthday = (birthday:Array, item:MyData) => {
//   if (birthday.length === 1) {
//     return dateCompareIterator[birthday[0].operation](birthday[0].value, item.birthday);
//   } else if (birthday.length > 1) {
//     return dateCompareIterator[birthday[0].operation](birthday[0].value, item.birthday) && dateCompareIterator[birthday[1].operation](birthday[1].value, item.birthday);
//   } 
// }

const dateCompareIterator = {
  LTE: (item: string, value: string) => moment(item).isBefore(value),
  GTE: (item: string, value:string) => moment(item).isAfter(value)
}

/** Returns true if strings are equal. Ignores case sensitivity. */
const compareInsensitive = (a:string, b:string) => (a.toLowerCase()).includes(b.toLowerCase());

/** Returns true if item contains name provided. */
// const matchName = (name:string, item:MyData) => 
//   stringIterator[name.operation](item.firstName, name.value) ||
//   stringIterator[name.operation](item.lastName, name.value);
  

// /* Returns true if item's comment matches the criteria of the query and operation */
// const matchComment = (comment:object, item:MyData) => stringIterator[comment.operation](item.comment, comment.value);

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
  color: matchColors,
}

// export const handleFilterQuery = ({field, logic, filterItems, items}) => {
//   if(logic == Logics.OR) {
//     return filterItems.map(filterItem => items.filter(item => 
//       fieldToIteratorMapper[field][filterItem.operation](item, filterItem.value))
//   } else {
//     const reducer = (accumlator, currentValue) => {

//     };
//     let _items = [...items];
//     filterItems.forEach(filterItem => {
//       _items = [..._items.filter(item => 
//         fieldToIteratorMapper[field][filterItem.operation](item, filterItem.value))]
//     });
//   }
// }

function handleFilterItems<Tobj> (params: FilterBars.FilterQuery<Tobj>, mapper: any) {
  const { logic, field, filterItems } = params;
  const arrayFn = logic === Logics.OR ? Array.prototype.some : Array.prototype.every;

  return (item: Tobj) => arrayFn.call(filterItems, (filterItem: FilterBars.FilterItem<Tobj>) => {
    // console.log('ITEM BIRTHDAY', moment(item.birthday).isBefore(filterItem.value));
    console.log('GET: ', get(item, field));
    console.log('RESULT ', mapper[field][filterItem.operation](get(item, field), filterItem.value));
    return mapper[field][filterItem.operation](get(item, field), filterItem.value);
  });
}

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

  
  // console.log('LOGIC: ', logic, 'FILTER QUERIES: ', filterQueries);

  // if(logic == Logics.OR) {
  //   return filterItems.map(filterItem => items.filter(item => 
  //     fieldToIteratorMapper[field][filterItem.operation](item, filterItem.value))
  // } else {
  //   const reducer = (accumlator, currentValue) => accumulator && curre

  //   };
  //   let _items = [...items];
  //   filterItems.forEach(filterItem => {
  //     _items = [..._items.filter(item => 
  //       fieldToIteratorMapper[field][filterItem.operation](item, filterItem.value))]
  //   });
  // }
// }


 


// /** Returns true if item matches any of the query parameters. */
// export const matchQuery = ( query:Query, item:MyData ) =>
//   (query.name && matchName(query.name, item)) ||
//   (query.amount !== undefined && matchAmount(query.amount, item)) ||
//   (query.colors && matchColors(query.colors, item)) ||
//   (query.birthday && matchBirthday(query.birthday, item)) ||
//   (query.comment && matchComment(query.comment, item));

// export interface Query {
//   name?: string,
//   amount?: number,
//   colors?: string[],
//   birthday: object,
//   comment?: {
//     operation: string,
//     value: string
//   }
// }

