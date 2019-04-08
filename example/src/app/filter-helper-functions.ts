import { MyData } from "./components/app";
import { valueContainerCSS } from "react-select/lib/components/containers";
import moment from 'moment';

/** Returns true if strings are equal. Ignores case sensitivity. */
const compareInsensitive = (a:string, b:string) => (a.toLowerCase()).includes(b.toLowerCase());

/** Returns true if item contains name provided. */
const matchName = (name:string, item:MyData) =>
  compareInsensitive(item.firstName, name) ||
  compareInsensitive(item.lastName, name);

/** Returns true if item contains amount provided. */
const matchAmount = (amount:number, item:MyData) => item.amount === amount;

/** Returns true if item contains one of the provided colors. */
const matchColors = (colors:string[], item:MyData) => {
  // Field contains confusing name. Colors is not an array.
  const color = item.colors;

  return colors.map(c => c.toLowerCase()).includes(color);
};

const matchComment = (comment:object, item:MyData) => {
  if (comment.operation === "CONTAINS") {
      return item.comment.includes(comment.value);
  } else if (comment.operation === "EQ") {
    return item.comment === comment.value;
  } else if (comment.operation === "STARTS") {
    return item.comment.startsWith(comment.value);
  } else if (comment.operation === "ENDS") {
    return item.comment.endsWith(comment.value);
  }
}

//Use a dictionary; an object - trans-language
/*
Map

rather than if, create object: Operation iterators
opIts = {
  [Operations.CONTAINS]: (item: string, value: string) => item.toLowerCase().includes(value.toLowerCase()),

}
filterItem = filterQuery.filterItem[0];
opIts[filterItem.operation](get(item, filterQuery.field, ''), filterItem.value);
*/

const compareDates = (dateStandard, dateIteration, operation) => {
  if (operation === "LTE") {
    return moment(dateIteration).isBefore(moment(dateStandard));
  } else if (operation === "GTE") {
    return moment(dateIteration).isAfter(moment(dateStandard));
  }
}

 const matchBirthday = (birthday:object, item:MyData) => {
  if (birthday.length === 1) {
    return compareDates(birthday[0].value, item.birthday, birthday[0].operation);
  } else if (birthday.length > 1) {
    return compareDates(birthday[0].value, item.birthday, birthday[0].operation) && compareDates(birthday[1].value, item.birthday, birthday[1].operation)
  } 

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