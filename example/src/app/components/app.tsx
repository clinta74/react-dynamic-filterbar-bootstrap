import React from 'react';
import FlexTable from 'react-flexbox-table';
import { FilterBars, Filters, FilterBar, ChangeFQLHander } from '../../../../src/index';
import { customStyles } from '../../../../src/filter-bar/filters/select-filter';
import { data } from './example-data';
import { string, number } from 'prop-types';
import { matchQuery, Query } from '../filter-helper-functions';
import { moment } from 'moment';

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

        /** Cleaner code for runFilters function; executes currently selected filters on table; previous filter below */
        private runFilters2: ChangeFQLHander<MyData> = (fql) => {
            let condensedQuery:Query = {
                name: undefined,
                amount: undefined,
                colors: [],
                birthday: [],
                comment: {
                    operation: undefined,
                    value: undefined
                }                
            }
            let fqlQueries = this.state.fql.filterQueries;

            //Iterates through the selected filters and adds them to condensedQuery
            fqlQueries.forEach(query => {
                if (Array.isArray(query.field) && query.filterItems[0].value !== '') {
                    const searched = query.filterItems[0].value as string;
                    condensedQuery.name = searched.toLowerCase();
                } else if (query.field === 'amount') {
                    condensedQuery.amount = Number(query.filterItems[0].value) as number;
                } else if (query.field === 'color') {
                    query.filterItems.forEach(color => condensedQuery.colors.push(color.value));
                } else if (query.field === 'birthday') {
                    console.log('BIRTHDAY QUERY', query);
                    condensedQuery.birthday = query.filterItems;
                } else if (query.field === 'comment') {
                    condensedQuery.comment = query.filterItems[0];
                } 
            }

              const matches = data.filter(
                  person => matchQuery(condensedQuery, person)
              )
              this.setState({
                display: matches,
                filterApplied: 'Filters Applied'
                });    
        }

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
                        <Filters.StringFilter<MyData> field={['firstName', 'lastName']} label="Name" className="form-control" buttonClassName="btn btn-primary" />
                        <Filters.StringFilter<MyData> field="comment" label="Comment" className="form-control" buttonClassName="btn btn-primary" showOperator />
                        <Filters.NumericFilter<MyData> field="amount" label="Amount" className="form-control" />
                        <Filters.SelectFilter<MyData> field="color" label="Colors" options={colorOptions} styles={customStyles} isMulti />
                        <Filters.DateFilter field="birthday" label="Birthday" showOperator buttonClassName="btn btn-primary" shown/>
                    </FilterBar>
                    {/* <button onClick={this.runFilters} fql={fql}> Old Filter </button> */}
                    <button onClick={this.runFilters2} fql={fql}> Run Filters </button>
                    <button onClick = {this.showAll} fql = {fql} title="Click to toggle the filters on or off">{this.state.filterApplied}</button>
                </div>

                <div>
                    <FlexTable.DataTable items={this.state.display}>
                        <FlexTable.BoundColumn<MyData> binding={item => item.firstName} headerText="First Name" className="col-2"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.lastName} headerText="Last Name" className="col-2"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.birthday} headerText="Birthday" className="col-3"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.comment} headerText="Comment" className="col-5"/>
                    </FlexTable.DataTable>
                </div>
            </section>
        );
    }
}

// const filterData = (items: MyData[], fql?: FilterBars.FilterQueryLanguage<MyData>):MyData[] => {
//     if(!!fql) {
//         items.filter(item => {
//             if(fql.logic == Logics.AND) {
//                 return fql.filterQueries.some(fq => {
//                     const fields = Array.from(fq.field);

//                     return fields.every(field => {
//                         const value = item[field as keyof MyData];
//                         fq.filterItems.some(filterI(value as string).includes(fq)
//                         return true;
//                     });
//                 })
//             }
//         })
//         const filters = fql.filterQueries.map(fq => {
//         })
//         return filter(items);
//     } 

//     return items;
// }




/** Executes currently selected filters on table */
/*
private runFilters: ChangeFQLHander<MyData> = (fql) => {

    let matches = {
        names:[],
        comments:[],
        amounts:[],
        colors:[]
    };
    let queries = this.state.fql.filterQueries;

    // Querying for each criteria:
    queries.forEach(query => {
        if (Array.isArray(query.field) && query.filterItems[0].value !== '') {
            const searched = query.filterItems[0].value as string;
            const name = searched.toLowerCase();
            data.forEach(person => {
                const first = person.firstName.toLowerCase();
                const last = person.lastName.toLowerCase();
                if (first.includes(name)) {
                    matches.names.push(person);
                } else if (last.includes(name)) {
                    matches.names.push(person);
                }
            });
        } else if (query.field === 'amount') {
            const amt = Number(query.filterItems[0].value) as number;
            data.forEach(person => {
                if (person.amount === amt) matches.amounts.push(person);
            })

        } else if (query.field === 'color') {
            const filterColors = query.filterItems;
            data.forEach(person => {
                for (let i = 0; i < filterColors.length; i++) {
                    if (person.colors === filterColors[i].value) {
                        matches.colors.push(person);
                        }
                    }
                })
            }
        })

        //Remove Duplicates:
        let concatenated = matches.names.concat(matches.comments.concat(matches.amounts.concat(matches.colors)));
        const uniqueArray = concatenated.filter((person,index) => {
            return index === concatenated.findIndex(obj => {
              return JSON.stringify(obj) === JSON.stringify(person);
            });
          });

          //Update the data shown:
          this.setState({
            display: uniqueArray
            });

    }
    */
