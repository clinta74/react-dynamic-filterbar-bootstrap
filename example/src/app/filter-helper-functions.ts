import { MyData } from "./components/app";
import { valueContainerCSS } from "react-select/lib/components/containers";
import moment from 'moment';
import _ from 'lodash';

/** Returns true if strings are equal. Ignores case sensitivity. */
const compareInsensitive = (a:string, b:string) => (a.toLowerCase()).includes(b.toLowerCase());

/** Returns true if item contains name provided. */
const matchName = (name:string, item:MyData) =>
  compareInsensitive(item.firstName, name) ||
  compareInsensitive(item.lastName, name);

/** Returns true if item contains amount provided. */
// const matchAmount = (amount:number, item:MyData) => item.amount === amount;
const matchAmount = (amount:Object, item:MyData) => numberCompare[amount.operation](Number(amount.value), Number(item.amount));

let numberCompare = {
  CONTAINS: (selection: number, iteration: number) => selection === Number(iteration),
  LT: (selection: number, iteration: number) => selection < iteration,
  GT: (selection: number, iteration: number) => selection < iteration,
  NEQ: (selection: number, iteration: number) => selection !== iteration, 
  GTE: (selection: number, iteration: number) => selection >= iteration,
  LTE: (selection: number, iteration: number) => selection <= iteration 
}


/** Returns true if item contains one of the provided colors. */
const matchColors = (colors:string[], item:MyData) => {
  const color = item.colors;
  return colors.map(c => c.toLowerCase()).includes(color);
};


/* Returns true if item's birthday is correctly relative (greater than or less than) to the date selected */
let dateCompare = {
  LTE: (dateStandard, dateIteration) => moment(dateIteration).isBefore(dateStandard),
  GTE: (dateStandard, dateIteration) => moment(dateIteration).isAfter(dateStandard)
}

/** Calls Compare dateCompare itartor based on filter query or queries selected */
 const matchBirthday = (birthday:object, item:MyData) => {
  if (birthday.length === 1) {
    return dateCompare[birthday[0].operation](birthday[0].value, item.birthday);
  } else if (birthday.length > 1) {
    return dateCompare[birthday[0].operation](birthday[0].value, item.birthday) && dateCompare[birthday[1].operation](birthday[1].value, item.birthday);
  } 

}

/* Returns true if item's comment matches the criteria of the query and operation */
const matchComment = (comment:object, item:MyData) => {
  return stringIterator[comment.operation](item.comment, comment.value);
}

let stringIterator = {
  CONTAINS: (item: string, value: string) => item.toLowerCase().includes(value.toLowerCase()),
  EQ: (item: string, value: string) => item.toLowerCase() === value.toLowerCase(),
  STARTS: (item: string, value: string) => item.toLowerCase().startsWith(value.toLowerCase()),
  ENDS: (item: string, value: string) => item.toLowerCase().endsWith(value.toLowerCase()),
  NOOP: _.noop()
}

/** Returns true if item matches any of the query parameters. */
export const matchQuery = ( query:Query, item:MyData ) =>
  (query.name && matchName(query.name, item)) ||
  (query.amount !== undefined && matchAmount(query.amount, item)) ||
  (query.colors && matchColors(query.colors, item)) ||
  (query.birthday && matchBirthday(query.birthday, item)) ||
  (query.comment && matchComment(query.comment, item));

export interface Query {
  name?: string,
  amount?: number,
  colors?: string[],
  birthday: object,
  comment?: {
    operation: string,
    value: string
  }
}

