import { MyData } from "./components/app";

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

/** Returns true if item matches any of the query parameters. */
export const matchQuery = ( query:Query, item:MyData ) =>
  (query.name && matchName(query.name, item)) ||
  (query.amount !== undefined && matchAmount(query.amount, item)) ||
  (query.colors && matchColors(query.colors, item));


export interface Query {
  name?: string,
  amount?: number,
  colors?: string[]
}