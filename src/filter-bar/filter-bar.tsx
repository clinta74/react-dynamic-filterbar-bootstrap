import React from 'react';

// Local imports
import { FilterBars, Logics } from '../index'
import { RemoveFilterHandler, FilterItem } from './filter-item';
import { Dropdown } from '../dropdown/dropdown';
import classNames from 'classnames';

export type ChangeFQLHander<Tobj> = (fql: FilterBars.FilterQueryLanguage<Tobj>) => void;

type FilterBarProps<Tobj> = {
  onFilterUpdate: ChangeFQLHander<Tobj>,
  fql: FilterBars.FilterQueryLanguage<Tobj>,
  labelClassName?: string,
  buttonClassName?: string,
};

type FilterBarState = {
  showMenu: boolean
}

type FilterElement<Tobj> = React.ReactElement<FilterBars.FilterProps<Tobj>>;

export class FilterBar<Tobj> extends React.Component<FilterBarProps<Tobj>, FilterBarState> {
  constructor(props: FilterBarProps<Tobj>) {
    super(props);

    this.state = {
      showMenu: false,
    }
  }

  availableChildren = React.Children.toArray(this.props.children);

  onRemoveFilter: RemoveFilterHandler = (field) => {
    const { fql, onFilterUpdate } = this.props;

    fql.filterQueries = [...fql.filterQueries.filter(fq => fq.field != field)];
    onFilterUpdate(fql);
  }

  onAddFilter = (filter: FilterElement<Tobj>) => {
    const { fql, onFilterUpdate } = this.props;
    const field = filter.props.field;
    const filterQuery: FilterBars.FilterQuery<Tobj> = filter.props.getDefaultFilterQuery && filter.props.getDefaultFilterQuery(field) || {
      field,
      logic: Logics.OR,
      filterItems: []
    };

    fql.filterQueries = [...fql.filterQueries, filterQuery];

    onFilterUpdate(fql);
  }

  render() {
    const { fql, onFilterUpdate } = this.props;

    const filterItems = fql.filterQueries.map(fq => {
      const activeFilter = this.availableChildren.find(availableChild => {
        if (!availableChild) return false;
        return (availableChild as FilterElement<Tobj>).props.field === fq.field
      }) as FilterElement<Tobj>;

      const filter = React.cloneElement(activeFilter, {
        filterQuery: fq,
        onFilterUpdate: (filterQuery: FilterBars.FilterQuery<Tobj>) => {
          const fqIndex = fql.filterQueries.findIndex(_filterQuery => _filterQuery.field === fq.field);
          fql.filterQueries = [
            ...fql.filterQueries.slice(0, fqIndex),
            filterQuery,
            ...fql.filterQueries.slice(fqIndex + 1)
          ];
          onFilterUpdate(fql);
        }
      });
      const field = activeFilter.props.field.toString();
      return <FilterItem key={field} filter={filter} onRemoveFilter={this.onRemoveFilter} field={field} />;
    });

    const activeFields = this.props.fql.filterQueries.map(fq => fq.field);
    const availableFilterItems = this.availableChildren.filter(availableChild =>
      !activeFields.includes((availableChild as FilterElement<Tobj>).props.field)) as FilterElement<Tobj>[];
    const dropdownItems = availableFilterItems.map(f => ({
      option: f.props.label,
      value: f
    }));

    const filterBarDropdownClassName = classNames('filter-bar-dropdown filter-bar-item', { 'hide': dropdownItems.length === 0 });

    return (
      <div className="filter-bar">
        <div className="filter-bar-items">
          {filterItems}
          <div className={filterBarDropdownClassName}>
            <div className="filter-bar-select-container">
              <Dropdown label="Add Filter" items={dropdownItems} onChange={this.onAddFilter} {...this.props}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
