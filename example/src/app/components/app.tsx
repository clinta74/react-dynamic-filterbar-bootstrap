import React from 'react';
import { FilterBars, Logics, Filters, FilterBar, ChangeFQLHander } from '../../../../src/index';

const colors = ['red', 'green', 'blue', 'black', 'pink', 'yellow'];

type MyData = {
  name: string,
  amount: number,
  birthday: string,
  colors: string,
}

type AppProps = {};
type AppState = {
  fql: FilterBars.FilterQueryLanguage<MyData>,
}

const fql: FilterBars.FilterQueryLanguage<MyData> = {
  logic: Logics.OR,
  filterQueries: [
  ]
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      fql,
    };
  }

  onFilterUpdate: ChangeFQLHander<MyData> = (fql) => {
    console.log('FQL: ', fql);
    this.setState({ fql });
  }

  render() {
    return (
      <section>
        <h2>Filter Bar Example</h2>
        <FilterBar<MyData> onFilterUpdate={this.onFilterUpdate} fql={this.state.fql} buttonClassName="btn">
          <Filters.StringFilter<MyData> field="name" label="Name" className="form-control" buttonClassName="btn btn-primary" showOperator />
          <Filters.StringFilter<MyData> field="amount" label="Amount" className="form-control" />
        </FilterBar>
      </section>
    );
  }
}
