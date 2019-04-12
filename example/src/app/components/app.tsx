import React from 'react';
import FlexTable from 'react-flexbox-table';
import { FilterBars, Filters, FilterBar, ChangeFQLHander } from '../../../../src/index';
import { customStyles } from '../../../../src/filter-bar/filters/select-filter';
import { data } from './example-data';
import { string, number } from 'prop-types';
import { matchQuery, Query, filterIt, fieldToIteratorMapper } from '../filter-helper-functions';
import moment from 'moment';

const colors = ['red', 'green', 'blue', 'black', 'pink', 'yellow', 'orange', 'indigo'];

export type MyData = {
    firstName: string,
    lastName: string,
    comment: string,
    amount: number,
    birthday: string,
    colors: string,
}

type AppProps = {};
type AppState = {
    fql?: FilterBars.FilterQueryLanguage<MyData>,
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            fql: undefined,
            display: data,
            filterApplied: 'No Filters Applied'
        }
    }

    private onFilterUpdate: ChangeFQLHander<MyData> = (fql) => {
        this.setState({ 
            fql,
            filterApplied: 'New Filters Not Run'
        });
    }

    /** Clears out previously run filters */
    private showAll: ChangeFQLHander<MyData> = (fql) => {
        this.setState({
            display: data,
            filterApplied: 'No Filters Applied'
        })
    }

    /** Executes currently selected filters on data set */
    private runFilters: ChangeFQLHander<MyData> = (fql) => {
        let condensedQuery:Query = {
            name: undefined,
            amount: undefined,
            colors: [],
            birthday: [],
            comment: undefined         
        }
        let fqlQueries = this.state.fql.filterQueries;
        let fqlCopy = this.state.fql;
        // console.log('FILTER QUERIES: ', fqlQueries);
        console.log("ALL OF FQL", fqlCopy);

        const filteredData = filterIt(data, fieldToIteratorMapper, fqlCopy);
        console.log('FILTERED DATA: ', filteredData);

        this.setState({
            display: filteredData,
            filterApplied: 'Filters Applied'
            });

    }


        // let fqlIterator = {
        //     name: (filterItems: Array )=> { condensedQuery.name = filterItems[0] as Object },
        //     amount: (filterItems: Array )=> { condensedQuery.amount = filterItems[0] as Object) },
        //     color: (filterItems: Array )=> { filterItems.forEach( color => condensedQuery.colors.push(color.value)) },
        //     comment: (filterItems: Array ) => { condensedQuery.comment = filterItems[0] },
        //     birthday: ( filterItems: Array ) => { condensedQuery.birthday = filterItems }
        // }

        // //Iterates through the selected filters and adds them to condensedQuery
        // fqlQueries.forEach(query => {
        //     fqlIterator[query.field](query.filterItems);
        // }
            
        // const matches = data.filter(
        //     person => matchQuery(condensedQuery, person)
        // )

        // this.setState({
        // display: matches,
        // filterApplied: 'Filters Applied'
        // });    

    render() {
        const colorOptions = colors.map((c) => ({
            value: c,
            option: c,
        }));

        const { fql } = this.state;

        return (
            <section className="container">
                <h2>Filter Bar Example</h2>
                <div className="mb-4">
                    <FilterBar<MyData> onFilterUpdate={this.onFilterUpdate} fql={fql} buttonClassName="btn">
                        <Filters.StringFilter<MyData> field="name" label="Name" className="form-control" buttonClassName="btn btn-primary" showOperator />
                        <Filters.StringFilter<MyData> field="comment" label="Comment" className="form-control" buttonClassName="btn btn-primary" showOperator />
                        <Filters.NumericFilter<MyData> field="amount" label="Amount" className="form-control" showOperator/>
                        <Filters.SelectFilter<MyData> field="colors" label="Colors" options={colorOptions} styles={customStyles} isMulti />
                        <Filters.DateFilter field="birthday" label="Birthday" showOperator buttonClassName="btn btn-primary" shown/>
                    </FilterBar>
                    <button onClick={this.runFilters} fql={fql}> Run Filters </button>
                    <button onClick = {this.showAll} fql = {fql} title="Click to toggle the filters on or off">{this.state.filterApplied}</button>
                </div>

                <div>
                    <FlexTable.DataTable items={this.state.display}>
                        <FlexTable.BoundColumn<MyData> binding={item => item.firstName} headerText="First Name" className="col-2"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.lastName} headerText="Last Name" className="col-2"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.birthday} headerText="Birthday" className="col-3" formatter = {item=> moment(item).format('L')}/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.comment} headerText="Comment" className="col-5"/>
                    </FlexTable.DataTable>
                </div>
                <div>

                </div>

            </section>
        );
    }
}
