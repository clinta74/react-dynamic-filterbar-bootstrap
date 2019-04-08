# React Dynamic Filter Bar
A component that provides a filters to the user in a way that can added or 
remove form the bar. The user is presented with a list of available filters 
in a list.  Choosing a filter adds it to the bar with the option to then
remove that filter.  Those filters present the user with the fields or selections
that allow the user to configure the values and operations of that filter.

## Install
``` 
npm install react-dynamic-filterbar
```

## Usage
Add your filterbar to the page and handle the updateF

``` javascript
import { Filters, FilterBar, ChangeFQLHander } from 'react-dynamic-filterbar';
type AppProps = {};
type AppState = {
    fql?: FilterBars.FilterQueryLanguage<MyData>,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
      super(props);
      this.state = {
          fql: undefined,
      }
  }

  onFilterUpdate: ChangeFQLHander<MyData> = (fql) => {
      this.setState({ fql });
  }

  render() {
  return (
    <FilterBar onFilterUpdate={this.onFilterUpdate} fql={fql} buttonClassName="btn">
      <Filters.StringFilter field={['firstName', 'lastName']} label="Name" className="form-control" buttonClassName="btn btn-primary" />
      <Filters.StringFilter field="comment" label="Comment" className="form-control" buttonClassName="btn btn-primary" showOperator />
      <Filters.NumericFilter field="amount" label="Amount" className="form-control" />
      <Filters.SelectFilter field="color" label="Colors" options={colorOptions} styles={customStyles} isMulti />
      <Filters.DateFilter field="birthday" label="Birthday" showOperator buttonClassName="btn btn-primary" shown/>
    </FilterBar>);
  }
}
```

## Filter Options
__Comon__
- field - The field the filter applies to.
- label - The string used to represent the filter. Used in the add fitler and filter labels.
- shown - The filter is added at page load with default values.
__String and Number__
- showOperator - Show a dropdown to choose what operation to be applied.
- buttonClassName
- className

## Understanding Filter Query Language (FQL)
FQL is designed to be a normalized definition of filters that can be applied to a dataset in a serializable format.  The format
allows for flexable filter configuration that still includes order of filter application and nested properties. This result is an
object that can represent the WHERE clause of a SQL while keeping the information needed to display the filters.

``` javascript
  FQL = { // The base FQL wrapping object.
    logic: AND, // AND | OR - Used to represent how multiple filters are grouped together. (Default: AND)
    filterQueries: [ 
      logic: OR, // Logic used to join filter values on a property together and multiple filters.
      field: 'name', // The property or field to be filtered on. Can be array of fields or nested fields. ex ['user.firstName', 'user.lastName']
      filterItems: [
        operation: EQ, // Logic used in the comparison operation.
        value: 'Jim' // The value to check against.
      ]
    ]
  }
```
__SQL:__
SELECT * FROM USER WHERE [name] = 'Jim';



__Example:__
Text filter added for a name.
- Input to type in string to filter on.
- Optionally select filter logic.
  - Contains
  - Equals (An exact match)
  - Starts with
  - Ends with
  - Does not contain
- Optionally provide case sensitivity.  (Preferred case insensitivity.)
