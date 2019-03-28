import React from 'react';
import { get, head, find, first } from 'lodash';
import classNames from 'classnames';

// Local imports
import { FilterBars, FilterBar } from '../../index';
import { Operations, Logics } from '../../enums';

type MultiSelectFilterProps = {
  className?: string,
  labelClassName?: string,
  buttonClassName?: string,
}

export const getDefaultFilterQuery = <Tobj extends {}>(field: FilterBars.FitlerQueryField<Tobj>): FilterBars.FilterQuery<Tobj> => ({
  field,
  logic: Logics.OR,
  filterItems: [],
});



export class MultiSelectFilter<Tobj> extends React.PureComponent<FilterBars.FilterProps<Tobj, MultiSelectFilterProps>> {
  constructor(props: FilterBars.FilterProps<Tobj, MultiSelectFilterProps>) {
    super({ getDefaultFilterQuery, ...props});
  }


  render() {
    const { field, filterQuery, className, label, buttonClassName } = this.props;

    return (
      <>
        <label className="filter-bar-label">{label}</label>
      </>
    );
  }
}